import { FormEvent, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api/client';
import PageHeader from '../components/PageHeader';

const statusOptions = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export default function OrderDetailPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState<Record<string, unknown> | null>(null);
  const [status, setStatus] = useState('');
  const [tracking, setTracking] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = () => {
    if (!orderId) return;
    api<{ success: boolean; data: Record<string, unknown> }>(`/api/admin/orders/${orderId}`).then((res) => {
      setOrder(res.data);
      setStatus(String(res.data.status ?? ''));
      setTracking(String(res.data.trackingNumber ?? ''));
    });
  };

  useEffect(() => {
    load();
  }, [orderId]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await api(`/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status, trackingNumber: tracking }),
      });
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Güncelleme başarısız');
    } finally {
      setSaving(false);
    }
  };

  const formatMoney = (n: number) =>
    new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(n);

  if (!order) {
    return (
      <div className="loading-state">
        <span className="spinner" />
      </div>
    );
  }

  const items = (order.items as Array<Record<string, unknown>>) ?? [];
  const bankTransfer = order.bankTransferInstructions as
    | {
        message?: string;
        orderNumber?: string;
        accounts?: Array<{
          bankName: string;
          accountHolder: string;
          iban: string;
          branchName?: string;
          currency: string;
        }>;
      }
    | undefined;

  return (
    <>
      <PageHeader
        title={String(order.orderNumber)}
        subtitle={`Müşteri: ${(order.customer as { email?: string })?.email ?? '—'}`}
        action={
          <Link to="/orders" className="btn btn-secondary">
            ← Siparişler
          </Link>
        }
      />

      <div className="form-layout" style={{ gridTemplateColumns: '1fr 340px' }}>
        <div className="card">
          <h3 className="card-title">Ürünler</h3>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Ürün</th>
                  <th>Adet</th>
                  <th>Fiyat</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={String(item.id)}>
                    <td>{String(item.productName)}</td>
                    <td>{String(item.quantity)}</td>
                    <td className="price-cell">{formatMoney(Number(item.subtotal))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: '1rem', textAlign: 'right' }}>
            <p>
              <strong>Toplam:</strong> {formatMoney(Number(order.total))}
            </p>
          </div>
        </div>

        {bankTransfer && (
          <div className="card form-grid" style={{ marginBottom: '1rem' }}>
            <h3 className="card-title">Havale bilgileri</h3>
            <p className="muted" style={{ margin: 0 }}>
              {bankTransfer.message}
            </p>
            <ul style={{ margin: '0.5rem 0 0', paddingLeft: '1.1rem' }}>
              {(bankTransfer.accounts ?? []).map((acc) => (
                <li key={acc.iban} style={{ marginBottom: '0.75rem' }}>
                  <strong>{acc.bankName}</strong> — {acc.accountHolder}
                  <br />
                  <span style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>{acc.iban}</span>
                  {acc.branchName && (
                    <>
                      <br />
                      <span className="muted">{acc.branchName}</span>
                    </>
                  )}
                </li>
              ))}
            </ul>
            <p className="muted" style={{ fontSize: '0.85rem' }}>
              Ödeme gelince durumu <strong>Confirmed</strong> yapın.
            </p>
          </div>
        )}

        <form className="card form-grid" onSubmit={onSubmit}>
          <h3 className="card-title">Durum güncelle</h3>
          <div className="field">
            <label htmlFor="status">Durum</label>
            <select id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
              {statusOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="tracking">Kargo takip no</label>
            <input id="tracking" value={tracking} onChange={(e) => setTracking(e.target.value)} />
          </div>
          {error && <div className="error-banner">{error}</div>}
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Kaydediliyor...' : 'Güncelle'}
          </button>
        </form>
      </div>
    </>
  );
}
