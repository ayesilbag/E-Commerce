import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import PageHeader from '../components/PageHeader';

type Stats = {
  totalProducts: number;
  activeProducts: number;
  totalOrders: number;
  pendingOrders: number;
  revenueThisMonth: number;
  revenueTotal: number;
  lowStock: number;
};

type RecentOrder = {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  created: string;
};

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recent, setRecent] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api<{ success: boolean; data: { stats: Stats; recentOrders: RecentOrder[] } }>('/api/admin/dashboard')
      .then((res) => {
        setStats(res.data.stats);
        setRecent(res.data.recentOrders);
      })
      .finally(() => setLoading(false));
  }, []);

  const formatMoney = (n: number) =>
    new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(n);

  if (loading) {
    return (
      <div className="loading-state">
        <span className="spinner" />
        Yükleniyor...
      </div>
    );
  }

  return (
    <>
      <PageHeader title="Ana sayfa" subtitle="Mağaza özetiniz" />

      <div className="stat-grid">
        <div className="stat-card">
          <span className="stat-label">Toplam ürün</span>
          <span className="stat-value">{stats?.totalProducts ?? 0}</span>
          <span className="stat-hint">{stats?.activeProducts ?? 0} aktif</span>
        </div>
        <div className="stat-card accent">
          <span className="stat-label">Bu ay ciro</span>
          <span className="stat-value">{formatMoney(stats?.revenueThisMonth ?? 0)}</span>
          <span className="stat-hint">Toplam {formatMoney(stats?.revenueTotal ?? 0)}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Siparişler</span>
          <span className="stat-value">{stats?.totalOrders ?? 0}</span>
          <span className="stat-hint">{stats?.pendingOrders ?? 0} bekleyen</span>
        </div>
        <div className="stat-card warning">
          <span className="stat-label">Düşük stok</span>
          <span className="stat-value">{stats?.lowStock ?? 0}</span>
          <span className="stat-hint">≤ 5 adet</span>
        </div>
      </div>

      <div className="card card-flush" style={{ marginTop: '1.5rem' }}>
        <div className="card-section" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 className="card-title" style={{ margin: 0 }}>
            Son siparişler
          </h3>
          <Link to="/orders" className="btn btn-ghost btn-sm">
            Tümünü gör
          </Link>
        </div>
        {recent.length === 0 ? (
          <p className="muted card-section">Henüz sipariş yok.</p>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Sipariş</th>
                  <th>Durum</th>
                  <th>Tutar</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {recent.map((o) => (
                  <tr key={o.id}>
                    <td className="product-name">{o.orderNumber}</td>
                    <td>
                      <span className="badge badge-muted">{o.status}</span>
                    </td>
                    <td className="price-cell">{formatMoney(o.total)}</td>
                    <td>
                      <Link to={`/orders/${o.id}`} className="btn btn-secondary btn-sm">
                        Detay
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
