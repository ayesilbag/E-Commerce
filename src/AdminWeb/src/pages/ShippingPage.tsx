import { FormEvent, useEffect, useState } from 'react';
import { api } from '../api/client';
import { IconPlus, IconShipping } from '../components/Icons';
import PageHeader from '../components/PageHeader';

type Shipping = {
  id: string;
  name: string;
  description?: string;
  cost: number;
  estimatedDays: number;
  provider?: string;
};

export default function ShippingPage() {
  const [items, setItems] = useState<Shipping[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [cost, setCost] = useState(0);
  const [estimatedDays, setEstimatedDays] = useState(3);
  const [provider, setProvider] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api<{ success: boolean; data: Shipping[] }>('/api/admin/shipping-methods');
      setItems(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await api('/api/admin/shipping-methods', {
        method: 'POST',
        body: JSON.stringify({ name, description, cost, estimatedDays, provider, isActive: true }),
      });
      setName('');
      setDescription('');
      setCost(0);
      setEstimatedDays(3);
      setProvider('');
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Hata');
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Silinsin mi?')) return;
    await api(`/api/admin/shipping-methods/${id}`, { method: 'DELETE' });
    await load();
  };

  return (
    <>
      <PageHeader title="Kargo" subtitle="Teslimat seçeneklerini ve ücretlerini yönetin" />

      <div className="form-layout" style={{ gridTemplateColumns: '360px 1fr' }}>
        <div className="card">
          <h3 className="card-title">Yeni kargo yöntemi</h3>
          <form className="form-grid" onSubmit={onSubmit}>
            <div className="field">
              <label htmlFor="ship-name">Ad *</label>
              <input id="ship-name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="field">
              <label htmlFor="ship-desc">Açıklama</label>
              <input id="ship-desc" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div className="form-grid-2">
              <div className="field">
                <label htmlFor="ship-cost">Ücret (₺)</label>
                <input id="ship-cost" type="number" step="0.01" value={cost} onChange={(e) => setCost(Number(e.target.value))} />
              </div>
              <div className="field">
                <label htmlFor="ship-days">Tahmini gün</label>
                <input id="ship-days" type="number" value={estimatedDays} onChange={(e) => setEstimatedDays(Number(e.target.value))} />
              </div>
            </div>
            <div className="field">
              <label htmlFor="ship-provider">Kargo firması</label>
              <input id="ship-provider" value={provider} onChange={(e) => setProvider(e.target.value)} placeholder="Aras, MNG, Yurtiçi..." />
            </div>
            {error && <div className="error-banner">{error}</div>}
            <button type="submit" className="btn btn-primary">
              <IconPlus size={18} />
              Ekle
            </button>
          </form>
        </div>

        <div className="card card-flush">
          {loading ? (
            <div className="loading-state">
              <span className="spinner" />
              Yükleniyor...
            </div>
          ) : items.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <IconShipping size={28} />
              </div>
              <h3>Kargo yöntemi yok</h3>
              <p>Sol taraftan kargo seçeneği ekleyin.</p>
            </div>
          ) : (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Yöntem</th>
                    <th>Firma</th>
                    <th>Ücret</th>
                    <th>Teslimat</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((m) => (
                    <tr key={m.id}>
                      <td>
                        <div className="product-name">{m.name}</div>
                        {m.description && <div className="product-meta">{m.description}</div>}
                      </td>
                      <td className="muted">{m.provider ?? '—'}</td>
                      <td className="price-cell">{m.cost.toFixed(2)} ₺</td>
                      <td>{m.estimatedDays} gün</td>
                      <td>
                        <button type="button" className="btn btn-danger btn-sm" onClick={() => remove(m.id)}>
                          Sil
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
