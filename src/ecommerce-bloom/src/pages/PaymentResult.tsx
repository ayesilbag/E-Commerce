import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  RefreshCw,
  Loader2,
  CreditCard,
  Clock,
} from "lucide-react";
import { getOrder, cancelOrder, type Order, type PaymentStatus } from "@/services/orders.service";
import {
  initializeIyzicoPayment,
  redirectToIyzicoPayment,
} from "@/services/payments.service";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { findStatusLabel, uiLabel, useAppPagesUi } from "@/hooks/useAppPagesUi";

const POLL_INTERVAL_MS = 2500;
const MAX_POLL_ATTEMPTS = 10;

const PaymentResult = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { refreshCart } = useCart();
  const checkout = useAppPagesUi()?.checkout;
  const global = useAppPagesUi()?.global;

  const orderId = searchParams.get("orderId") || "";

  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState<Order | null>(null);
  const [pollAttempt, setPollAttempt] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const fetchAndSetOrder = useCallback(async (id: string): Promise<Order | null> => {
    const data = await getOrder(id);
    setOrder(data);
    return data;
  }, []);

  const pollOrderStatus = useCallback(
    async (id: string) => {
      for (let i = 0; i < MAX_POLL_ATTEMPTS; i++) {
        setPollAttempt(i + 1);
        const data = await fetchAndSetOrder(id);
        if (data?.paymentStatus && data.paymentStatus !== "Pending") {
          return data;
        }
        await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
      }
      return fetchAndSetOrder(id);
    },
    [fetchAndSetOrder]
  );

  useEffect(() => {
    const load = async () => {
      if (!orderId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const data = await fetchAndSetOrder(orderId);
        if (data?.paymentStatus === "Pending") {
          await pollOrderStatus(orderId);
        }
        await refreshCart();
        sessionStorage.removeItem("bizdenalbizdensat_pending_iyzico_order");
      } catch (error) {
        const msg =
          error instanceof Error
            ? error.message
            : (uiLabel(checkout?.orderDetailLoadError) ?? "");
        const title = uiLabel(global?.errorTitle);
        if (title || msg) {
          toast.error(title ?? "", { description: msg });
        }
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [orderId, fetchAndSetOrder, pollOrderStatus, refreshCart, checkout?.orderDetailLoadError, global?.errorTitle]);

  const handleRetryPayment = async () => {
    if (!order?.id) return;
    try {
      setIsRetrying(true);
      const initData = await initializeIyzicoPayment({ orderId: order.id });
      redirectToIyzicoPayment(initData.paymentPageUrl);
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : (uiLabel(checkout?.paymentErrorFallback) ?? "");
      const title = uiLabel(global?.errorTitle);
      if (title || msg) {
        toast.error(title ?? "", { description: msg });
      }
      setIsRetrying(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!order?.id) return;
    const placeholder = uiLabel(checkout?.cancelReasonPlaceholder);
    const reason = placeholder ? window.prompt(placeholder) : window.prompt("");
    if (!reason) return;

    try {
      setIsCancelling(true);
      await cancelOrder(order.id, { reason });
      navigate("/orders");
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : (uiLabel(checkout?.paymentErrorFallback) ?? "");
      const title = uiLabel(global?.errorTitle);
      if (title || msg) {
        toast.error(title ?? "", { description: msg });
      }
    } finally {
      setIsCancelling(false);
    }
  };

  const handleRefresh = async () => {
    if (!orderId) return;
    setIsLoading(true);
    try {
      await pollOrderStatus(orderId);
    } finally {
      setIsLoading(false);
    }
  };

  const paymentStatus: PaymentStatus | "unknown" = order?.paymentStatus ?? "unknown";

  const pollNote = uiLabel(checkout?.paymentResultPollNote)
    ?.replace("{current}", String(pollAttempt))
    ?.replace("{max}", String(MAX_POLL_ATTEMPTS));

  const renderStatusHeader = () => {
    if (isLoading) {
      return {
        icon: <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto mb-4" />,
        title: uiLabel(checkout?.paymentResultCheckingTitle),
        subtitle: pollAttempt > 0 ? pollNote : undefined,
        bg: "bg-muted",
        titleClass: "text-foreground",
      };
    }

    if (!orderId) {
      return {
        icon: <XCircle size={64} className="mx-auto text-red-600 mb-4" />,
        title: uiLabel(checkout?.paymentResultMissingOrderTitle),
        subtitle: uiLabel(checkout?.paymentResultMissingOrderDescription),
        bg: "bg-red-50",
        titleClass: "text-red-900",
      };
    }

    switch (paymentStatus) {
      case "Completed":
        return {
          icon: <CheckCircle2 size={64} className="mx-auto text-green-600 mb-4" />,
          title: uiLabel(checkout?.paymentResultSuccessTitle),
          subtitle: uiLabel(checkout?.paymentResultSuccessDescription),
          bg: "bg-green-50",
          titleClass: "text-green-900",
        };
      case "Failed":
        return {
          icon: <XCircle size={64} className="mx-auto text-red-600 mb-4" />,
          title: uiLabel(checkout?.paymentResultFailedTitle),
          subtitle: uiLabel(checkout?.paymentResultFailedDescription),
          bg: "bg-red-50",
          titleClass: "text-red-900",
        };
      case "Refunded":
        return {
          icon: <CreditCard size={64} className="mx-auto text-blue-600 mb-4" />,
          title: uiLabel(checkout?.paymentResultRefundedTitle),
          subtitle: uiLabel(checkout?.paymentResultRefundedDescription),
          bg: "bg-blue-50",
          titleClass: "text-blue-900",
        };
      case "Pending":
      default:
        return {
          icon: <Clock size={64} className="mx-auto text-yellow-600 mb-4" />,
          title: uiLabel(checkout?.paymentResultPendingTitle),
          subtitle: uiLabel(checkout?.paymentResultPendingDescription),
          bg: "bg-yellow-50",
          titleClass: "text-yellow-900",
        };
    }
  };

  const header = renderStatusHeader();
  const canRetry =
    order && paymentStatus !== "Completed" && order.status === "Pending";
  const canCancel = order?.status === "Pending";

  const completedPaymentLabel = findStatusLabel(checkout?.paymentStatusLabels, "Completed");

  return (
    <div className="min-h-screen flex flex-col bg-muted">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-card rounded-lg shadow-sm overflow-hidden">
            <div className={`px-6 py-8 text-center ${header.bg}`}>
              {header.icon}
              {header.title && (
                <h1 className={`text-base font-semibold mb-2 ${header.titleClass}`}>{header.title}</h1>
              )}
              {header.subtitle && (
                <p className="text-foreground max-w-md mx-auto">{header.subtitle}</p>
              )}

              {paymentStatus === "Pending" && orderId && !isLoading && (
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {uiLabel(checkout?.refreshButton) && (
                    <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      {checkout!.refreshButton}
                    </Button>
                  )}
                  {canRetry && uiLabel(checkout?.retryPaymentButton) && (
                    <Button
                      onClick={handleRetryPayment}
                      disabled={isRetrying}
                      className="bg-primary hover:bg-primary/90 text-white"
                    >
                      {isRetrying
                        ? (uiLabel(checkout?.iyzicoRedirectingLabel) ?? checkout!.retryPaymentButton)
                        : checkout!.retryPaymentButton}
                    </Button>
                  )}
                </div>
              )}

              {paymentStatus === "Failed" && canRetry && !isLoading && uiLabel(checkout?.retryPaymentButton) && (
                <Button
                  onClick={handleRetryPayment}
                  disabled={isRetrying}
                  variant="outline"
                  className="mt-4"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  {checkout!.retryPaymentButton}
                </Button>
              )}
            </div>

            {order && paymentStatus === "Completed" && (
              <div className="px-6 py-6 border-t border-border space-y-3 text-sm">
                {uiLabel(checkout?.orderDetailsTitle) && (
                  <h2 className="text-sm font-semibold text-foreground">{checkout!.orderDetailsTitle}</h2>
                )}
                {uiLabel(checkout?.orderNumberLabel) && (
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">{checkout!.orderNumberLabel}</span>
                    <span className="font-medium">{order.orderNumber}</span>
                  </div>
                )}
                {uiLabel(checkout?.totalLabel) && (
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">{checkout!.totalLabel}</span>
                    <span className="font-medium">{order.total?.toFixed(2)} TL</span>
                  </div>
                )}
                {uiLabel(checkout?.statusLabel) && completedPaymentLabel && (
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">{checkout!.statusLabel}</span>
                    <span className="font-medium text-green-600">{completedPaymentLabel}</span>
                  </div>
                )}
              </div>
            )}

            {order && paymentStatus === "Failed" && uiLabel(checkout?.paymentResultFailedBanner) && (
              <div className="px-6 py-4 border-t bg-yellow-50 text-xs text-yellow-800">
                {checkout!.paymentResultFailedBanner}
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            {paymentStatus === "Completed" && order ? (
              <>
                {uiLabel(checkout?.viewOrderDetailButton) && (
                  <Button
                    onClick={() => navigate(`/order/${order.id}`)}
                    className="flex-1 bg-primary hover:bg-primary/90 text-white"
                  >
                    {checkout!.viewOrderDetailButton}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
                {uiLabel(checkout?.goToOrdersButton) && (
                  <Button onClick={() => navigate("/orders")} variant="outline" className="flex-1">
                    {checkout!.goToOrdersButton}
                  </Button>
                )}
              </>
            ) : (
              <>
                {uiLabel(checkout?.continueShoppingButton) && (
                  <Button onClick={() => navigate("/shop")} variant="outline" className="flex-1">
                    {checkout!.continueShoppingButton}
                  </Button>
                )}
                {uiLabel(checkout?.goToOrdersButton) && (
                  <Button
                    onClick={() => navigate("/orders")}
                    className="flex-1 bg-primary hover:bg-primary/90 text-white"
                  >
                    {checkout!.goToOrdersButton}
                  </Button>
                )}
                {canCancel && uiLabel(checkout?.cancelOrderButton) && (
                  <Button
                    variant="outline"
                    className="flex-1 border-red-200 text-red-600"
                    onClick={handleCancelOrder}
                    disabled={isCancelling}
                  >
                    {isCancelling
                      ? (uiLabel(checkout?.cancelDialogSubmitting) ?? checkout!.cancelOrderButton)
                      : checkout!.cancelOrderButton}
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PaymentResult;
