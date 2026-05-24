import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { clearToken } from '../api/client';
import {
  IconCategories,
  IconCoupon,
  IconDashboard,
  IconLogout,
  IconOrders,
  IconProducts,
  IconShipping,
  IconBank,
} from './Icons';
import MobileNav from './MobileNav';

export default function Layout() {
  const navigate = useNavigate();

  const logout = () => {
    clearToken();
    navigate('/login');
  };

  return (
    <div className="layout">
      <aside className="sidebar desktop-only">
        <div className="sidebar-brand">
          <div className="brand-mark">D</div>
          <div className="brand-text">
            <span className="brand-name">Digitalep</span>
            <span className="brand-tag">Admin Panel</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/" end className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
            <IconDashboard />
            Ana sayfa
          </NavLink>
          <NavLink to="/products" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
            <IconProducts />
            Ürünler
          </NavLink>
          <NavLink to="/orders" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
            <IconOrders />
            Siparişler
          </NavLink>
          <NavLink to="/coupons" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
            <IconCoupon />
            Kuponlar
          </NavLink>
          <NavLink to="/categories" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
            <IconCategories />
            Kategoriler
          </NavLink>
          <NavLink to="/shipping" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
            <IconShipping />
            Kargo
          </NavLink>
          <NavLink to="/bank-accounts" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
            <IconBank />
            Havale
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <button type="button" className="btn btn-ghost" style={{ width: '100%', justifyContent: 'flex-start' }} onClick={logout}>
            <IconLogout />
            Çıkış yap
          </button>
        </div>
      </aside>

      <main className="main">
        <Outlet />
      </main>

      <MobileNav />
    </div>
  );
}
