
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useSearchParams } from "react-router-dom";
import ErrorBoundary from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Shop from "./pages/Shop";
import Contact from "./pages/Contact";
import ProductDetail from "./pages/ProductDetail";
import CategoryPage from "./pages/CategoryPage";
import Account from "./pages/Account";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import PaymentResult from "./pages/PaymentResult";
import Checkout from "./pages/Checkout";
import Order from "./pages/Order";
import OrderDetail from "./pages/OrderDetail";
import OrderPayment from "./pages/OrderPayment";
import Orders from "./pages/Orders";
import Addresses from "./pages/Addresses";
import PaymentMethods from "./pages/PaymentMethods";
import Wishlist from "./pages/Wishlist";
import { CartProvider } from "./contexts/CartContext";
import { WishlistProvider } from "./contexts/WishlistContext";
import { AuthProvider } from "./contexts/AuthContext";
import { AddressProvider } from "./contexts/AddressContext";
import { SiteSettingsProvider } from "./contexts/SiteSettingsContext";
import ProtectedRoute from "./components/ProtectedRoute";
import LegalPage from "./pages/LegalPage";
import { LEGAL_PAGE_ROUTES, LEGACY_LEGAL_REDIRECTS } from "./constants/legal-pages";

const IyzicoReturnRedirect = () => {
  const [searchParams] = useSearchParams();
  const qs = searchParams.toString();
  return <Navigate to={qs ? `/payment/result?${qs}` : "/payment/result"} replace />;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 dakika
    },
    mutations: {
      retry: 1,
    },
  },
});

const App = () => (
  <ErrorBoundary>
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SiteSettingsProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <AddressProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/contact" element={<Contact />} />
                {LEGAL_PAGE_ROUTES.map(({ slug, path }) => (
                  <Route key={slug} path={path} element={<LegalPage slug={slug} />} />
                ))}
                {LEGACY_LEGAL_REDIRECTS.map(({ from, to }) => (
                  <Route key={from} path={from} element={<Navigate to={to} replace />} />
                ))}
                <Route path="/privacy-policy" element={<Navigate to="/privacy" replace />} />
                <Route path="/returns" element={<Navigate to="/delivery-returns" replace />} />
                <Route path="/shipping" element={<Navigate to="/delivery-returns" replace />} />
                <Route path="/faq" element={<Navigate to="/contact#faq" replace />} />
                <Route path="/terms" element={<Navigate to="/distance-selling" replace />} />
                <Route
                  path="/pre-information-form"
                  element={<Navigate to="/pre-information" replace />}
                />
                <Route path="/cookies" element={<Navigate to="/privacy" replace />} />
                <Route path="/account/orders" element={<Navigate to="/orders" replace />} />
                <Route path="/account/wishlist" element={<Navigate to="/wishlist" replace />} />
                <Route
                  path="/track-order"
                  element={
                    <ProtectedRoute>
                      <Navigate to="/orders" replace />
                    </ProtectedRoute>
                  }
                />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/categories" element={<CategoryPage />} />
                <Route path="/category/:categoryName" element={<CategoryPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/payment/result" element={<ProtectedRoute><PaymentResult /></ProtectedRoute>} />
                <Route path="/iyzico/return" element={<IyzicoReturnRedirect />} />
                <Route path="/wishlist" element={<Wishlist />} />

                {/* Protected Routes */}
                <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                <Route path="/order" element={<ProtectedRoute><Order /></ProtectedRoute>} />
                <Route path="/order/payment" element={<ProtectedRoute><OrderPayment /></ProtectedRoute>} />
                <Route path="/account/*" element={<ProtectedRoute><Account /></ProtectedRoute>} />
                <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
                <Route path="/order/:id" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />
                <Route path="/addresses" element={<ProtectedRoute><Addresses /></ProtectedRoute>} />
                <Route path="/payment-methods" element={<ProtectedRoute><PaymentMethods /></ProtectedRoute>} />

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </AddressProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
      </SiteSettingsProvider>
    </TooltipProvider>
  </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
