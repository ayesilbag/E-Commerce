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

const POLL_INTERVAL_MS = 2500;
const MAX_POLL_ATTEMPTS = 10;

const PaymentResult = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { refreshCart } = useCart();

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
        const msg = error instanceof Error ? error.message : "Sipariş doğrulanamadı";
        toast.error("Hata", { description: msg });
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [orderId, fetchAndSetOrder, pollOrderStatus, refreshCart]);

  const handleRetryPayment = async () => {
    if (!order?.id) return;
    try {
      setIsRetrying(true);
      const initData = await initializeIyzicoPayment({ orderId: order.id });
      redirectToIyzicoPayment(initData.paymentPageUrl);
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Ödeme başlatılamadı";
      toast.error("Hata", { description: msg });
      setIsRetrying(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!order?.id) return;
    const reason = window.prompt("İptal sebebini yazınız:");
    if (!reason) return;

    try {
      setIsCancelling(true);
      await cancelOrder(order.id, { reason });
      toast.success("Sipariş iptal edildi");
      navigate("/orders");
    } catch (error) {
      const msg = error instanceof Error ? error.message : "İptal başarısız";
      toast.error("Hata", { description: msg });
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

  const renderStatusHeader = () => {
    if (isLoading) {
      return {
        icon: <Loader2 className="w-16 h-16 animate-spin text-purple-600 mx-auto mb-4" />,
        title: "Ödeme durumu kontrol ediliyor...",
        subtitle: pollAttempt > 0 ? `Kontrol ${pollAttempt}/${MAX_POLL_ATTEMPTS}` : undefined,
        bg: "bg-gray-100",
        titleClass: "text-gray-900",
      };
    }

    if (!orderId) {
      return {
        icon: <XCircle size={64} className="mx-auto text-red-600 mb-4" />,
        title: "Sipariş bulunamadı",
        subtitle: "Geçersiz veya eksik ödeme dönüş bağlantısı.",
        bg: "bg-red-50",
        titleClass: "text-red-900",
      };
    }

    switch (paymentStatus) {
      case "Completed":
        return {
          icon: <CheckCircle2 size={64} className="mx-auto text-green-600 mb-4" />,
          title: "Ödeme Başarılı!",
          subtitle: "Siparişiniz onaylandı.",
          bg: "bg-green-50",
          titleClass: "text-green-900",
        };
      case "Failed":
        return {
          icon: <XCircle size={64} className="mx-auto text-red-600 mb-4" />,
          title: "Ödeme Başarısız",
          subtitle: "Ödemeniz tamamlanamadı. Tekrar deneyebilirsiniz.",
          bg: "bg-red-50",
          titleClass: "text-red-900",
        };
      case "Refunded":
        return {
          icon: <CreditCard size={64} className="mx-auto text-blue-600 mb-4" />,
          title: "İade Edildi",
          subtitle: "Bu sipariş için ödeme iade edilmiştir.",
          bg: "bg-blue-50",
          titleClass: "text-blue-900",
        };
      case "Pending":
      default:
        return {
          icon: <Clock size={64} className="mx-auto text-yellow-600 mb-4" />,
          title: "Ödeme Bekleniyor",
          subtitle: "Ödeme henüz onaylanmadı. Birkaç saniye sonra yenileyin veya tekrar ödeyin.",
          bg: "bg-yellow-50",
          titleClass: "text-yellow-900",
        };
    }
  };

  const header = renderStatusHeader();
  const canRetry =
    order && paymentStatus !== "Completed" && order.status === "Pending";
  const canCancel = order?.status === "Pending";

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className={`px-6 py-8 text-center ${header.bg}`}>
              {header.icon}
              <h1 className={`text-base font-semibold mb-2 ${header.titleClass}`}>{header.title}</h1>
              {header.subtitle && (
                <p className="text-gray-700 max-w-md mx-auto">{header.subtitle}</p>
              )}

              {paymentStatus === "Pending" && orderId && !isLoading && (
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Yenile
                  </Button>
                  {canRetry && (
                    <Button
                      onClick={handleRetryPayment}
                      disabled={isRetrying}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      {isRetrying ? "Yönlendiriliyor..." : "Tekrar Öde"}
                    </Button>
                  )}
                </div>
              )}

              {paymentStatus === "Failed" && canRetry && !isLoading && (
                <Button
                  onClick={handleRetryPayment}
                  disabled={isRetrying}
                  variant="outline"
                  className="mt-4"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Tekrar Öde
                </Button>
              )}
            </div>

            {order && paymentStatus === "Completed" && (
              <div className="px-6 py-6 border-t border-gray-200 space-y-3 text-sm">
                <h2 className="text-sm font-semibold text-gray-900">Sipariş Detayları</h2>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Sipariş Numarası</span>
                  <span className="font-medium">{order.orderNumber}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Toplam</span>
                  <span className="font-medium">{order.total?.toFixed(2)} TL</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Durum</span>
                  <span className="font-medium text-green-600">Ödeme Tamamlandı</span>
                </div>
              </div>
            )}

            {order && paymentStatus === "Failed" && (
              <div className="px-6 py-4 border-t bg-yellow-50 text-xs text-yellow-800">
                Ödeme başarısız. Sepetiniz korunur; tekrar ödeme deneyebilir veya siparişi iptal
                edebilirsiniz.
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            {paymentStatus === "Completed" && order ? (
              <>
                <Button
                  onClick={() => navigate(`/order/${order.id}`)}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Sipariş Detayı
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button onClick={() => navigate("/orders")} variant="outline" className="flex-1">
                  Tüm Siparişlerim
                </Button>
              </>
            ) : (
              <>
                <Button onClick={() => navigate("/shop")} variant="outline" className="flex-1">
                  Alışverişe Devam Et
                </Button>
                <Button
                  onClick={() => navigate("/orders")}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Siparişlerim
                </Button>
                {canCancel && (
                  <Button
                    variant="outline"
                    className="flex-1 border-red-200 text-red-600"
                    onClick={handleCancelOrder}
                    disabled={isCancelling}
                  >
                    {isCancelling ? "İptal ediliyor..." : "Siparişi İptal Et"}
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
