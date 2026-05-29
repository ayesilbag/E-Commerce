import { FormEvent, useEffect, useState } from 'react';
import { api } from '../api/client';
import { IconCreditCard, IconPlus } from '../components/Icons';
import PageHeader from '../components/PageHeader';

const CURRENCIES = ['TRY', 'USD', 'EUR', 'GBP', 'NOK', 'CHF'] as const;

type PaymentClient = {
  id: string;
  code: string;
  name: string;
  tenantCode?: string;
  apiKey: string;
  hasSecretKey: boolean;
  isSandbox: boolean;
  isActive: boolean;
  isDefault: boolean;
  locale: string;
  currency: string;
  callbackBaseUrl?: string;
  enabledInstallments?: string;
  successRedirectUrl?: string;
  failureRedirectUrl?: string;
};

type PaymentSettings = {
  callbackBaseUrl?: string;
  defaultCurrency: string;
};

const emptyForm = {
  code: '',
  name: '',
  tenantCode: '',
  apiKey: '',
  secretKey: '',
  isSandbox: true,
  isActive: true,
  isDefault: false,
  locale: 'tr',
  currency: 'TRY',
  callbackBaseUrl: '',
  enabledInstallments: '2,3,6,9',
  successRedirectUrl: '',
  failureRedirectUrl: '',
};

