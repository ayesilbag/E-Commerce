import { FormEvent, useEffect, useState } from 'react';
import { api } from '../api/client';
import { IconBank, IconPlus } from '../components/Icons';
import PageHeader from '../components/PageHeader';

type BankAccount = {
  id: string;
  bankName: string;
  accountHolder: string;
  iban: string;
  branchName?: string;
  currency: string;
  instructions?: string;
  sortOrder: number;
  isActive: boolean;
};

const emptyForm = {
  bankName: '',
  accountHolder: '',
  iban: '',
  branchName: '',
  currency: 'TRY',
  instructions: 'Havale/EFT açıklama alanına sipariş numaranızı yazınız.',
  sortOrder: 0,
  isActive: true,
};

function maskIban(iban: string) {
  if (iban.length < 8) return iban;
  return `${iban.slice(0, 4)} **** **** ${iban.slice(-4)}`;
}

export default function BankAccountsPage() {
  const [items, setItems] = useState<BankAccount[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api<{ success: boolean; data: BankAccount[] }>('/api/admin/bank-accounts');
      setItems(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const body = {
        bankName: form.bankName,
        accountHolder: form.accountHolder,
        iban: form.iban.replace(/\s/g, ''),
        branchName: form.branchName || null,
        currency: form.currency,
        instructions: form.instructions || null,
        sortOrder: form.sortOrder,
        isActive: form.isActive,
      };

      if (editingId) {
        await api(`/api/admin/bank-accounts/${editingId}`, { method: 'PUT', body: JSON.stringify(body) });
      } else {
        await api('/api/admin/bank-accounts', { method: 'POST', body: JSON.stringify(body) });
      }

      resetForm();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Hata');
    }
  };

  const startEdit = (item: BankAccount) => {
    setEditingId(item.id);
    setForm({
      bankName: item.bankName,
      accountHolder: item.accountHolder,
      iban: item.iban,
      branchName: item.branchName ?? '',
      currency: item.currency,
      instructions: item.instructions ?? '',
      sortOrder: item.sortOrder,
      isActive: item.isActive,
    });
  };

  const remove = async (id: string) => {
    if (!confirm('Bu banka hesabı silinsin mi?')) return;
    await api(`/api/admin/bank-accounts/${id}`, { method: 'DELETE' });
    if (editingId === id) resetForm();
    await load();
  };

  return (
    <>
      <PageHeader title="Havale hesapları" subtitle="Müşterilerin EFT/havale yapacağı banka bilgilerini yönetin" />

      <div className="form-layout" style={{ gridTemplateColumns: '380px 1fr' }}>
        <div className="card">
          <h3 className="card-title">{editingId ? 'Hesabı düzenle' : 'Yeni banka hesabı'}</h3>
          <form className="form-grid" onSubmit={onSubmit}>
            <div className="field">
              <label htmlFor="bank-name">Banka adı *</label>
              <input
                id="bank-name"
                value={form.bankName}
                onChange={(e) => setForm({ ...form, bankName: e.target.value })}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="account-holder">Hesap sahibi *</label>
              <input
                id="account-holder"
                value={form.accountHolder}
                onChange={(e) => setForm({ ...form, accountHolder: e.target.value })}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="iban">IBAN *</label>
              <input
                id="iban"
                value={form.iban}
                onChange={(e) => setForm({ ...form, iban: e.target.value.toUpperCase() })}
                placeholder="TR..."
                required
              />
            </div>
            <div className="field">
              <label htmlFor="branch">Şube</label>
              <input id="branch" value={form.branchName} onChange={(e) => setForm({ ...form, branchName: e.target.value })} />
            </div>
            <div className="form-grid-2">
              <div className="field">
                <label htmlFor="currency">Para birimi</label>
                <input id="currency" value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} />
              </div>
              <div className="field">
                <label htmlFor="sort">Sıra</label>
                <input
                  id="sort"
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
                />
              </div>
            </div>
            <div className="field">
              <label htmlFor="instructions">Talimat metni</label>
              <textarea
                id="instructions"
                rows={3}
                value={form.instructions}
                onChange={(e) => setForm({ ...form, instructions: e.target.value })}
              />
            </div>
            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              />
              Aktif (checkout&apos;ta göster)
            </label>
            {error && <div className="error-banner">{error}</div>}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="submit" className="btn btn-primary">
                <IconPlus size={18} />
                {editingId ? 'Güncelle' : 'Ekle'}
              </button>
              {editingId && (
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  İptal
                </button>
              )}
            </div>
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
                <IconBank size={28} />
              </div>
              <h3>Banka hesabı yok</h3>
              <p>Sol taraftan havale hesabı ekleyin.</p>
            </div>
          ) : (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Banka</th>
                    <th>Hesap sahibi</th>
                    <th>IBAN</th>
                    <th>Durum</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((a) => (
                    <tr key={a.id}>
                      <td>
                        <div className="product-name">{a.bankName}</div>
                        {a.branchName && <div className="product-meta">{a.branchName}</div>}
                      </td>
                      <td>{a.accountHolder}</td>
                      <td className="muted" style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                        {maskIban(a.iban)}
                      </td>
                      <td>
                        <span className={`badge ${a.isActive ? 'badge-success' : 'badge-muted'}`}>
                          {a.isActive ? 'Aktif' : 'Pasif'}
                        </span>
                      </td>
                      <td style={{ whiteSpace: 'nowrap' }}>
                        <button type="button" className="btn btn-secondary btn-sm" onClick={() => startEdit(a)}>
                          Düzenle
                        </button>{' '}
                        <button type="button" className="btn btn-danger btn-sm" onClick={() => remove(a.id)}>
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
