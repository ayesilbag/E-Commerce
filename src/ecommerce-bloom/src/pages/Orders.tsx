import { useState, useEffect } from "react";
import usePageTitle from "@/hooks/usePageTitle";
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

const statusConfig: Record<OrderStatus, { label: string; color: string; icon: any }> = {
  Pending: { label: 'Beklemede', color: 'bg-yellow-100 text-yellow-800 border-yellow-300', icon: Clock },
  Confirmed: { label: 'Onaylandı', color: 'bg-blue-100 text-blue-800 border-blue-300', icon: CheckCircle },
  Processing: { label: 'Hazırlanıyor', color: 'bg-purple-100 text-purple-800 border-purple-300', icon: Package },
  Shipped: { label: 'Kargolandı', color: 'bg-indigo-100 text-indigo-800 border-indigo-300', icon: Truck },
  Delivered: { label: 'Teslim Edildi', color: 'bg-green-100 text-green-800 border-green-300', icon: CheckCircle },
  Cancelled: { label: 'İptal Edildi', color: 'bg-red-100 text-red-800 border-red-300', icon: XCircle },
};

const Orders = () => {
  usePageTitle("Siparişlerim");
  const { isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();
  const statusParam = searchParams.get('status') as OrderStatus | null;
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
        const msg = error instanceof Error ? error.message : 'Siparişler yüklenemedi';
        setFetchError(msg);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      setFetchError(null);
      fetchOrders();
    }
  }, [isAuthenticated, currentPage, selectedStatus]);

  useEffect(() => {
    let filtered = [...orders];

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(order => order.status === selectedStatus);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(order =>
        order.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredOrders(filtered);
  }, [orders, selectedStatus, searchQuery]);

  const getStatusBadge = (status: OrderStatus) => {
    const config = statusConfig[status];
    const Icon = config.icon;
    return (
      <Badge variant="outline" className={`${config.color} gap-1`}>
        <Icon size={12} />
        {config.label}
      </Badge>
    );
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-8 md:py-16">
        <div className="container-custom px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-base font-semibold mb-2">Siparişlerim</h1>
            <p className="text-xs text-gray-600">Tüm siparişlerinizi buradan takip edebilirsiniz</p>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Sipariş no ara..."
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
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              </div>
            </div>
            <Select
              value={selectedStatus}
              onValueChange={(value) => setSelectedStatus(value as OrderStatus | 'all')}
            >
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Tüm Durumlar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Durumlar</SelectItem>
                <SelectItem value="Pending">Beklemede</SelectItem>
                <SelectItem value="Confirmed">Onaylandı</SelectItem>
                <SelectItem value="Processing">Hazırlanıyor</SelectItem>
                <SelectItem value="Shipped">Kargolandı</SelectItem>
                <SelectItem value="Delivered">Teslim Edildi</SelectItem>
                <SelectItem value="Cancelled">İptal Edildi</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Orders List */}
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader className="w-8 h-8 animate-spin text-purple-default" />
            </div>
          ) : fetchError ? (
            <Card>
              <CardContent className="py-16">
                <div className="text-center">
                  <XCircle className="w-12 h-12 mx-auto text-red-400 mb-4" />
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Siparişler yüklenemedi</h3>
                  <p className="text-xs text-gray-500 mb-4">{fetchError}</p>
                  <Button variant="outline" onClick={() => { setFetchError(null); setCurrentPage(p => p); }}>
                    Tekrar Dene
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : filteredOrders.length === 0 ? (
            <Card>
              <CardContent className="py-16">
                <div className="text-center">
                  <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-sm font-medium text-gray-900 mb-2">
                    {searchQuery || selectedStatus !== 'all' ? 'Sipariş bulunamadı' : 'Henüz siparişiniz yok'}
                  </h3>
                  <p className="text-gray-500 mb-6">
                    {searchQuery || selectedStatus !== 'all'
                      ? 'Filtre kriterlerinize uygun sipariş bulunamadı.'
                      : 'Alışveriş yaparak ilk siparişinizi oluşturun.'}
                  </p>
                  <Button asChild>
                    <Link to="/shop">Alışverişe Başla</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => {
                const StatusIcon = statusConfig[order.status as OrderStatus]?.icon || Clock;

                return (
                  <Card key={order.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <CardTitle className="text-sm flex items-center gap-2">
                            <Link
                              to={`/order/${order.id}`}
                              className="text-purple-600 hover:text-purple-700 font-semibold"
                            >
                              #{order.orderNumber || order.id}
                            </Link>
                          </CardTitle>
                          <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                            <Calendar size={12} />
                            {new Date(order.created).toLocaleDateString('tr-TR', {
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
                      {/* Order Items Preview */}
                      <div className="flex gap-3 mb-4 overflow-x-auto pb-2">
                        {order.items.slice(0, 3).map((item) => (
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
                          <div className="flex-shrink-0 w-16 h-16 rounded-md bg-gray-100 flex items-center justify-center text-gray-500 text-sm">
                            +{order.items.length - 3}
                          </div>
                        )}
                      </div>

                      {/* Order Details */}
                      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t">
                        <div className="text-sm">
                          <span className="text-gray-500">{order.items.length} ürün</span>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap justify-end">
                          {order.paymentStatus === 'Pending' && order.status === 'Pending' && (
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-300">
                              Ödeme Bekleniyor
                            </Badge>
                          )}
                          <div className="text-right">
                            <p className="text-xs text-gray-500">Toplam</p>
                            <p className="text-sm font-semibold text-purple-600">
                              ₺{order.total.toFixed(2)}
                            </p>
                          </div>
                          {order.paymentStatus === 'Pending' && order.status === 'Pending' && (
                            <Button size="sm" className="bg-purple-600 hover:bg-purple-700" asChild>
                              <Link to={`/payment/result?orderId=${order.id}`}>
                                Öde
                              </Link>
                            </Button>
                          )}
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/order/${order.id}`}>
                              Detay
                              <ChevronRight size={14} className="ml-1" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalOrders > 10 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Önceki
              </Button>
              <span className="text-sm text-gray-600">
                Sayfa {currentPage}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => p + 1)}
                disabled={currentPage * 10 >= totalOrders}
              >
                Sonraki
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Orders;