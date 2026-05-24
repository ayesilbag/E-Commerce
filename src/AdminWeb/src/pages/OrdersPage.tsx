import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import PageHeader from '../components/PageHeader';

type Order = {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  total: number;
  itemCount: number;
  customerName: string;
  customerEmail: string;
};

const statuses = ['', 'Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const q = status ? `&status=${status}` : '';
      const res = await api<{ success: boolean; data: { orders: Order[] } }>(`/api/admin/orders?limit=50${q}`);
      setOrders(res.data.orders);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [status]);

  const formatMoney = (n: number) =>
    new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(n);

  return (
    <>
      <PageHeader title="Siparişler" subtitle="Tüm siparişleri görüntüleyin ve yönetin" />

      <div className="filter-bar card" style={{ marginBottom: '1rem', padding: '1rem' }}>
        <div className="field" style={{ margin: 0, maxWidth: 220 }}>
          <label htmlFor="status-filter">Durum</label>
          <select id="status-filter" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">Tümü</option>
            {statuses.filter(Boolean).map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="card card-flush">
        {loading ? (
          <div className="loading-state">
            <span className="spinner" />
            Yükleniyor...
          </div>
        ) : orders.length === 0 ? (
          <p className="muted empty-state">Sipariş bulunamadı.</p>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Sipariş</th>
                  <th>Müşteri</th>
                  <th>Durum</th>
                  <th>Tutar</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td>
                      <div className="product-name">{o.orderNumber}</div>
                      <div className="product-meta">{o.itemCount} ürün</div>
                    </td>
                    <td>
                      <div className="product-name">{o.customerName}</div>
                      <div className="product-meta">{o.customerEmail}</div>
                    </td>
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
