import { Navigate, Route, Routes } from 'react-router-dom';
import { getToken } from './api/client';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/ProductsPage';
import ProductFormPage from './pages/ProductFormPage';
import CategoriesPage from './pages/CategoriesPage';
import ShippingPage from './pages/ShippingPage';
import BankAccountsPage from './pages/BankAccountsPage';
import PaymentClientsPage from './pages/PaymentClientsPage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import CouponsPage from './pages/CouponsPage';
import SiteSettingsPage from './pages/SiteSettingsPage';
import SiteSettingsFormPage from './pages/SiteSettingsFormPage';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  if (!getToken()) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/new" element={<ProductFormPage />} />
        <Route path="products/:id" element={<ProductFormPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="orders/:orderId" element={<OrderDetailPage />} />
        <Route path="coupons" element={<CouponsPage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="shipping" element={<ShippingPage />} />
        <Route path="bank-accounts" element={<BankAccountsPage />} />
        <Route path="payment-clients" element={<PaymentClientsPage />} />
        <Route path="site-settings" element={<SiteSettingsPage />} />
        <Route path="site-settings/new" element={<SiteSettingsFormPage />} />
        <Route path="site-settings/:id" element={<SiteSettingsFormPage />} />
      </Route>
    </Routes>
  );
}
