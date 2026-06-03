import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ChevronRight,
  Tag,
  Building2,
  Copy,
  CheckCheck,
  Shield,
  CreditCard,
  Loader2,
  AlertTriangle,
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

type PaymentMethod = "iyzico" | "havale";

const PENDING_ORDER_KEY = "bizdenalbizdensat_pending_iyzico_order";

const OrderPayment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartTotal, cartItems, refreshCart } = useCart();
  const { isAuthenticated } = useAuth();
  const siteSettings = useSiteSettings();
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
  const [discountCode, setDiscountCode] = useState("");
  const [contractsAccepted, setContractsAccepted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedIban, setCopiedIban] = useState<string | null>(null);
  const [havaleInstructions, setHavaleInstructions] = useState<{
    orderNumber: string;
    message: string;
    accounts: BankAccount[];
  } | null>(null);

  const isSandbox = iyzicoClients.some((c) => c.isSandbox);

  useEffect(() => {
    if (!isAuthenticated) return;
    if (!selectedAddressId) {
      toast.error("Lütfen teslimat adresi seçin");
      navigate("/order");
    }
  }, [isAuthenticated, selectedAddressId, navigate]);

  useEffect(() => {
    getShippingMethods()
      .then((methods) => {
        setCargoOptions(methods);
        if (methods.length > 0) {
          setSelectedCargo(methods[0].id ?? methods[0].name);
        }
      })
      .catch(() => toast.error("Kargo seçenekleri yüklenemedi"))
      .finally(() => setLoadingCargo(false));
  }, []);

  useEffect(() => {
    getBankAccounts()
      .then((res) => {
        const accounts = res.data || [];
        setBankAccounts(accounts);
        if (accounts.length > 0) {
          setSelectedBank(accounts[0].id);
        }
      })
      .catch(() => toast.error("Banka hesapları yüklenemedi"))
      .finally(() => setLoadingBanks(false));
  }, []);

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
      .catch(() => toast.error("Ödeme seçenekleri yüklenemedi"))
      .finally(() => setLoadingPaymentMeta(false));
  }, []);

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
      name: cargoOption?.name ?? "Standart Kargo",
      cost: cargoOption?.cost ?? shippingCost,
      estimatedDays: cargoOption?.estimatedDays ?? 3,
      provider: cargoOption?.provider ?? cargoOption?.name ?? "Kargo",
    };
  };

  const handleIyzicoPay = async () => {
    if (!selectedAddressId) {
      toast.error("Teslimat adresi gerekli");
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
      throw new Error(orderResponse.message || "Sipariş oluşturulamadı");
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
      toast.error("Teslimat adresi gerekli");
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
      throw new Error(orderResponse.message || "Sipariş oluşturulamadı");
    }

    await refreshCart?.();

    if (instructions) {
      setHavaleInstructions({
        orderNumber: instructions.orderNumber || order.orderNumber,
        message: instructions.message,
        accounts: (instructions.accounts as BankAccount[]) || bankAccounts,
      });
      toast.success("Siparişiniz oluşturuldu", {
        description: "Havale bilgilerini aşağıdan görüntüleyebilirsiniz.",
      });
    } else {
      toast.success("Siparişiniz Alındı!", {
        description:
          "Havale/EFT işleminizi gerçekleştirdikten sonra siparişiniz onaylanacaktır.",
      });
      navigate(`/order/${order.id}`);
    }
  };

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: "/order/payment" } });
      return;
    }

    if (!contractsAccepted) {
      toast.error("Hata", { description: "Lütfen sözleşmeleri onaylayın" });
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
        error instanceof Error ? error.message : "Ödeme işleminde hata oluştu";
      toast.error("Ödeme Hatası", { description: errorMessage });
    } finally {
      setIsProcessing(false);
    }
  };

  if (havaleInstructions) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-100">
        <Navbar />
        <main className="flex-1 py-8 px-4">
          <div className="max-w-lg mx-auto bg-white rounded-lg shadow-sm p-6 space-y-4">
            <h1 className="text-base font-semibold text-gray-900">Havale / EFT Talimatları</h1>
            <p className="text-sm text-gray-600">
              Sipariş No: <strong>{havaleInstructions.orderNumber}</strong>
            </p>
            <p className="text-sm text-gray-700">{havaleInstructions.message}</p>
            {havaleInstructions.accounts.map((account) => (
              <div key={account.id} className="border rounded-lg p-4 text-sm space-y-1">
                <p className="font-semibold">{account.bankName}</p>
                <p>{account.accountHolder}</p>
                <p className="font-mono text-xs">{account.iban}</p>
              </div>
            ))}
            <Button
              className="w-full bg-purple-600 hover:bg-purple-700"
              onClick={() => navigate("/orders")}
            >
              Siparişlerime Git
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />

      <main className="flex-1 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {isSandbox && (
            <div className="mb-4 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <span>
                Test ortamındasınız. Ödeme iyzico sandbox sayfasında tamamlanır.{" "}
                <a
                  href="https://docs.iyzico.com/odeme-metotlari/odeme-formu/cf-entegrasyonu/cf-ornek-entegrasyon"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline font-medium"
                >
                  Test kartları
                </a>
              </span>
            </div>
          )}

          {!isAuthenticated && (
            <div className="bg-white rounded-lg px-5 py-3 mb-4 flex items-center justify-between text-sm text-gray-600 shadow-sm">
              <span>Zaten hesabınız var mı?</span>
              <button
                className="text-purple-600 font-semibold hover:underline"
                onClick={() => navigate("/login", { state: { from: "/order/payment" } })}
              >
                Giriş Yap
              </button>
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 space-y-3">
              <div className="flex rounded-lg overflow-hidden shadow-sm">
                <button
                  onClick={() => navigate("/order")}
                  className="flex-1 py-4 text-sm font-semibold tracking-wide transition-colors bg-gray-200 text-gray-500 hover:bg-gray-300"
                >
                  ADRES BİLGİLERİ
                </button>
                <button className="flex-1 py-4 text-sm font-semibold tracking-wide bg-purple-600 text-white">
                  ÖDEME BİLGİLERİ
                </button>
              </div>

              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <button className="w-full flex items-center justify-between px-5 py-4 text-sm font-semibold text-gray-800">
                  <span>KARGO SEÇENEKLERİ</span>
                  <ChevronRight className="w-4 h-4 text-gray-400 rotate-90" />
                </button>
                <div className="px-5 pb-5">
                  {loadingCargo ? (
                    <div className="flex items-center justify-center py-6 gap-2 text-gray-400">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">Kargo seçenekleri yükleniyor...</span>
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
                                ? "border-purple-500 bg-purple-50"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <input
                              type="radio"
                              name="cargo"
                              value={optionKey}
                              checked={selectedCargo === optionKey}
                              onChange={() => setSelectedCargo(optionKey)}
                              className="accent-purple-600"
                            />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-800">{option.name}</p>
                              <p className="text-sm text-gray-600 mt-0.5">
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

              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-800">ÖDEME SEÇENEKLERİ</p>
                </div>

                <div className="px-5 py-4 space-y-3">
                  <div className="mb-4">
                    <CheckoutLegalConsent
                      checked={contractsAccepted}
                      onCheckedChange={setContractsAccepted}
                    />
                  </div>

                  {loadingPaymentMeta ? (
                    <div className="flex items-center gap-2 text-gray-400 py-4">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">Ödeme seçenekleri yükleniyor...</span>
                    </div>
                  ) : (
                    <>
                      <label
                        className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          paymentMethod === "iyzico"
                            ? "border-purple-500 bg-purple-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={paymentMethod === "iyzico"}
                          onChange={() => setPaymentMethod("iyzico")}
                          className="accent-purple-600 flex-shrink-0"
                        />
                        <div className="flex items-center gap-2">
                          {iyzicoLogoUrl ? (
                            <img
                              src={getImageUrl(iyzicoLogoUrl)}
                              alt="iyzico ile Öde"
                              className="h-8 w-auto object-contain"
                            />
                          ) : (
                            <>
                              <span className="font-bold text-[#1a9b79] text-base">iyzico</span>
                              <span className="text-[10px] bg-[#1a9b79] text-white px-1.5 py-0.5 rounded font-bold">
                                ile Öde
                              </span>
                            </>
                          )}
                        </div>
                      </label>

                      {paymentMethod === "iyzico" && (
                        <div className="ml-4 pl-3 border-l-2 border-purple-200 space-y-3">
                          <div className="flex items-start gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-3 text-xs text-gray-700">
                            <Shield className="w-4 h-4 flex-shrink-0 mt-0.5 text-purple-600" />
                            <span>
                              Kart bilgileriniz bu sitede toplanmaz. Ödeme güvenli iyzico
                              sayfasında tamamlanır.
                            </span>
                          </div>

                          {iyzicoClients.length > 1 && (
                            <div className="space-y-2">
                              <p className="text-xs text-gray-500 font-medium">Ödeme mağazası</p>
                              {iyzicoClients.map((client) => (
                                <label
                                  key={client.code}
                                  className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer ${
                                    selectedIyzicoClient === client.code
                                      ? "border-purple-400 bg-purple-50"
                                      : "border-gray-200"
                                  }`}
                                >
                                  <input
                                    type="radio"
                                    name="iyzicoClient"
                                    checked={selectedIyzicoClient === client.code}
                                    onChange={() => setSelectedIyzicoClient(client.code)}
                                    className="accent-purple-600"
                                  />
                                  <div>
                                    <p className="text-sm font-medium">{client.name}</p>
                                    <p className="text-xs text-gray-500">{client.currency}</p>
                                  </div>
                                </label>
                              ))}
                            </div>
                          )}

                          {iyzicoClients.length === 0 && (
                            <p className="text-xs text-gray-500">
                              Mağaza listesi boş; ödeme sunucudaki varsayılan iyzico yapılandırması ile
                              başlatılacak.
                            </p>
                          )}

                          <Button
                            onClick={handleSubmit}
                            disabled={isProcessing || !contractsAccepted}
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-lg h-12 text-sm font-semibold disabled:opacity-50"
                          >
                            {isProcessing ? (
                              <span className="flex items-center gap-2 justify-center">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Yönlendiriliyor...
                              </span>
                            ) : (
                              <span className="flex items-center gap-2 justify-center">
                                <ExternalLink className="w-4 h-4" />
                                {totalAmount.toFixed(2)} TL — iyzico ile Öde
                              </span>
                            )}
                          </Button>
                        </div>
                      )}

                      {bankTransferEnabled && (
                        <>
                          <label
                            className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                              paymentMethod === "havale"
                                ? "border-purple-500 bg-purple-50"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <input
                              type="radio"
                              name="paymentMethod"
                              checked={paymentMethod === "havale"}
                              onChange={() => setPaymentMethod("havale")}
                              className="accent-purple-600 flex-shrink-0"
                            />
                            <Building2 className="w-5 h-5 text-blue-600 flex-shrink-0" />
                            <div>
                              <p className="text-sm font-semibold text-gray-800">Havale / EFT</p>
                              <p className="text-xs text-gray-500">Banka havalesiyle ödeme</p>
                            </div>
                          </label>

                          {paymentMethod === "havale" && (
                            <div className="ml-4 pl-3 border-l-2 border-blue-200 space-y-3">
                              <p className="text-xs text-gray-500">
                                Sipariş oluşturulduktan sonra havale talimatları gösterilecektir.
                              </p>
                              {loadingBanks ? (
                                <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                              ) : (
                                bankAccounts.map((account) => (
                                  <div
                                    key={account.id}
                                    className="border rounded-lg p-3 text-xs text-gray-600"
                                  >
                                    <p className="font-semibold text-gray-800">{account.bankName}</p>
                                    <p className="font-mono mt-1">{account.iban}</p>
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
                                      IBAN Kopyala
                                    </button>
                                  </div>
                                ))
                              )}
                              <Button
                                onClick={handleSubmit}
                                disabled={isProcessing}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg h-12 text-sm font-semibold"
                              >
                                {isProcessing ? "İşleniyor..." : "Siparişi Oluştur (Havale)"}
                              </Button>
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
                    className="flex flex-wrap items-center gap-3 pt-2 border-t border-gray-100"
                    imgClassName="h-6 w-auto object-contain"
                  />
                </div>
              </div>
            </div>

            <div className="w-full lg:w-72 space-y-3 flex-shrink-0">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100">
                  <span className="text-sm font-semibold text-gray-800">Sipariş Özeti</span>
                </div>
                <div className="px-4 py-3 space-y-3">
                  {cartItems.slice(0, 4).map((item) => (
                    <div key={item.product.id} className="flex gap-3 items-start">
                      <div className="w-14 h-14 rounded overflow-hidden bg-gray-100 flex-shrink-0 border">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-700 line-clamp-2">{item.product.name}</p>
                        <p className="text-xs font-semibold mt-1">
                          {((item.product.price || 0) * item.quantity).toFixed(2)} TL
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 pb-4 border-t pt-3 space-y-2 text-xs">
                  <div className="flex justify-between text-gray-600">
                    <span>Sepet Toplamı</span>
                    <span>{cartTotal.toFixed(2)} TL</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Kargo</span>
                    <span>{shippingCost.toFixed(2)} TL</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold border-t pt-2">
                    <span>Genel Toplam</span>
                    <span className="text-purple-700">{totalAmount.toFixed(2)} TL</span>
                  </div>
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