export default function PaymentClientsPage() {
  const [items, setItems] = useState<PaymentClient[]>([]);
  const [globalSettings, setGlobalSettings] = useState<PaymentSettings>({ defaultCurrency: 'TRY' });
  const [globalForm, setGlobalForm] = useState({ callbackBaseUrl: '', defaultCurrency: 'TRY' });
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [globalError, setGlobalError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [clientsRes, settingsRes] = await Promise.all([
        api<{ success: boolean; data: PaymentClient[] }>('/api/admin/payment-clients'),
        api<{ success: boolean; data: PaymentSettings }>('/api/admin/payment-settings'),
      ]);
      setItems(clientsRes.data);
      setGlobalSettings(settingsRes.data);
      setGlobalForm({
        callbackBaseUrl: settingsRes.data.callbackBaseUrl ?? '',
        defaultCurrency: settingsRes.data.defaultCurrency ?? 'TRY',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setForm({
      ...emptyForm,
      currency: globalForm.defaultCurrency,
    });
    setEditingId(null);
  };

  const onSaveGlobal = async (e: FormEvent) => {
    e.preventDefault();
    setGlobalError('');
    try {
      const res = await api<{ success: boolean; data: PaymentSettings }>('/api/admin/payment-settings', {
        method: 'PUT',
        body: JSON.stringify({
          callbackBaseUrl: globalForm.callbackBaseUrl || null,
          defaultCurrency: globalForm.defaultCurrency,
        }),
      });
      setGlobalSettings(res.data);
      setGlobalForm({
        callbackBaseUrl: res.data.callbackBaseUrl ?? '',
        defaultCurrency: res.data.defaultCurrency,
      });
    } catch (err) {
      setGlobalError(err instanceof Error ? err.message : 'Hata');
    }
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const body = {
        code: form.code,
        name: form.name,
        tenantCode: form.tenantCode || null,
        apiKey: form.apiKey,
        secretKey: form.secretKey || null,
        isSandbox: form.isSandbox,
        isActive: form.isActive,
        isDefault: form.isDefault,
        locale: form.locale,
        currency: form.currency,
        callbackBaseUrl: form.callbackBaseUrl || null,
        enabledInstallments: form.enabledInstallments || null,
        successRedirectUrl: form.successRedirectUrl || null,
        failureRedirectUrl: form.failureRedirectUrl || null,
      };

      if (editingId) {
        await api(`/api/admin/payment-clients/${editingId}`, { method: 'PUT', body: JSON.stringify(body) });
      } else {
        await api('/api/admin/payment-clients', { method: 'POST', body: JSON.stringify(body) });
      }

      resetForm();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Hata');
    }
  };

  const startEdit = (item: PaymentClient) => {
    setEditingId(item.id);
    setForm({
      code: item.code,
      name: item.name,
      tenantCode: item.tenantCode ?? '',
      apiKey: item.apiKey,
      secretKey: '',
      isSandbox: item.isSandbox,
      isActive: item.isActive,
      isDefault: item.isDefault,
      locale: item.locale,
      currency: item.currency,
      callbackBaseUrl: item.callbackBaseUrl ?? '',
      enabledInstallments: item.enabledInstallments ?? '',
      successRedirectUrl: item.successRedirectUrl ?? '',
      failureRedirectUrl: item.failureRedirectUrl ?? '',
    });
  };

  const remove = async (id: string) => {
    if (!confirm('Bu ödeme istemcisi silinsin mi?')) return;
    try {
      await api(`/api/admin/payment-clients/${id}`, { method: 'DELETE' });
      if (editingId === id) resetForm();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Silinemedi');
    }
  };

  const effectiveCallbackBase =
    form.callbackBaseUrl || globalSettings.callbackBaseUrl || 'https://your-domain.com';

  return (
    <>
      <PageHeader
        title="iyzico ödeme istemcileri"
        subtitle="Global callback ve para birimi; her mağaza için ayrı iyzico hesabı"
      />

      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <h3 className="card-title">Genel ödeme ayarları</h3>
        <p className="product-meta" style={{ marginBottom: '1rem' }}>
          Tüm istemciler için varsayılan callback kökü ve para birimi. İstemci özel alan doluysa o önceliklidir.
        </p>
        <form className="form-grid" onSubmit={onSaveGlobal} style={{ maxWidth: 640 }}>
          <div className="field">
            <label htmlFor="global-callback">Callback Base URL (global)</label>
            <input
              id="global-callback"
              value={globalForm.callbackBaseUrl}
              onChange={(e) => setGlobalForm({ ...globalForm, callbackBaseUrl: e.target.value })}
              placeholder="https://api.magaza.com"
            />
            <div className="product-meta">Örn: https://shop.example.com — sonuna /callback/... eklenir</div>
          </div>
          <div className="field">
            <label htmlFor="global-currency">Varsayılan para birimi</label>
            <select
              id="global-currency"
              value={globalForm.defaultCurrency}
              onChange={(e) => setGlobalForm({ ...globalForm, defaultCurrency: e.target.value })}
            >
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          {globalError && <div className="error-banner">{globalError}</div>}
          <button type="submit" className="btn btn-primary" style={{ width: 'fit-content' }}>
            Genel ayarları kaydet
          </button>
        </form>
      </div>

      <div className="form-layout" style={{ gridTemplateColumns: '400px 1fr' }}>
        <div className="card">
          <h3 className="card-title">{editingId ? 'İstemciyi düzenle' : 'Yeni ödeme istemcisi'}</h3>
          <form className="form-grid" onSubmit={onSubmit}>
            <div className="field">
              <label htmlFor="pc-code">Kod *</label>
              <input
                id="pc-code"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toLowerCase().replace(/\s/g, '-') })}
                placeholder="main-store"
                required
                disabled={!!editingId}
              />
              <div className="product-meta">
                Callback: {effectiveCallbackBase}/api/payments/iyzico/callback/{form.code || '{kod}'}
              </div>
            </div>
            <div className="field">
              <label htmlFor="pc-name">Görünen ad *</label>
              <input id="pc-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="field">
              <label htmlFor="pc-tenant">Tenant kodu</label>
              <input
                id="pc-tenant"
                value={form.tenantCode}
                onChange={(e) => setForm({ ...form, tenantCode: e.target.value })}
                placeholder="SHOP (subdomain ile eşleşir)"
              />
            </div>
            <div className="form-grid-2">
              <div className="field">
                <label htmlFor="pc-currency">Para birimi *</label>
                <select id="pc-currency" value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })}>
                  {CURRENCIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="pc-locale">Dil</label>
                <select id="pc-locale" value={form.locale} onChange={(e) => setForm({ ...form, locale: e.target.value })}>
                  <option value="tr">Türkçe</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>
            <div className="field">
              <label htmlFor="pc-callback">Callback Base URL (istemci)</label>
              <input
                id="pc-callback"
                value={form.callbackBaseUrl}
                onChange={(e) => setForm({ ...form, callbackBaseUrl: e.target.value })}
                placeholder="Boş = genel ayar kullanılır"
              />
            </div>
            <div className="field">
              <label htmlFor="pc-apikey">API Key *</label>
              <input id="pc-apikey" value={form.apiKey} onChange={(e) => setForm({ ...form, apiKey: e.target.value })} required />
            </div>
            <div className="field">
              <label htmlFor="pc-secret">
                Secret Key {editingId ? '(boş bırakırsanız değişmez)' : '*'}
              </label>
              <input
                id="pc-secret"
                type="password"
                value={form.secretKey}
                onChange={(e) => setForm({ ...form, secretKey: e.target.value })}
                required={!editingId}
                autoComplete="new-password"
              />
            </div>
            <div className="field">
              <label htmlFor="pc-installments">Taksitler</label>
              <input
                id="pc-installments"
                value={form.enabledInstallments}
                onChange={(e) => setForm({ ...form, enabledInstallments: e.target.value })}
                placeholder="2,3,6,9"
              />
            </div>
            <div className="field">
              <label htmlFor="pc-success">Başarı yönlendirme</label>
              <input
                id="pc-success"
                value={form.successRedirectUrl}
                onChange={(e) => setForm({ ...form, successRedirectUrl: e.target.value })}
                placeholder="/orders/{orderId}?paid=1"
              />
            </div>
            <div className="field">
              <label htmlFor="pc-failure">Hata yönlendirme</label>
              <input
                id="pc-failure"
                value={form.failureRedirectUrl}
                onChange={(e) => setForm({ ...form, failureRedirectUrl: e.target.value })}
                placeholder="/checkout?failed=1"
              />
            </div>
            <label className="checkbox-row">
              <input type="checkbox" checked={form.isSandbox} onChange={(e) => setForm({ ...form, isSandbox: e.target.checked })} />
              Sandbox (test) ortamı
            </label>
            <label className="checkbox-row">
              <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
              Aktif
            </label>
            <label className="checkbox-row">
              <input type="checkbox" checked={form.isDefault} onChange={(e) => setForm({ ...form, isDefault: e.target.checked })} />
              Varsayılan istemci
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
                <IconCreditCard size={28} />
              </div>
              <h3>Ödeme istemcisi yok</h3>
              <p>Önce genel ayarları kaydedin, ardından istemci ekleyin.</p>
            </div>
          ) : (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Kod / Ad</th>
                    <th>Para birimi</th>
                    <th>Tenant</th>
                    <th>Ortam</th>
                    <th>Durum</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((c) => (
                    <tr key={c.id}>
                      <td>
                        <div className="product-name">{c.name}</div>
                        <div className="product-meta">{c.code}</div>
                      </td>
                      <td>{c.currency}</td>
                      <td className="muted">{c.tenantCode ?? '—'}</td>
                      <td>
                        <span className={`badge ${c.isSandbox ? 'badge-warning' : 'badge-success'}`}>
                          {c.isSandbox ? 'Sandbox' : 'Canlı'}
                        </span>
                        {c.isDefault && (
                          <span className="badge badge-muted" style={{ marginLeft: 4 }}>
                            Varsayılan
                          </span>
                        )}
                      </td>
                      <td>
                        <span className={`badge ${c.isActive ? 'badge-success' : 'badge-muted'}`}>
                          {c.isActive ? 'Aktif' : 'Pasif'}
                        </span>
                      </td>
                      <td style={{ whiteSpace: 'nowrap' }}>
                        <button type="button" className="btn btn-secondary btn-sm" onClick={() => startEdit(c)}>
                          Düzenle
                        </button>{' '}
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
