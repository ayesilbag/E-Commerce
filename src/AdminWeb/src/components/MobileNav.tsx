import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { clearToken } from '../api/client';
import {
  IconCategories,
  IconCoupon,
  IconDashboard,
  IconLogout,
  IconMenu,
  IconOrders,
  IconProducts,
  IconShipping,
  IconBank,
  IconCreditCard,
} from './Icons';

export default function MobileNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const logout = () => {
    clearToken();
    navigate('/login');
  };

  return (
    <>
      <nav className="bottom-nav" aria-label="Mobil menü">
        <NavLink to="/" end className={({ isActive }) => `bottom-nav-item${isActive ? ' active' : ''}`}>
          <IconDashboard size={22} />
          <span>Ana sayfa</span>
        </NavLink>
        <NavLink to="/products" className={({ isActive }) => `bottom-nav-item${isActive ? ' active' : ''}`}>
          <IconProducts size={22} />
          <span>Ürünler</span>
        </NavLink>
        <NavLink to="/orders" className={({ isActive }) => `bottom-nav-item${isActive ? ' active' : ''}`}>
          <IconOrders size={22} />
          <span>Sipariş</span>
        </NavLink>
        <NavLink to="/coupons" className={({ isActive }) => `bottom-nav-item${isActive ? ' active' : ''}`}>
          <IconCoupon size={22} />
          <span>Kupon</span>
        </NavLink>
        <button type="button" className={`bottom-nav-item${menuOpen ? ' active' : ''}`} onClick={() => setMenuOpen(true)}>
          <IconMenu size={22} />
          <span>Menü</span>
        </button>
      </nav>

      {menuOpen && (
        <div className="mobile-sheet-backdrop" onClick={() => setMenuOpen(false)} role="presentation">
          <div className="mobile-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-sheet-handle" />
            <p className="mobile-sheet-title">Diğer</p>
            <NavLink to="/categories" className="mobile-sheet-link" onClick={() => setMenuOpen(false)}>
              <IconCategories /> Kategoriler
            </NavLink>
            <NavLink to="/shipping" className="mobile-sheet-link" onClick={() => setMenuOpen(false)}>
              <IconShipping /> Kargo
            </NavLink>
            <NavLink to="/bank-accounts" className="mobile-sheet-link" onClick={() => setMenuOpen(false)}>
              <IconBank /> Havale hesapları
            </NavLink>
            <NavLink to="/payment-clients" className="mobile-sheet-link" onClick={() => setMenuOpen(false)}>
              <IconCreditCard /> iyzico ödeme
            </NavLink>
            <button type="button" className="mobile-sheet-link danger" onClick={logout}>
              <IconLogout /> Çıkış yap
            </button>
          </div>
        </div>
      )}
    </>
  );
}
