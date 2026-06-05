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
import { findStatusLabel, uiLabel, useAppPagesUi } from '@/hooks/useAppPagesUi';

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const checkout = useAppPagesUi()?.checkout;
  const global = useAppPagesUi()?.global;

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  const iyzicoData = location.state?.iyzicoReturn;

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setIsLoading(true);
        if (!id) {
          const description = uiLabel(checkout?.orderDetailLoadError);
          if (description) {
            toast.error(uiLabel(global?.errorTitle) ?? '', { description });
          }
          navigate('/account');
          return;
        }

        const orderData = await getOrder(id);
        setOrder(orderData);

        if (iyzicoData) {
          if (iyzicoData.success) {
            const title = uiLabel(checkout?.paymentResultSuccessTitle);
            const description = uiLabel(checkout?.paymentResultSuccessDescription);
            if (title || description) {
              toast.success(title ?? '', { description });
            }
          } else {
            const title = uiLabel(checkout?.paymentResultFailedTitle);
            const description = iyzicoData.message || uiLabel(checkout?.paymentResultFailedDescription);
            if (title || description) {
              toast.error(title ?? '', { description });
            }
          }
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : (uiLabel(checkout?.orderDetailLoadError) ?? '');
        const title = uiLabel(global?.errorTitle);
        if (title || errorMessage) {
          toast.error(title ?? '', { description: errorMessage });
        }
        navigate('/account');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [id, navigate, location.state, iyzicoData, checkout, global]);

  const handleCompletePayment = async () => {
    if (!order) return;
    try {
      setIsProcessing(true);
      const initData = await initializeIyzicoPayment({ orderId: order.id });
      redirectToIyzicoPayment(initData.paymentPageUrl);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : (uiLabel(checkout?.paymentErrorFallback) ?? '');
      const title = uiLabel(global?.errorTitle);
      if (title || errorMessage) {
        toast.error(title ?? '', { description: errorMessage });
      }
      setIsProcessing(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!order || !cancelReason.trim()) return;
    try {
      setIsProcessing(true);
      await cancelOrder(order.id, { reason: cancelReason.trim() });
      setShowCancelDialog(false);
      navigate('/account');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : (uiLabel(checkout?.paymentErrorFallback) ?? '');
      const title = uiLabel(global?.errorTitle);
      if (title || errorMessage) {
        toast.error(title ?? '', { description: errorMessage });
      }
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
        return <Package className="w-6 h-6 text-primary" />;
      case 'Shipped':
        return <Truck className="w-6 h-6 text-blue-600" />;
      case 'Delivered':
        return <CheckCircle2 className="w-6 h-6 text-green-500" />;
      case 'Cancelled':
        return <XCircle className="w-6 h-6 text-red-500" />;
      default:
        return <Clock className="w-6 h-6 text-muted-foreground" />;
    }
  };

  const getStatusText = (status: string) =>
    findStatusLabel(checkout?.orderStatusLabels, status) ?? status;

  const getPaymentStatusText = (status: string) =>
    findStatusLabel(checkout?.paymentStatusLabels, status) ?? status;

  const getPaymentMethodDisplay = (type?: string) => {
    if (!type) return '-';
    if (type === 'bank_transfer' || type === 'BankTransfer') {
      return uiLabel(checkout?.bankTransferTitle) ?? type;
    }
    if (type === 'iyzico' || type === 'credit_card_iyzico' || type === 'Iyzico') {
      return 'iyzico';
    }
    return type;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-16">
          <div className="text-center">
            <Loader className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
            {uiLabel(global?.loadingLabel) && (
              <p className="text-muted-foreground">{global!.loadingLabel}</p>
            )}
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
            {uiLabel(checkout?.orderNotFound) && (
              <p className="text-red-600 mb-4">{checkout!.orderNotFound}</p>
            )}
            {uiLabel(checkout?.backToAccountButton) && (
              <Button onClick={() => navigate('/account')} className="btn-gradient">
                {checkout!.backToAccountButton}
              </Button>
            )}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const canCompletePayment =
    order.paymentStatus === 'Pending' && order.status === 'Pending';

  const canCancel = order.status === 'Pending';

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-4 xs:py-6 sm:py-8 md:py-12">
        <div className="container-custom px-2 xs:px-4 sm:px-6">
          <div className="flex items-center gap-2 xs:gap-3 md:gap-4 mb-6 md:mb-8">
            {uiLabel(checkout?.backButton) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/account')}
                className="gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                {checkout!.backButton}
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 xs:gap-6 md:gap-8">
            <div className="md:col-span-2 space-y-4 xs:space-y-6 md:space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    {getStatusIcon(order.status)}
                    <span>{getStatusText(order.status)}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {uiLabel(checkout?.orderNumberPrefix) && (
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">{checkout!.orderNumberPrefix}</span>{' '}
                        {order.orderNumber || order.id}
                      </p>
                    )}
                    {uiLabel(checkout?.orderDatePrefix) && (
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">{checkout!.orderDatePrefix}</span>{' '}
                        {(() => {
                          const raw = (order as Order & { createdAt?: string; created?: string }).createdAt
                            || (order as Order & { created?: string }).created;
                          if (!raw) return '-';
                          const d = new Date(raw);
                          return isNaN(d.getTime()) ? '-' : d.toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          });
                        })()}
                      </p>
                    )}
                    {order.trackingNumber && uiLabel(checkout?.trackingNumberPrefix) && (
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">{checkout!.trackingNumberPrefix}</span>{' '}
                        {order.trackingNumber}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {order.paymentStatus && (
                <Card>
                  <CardHeader>
                    {uiLabel(checkout?.paymentInfoTitle) && (
                      <CardTitle className="flex items-center gap-2 text-sm">
                        <CreditCard className="w-5 h-5 text-primary" />
                        {checkout!.paymentInfoTitle}
                      </CardTitle>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {uiLabel(checkout?.statusLabel) && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{checkout!.statusLabel}</span>
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
                    )}
                    {uiLabel(checkout?.paymentMethodLabel) && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{checkout!.paymentMethodLabel}</span>
                        <span className="font-medium">
                          {getPaymentMethodDisplay(order.paymentMethod?.type)}
                        </span>
                      </div>
                    )}
                    {order.paymentMethod?.cardLast4 && uiLabel(checkout?.cardLabel) && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{checkout!.cardLabel}</span>
                        <span className="font-medium">**** {order.paymentMethod.cardLast4}</span>
                      </div>
                    )}
                    {order.paymentMethod?.cardBrand && (
                      <div className="flex justify-end text-sm">
                        <span className="font-medium">{order.paymentMethod.cardBrand}</span>
                      </div>
                    )}
                    {order.transactionId && uiLabel(checkout?.transactionIdLabel) && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{checkout!.transactionIdLabel}</span>
                        <span className="font-mono text-foreground">{order.transactionId}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              <Card>
                {uiLabel(checkout?.productsTitle) && (
                  <CardHeader>
                    <CardTitle className="text-sm">{checkout!.productsTitle}</CardTitle>
                  </CardHeader>
                )}
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
                          <p className="font-medium text-foreground">{item.productName}</p>
                          {uiLabel(checkout?.quantityPrefix) && (
                            <p className="text-sm text-muted-foreground">
                              {checkout!.quantityPrefix} {item.quantity}
                            </p>
                          )}
                          {item.variant && (
                            <div className="text-xs text-muted-foreground mt-1">
                              {item.variant.color && uiLabel(checkout?.colorPrefix) && (
                                <span>{checkout!.colorPrefix} {item.variant.color}</span>
                              )}
                              {item.variant.size && uiLabel(checkout?.sizePrefix) && (
                                <span>, {checkout!.sizePrefix} {item.variant.size}</span>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-medium">₺{(item.subtotal ?? 0).toFixed(2)}</p>
                          <p className="text-xs text-muted-foreground">
                            ₺{(item.price ?? 0).toFixed(2)} x {item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {order.shippingAddress && (
                <Card>
                  {uiLabel(checkout?.shippingAddressTitle) && (
                    <CardHeader>
                      <CardTitle className="text-sm">{checkout!.shippingAddressTitle}</CardTitle>
                    </CardHeader>
                  )}
                  <CardContent>
                    <div className="space-y-1 text-sm">
                      <p className="font-medium">{order.shippingAddress.fullName}</p>
                      <p className="text-muted-foreground">{order.shippingAddress.address}</p>
                      <p className="text-muted-foreground">
                        {order.shippingAddress.city} {order.shippingAddress.district}{' '}
                        {order.shippingAddress.postalCode}
                      </p>
                      <p className="text-muted-foreground">{order.shippingAddress.country}</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-4 xs:space-y-6">
              <Card>
                {uiLabel(checkout?.orderSummaryTitle) && (
                  <CardHeader>
                    <CardTitle className="text-sm">{checkout!.orderSummaryTitle}</CardTitle>
                  </CardHeader>
                )}
                <CardContent className="space-y-3">
                  {uiLabel(checkout?.subtotalLabel) && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{checkout!.subtotalLabel}</span>
                      <span>₺{(order.subtotal ?? 0).toFixed(2)}</span>
                    </div>
                  )}
                  {(order.discountAmount ?? 0) > 0 && uiLabel(checkout?.discountLabel) && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{checkout!.discountLabel}</span>
                      <span className="text-green-600">-₺{(order.discountAmount ?? 0).toFixed(2)}</span>
                    </div>
                  )}
                  {uiLabel(checkout?.shippingFeeLabel) && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{checkout!.shippingFeeLabel}</span>
                      <span>₺{(order.shippingCost ?? 0).toFixed(2)}</span>
                    </div>
                  )}
                  {uiLabel(checkout?.taxLabel) && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{checkout!.taxLabel}</span>
                      <span>₺{(order.tax ?? 0).toFixed(2)}</span>
                    </div>
                  )}
                  {uiLabel(checkout?.totalLabel) && (
                    <div className="flex justify-between text-sm font-semibold border-t pt-3">
                      <span>{checkout!.totalLabel}</span>
                      <span>₺{(order.total ?? 0).toFixed(2)}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {order.shippingMethod && (
                <Card>
                  {uiLabel(checkout?.shippingMethodTitle) && (
                    <CardHeader>
                      <CardTitle className="text-sm">{checkout!.shippingMethodTitle}</CardTitle>
                    </CardHeader>
                  )}
                  <CardContent className="space-y-2 text-sm">
                    <p className="font-medium">{order.shippingMethod.name}</p>
                    {order.shippingMethod.description && (
                      <p className="text-muted-foreground">{order.shippingMethod.description}</p>
                    )}
                    {uiLabel(checkout?.estimatedDeliveryPrefix) && (
                      <p className="text-muted-foreground">
                        {checkout!.estimatedDeliveryPrefix} {order.shippingMethod.estimatedDays}
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}

              {canCompletePayment && uiLabel(checkout?.completePaymentButton) && (
                <Button
                  className="w-full bg-primary hover:bg-primary/90 text-white"
                  onClick={handleCompletePayment}
                  disabled={isProcessing}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  {isProcessing
                    ? (uiLabel(checkout?.iyzicoRedirectingLabel) ?? checkout!.completePaymentButton)
                    : checkout!.completePaymentButton}
                </Button>
              )}
              {canCancel && uiLabel(checkout?.cancelOrderButton) && (
                <Button
                  variant="outline"
                  className="w-full border-red-200 text-red-600 hover:bg-red-50"
                  onClick={() => setShowCancelDialog(true)}
                  disabled={isProcessing}
                >
                  {checkout!.cancelOrderButton}
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />

      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            {uiLabel(checkout?.cancelDialogTitle) && (
              <DialogTitle>{checkout!.cancelDialogTitle}</DialogTitle>
            )}
            {uiLabel(checkout?.cancelDialogDescription) && (
              <DialogDescription>
                {checkout!.cancelDialogDescription.replace('{orderNumber}', order?.orderNumber ?? order?.id ?? '')}
              </DialogDescription>
            )}
          </DialogHeader>
          <Textarea
            placeholder={uiLabel(checkout?.cancelReasonPlaceholder) ?? ''}
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            rows={3}
            className="resize-none"
          />
          <DialogFooter>
            {uiLabel(checkout?.cancelDialogDismiss) && (
              <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
                {checkout!.cancelDialogDismiss}
              </Button>
            )}
            {uiLabel(checkout?.cancelDialogConfirm) && (
              <Button
                variant="destructive"
                onClick={handleCancelOrder}
                disabled={isProcessing || !cancelReason.trim()}
              >
                {isProcessing
                  ? (uiLabel(checkout?.cancelDialogSubmitting) ?? checkout!.cancelDialogConfirm)
                  : checkout!.cancelDialogConfirm}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderDetail;
