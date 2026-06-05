import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Loader, ChevronLeft, Clock, Truck, Package, CreditCard, CheckCircle2, XCircle, ExternalLink } from 'lucide-react';
import { getOrder, cancelOrder } from '@/services/orders.service';
import { initializeIyzicoPayment, redirectToIyzicoPayment } from '@/services/payments.service';
import type { Order } from '@/types';
import { toast } from 'sonner';

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  // Check if user came from iyzico return
  const iyzicoData = location.state?.iyzicoReturn;
  const paymentStatus = location.state?.paymentStatus;

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setIsLoading(true);
        if (!id) {
          toast.error('Sipariş ID bulunamadı');
          navigate('/account');
          return;
        }

        const orderData = await getOrder(id);
        setOrder(orderData);

        // If came from iyzico return, show toast
        if (iyzicoData) {
          if (iyzicoData.success) {
            toast.success('Ödeme Başarılı!', {
              description: 'Siparişiniz oluşturuldu',
            });
          } else {
            toast.error('Ödeme Başarısız', {
              description: iyzicoData.message || 'Ödeme tamamlanamadı',
            });
          }
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Sipariş yüklenirken hata oluştu';
        toast.error('Hata', { description: errorMessage });
        navigate('/account');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [id, navigate, location.state]);

  const handleCompletePayment = async () => {
    if (!order) return;
    try {
      setIsProcessing(true);
      const initData = await initializeIyzicoPayment({ orderId: order.id });
      redirectToIyzicoPayment(initData.paymentPageUrl);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ödeme başlatılamadı';
      toast.error('Hata', { description: errorMessage });
      setIsProcessing(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!order || !cancelReason.trim()) return;
    try {
      setIsProcessing(true);
      await cancelOrder(order.id, { reason: cancelReason.trim() });
      toast.success('Sipariş iptal edildi');
      setShowCancelDialog(false);
      navigate('/account');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'İptal işlemi başarısız';
      toast.error('Hata', { description: errorMessage });
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending':
        return <Clock className="w-6 h-6 text-yellow-500" />;
      case 'Confirmed':
        return <CheckCircle2 className="w-6 h-6 text-blue-500" />;
      case 'Processing':
        return <Package className="w-6 h-6 text-purple-500" />;
      case 'Shipped':
        return <Truck className="w-6 h-6 text-blue-600" />;
      case 'Delivered':
        return <CheckCircle2 className="w-6 h-6 text-green-500" />;
      case 'Cancelled':
        return <XCircle className="w-6 h-6 text-red-500" />;
      default:
        return <Clock className="w-6 h-6 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      Pending: 'Beklemede',
      Confirmed: 'Onaylandı',
      Processing: 'İşleniyor',
      Shipped: 'Gönderildi',
      Delivered: 'Teslim Edildi',
      Cancelled: 'İptal Edildi',
    };
    return statusMap[status] || status;
  };

  const getPaymentStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      Pending: 'Ödeme Bekleniyor',
      Completed: 'Ödeme Tamamlandı',
      Failed: 'Ödeme Başarısız',
      Refunded: 'İade Edildi',
    };
    return statusMap[status] || status;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-16">
          <div className="text-center">
            <Loader className="w-12 h-12 animate-spin mx-auto mb-4 text-purple-default" />
            <p className="text-gray-600">Sipariş yükleniyor...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-16">
          <div className="text-center">
            <p className="text-red-600 mb-4">Sipariş bulunamadı</p>
            <Button onClick={() => navigate('/account')} className="btn-gradient">
              Hesaba Dön
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const isIyzicoOrder = (type?: string) =>
    type === 'iyzico' || type === 'credit_card_iyzico' || type === 'Iyzico';

  const canCompletePayment =
    order.paymentStatus === 'Pending' && order.status === 'Pending';

  const canCancel = order.status === 'Pending';

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-4 xs:py-6 sm:py-8 md:py-12">
        <div className="container-custom px-2 xs:px-4 sm:px-6">
          {/* Header */}
          <div className="flex items-center gap-2 xs:gap-3 md:gap-4 mb-6 md:mb-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/account')}
              className="gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              Geri
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 xs:gap-6 md:gap-8">
            {/* Main Content */}
            <div className="md:col-span-2 space-y-4 xs:space-y-6 md:space-y-8">
              {/* Order Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    {getStatusIcon(order.status)}
                    <span>{getStatusText(order.status)}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Sipariş No:</span> {order.orderNumber || order.id}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Tarih:</span>{' '}
                      {(() => {
                        const raw = (order as any).createdAt || (order as any).created;
                        if (!raw) return '-';
                        const d = new Date(raw);
                        return isNaN(d.getTime()) ? '-' : d.toLocaleDateString('tr-TR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        });
                      })()}
                    </p>
                    {order.trackingNumber && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Takip No:</span> {order.trackingNumber}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Payment Information (İyzico) */}
              {order.paymentStatus && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <CreditCard className="w-5 h-5 text-purple-600" />
                      Ödeme Bilgileri
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Durum</span>
                      <span className={`font-medium ${
                        order.paymentStatus === 'Completed'
                          ? 'text-green-600'
                          : order.paymentStatus === 'Failed'
                          ? 'text-red-600'
                          : 'text-yellow-600'
                      }`}>
                        {getPaymentStatusText(order.paymentStatus)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Ödeme Yöntemi</span>
                      <span className="font-medium">
                        {isIyzicoOrder(order.paymentMethod?.type)
                          ? 'iyzico (Kredi/Banka Kartı)'
                          : order.paymentMethod?.type === 'bank_transfer' ||
                              order.paymentMethod?.type === 'BankTransfer'
                            ? 'Havale / EFT'
                            : order.paymentMethod?.type || '-'}
                      </span>
                    </div>
                    {order.paymentMethod?.cardLast4 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Kart</span>
                        <span className="font-medium">**** {order.paymentMethod.cardLast4}</span>
                      </div>
                    )}
                    {order.paymentMethod?.cardBrand && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Bank</span>
                        <span className="font-medium">{order.paymentMethod.cardBrand}</span>
                      </div>
                    )}
                    {order.transactionId && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">İşlem ID</span>
                        <span className="font-mono text-gray-700">{order.transactionId}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Ürünler</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(order.items ?? []).map((item) => (
                      <div key={item.id} className="flex gap-4 pb-4 border-b last:border-b-0">
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="w-20 h-20 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{item.productName}</p>
                          <p className="text-sm text-gray-600">Miktar: {item.quantity}</p>
                          {item.variant && (
                            <div className="text-xs text-gray-500 mt-1">
                              {item.variant.color && <span>Renk: {item.variant.color}</span>}
                              {item.variant.size && <span>, Beden: {item.variant.size}</span>}
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-medium">₺{(item.subtotal ?? 0).toFixed(2)}</p>
                          <p className="text-xs text-gray-600">
                            ₺{(item.price ?? 0).toFixed(2)} x {item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Address */}
              {order.shippingAddress && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Gönderim Adresi</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1 text-sm">
                      <p className="font-medium">{order.shippingAddress.fullName}</p>
                      <p className="text-gray-600">{order.shippingAddress.address}</p>
                      <p className="text-gray-600">
                        {order.shippingAddress.city} {order.shippingAddress.district} {order.shippingAddress.postalCode}
                      </p>
                      <p className="text-gray-600">{order.shippingAddress.country}</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-4 xs:space-y-6">
              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Sipariş Özeti</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Ara Toplam</span>
                    <span>₺{(order.subtotal ?? 0).toFixed(2)}</span>
                  </div>
                  {(order.discountAmount ?? 0) > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">İndirim</span>
                      <span className="text-green-600">-₺{(order.discountAmount ?? 0).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Kargo</span>
                    <span>₺{(order.shippingCost ?? 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Vergi</span>
                    <span>₺{(order.tax ?? 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold border-t pt-3">
                    <span>Toplam</span>
                    <span>₺{(order.total ?? 0).toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Method */}
              {order.shippingMethod && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Kargo Yöntemi</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <p className="font-medium">{order.shippingMethod.name}</p>
                    {order.shippingMethod.description && (
                      <p className="text-gray-600">{order.shippingMethod.description}</p>
                    )}
                    <p className="text-gray-600">
                      Tahmini: {order.shippingMethod.estimatedDays} gün
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Actions */}
              {canCompletePayment && (
                <Button
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  onClick={handleCompletePayment}
                  disabled={isProcessing}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  {isProcessing ? 'Yönlendiriliyor...' : 'Ödemeyi Tamamla'}
                </Button>
              )}
              {canCancel && (
                <Button
                  variant="outline"
                  className="w-full border-red-200 text-red-600 hover:bg-red-50"
                  onClick={() => setShowCancelDialog(true)}
                  disabled={isProcessing}
                >
                  Siparişi İptal Et
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* İptal Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Siparişi İptal Et</DialogTitle>
            <DialogDescription>
              Sipariş #{order?.orderNumber} iptal edilecek. Lütfen iptal sebebini belirtin.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="İptal sebebini yazınız..."
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            rows={3}
            className="resize-none"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
              Vazgeç
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelOrder}
              disabled={isProcessing || !cancelReason.trim()}
            >
              {isProcessing ? 'İptal Ediliyor...' : 'İptal Et'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderDetail;
