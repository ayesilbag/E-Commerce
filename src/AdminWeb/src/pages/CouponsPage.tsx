import { FormEvent, useEffect, useState } from 'react';
import { api } from '../api/client';
import { IconCoupon, IconPlus } from '../components/Icons';
import PageHeader from '../components/PageHeader';

type Coupon = {
  id: string;
  code: string;
  description?: string;
  discountAmount?: number;
  discountPercent?: number;
  minimumOrderAmount?: number;
  maxUses?: number;
  usedCount: number;
  isActive: boolean;
};

export default function CouponsPage() {
  const [items, setItems] = useState<Coupon[]>([]);
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [discountAmount, setDiscountAmount] = useState<number | ''>('');
  const [discountPercent, setDiscountPercent] = useState<number | ''>('');
  const [minimumOrderAmount, setMinimumOrderAmount] = useState<number | ''>('');
  const [maxUses, setMaxUses] = useState<number | ''>('');
  const [error, setError] = useState('');

  const load = async () => {
    const res = await api<{ success: boolean; data: Coupon[] }>('/api/admin/coupons');
    setItems(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await api('/api/admin/coupons', {
        method: 'POST',
        body: JSON.stringify({
          code,
          description,
          discountAmount: discountAmount === '' ? null : discountAmount,
          discountPercent: discountPercent === '' ? null : discountPercent,
          minimumOrderAmount: minimumOrderAmount === '' ? null : minimumOrderAmount,
          maxUses: maxUses === '' ? null : maxUses,
          isActive: true,
        }),
      });
      setCode('');
      setDescription('');
      setDiscountAmount('');
      setDiscountPercent('');
      setMinimumOrderAmount('');
      setMaxUses('');
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Hata');
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Kupon silinsin mi?')) return;
    await api(`/api/admin/coupons/${id}`, { method: 'DELETE' });
    await load();
  };

  return (
    <>
      <PageHeader title="Kuponlar" subtitle="İndirim kodlarını yönetin" />

      <div className="form-layout" style={{ gridTemplateColumns: 'minmax(280px, 360px) 1fr' }}>
        <div className="card">
          <h3 className="card-title">Yeni kupon</h3>
          <form className="form-grid" onSubmit={onSubmit}>
            <div className="field">
              <label htmlFor="code">Kod *</label>
              <input id="code" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} required placeholder="YAZ2026" />
            </div>
            <div className="field">
              <label htmlFor="desc">Açıklama</label>
              <input id="desc" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div className="form-grid-2">
              <div className="field">
                <label htmlFor="amt">Tutar (₺)</label>
                <input id="amt" type="number" step="0.01" value={discountAmount} onChange={(e) => setDiscountAmount(e.target.value === '' ? '' : Number(e.target.value))} />
              </div>
              <div className="field">
                <label htmlFor="pct">Yüzde (%)</label>
                <input id="pct" type="number" step="0.01" value={discountPercent} onChange={(e) => setDiscountPercent(e.target.value === '' ? '' : Number(e.target.value))} />
              </div>
            </div>
            <div className="form-grid-2">
              <div className="field">
                <label htmlFor="min">Min. sipariş (₺)</label>
                <input id="min" type="number" value={minimumOrderAmount} onChange={(e) => setMinimumOrderAmount(e.target.value === '' ? '' : Number(e.target.value))} />
              </div>
              <div className="field">
                <label htmlFor="max">Max kullanım</label>
                <input id="max" type="number" value={maxUses} onChange={(e) => setMaxUses(e.target.value === '' ? '' : Number(e.target.value))} />
              </div>
            </div>
            {error && <div className="error-banner">{error}</div>}
            <button type="submit" className="btn btn-primary">
              <IconPlus size={18} />
              Ekle
            </button>
          </form>
        </div>

        <div className="card card-flush">
          {items.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <IconCoupon size={28} />
              </div>
              <h3>Kupon yok</h3>
            </div>
          ) : (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Kod</th>
                    <th>İndirim</th>
                    <th>Kullanım</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((c) => (
                    <tr key={c.id}>
                      <td className="product-name">{c.code}</td>
                      <td>
                        {c.discountAmount != null ? `${c.discountAmount} ₺` : ''}
                        {c.discountPercent != null ? `%${c.discountPercent}` : ''}
                      </td>
                      <td>
                        {c.usedCount}
                        {c.maxUses != null ? ` / ${c.maxUses}` : ''}
                      </td>
                      <td>
                        <button type="button" className="btn btn-danger btn-sm" onClick={() => remove(c.id)}>
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
