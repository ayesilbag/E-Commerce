import { useState, useEffect } from "react";
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
import { findStatusLabel, uiLabel, useAppPagesUi } from "@/hooks/useAppPagesUi";

const Account = () => {
  const account = useAppPagesUi()?.account;
  const orderStatusLabels = useAppPagesUi()?.checkout?.orderStatusLabels;
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isAuthenticated, logout } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [isOrdersLoading, setIsOrdersLoading] = useState(true);

  const guestNameFallback = uiLabel(account?.guestNameFallback);
  const memberSincePrefix = uiLabel(account?.memberSincePrefix);
  const productUnitLabel = uiLabel(account?.productUnitLabel);

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
        if (uiLabel(account?.ordersLoadError)) {
          toast.error(account!.ordersLoadError!);
        }
      } finally {
        setIsOrdersLoading(false);
      }
    };

    loadOrders();
  }, [isAuthenticated, navigate, account?.ordersLoadError]);

  if (!isAuthenticated || !user) {
    return null;
  }

  const displayName = user.fullName || guestNameFallback;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-4 xs:py-6 sm:py-8 md:py-10 lg:py-12">
        <div className="container-custom px-2 xs:px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 xs:gap-6 md:gap-8">

            {/* Account sidebar */}
            <div className="md:col-span-3">
              <div className="bg-card border rounded-lg xs:rounded-lg sm:rounded-lg md:rounded-lg p-3 xs:p-4 md:p-6 sticky top-24">
                {/* User info */}
                <div className="flex items-center gap-2 xs:gap-3 md:gap-4 pb-3 xs:pb-4 md:pb-6 border-b mb-3 xs:mb-4 md:mb-6">
                  <div className="h-12 xs:h-14 md:h-16 w-12 xs:w-14 md:w-16 rounded-full overflow-hidden bg-muted flex-shrink-0">
                    <img
                      src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                      alt={displayName || user.email}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    {displayName && (
                      <h2 className="font-semibold text-sm">{displayName}</h2>
                    )}
                    <p className="text-muted-foreground text-sm">{user.email}</p>
                    {memberSincePrefix && user.createdAt && (
                      <p className="text-muted-foreground text-xs mt-1">
                        {memberSincePrefix} {new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    )}
                  </div>
                </div>

                {/* Navigation menu */}
                <nav className="space-y-1">
                  {uiLabel(account?.navAccount) && (
                    <Button
                      variant="ghost"
                      className="w-full justify-start font-normal"
                      asChild
                    >
                      <Link to="/account">
                        <User className="mr-2" size={18} />
                        {account!.navAccount}
                      </Link>
                    </Button>
                  )}
                  {uiLabel(account?.navOrders) && (
                    <Button
                      variant="ghost"
                      className="w-full justify-start font-normal"
                      asChild
                    >
                      <Link to="/orders">
                        <Package className="mr-2" size={18} />
                        {account!.navOrders}
                        <span className="ml-auto bg-muted text-foreground px-2 py-0.5 text-xs rounded-full">
                          {orders.length}
                        </span>
                      </Link>
                    </Button>
                  )}
                  {uiLabel(account?.navWishlist) && (
                    <Button
                      variant="ghost"
                      className="w-full justify-start font-normal"
                      asChild
                    >
                      <Link to="/wishlist">
                        <Heart className="mr-2" size={18} />
                        {account!.navWishlist}
                        {wishlistCount > 0 && (
                          <span className="ml-auto bg-muted text-foreground px-2 py-0.5 text-xs rounded-full">
                            {wishlistCount}
                          </span>
                        )}
                      </Link>
                    </Button>
                  )}
                  {uiLabel(account?.navAddresses) && (
                    <Button
                      variant="ghost"
                      className="w-full justify-start font-normal"
                      asChild
                    >
                      <Link to="/addresses">
                        <MapPin className="mr-2" size={18} />
                        {account!.navAddresses}
                      </Link>
                    </Button>
                  )}
                  {uiLabel(account?.navPaymentMethods) && (
                    <Button
                      variant="ghost"
                      className="w-full justify-start font-normal"
                      asChild
                    >
                      <Link to="/payment-methods">
                        <CreditCard className="mr-2" size={18} />
                        {account!.navPaymentMethods}
                      </Link>
                    </Button>
                  )}
                </nav>

                {uiLabel(account?.logoutButton) && (
                  <div className="mt-8 pt-6 border-t">
                    <Button variant="outline" className="w-full" onClick={handleLogout}>
                      <LogOut className="mr-2" size={16} />
                      {account!.logoutButton}
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Main content */}
            <div className="md:col-span-9">
              {uiLabel(account?.pageTitle) && (
                <h1 className="text-base font-semibold mb-6">{account!.pageTitle}</h1>
              )}

              {/* Account overview */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {(uiLabel(account?.ordersCardTitle) || uiLabel(account?.ordersCardSubtitle)) && (
                  <Card>
                    <CardHeader className="pb-2">
                      {uiLabel(account?.ordersCardTitle) && (
                        <CardTitle className="text-sm flex items-center">
                          <Package className="mr-2" size={18} />
                          {account!.ordersCardTitle}
                        </CardTitle>
                      )}
                    </CardHeader>
                    <CardContent>
                      <p className="text-lg font-semibold">{orders.length}</p>
                      {uiLabel(account?.ordersCardSubtitle) && (
                        <p className="text-sm text-muted-foreground">{account!.ordersCardSubtitle}</p>
                      )}
                    </CardContent>
                  </Card>
                )}
                {(uiLabel(account?.cartCardTitle) || uiLabel(account?.cartCardSubtitle)) && (
                  <Card>
                    <CardHeader className="pb-2">
                      {uiLabel(account?.cartCardTitle) && (
                        <CardTitle className="text-sm flex items-center">
                          <ShoppingBag className="mr-2" size={18} />
                          {account!.cartCardTitle}
                        </CardTitle>
                      )}
                    </CardHeader>
                    <CardContent>
                      <p className="text-lg font-semibold">{cartCount}</p>
                      {uiLabel(account?.cartCardSubtitle) && (
                        <p className="text-sm text-muted-foreground">{account!.cartCardSubtitle}</p>
                      )}
                    </CardContent>
                  </Card>
                )}
                {(uiLabel(account?.wishlistCardTitle) || uiLabel(account?.wishlistCardSubtitle)) && (
                  <Card>
                    <CardHeader className="pb-2">
                      {uiLabel(account?.wishlistCardTitle) && (
                        <CardTitle className="text-sm flex items-center">
                          <Heart className="mr-2" size={18} />
                          {account!.wishlistCardTitle}
                        </CardTitle>
                      )}
                    </CardHeader>
                    <CardContent>
                      <p className="text-lg font-semibold">{wishlistCount}</p>
                      {uiLabel(account?.wishlistCardSubtitle) && (
                        <p className="text-sm text-muted-foreground">{account!.wishlistCardSubtitle}</p>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>

              {uiLabel(account?.ordersTabLabel) && (
                <Tabs defaultValue="orders" className="space-y-6">
                  <TabsList className="grid w-full sm:w-auto sm:inline-grid grid-cols-1 sm:grid-cols-1">
                    <TabsTrigger value="orders">{account!.ordersTabLabel}</TabsTrigger>
                  </TabsList>

                  {/* Orders tab */}
                  <TabsContent value="orders">
                    <Card>
                      <CardHeader>
                        {uiLabel(account?.ordersTabLabel) && (
                          <CardTitle>{account!.ordersTabLabel}</CardTitle>
                        )}
                      </CardHeader>
                      <CardContent>
                        {orders.length === 0 ? (
                          <div className="text-center py-10">
                            <Package className="h-12 w-12 mx-auto text-muted-foreground/50" />
                            {uiLabel(account?.emptyOrdersTitle) && (
                              <h3 className="mt-4 text-sm font-medium text-foreground">{account!.emptyOrdersTitle}</h3>
                            )}
                            {uiLabel(account?.emptyOrdersDescription) && (
                              <p className="mt-1 text-sm text-muted-foreground">
                                {account!.emptyOrdersDescription}
                              </p>
                            )}
                            {uiLabel(account?.emptyOrdersButton) && (
                              <div className="mt-6">
                                <Button asChild>
                                  <Link to="/shop">{account!.emptyOrdersButton}</Link>
                                </Button>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {orders.map(order => (
                              <div key={order.id} className="bg-muted/50 rounded-lg p-4 flex flex-wrap items-center justify-between gap-4">
                                <div>
                                  <p className="font-medium text-primary">{order.orderNumber || order.id}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {new Date(order.createdAt).toLocaleDateString(undefined, {
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric'
                                    })}
                                  </p>
                                  {productUnitLabel && (
                                    <p className="text-sm mt-1">
                                      <span className="font-medium">{order.items.length}</span>
                                      <span className="text-muted-foreground"> {productUnitLabel}</span>
                                    </p>
                                  )}
                                </div>
                                <div className="text-right">
                                  <p className="font-bold">₺{order.total.toFixed(2)}</p>
                                  {(() => {
                                    const statusLabel = findStatusLabel(orderStatusLabels, order.status?.toLowerCase() ?? '') ?? order.status;
                                    if (!statusLabel) return null;
                                    return (
                                      <span className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${
                                        ['Delivered', 'delivered'].includes(order.status)
                                          ? 'bg-green-100 text-green-800'
                                          : ['Cancelled', 'cancelled'].includes(order.status)
                                          ? 'bg-red-100 text-red-800'
                                          : ['Shipped', 'shipped'].includes(order.status)
                                          ? 'bg-indigo-100 text-indigo-800'
                                          : 'bg-blue-100 text-blue-800'
                                      }`}>
                                        {statusLabel}
                                      </span>
                                    );
                                  })()}
                                </div>
                                {uiLabel(account?.viewOrderButton) && (
                                  <Button variant="outline" className="w-full sm:w-auto" size="sm" asChild>
                                    <Link to={`/order/${order.id}`}>
                                      {account!.viewOrderButton}
                                    </Link>
                                  </Button>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Account;
