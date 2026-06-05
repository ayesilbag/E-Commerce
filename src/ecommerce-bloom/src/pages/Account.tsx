import { useState, useEffect } from "react";
import usePageTitle from "@/hooks/usePageTitle";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  CreditCard,
  Heart,
  MapPin,
  Package,
  ShieldCheck,
  ShoppingBag,
  User,
  LogOut
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Link, useNavigate } from "react-router-dom";
import { getOrders } from "@/services/orders.service";
import type { Order } from "@/types";
import { toast } from "sonner";

const Account = () => {
  usePageTitle("Hesabım");
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isAuthenticated, logout } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [isOrdersLoading, setIsOrdersLoading] = useState(true);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const loadOrders = async () => {
      try {
        setIsOrdersLoading(true);
        const ordersData = await getOrders({ page: 1, limit: 10 });
        setOrders(ordersData.items);
      } catch (error) {
        console.error("Error loading orders:", error);
        toast.error("Siparişler yüklenirken hata oluştu");
      } finally {
        setIsOrdersLoading(false);
      }
    };

    loadOrders();
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-4 xs:py-6 sm:py-8 md:py-10 lg:py-12">
        <div className="container-custom px-2 xs:px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 xs:gap-6 md:gap-8">

            {/* Account sidebar */}
            <div className="md:col-span-3">
              <div className="bg-white border rounded-lg xs:rounded-lg sm:rounded-lg md:rounded-lg p-3 xs:p-4 md:p-6 sticky top-24">
                {/* User info */}
                <div className="flex items-center gap-2 xs:gap-3 md:gap-4 pb-3 xs:pb-4 md:pb-6 border-b mb-3 xs:mb-4 md:mb-6">
                  <div className="h-12 xs:h-14 md:h-16 w-12 xs:w-14 md:w-16 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                    <img
                      src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                      alt={user.fullName || "Kullanıcı"}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h2 className="font-semibold text-sm">{user.fullName || "Kullanıcı"}</h2>
                    <p className="text-gray-500 text-sm">{user.email}</p>
                    <p className="text-gray-400 text-xs mt-1">Kayıt tarihi: {user.createdAt ? new Date(user.createdAt).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' }) : '-'}</p>
                  </div>
                </div>

                {/* Navigation menu */}
                <nav className="space-y-1">
                  <Button
                    variant="ghost"
                    className="w-full justify-start font-normal"
                    asChild
                  >
                    <Link to="/account">
                      <User className="mr-2" size={18} />
                      Hesabım
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start font-normal"
                    asChild
                  >
                    <Link to="/orders">
                      <Package className="mr-2" size={18} />
                      Siparişlerim
                      <span className="ml-auto bg-gray-100 text-gray-700 px-2 py-0.5 text-xs rounded-full">
                        {orders.length}
                      </span>
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start font-normal"
                    asChild
                  >
                    <Link to="/wishlist">
                      <Heart className="mr-2" size={18} />
                      Favorilerim
                      {wishlistCount > 0 && (
                        <span className="ml-auto bg-gray-100 text-gray-700 px-2 py-0.5 text-xs rounded-full">
                          {wishlistCount}
                        </span>
                      )}
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start font-normal"
                    asChild
                  >
                    <Link to="/addresses">
                      <MapPin className="mr-2" size={18} />
                      Adreslerim
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start font-normal"
                    asChild
                  >
                    <Link to="/payment-methods">
                      <CreditCard className="mr-2" size={18} />
                      Ödeme Yöntemleri
                    </Link>
                  </Button>
                </nav>

                <div className="mt-8 pt-6 border-t">
                  <Button variant="outline" className="w-full" onClick={handleLogout}>
                    <LogOut className="mr-2" size={16} />
                    Çıkış Yap
                  </Button>
                </div>
              </div>
            </div>

            {/* Main content */}
            <div className="md:col-span-9">
              <h1 className="text-base font-semibold mb-6">Hesabım</h1>

              {/* Account overview */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center">
                      <Package className="mr-2" size={18} />
                      Siparişler
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg font-semibold">{orders.length}</p>
                    <p className="text-sm text-gray-500">Son siparişler</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center">
                      <ShoppingBag className="mr-2" size={18} />
                      Sepet
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg font-semibold">{cartCount}</p>
                    <p className="text-sm text-gray-500">Sepetteki ürünler</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center">
                      <Heart className="mr-2" size={18} />
                      Favoriler
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg font-semibold">{wishlistCount}</p>
                    <p className="text-sm text-gray-500">Favori ürünler</p>
                  </CardContent>
                </Card>
              </div>

              <Tabs defaultValue="orders" className="space-y-6">
                <TabsList className="grid w-full sm:w-auto sm:inline-grid grid-cols-1 sm:grid-cols-1">
                  <TabsTrigger value="orders">Siparişlerim</TabsTrigger>
                </TabsList>

                {/* Orders tab */}
                <TabsContent value="orders">
                  <Card>
                    <CardHeader>
                      <CardTitle>Son Siparişler</CardTitle>
                      <CardDescription>
                        Son siparişlerinizi görüntüleyin ve yönetin
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {orders.length === 0 ? (
                        <div className="text-center py-10">
                          <Package className="h-12 w-12 mx-auto text-gray-300" />
                          <h3 className="mt-4 text-sm font-medium text-gray-900">Henüz siparişiniz yok</h3>
                          <p className="mt-1 text-sm text-gray-500">
                            Alışveriş yaparak siparişlerinizi burada görebilirsiniz
                          </p>
                          <div className="mt-6">
                            <Button asChild>
                              <Link to="/shop">Alışverişe Başla</Link>
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {orders.map(order => (
                            <div key={order.id} className="bg-gray-50 rounded-lg p-4 flex flex-wrap items-center justify-between gap-4">
                              <div>
                                <p className="font-medium text-purple-default">{order.orderNumber || order.id}</p>
                                <p className="text-sm text-gray-600">
                                  {new Date(order.createdAt).toLocaleDateString('tr-TR', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })}
                                </p>
                                <p className="text-sm mt-1">
                                  <span className="font-medium">{order.items.length}</span>
                                  <span className="text-gray-500"> {order.items.length === 1 ? 'ürün' : 'ürün'}</span>
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold">₺{order.total.toFixed(2)}</p>
                                <span className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${
                                  ['Delivered', 'delivered'].includes(order.status)
                                    ? 'bg-green-100 text-green-800'
                                    : ['Cancelled', 'cancelled'].includes(order.status)
                                    ? 'bg-red-100 text-red-800'
                                    : ['Shipped', 'shipped'].includes(order.status)
                                    ? 'bg-indigo-100 text-indigo-800'
                                    : 'bg-blue-100 text-blue-800'
                                }`}>
                                  {(() => {
                                    const s = order.status?.toLowerCase();
                                    if (s === 'delivered') return 'Teslim Edildi';
                                    if (s === 'pending') return 'Beklemede';
                                    if (s === 'confirmed') return 'Onaylandı';
                                    if (s === 'processing') return 'Hazırlanıyor';
                                    if (s === 'shipped') return 'Kargolandı';
                                    if (s === 'cancelled') return 'İptal Edildi';
                                    return order.status;
                                  })()}
                                </span>
                              </div>
                              <Button variant="outline" className="w-full sm:w-auto" size="sm" asChild>
                                <Link to={`/order/${order.id}`}>
                                  Detayları Görüntüle
                                </Link>
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Account;