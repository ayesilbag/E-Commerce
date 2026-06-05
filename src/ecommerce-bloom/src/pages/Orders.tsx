import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  Package,
  ChevronRight,
  Filter,
  Calendar,
  CheckCircle,
  Truck,
  Clock,
  XCircle,
  Loader,
} from "lucide-react";
import { getOrders, type OrderStatus } from "@/services/orders.service";
import { Link, useSearchParams } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { findStatusLabel, uiLabel, useAppPagesUi } from "@/hooks/useAppPagesUi";

const statusIconConfig: Record<OrderStatus, { color: string; icon: typeof Clock }> = {
  Pending: { color: 'bg-yellow-100 text-yellow-800 border-yellow-300', icon: Clock },
  Confirmed: { color: 'bg-blue-100 text-blue-800 border-blue-300', icon: CheckCircle },
  Processing: { color: 'bg-primary/15 text-primary border-primary/40', icon: Package },
  Shipped: { color: 'bg-indigo-100 text-indigo-800 border-indigo-300', icon: Truck },
  Delivered: { color: 'bg-green-100 text-green-800 border-green-300', icon: CheckCircle },
  Cancelled: { color: 'bg-red-100 text-red-800 border-red-300', icon: XCircle },
};

const Orders = () => {
  const ordersUi = useAppPagesUi()?.orders;
  const { isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  const [orders, setOrders] = useState<any[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | 'all'>('all');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const statusFilter = selectedStatus === 'all' ? undefined : selectedStatus;
        const data = await getOrders({ page: currentPage, limit: 10, status: statusFilter });
        setOrders(data.items);
        setTotalOrders(data.total || data.items.length);
      } catch (error) {
        const msg =
          error instanceof Error
            ? error.message
            : (uiLabel(ordersUi?.loadErrorFallback) ?? null);
        setFetchError(msg);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      setFetchError(null);
      fetchOrders();
    }
  }, [isAuthenticated, currentPage, selectedStatus, ordersUi?.loadErrorFallback]);

  useEffect(() => {
    let filtered = [...orders];

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(order => order.status === selectedStatus);
    }

    if (searchQuery) {
      filtered = filtered.filter(order =>
        order.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredOrders(filtered);
  }, [orders, selectedStatus, searchQuery]);

  const getStatusBadge = (status: OrderStatus) => {
    const config = statusIconConfig[status];
    const label = findStatusLabel(ordersUi?.statusOptions, status);
    if (!label) return null;
    const Icon = config.icon;
    return (
      <Badge variant="outline" className={`${config.color} gap-1`}>
        <Icon size={12} />
        {label}
      </Badge>
    );
  };

  if (!isAuthenticated) {
    return null;
  }

  const pageLabelText = uiLabel(ordersUi?.pageLabel)?.replace('{page}', String(currentPage));

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-8 md:py-16">
        <div className="container-custom px-4">
          <div className="mb-8">
            {uiLabel(ordersUi?.pageTitle) && (
              <h1 className="text-base font-semibold mb-2">{ordersUi!.pageTitle}</h1>
            )}
            {uiLabel(ordersUi?.pageSubtitle) && (
              <p className="text-xs text-muted-foreground">{ordersUi!.pageSubtitle}</p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Input
                  type="text"
                  placeholder={uiLabel(ordersUi?.searchPlaceholder) ?? ''}
                  value={searchQuery}
                  onChange={(e) => {
                    const params = new URLSearchParams(searchParams);
                    if (e.target.value) {
                      params.set('search', e.target.value);
                    } else {
                      params.delete('search');
                    }
                    window.history.replaceState({}, '', `?${params.toString()}`);
                  }}
                  className="pl-10"
                />
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              </div>
            </div>
            <Select
              value={selectedStatus}
              onValueChange={(value) => setSelectedStatus(value as OrderStatus | 'all')}
            >
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder={uiLabel(ordersUi?.allStatusesLabel) ?? ''} />
              </SelectTrigger>
              <SelectContent>
                {uiLabel(ordersUi?.allStatusesLabel) && (
                  <SelectItem value="all">{ordersUi!.allStatusesLabel}</SelectItem>
                )}
                {(ordersUi?.statusOptions ?? []).map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : fetchError ? (
            <Card>
              <CardContent className="py-16">
                <div className="text-center">
                  <XCircle className="w-12 h-12 mx-auto text-red-400 mb-4" />
                  {uiLabel(ordersUi?.loadErrorTitle) && (
                    <h3 className="text-sm font-medium text-foreground mb-2">{ordersUi!.loadErrorTitle}</h3>
                  )}
                  <p className="text-xs text-muted-foreground mb-4">{fetchError}</p>
                  {uiLabel(ordersUi?.retryButton) && (
                    <Button variant="outline" onClick={() => { setFetchError(null); setCurrentPage(p => p); }}>
                      {ordersUi!.retryButton}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : filteredOrders.length === 0 ? (
            <Card>
              <CardContent className="py-16">
                <div className="text-center">
                  <Package className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                  {(searchQuery || selectedStatus !== 'all') ? (
                    <>
                      {uiLabel(ordersUi?.emptyFilteredTitle) && (
                        <h3 className="text-sm font-medium text-foreground mb-2">{ordersUi!.emptyFilteredTitle}</h3>
                      )}
                      {uiLabel(ordersUi?.emptyFilteredDescription) && (
                        <p className="text-muted-foreground mb-6">{ordersUi!.emptyFilteredDescription}</p>
                      )}
                    </>
                  ) : (
                    <>
                      {uiLabel(ordersUi?.emptyTitle) && (
                        <h3 className="text-sm font-medium text-foreground mb-2">{ordersUi!.emptyTitle}</h3>
                      )}
                      {uiLabel(ordersUi?.emptyDescription) && (
                        <p className="text-muted-foreground mb-6">{ordersUi!.emptyDescription}</p>
                      )}
                    </>
                  )}
                  {uiLabel(ordersUi?.startShoppingButton) && (
                    <Button asChild>
                      <Link to="/shop">{ordersUi!.startShoppingButton}</Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <Card key={order.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Link
                            to={`/order/${order.id}`}
                            className="text-primary hover:text-primary/80 font-semibold"
                          >
                            #{order.orderNumber || order.id}
                          </Link>
                        </CardTitle>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <Calendar size={12} />
                          {new Date(order.created).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        {getStatusBadge(order.status)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-3 mb-4 overflow-x-auto pb-2">
                      {order.items.slice(0, 3).map((item: { id: string; productImage: string; productName: string }) => (
                        <div
                          key={item.id}
                          className="flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border"
                        >
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="flex-shrink-0 w-16 h-16 rounded-md bg-muted flex items-center justify-center text-muted-foreground text-sm">
                          +{order.items.length - 3}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t">
                      <div className="text-sm">
                        {uiLabel(ordersUi?.productUnitLabel) && (
                          <span className="text-muted-foreground">
                            {order.items.length} {ordersUi!.productUnitLabel}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-wrap justify-end">
                        {order.paymentStatus === 'Pending' && order.status === 'Pending' && uiLabel(ordersUi?.paymentPendingBadge) && (
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-300">
                            {ordersUi!.paymentPendingBadge}
                          </Badge>
                        )}
                        <div className="text-right">
                          {uiLabel(ordersUi?.totalLabel) && (
                            <p className="text-xs text-muted-foreground">{ordersUi!.totalLabel}</p>
                          )}
                          <p className="text-sm font-semibold text-primary">
                            ₺{order.total.toFixed(2)}
                          </p>
                        </div>
                        {order.paymentStatus === 'Pending' && order.status === 'Pending' && uiLabel(ordersUi?.payButton) && (
                          <Button size="sm" className="bg-primary hover:bg-primary/90" asChild>
                            <Link to={`/payment/result?orderId=${order.id}`}>
                              {ordersUi!.payButton}
                            </Link>
                          </Button>
                        )}
                        {uiLabel(ordersUi?.detailButton) && (
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/order/${order.id}`}>
                              {ordersUi!.detailButton}
                              <ChevronRight size={14} className="ml-1" />
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {totalOrders > 10 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              {uiLabel(ordersUi?.previousPage) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  {ordersUi!.previousPage}
                </Button>
              )}
              {pageLabelText && (
                <span className="text-sm text-muted-foreground">{pageLabelText}</span>
              )}
              {uiLabel(ordersUi?.nextPage) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => p + 1)}
                  disabled={currentPage * 10 >= totalOrders}
                >
                  {ordersUi!.nextPage}
                </Button>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Orders;
