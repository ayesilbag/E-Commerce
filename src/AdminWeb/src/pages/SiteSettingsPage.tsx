import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { IconPlus, IconSettings } from '../components/Icons';
import PageHeader from '../components/PageHeader';

type SiteSettingsListItem = {
  id: string;
  code: string;
  name: string;
  siteName: string;
  domain?: string;
  isActive: boolean;
  isDefault: boolean;
  paymentComplianceCompleted?: number;
  paymentComplianceTotal?: number;
};

export default function SiteSettingsPage() {
  const [items, setItems] = useState<SiteSettingsListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api<{ success: boolean; data: SiteSettingsListItem[] }>('/api/admin/site-settings');
      setItems(res.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Liste alınamadı');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (id: string, name: string) => {
    if (!confirm(`"${name}" UI ayarları silinsin mi?`)) return;
    try {
      await api(`/api/admin/site-settings/${id}`, { method: 'DELETE' });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Silme başarısız');
    }
  };

  return (
    <>
      <PageHeader
        title="Site Ayarları"
        subtitle="Her storefront UI için ayrı marka ve iletişim bilgileri"
        action={
          <Link to="/site-settings/new" className="btn btn-primary">
            <IconPlus /> Yeni UI
          </Link>
        }
      />

      {error && <div className="error-banner">{error}</div>}

      <div className="card">
        <p className="field-hint" style={{ marginBottom: 16 }}>
          Her UI kendi <code>code</code> değeriyle <code>GET /api/site-settings/&#123;code&#125;</code> endpoint&apos;inden ayarlarını çeker.
        </p>

        {loading ? (
          <p className="loading-state">Yükleniyor…</p>
        ) : items.length === 0 ? (
          <div className="empty-state">
            <IconSettings size={32} />
            <p>Henüz UI tanımı yok.</p>
            <Link to="/site-settings/new" className="btn btn-primary">İlk UI&apos;yı oluştur</Link>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>UI kodu</th>
                  <th>Ad</th>
                  <th>Site adı</th>
                  <th>Domain</th>
                  <th>Ödeme kriterleri</th>
                  <th>Durum</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td><code>{item.code}</code></td>
                    <td>{item.name}</td>
                    <td>{item.siteName}</td>
                    <td className="muted">{item.domain ?? '—'}</td>
                    <td>
                      {item.paymentComplianceTotal != null ? (
                        <span
                          className={
                            item.paymentComplianceCompleted === item.paymentComplianceTotal
                              ? 'badge badge-success'
                              : 'badge badge-muted'
                          }
                        >
                          {item.paymentComplianceCompleted}/{item.paymentComplianceTotal}
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td>
                      {!item.isActive && <span className="badge badge-muted">Pasif</span>}
                      {item.isDefault && <span className="badge">Varsayılan</span>}
                      {item.isActive && !item.isDefault && <span className="badge badge-success">Aktif</span>}
                    </td>
                    <td className="table-actions">
                      <Link to={`/site-settings/${item.id}`} className="btn btn-ghost btn-sm">Düzenle</Link>
                      <button type="button" className="btn btn-ghost btn-sm danger" onClick={() => remove(item.id, item.name)}>
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
    </>
  );
}
