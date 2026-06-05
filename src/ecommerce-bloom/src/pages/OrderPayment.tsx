import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  Building2,
  Copy,
  CheckCheck,
  Shield,
  Loader2,
  ExternalLink,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PaymentComplianceLogos from "@/components/PaymentComplianceLogos";
import CheckoutLegalConsent from "@/components/CheckoutLegalConsent";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";
import { getImageUrl } from "@/lib/product-utils";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { createOrder } from "@/services/orders.service";
import { getShippingMethods, type ShippingMethod } from "@/services/shipping.service";
import {
  getBankAccounts,
  getPaymentOptions,
  getIyzicoClients,
  initializeIyzicoPayment,
  redirectToIyzicoPayment,
  type BankAccount,
} from "@/services/payments.service";
import type { IyzicoClient } from "@/types/iyzico";
import { toast } from "sonner";
import { uiLabel, useAppPagesUi } from "@/hooks/useAppPagesUi";

type PaymentMethod = "iyzico" | "havale";

const PENDING_ORDER_KEY = "bizdenalbizdensat_pending_iyzico_order";

const OrderPayment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartTotal, cartItems, refreshCart } = useCart();
  const { isAuthenticated } = useAuth();
  const siteSettings = useSiteSettings();
  const checkout = useAppPagesUi()?.checkout;
  const global = useAppPagesUi()?.global;
  const iyzicoLogoUrl = siteSettings.paymentCompliance?.iyzicoPayLogoUrl;

  const selectedAddressId = location.state?.selectedAddressId ?? null;

  const [cargoOptions, setCargoOptions] = useState<ShippingMethod[]>([]);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [iyzicoClients, setIyzicoClients] = useState<IyzicoClient[]>([]);
  const [bankTransferEnabled, setBankTransferEnabled] = useState(true);
  const [selectedIyzicoClient, setSelectedIyzicoClient] = useState<string>("");
  const [loadingCargo, setLoadingCargo] = useState(true);
  const [loadingBanks, setLoadingBanks] = useState(true);
  const [loadingPaymentMeta, setLoadingPaymentMeta] = useState(true);

  const [selectedCargo, setSelectedCargo] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("iyzico");
  const [selectedBank, setSelectedBank] = useState("");
  const [contractsAccepted, setContractsAccepted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedIban, setCopiedIban] = useState<string | null>(null);
  const [havaleInstructions, setHavaleInstructions] = useState<{
    orderNumber: string;
    message: string;
    accounts: BankAccount[];
  } | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    if (!selectedAddressId) {
      const description = uiLabel(checkout?.selectAddressError);
      if (description) {
        toast.error(uiLabel(global?.errorTitle) ?? "", { description });
      }
      navigate("/order");
    }
  }, [isAuthenticated, selectedAddressId, navigate, checkout?.selectAddressError, global?.errorTitle]);

  useEffect(() => {
    getShippingMethods()
      .then((methods) => {
        setCargoOptions(methods);
        if (methods.length > 0) {
          setSelectedCargo(methods[0].id ?? methods[0].name);
        }
      })
      .catch(() => {
        const msg = uiLabel(checkout?.shippingLoadError);
        if (msg) toast.error(msg);
      })
      .finally(() => setLoadingCargo(false));
  }, [checkout?.shippingLoadError]);

  useEffect(() => {
    getBankAccounts()
      .then((res) => {
        const accounts = res.data || [];
        setBankAccounts(accounts);
        if (accounts.length > 0) {
          setSelectedBank(accounts[0].id);
        }
      })
      .catch(() => {
        const msg = uiLabel(checkout?.bankAccountsLoadError);
        if (msg) toast.error(msg);
      })
      .finally(() => setLoadingBanks(false));
  }, [checkout?.bankAccountsLoadError]);

  useEffect(() => {
    Promise.all([
      getPaymentOptions().catch(() => ({ iyzico: [], bankTransfer: true })),
      getIyzicoClients().catch(() => [] as IyzicoClient[]),
    ])
      .then(([options, clientsFromApi]) => {
        setBankTransferEnabled(options.bankTransfer ?? true);
        if (!options.bankTransfer && paymentMethod === "havale") {
          setPaymentMethod("iyzico");
        }

        const clients: IyzicoClient[] =
          clientsFromApi.length > 0
            ? clientsFromApi
            : (options.iyzico ?? []).map((o) => ({
                code: o.code,
                name: o.name,
                isSandbox: o.isSandbox,
                currency: "TRY",
              }));

        setIyzicoClients(clients);
        if (clients.length === 1) {
          setSelectedIyzicoClient(clients[0].code);
        } else if (clients.length > 1) {
          const def = options.iyzico?.find((o) => o.isDefault)?.code ?? clients[0].code;
          setSelectedIyzicoClient(def);
        }
      })
      .catch(() => {
        const msg = uiLabel(checkout?.paymentOptionsLoadError);
        if (msg) toast.error(msg);
      })
      .finally(() => setLoadingPaymentMeta(false));
  }, [checkout?.paymentOptionsLoadError, paymentMethod]);

  const shippingCost =
    cargoOptions.find((c) => (c.id ?? c.name) === selectedCargo)?.cost ?? 0;
  const totalAmount = cartTotal + shippingCost;

  const handleCopyIban = (iban: string, bankId: string) => {
    navigator.clipboard.writeText(iban.replace(/\s/g, ""));
    setCopiedIban(bankId);
    setTimeout(() => setCopiedIban(null), 2000);
  };

  const buildShippingMethod = () => {
    const cargoOption = cargoOptions.find((c) => (c.id ?? c.name) === selectedCargo);
    return {
      id: cargoOption?.id,
      name: cargoOption?.name ?? "Standard",
      cost: cargoOption?.cost ?? shippingCost,
      estimatedDays: cargoOption?.estimatedDays ?? 3,
      provider: cargoOption?.provider ?? cargoOption?.name ?? "Shipping",
    };
  };

  const handleIyzicoPay = async () => {
    if (!selectedAddressId) {
      const description = uiLabel(checkout?.selectAddressError);
      if (description) toast.error(uiLabel(global?.errorTitle) ?? "", { description });
      navigate("/order");
      return;
    }

    const orderResponse = await createOrder({
      shippingAddressId: selectedAddressId,
      shippingMethod: buildShippingMethod(),
      paymentMethod: { type: "iyzico" },
      notes: null,
    });

    const order = orderResponse.data?.order;
    if (!order?.id) {
      throw new Error(
        orderResponse.message || uiLabel(checkout?.orderCreateErrorFallback) || "Order create failed"
      );
    }

    sessionStorage.setItem(PENDING_ORDER_KEY, order.id);

    const paymentClientCode =
      iyzicoClients.length > 1 ? selectedIyzicoClient : undefined;

    const initData = await initializeIyzicoPayment({
      orderId: order.id,
      paymentClientCode: paymentClientCode || undefined,
    });

    await refreshCart?.();
    redirectToIyzicoPayment(initData.paymentPageUrl);
  };

  const handleHavalePay = async () => {
    if (!selectedAddressId) {
      const description = uiLabel(checkout?.selectAddressError);
      if (description) toast.error(uiLabel(global?.errorTitle) ?? "", { description });
      navigate("/order");
      return;
    }

    const orderResponse = await createOrder({
      shippingAddressId: selectedAddressId,
      shippingMethod: buildShippingMethod(),
      paymentMethod: { type: "bank_transfer" },
      notes: null,
    });

    const order = orderResponse.data?.order;
    const instructions = orderResponse.data?.paymentInstructions;

    if (!order) {
      throw new Error(
        orderResponse.message || uiLabel(checkout?.orderCreateErrorFallback) || "Order create failed"
      );
    }

    await refreshCart?.();

    if (instructions) {
      setHavaleInstructions({
        orderNumber: instructions.orderNumber || order.orderNumber,
        message: instructions.message,
        accounts: (instructions.accounts as BankAccount[]) || bankAccounts,
      });
      const title = uiLabel(checkout?.havaleSuccessTitle);
      const description = uiLabel(checkout?.havaleSuccessDescription);
      if (title || description) {
        toast.success(title ?? "", { description });
      }
    } else {
      const title = uiLabel(checkout?.havaleSuccessTitle);
      const description = uiLabel(checkout?.havaleSuccessDescription);
      if (title || description) {
        toast.success(title ?? "", { description });
      }
      navigate(`/order/${order.id}`);
    }
  };

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: "/order/payment" } });
      return;
    }

    if (!contractsAccepted) {
      const title = uiLabel(checkout?.validationErrorTitle) ?? uiLabel(global?.errorTitle);
      const description = uiLabel(checkout?.contractsRequiredMessage);
      if (title || description) {
        toast.error(title ?? "", { description });
      }
      return;
    }

    try {
      setIsProcessing(true);
      if (paymentMethod === "iyzico") {
        await handleIyzicoPay();
      } else {
        await handleHavalePay();
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : (uiLabel(checkout?.paymentErrorFallback) ?? "");
      const title = uiLabel(checkout?.paymentErrorTitle) ?? uiLabel(global?.errorTitle);
      if (title || errorMessage) {
        toast.error(title ?? "", { description: errorMessage });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const iyzicoPayLabel =
    uiLabel(checkout?.iyzicoPayButton)?.replace("{amount}", totalAmount.toFixed(2)) ??
    uiLabel(checkout?.iyzicoPayButton);

  if (havaleInstructions) {
    return (
      <div className="min-h-screen flex flex-col bg-muted">
        <Navbar />
        <main className="flex-1 py-8 px-4">
          <div className="max-w-lg mx-auto bg-card rounded-lg shadow-sm p-6 space-y-4">
            {uiLabel(checkout?.havaleInstructionsTitle) && (
              <h1 className="text-base font-semibold text-foreground">{checkout!.havaleInstructionsTitle}</h1>
            )}
            {uiLabel(checkout?.orderNumberLabel) && (
              <p className="text-sm text-muted-foreground">
                {checkout!.orderNumberLabel} <strong>{havaleInstructions.orderNumber}</strong>
              </p>
            )}
            <p className="text-sm text-foreground">{havaleInstructions.message}</p>
            {havaleInstructions.accounts.map((account) => (
              <div key={account.id} className="border rounded-lg p-4 text-sm space-y-1">
                <p className="font-semibold">{account.bankName}</p>
                <p>{account.accountHolder}</p>
                <p className="font-mono text-xs">{account.iban}</p>
              </div>
            ))}
            {uiLabel(checkout?.goToOrdersButton) && (
              <Button
                className="w-full bg-primary hover:bg-primary/90"
                onClick={() => navigate("/orders")}
              >
                {checkout!.goToOrdersButton}
              </Button>
            )}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted">
      <Navbar />

      <main className="flex-1 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {!isAuthenticated && uiLabel(checkout?.alreadyHaveAccountText) && (
            <div className="bg-card rounded-lg px-5 py-3 mb-4 flex items-center justify-between text-sm text-muted-foreground shadow-sm">
              <span>{checkout!.alreadyHaveAccountText}</span>
              {uiLabel(checkout?.loginLink) && (
                <button
                  type="button"
                  className="text-primary font-semibold hover:underline"
                  onClick={() => navigate("/login", { state: { from: "/order/payment" } })}
                >
                  {checkout!.loginLink}
                </button>
              )}
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 space-y-3">
              <div className="flex rounded-lg overflow-hidden shadow-sm">
                {uiLabel(checkout?.addressTabLabel) && (
                  <button
                    type="button"
                    onClick={() => navigate("/order")}
                    className="flex-1 py-4 text-sm font-semibold tracking-wide transition-colors bg-gray-200 text-muted-foreground hover:bg-gray-300"
                  >
                    {checkout!.addressTabLabel}
                  </button>
                )}
                {uiLabel(checkout?.paymentTabLabel) && (
                  <button
                    type="button"
                    className="flex-1 py-4 text-sm font-semibold tracking-wide bg-primary text-white"
                  >
                    {checkout!.paymentTabLabel}
                  </button>
                )}
              </div>

              <div className="bg-card rounded-lg shadow-sm overflow-hidden">
                {uiLabel(checkout?.shippingOptionsTitle) && (
                  <button type="button" className="w-full flex items-center justify-between px-5 py-4 text-sm font-semibold text-foreground">
                    <span>{checkout!.shippingOptionsTitle}</span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground rotate-90" />
                  </button>
                )}
                <div className="px-5 pb-5">
                  {loadingCargo ? (
                    <div className="flex items-center justify-center py-6 gap-2 text-muted-foreground">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {uiLabel(checkout?.shippingLoadingLabel) && (
                        <span className="text-sm">{checkout!.shippingLoadingLabel}</span>
                      )}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {cargoOptions.map((option) => {
                        const optionKey = option.id ?? option.name;
                        return (
                          <label
                            key={optionKey}
                            className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                              selectedCargo === optionKey
                                ? "border-primary bg-primary/10"
                                : "border-border hover:border-border"
                            }`}
                          >
                            <input
                              type="radio"
                              name="cargo"
                              value={optionKey}
                              checked={selectedCargo === optionKey}
                              onChange={() => setSelectedCargo(optionKey)}
                              className="accent-primary"
                            />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-foreground">{option.name}</p>
                              <p className="text-sm text-muted-foreground mt-0.5">
                                {option.cost.toFixed(2)} TL
                              </p>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-card rounded-lg shadow-sm overflow-hidden">
                {uiLabel(checkout?.paymentOptionsTitle) && (
                  <div className="px-5 py-4 border-b border-border">
                    <p className="text-sm font-semibold text-foreground">{checkout!.paymentOptionsTitle}</p>
                  </div>
                )}

                <div className="px-5 py-4 space-y-3">
                  <div className="mb-4">
                    <CheckoutLegalConsent
                      checked={contractsAccepted}
                      onCheckedChange={setContractsAccepted}
                    />
                  </div>

                  {loadingPaymentMeta ? (
                    <div className="flex items-center gap-2 text-muted-foreground py-4">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {uiLabel(checkout?.paymentLoadingLabel) && (
                        <span className="text-sm">{checkout!.paymentLoadingLabel}</span>
                      )}
                    </div>
                  ) : (
                    <>
                      <label
                        className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          paymentMethod === "iyzico"
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-border"
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={paymentMethod === "iyzico"}
                          onChange={() => setPaymentMethod("iyzico")}
                          className="accent-primary flex-shrink-0"
                        />
                        <div className="flex items-center gap-2">
                          {iyzicoLogoUrl ? (
                            <img
                              src={getImageUrl(iyzicoLogoUrl)}
                              alt=""
                              className="h-8 w-auto object-contain"
                            />
                          ) : (
                            <span className="font-bold text-[#1a9b79] text-base">iyzico</span>
                          )}
                        </div>
                      </label>

                      {paymentMethod === "iyzico" && (
                        <div className="ml-4 pl-3 border-l-2 border-primary/30 space-y-3">
                          {uiLabel(checkout?.iyzicoSecurityNote) && (
                            <div className="flex items-start gap-2 bg-muted/50 border border-border rounded-lg px-3 py-3 text-xs text-foreground">
                              <Shield className="w-4 h-4 flex-shrink-0 mt-0.5 text-primary" />
                              <span>{checkout!.iyzicoSecurityNote}</span>
                            </div>
                          )}

                          {iyzicoClients.length > 1 &&
                            iyzicoClients.map((client) => (
                              <label
                                key={client.code}
                                className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer ${
                                  selectedIyzicoClient === client.code
                                    ? "border-primary/50 bg-primary/10"
                                    : "border-border"
                                }`}
                              >
                                <input
                                  type="radio"
                                  name="iyzicoClient"
                                  checked={selectedIyzicoClient === client.code}
                                  onChange={() => setSelectedIyzicoClient(client.code)}
                                  className="accent-primary"
                                />
                                <div>
                                  <p className="text-sm font-medium">{client.name}</p>
                                  <p className="text-xs text-muted-foreground">{client.currency}</p>
                                </div>
                              </label>
                            ))}

                          {iyzicoPayLabel && (
                            <Button
                              onClick={handleSubmit}
                              disabled={isProcessing || !contractsAccepted}
                              className="w-full bg-primary hover:bg-primary/90 text-white rounded-lg h-12 text-sm font-semibold disabled:opacity-50"
                            >
                              {isProcessing ? (
                                <span className="flex items-center gap-2 justify-center">
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  {uiLabel(checkout?.iyzicoRedirectingLabel) ?? ""}
                                </span>
                              ) : (
                                <span className="flex items-center gap-2 justify-center">
                                  <ExternalLink className="w-4 h-4" />
                                  {iyzicoPayLabel}
                                </span>
                              )}
                            </Button>
                          )}
                        </div>
                      )}

                      {bankTransferEnabled && (
                        <>
                          <label
                            className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                              paymentMethod === "havale"
                                ? "border-primary bg-primary/10"
                                : "border-border hover:border-border"
                            }`}
                          >
                            <input
                              type="radio"
                              name="paymentMethod"
                              checked={paymentMethod === "havale"}
                              onChange={() => setPaymentMethod("havale")}
                              className="accent-primary flex-shrink-0"
                            />
                            <Building2 className="w-5 h-5 text-blue-600 flex-shrink-0" />
                            <div>
                              {uiLabel(checkout?.bankTransferTitle) && (
                                <p className="text-sm font-semibold text-foreground">{checkout!.bankTransferTitle}</p>
                              )}
                              {uiLabel(checkout?.bankTransferSubtitle) && (
                                <p className="text-xs text-muted-foreground">{checkout!.bankTransferSubtitle}</p>
                              )}
                            </div>
                          </label>

                          {paymentMethod === "havale" && (
                            <div className="ml-4 pl-3 border-l-2 border-blue-200 space-y-3">
                              {uiLabel(checkout?.bankTransferNote) && (
                                <p className="text-xs text-muted-foreground">{checkout!.bankTransferNote}</p>
                              )}
                              {loadingBanks ? (
                                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                              ) : (
                                bankAccounts.map((account) => (
                                  <div
                                    key={account.id}
                                    className="border rounded-lg p-3 text-xs text-muted-foreground"
                                  >
                                    <p className="font-semibold text-foreground">{account.bankName}</p>
                                    <p className="font-mono mt-1">{account.iban}</p>
                                    {uiLabel(checkout?.copyIbanButton) && (
                                      <button
                                        type="button"
                                        onClick={() => handleCopyIban(account.iban, account.id)}
                                        className="mt-2 text-blue-600 flex items-center gap-1"
                                      >
                                        {copiedIban === account.id ? (
                                          <CheckCheck className="w-3 h-3" />
                                        ) : (
                                          <Copy className="w-3 h-3" />
                                        )}
                                        {checkout!.copyIbanButton}
                                      </button>
                                    )}
                                  </div>
                                ))
                              )}
                              {uiLabel(checkout?.createOrderBankTransferButton) && (
                                <Button
                                  onClick={handleSubmit}
                                  disabled={isProcessing}
                                  className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg h-12 text-sm font-semibold"
                                >
                                  {isProcessing
                                    ? (uiLabel(checkout?.createOrderBankTransferSubmitting) ??
                                      checkout!.createOrderBankTransferButton)
                                    : checkout!.createOrderBankTransferButton}
                                </Button>
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </>
                  )}
                </div>

                <div className="px-5 pb-4">
                  <PaymentComplianceLogos
                    compliance={siteSettings.paymentCompliance}
                    className="flex flex-wrap items-center gap-3 pt-2 border-t border-border"
                    imgClassName="h-6 w-auto object-contain"
                  />
                </div>
              </div>
            </div>

            <div className="w-full lg:w-72 space-y-3 flex-shrink-0">
              <div className="bg-card rounded-lg shadow-sm overflow-hidden">
                {uiLabel(checkout?.orderSummaryTitle) && (
                  <div className="px-4 py-3 border-b border-border">
                    <span className="text-sm font-semibold text-foreground">{checkout!.orderSummaryTitle}</span>
                  </div>
                )}
                <div className="px-4 py-3 space-y-3">
                  {cartItems.slice(0, 4).map((item) => (
                    <div key={item.product.id} className="flex gap-3 items-start">
                      <div className="w-14 h-14 rounded overflow-hidden bg-muted flex-shrink-0 border">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-foreground line-clamp-2">{item.product.name}</p>
                        <p className="text-xs font-semibold mt-1">
                          {((item.product.price || 0) * item.quantity).toFixed(2)} TL
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 pb-4 border-t pt-3 space-y-2 text-xs">
                  {uiLabel(checkout?.cartTotalLabel) && (
                    <div className="flex justify-between text-muted-foreground">
                      <span>{checkout!.cartTotalLabel}</span>
                      <span>{cartTotal.toFixed(2)} TL</span>
                    </div>
                  )}
                  {uiLabel(checkout?.shippingFeeLabel) && (
                    <div className="flex justify-between text-muted-foreground">
                      <span>{checkout!.shippingFeeLabel}</span>
                      <span>{shippingCost.toFixed(2)} TL</span>
                    </div>
                  )}
                  {uiLabel(checkout?.grandTotalLabel) && (
                    <div className="flex justify-between text-sm font-bold border-t pt-2">
                      <span>{checkout!.grandTotalLabel}</span>
                      <span className="text-primary">{totalAmount.toFixed(2)} TL</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderPayment;
