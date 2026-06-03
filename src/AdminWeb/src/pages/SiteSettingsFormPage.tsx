import { FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api, uploadImage } from '../api/client';
import { IconUpload } from '../components/Icons';
import PageHeader from '../components/PageHeader';

type SocialLinks = {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  youTube?: string;
};

type PaymentCompliance = {
  aboutPageContent?: string | null;
  deliveryReturnsPageContent?: string | null;
  privacyPolicyPageContent?: string | null;
  distanceSellingAgreementPageContent?: string | null;
  preInformationFormPageContent?: string | null;
  iyzicoPayLogoUrl?: string | null;
};

const LEGAL_PAGE_FIELDS = [
  { key: 'aboutPage', label: 'Hakkımızda', slug: 'hakkimizda', field: 'aboutPageContent' as const },
  { key: 'preInformation', label: 'Ön bilgilendirme formu', slug: 'on-bilgilendirme-formu', field: 'preInformationFormPageContent' as const },
  { key: 'deliveryReturns', label: 'Teslimat ve iade şartları', slug: 'teslimat-ve-iade', field: 'deliveryReturnsPageContent' as const },
  { key: 'privacyPolicy', label: 'Gizlilik sözleşmesi', slug: 'gizlilik', field: 'privacyPolicyPageContent' as const },
  { key: 'distanceSelling', label: 'Mesafeli satış sözleşmesi', slug: 'mesafeli-satis', field: 'distanceSellingAgreementPageContent' as const },
];

type PaymentComplianceItem = {
  key: string;
  label: string;
  met: boolean;
};

type PaymentComplianceStatus = {
  completed: number;
  total: number;
  items: PaymentComplianceItem[];
};

type ApiSiteSettings = {
  id: string;
  code: string;
  name: string;
  siteName: string;
  domain?: string;
  logoUrl?: string;
  faviconUrl?: string;
  address?: string;
  emails: string[];
  phones: string[];
  workingHours: string[];
  socialLinks: SocialLinks;
  paymentCompliance?: PaymentCompliance;
  paymentComplianceStatus?: PaymentComplianceStatus;
  isActive: boolean;
  isDefault: boolean;
};

const emptyForm = {
  code: '',
  name: '',
  siteName: '',
  domain: '',
  logoUrl: '',
  faviconUrl: '',
  address: '',
  emailsText: '',
  phonesText: '',
  workingHoursText: '',
  facebook: '',
  twitter: '',
  instagram: '',
  youTube: '',
  aboutPageContent: '',
  deliveryReturnsPageContent: '',
  privacyPolicyPageContent: '',
  distanceSellingAgreementPageContent: '',
  preInformationFormPageContent: '',
  iyzicoPayLogoUrl: '',
  isActive: true,
  isDefault: false,
};

const IYZICO_LOGO_DOWNLOAD_URL = 'https://www.iyzico.com';

function buildComplianceStatus(form: typeof emptyForm): PaymentComplianceStatus {
  const pageItems = LEGAL_PAGE_FIELDS.map((p) => ({
    key: p.key,
    label: p.label,
    met: Boolean(form[p.field].trim()),
  }));
  const items: PaymentComplianceItem[] = [
    ...pageItems,
    { key: 'iyzicoLogo', label: 'iyzico ile Öde logosu', met: Boolean(form.iyzicoPayLogoUrl.trim()) },
  ];
  const completed = items.filter((i) => i.met).length;
  return { completed, total: items.length, items };
}

function linesToList(text: string) {
  return text.split('\n').map((line) => line.trim()).filter(Boolean);
}

function listToLines(items: string[]) {
  return items.join('\n');
}

function mapFromApi(data: ApiSiteSettings) {
  return {
    code: data.code ?? '',
    name: data.name ?? '',
    siteName: data.siteName ?? '',
    domain: data.domain ?? '',
    logoUrl: data.logoUrl ?? '',
    faviconUrl: data.faviconUrl ?? '',
    address: data.address ?? '',
    emailsText: listToLines(data.emails ?? []),
    phonesText: listToLines(data.phones ?? []),
    workingHoursText: listToLines(data.workingHours ?? []),
    facebook: data.socialLinks?.facebook ?? '',
    twitter: data.socialLinks?.twitter ?? '',
    instagram: data.socialLinks?.instagram ?? '',
    youTube: data.socialLinks?.youTube ?? '',
    aboutPageContent: data.paymentCompliance?.aboutPageContent ?? '',
    deliveryReturnsPageContent: data.paymentCompliance?.deliveryReturnsPageContent ?? '',
    privacyPolicyPageContent: data.paymentCompliance?.privacyPolicyPageContent ?? '',
    distanceSellingAgreementPageContent: data.paymentCompliance?.distanceSellingAgreementPageContent ?? '',
    preInformationFormPageContent: data.paymentCompliance?.preInformationFormPageContent ?? '',
    iyzicoPayLogoUrl: data.paymentCompliance?.iyzicoPayLogoUrl ?? '',
    isActive: data.isActive ?? true,
    isDefault: data.isDefault ?? false,
  };
}

export default function SiteSettingsFormPage() {
  const { id } = useParams();
  const isNew = !id || id === 'new';
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isNew || !id) return;

    setLoading(true);
    api<{ success: boolean; data: ApiSiteSettings }>(`/api/admin/site-settings/${id}`)
      .then((res) => setForm(mapFromApi(res.data)))
      .catch((err) => setError(err instanceof Error ? err.message : 'Kayıt alınamadı'))
      .finally(() => setLoading(false));
  }, [id, isNew]);

  const onUpload = async (
    file: File,
    field: 'logoUrl' | 'faviconUrl' | 'iyzicoPayLogoUrl',
  ) => {
    const result = await uploadImage(file, 'site');
    setForm((prev) => ({ ...prev, [field]: result.url }));
  };

  const complianceStatus = buildComplianceStatus(form);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    const body = {
      code: form.code || null,
      name: form.name,
      siteName: form.siteName,
      domain: form.domain || null,
      logoUrl: form.logoUrl || null,
      faviconUrl: form.faviconUrl || null,
      address: form.address || null,
      emails: linesToList(form.emailsText),
      phones: linesToList(form.phonesText),
      workingHours: linesToList(form.workingHoursText),
      socialLinks: {
        facebook: form.facebook || null,
        twitter: form.twitter || null,
        instagram: form.instagram || null,
        youTube: form.youTube || null,
      },
      paymentCompliance: {
        aboutPageContent: form.aboutPageContent || null,
        deliveryReturnsPageContent: form.deliveryReturnsPageContent || null,
        privacyPolicyPageContent: form.privacyPolicyPageContent || null,
        distanceSellingAgreementPageContent: form.distanceSellingAgreementPageContent || null,
        preInformationFormPageContent: form.preInformationFormPageContent || null,
        iyzicoPayLogoUrl: form.iyzicoPayLogoUrl || null,
      },
      isActive: form.isActive,
      isDefault: form.isDefault,
    };

    try {
      if (isNew) {
        const res = await api<{ success: boolean; data: ApiSiteSettings }>('/api/admin/site-settings', {
          method: 'POST',
          body: JSON.stringify(body),
        });
        navigate(`/site-settings/${res.data.id}`, { replace: true });
      } else {
        await api(`/api/admin/site-settings/${id}`, {
          method: 'PUT',
          body: JSON.stringify(body),
        });
        setSuccess('Site ayarları kaydedildi.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kayıt başarısız');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <PageHeader title={isNew ? 'Yeni UI' : 'UI Düzenle'} subtitle="Mağaza görünümü ve iletişim bilgileri" />
        <p className="loading-state">Yükleniyor…</p>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title={isNew ? 'Yeni UI' : 'UI Düzenle'}
        subtitle="Domain, logo, favicon ve iletişim bilgilerini yönetin"
        action={
          <Link to="/site-settings" className="btn btn-ghost">← Listeye dön</Link>
        }
      />

      {error && <div className="error-banner">{error}</div>}
      {success && (
        <div className="error-banner" style={{ background: 'rgba(34, 197, 94, 0.12)', color: '#15803d', borderColor: 'rgba(34, 197, 94, 0.3)' }}>
          {success}
        </div>
      )}

      <form className="card" onSubmit={onSubmit}>
        <h3 className="card-title">UI tanımı</h3>
        <div className="form-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
          <div className="field">
            <label htmlFor="ui-code">UI kodu *</label>
            <input
              id="ui-code"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value.toLowerCase() })}
              placeholder="bizdenalbizdensat"
              pattern="[a-z0-9]+(-[a-z0-9]+)*"
              required
              disabled={!isNew}
            />
            <small className="field-hint">Storefront <code>VITE_UI_CODE</code> ile eşleşir. Oluşturduktan sonra değiştirilemez.</small>
          </div>
          <div className="field">
            <label htmlFor="ui-name">Yönetim adı *</label>
            <input
              id="ui-name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Bizden Al Bizden Sat"
              required
            />
          </div>
        </div>

        <div className="form-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginTop: 8 }}>
          <label className="checkbox-field">
            <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
            Aktif
          </label>
          <label className="checkbox-field">
            <input type="checkbox" checked={form.isDefault} onChange={(e) => setForm({ ...form, isDefault: e.target.checked })} />
            Varsayılan UI (code belirtilmezse kullanılır)
          </label>
        </div>

        {!isNew && form.code && (
          <p className="field-hint" style={{ marginTop: 12 }}>
            API endpoint: <code>GET /api/site-settings/{form.code}</code>
          </p>
        )}

        <h3 className="card-title" style={{ marginTop: 24 }}>Marka &amp; domain</h3>
        <div className="form-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
          <div className="field">
            <label htmlFor="site-name">Site adı *</label>
            <input
              id="site-name"
              value={form.siteName}
              onChange={(e) => setForm({ ...form, siteName: e.target.value })}
              placeholder="bizdenalbizdensat.com"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="domain">Domain</label>
            <input
              id="domain"
              value={form.domain}
              onChange={(e) => setForm({ ...form, domain: e.target.value })}
              placeholder="https://bizdenalbizdensat.com"
            />
          </div>
        </div>

        <div className="form-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', marginTop: 16 }}>
          <div className="field">
            <label>Logo</label>
            {form.logoUrl && (
              <img src={form.logoUrl} alt="Logo önizleme" style={{ maxHeight: 48, marginBottom: 8, display: 'block' }} />
            )}
            <label className="btn btn-secondary" style={{ cursor: 'pointer', width: 'fit-content' }}>
              <IconUpload /> Logo yükle
              <input type="file" accept="image/*" hidden onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0], 'logoUrl')} />
            </label>
            <input value={form.logoUrl} onChange={(e) => setForm({ ...form, logoUrl: e.target.value })} placeholder="veya logo URL girin" style={{ marginTop: 8 }} />
          </div>
          <div className="field">
            <label>Favicon</label>
            {form.faviconUrl && (
              <img src={form.faviconUrl} alt="Favicon önizleme" style={{ maxHeight: 32, marginBottom: 8, display: 'block' }} />
            )}
            <label className="btn btn-secondary" style={{ cursor: 'pointer', width: 'fit-content' }}>
              <IconUpload /> Favicon yükle
              <input type="file" accept="image/*,.ico" hidden onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0], 'faviconUrl')} />
            </label>
            <input value={form.faviconUrl} onChange={(e) => setForm({ ...form, faviconUrl: e.target.value })} placeholder="veya favicon URL girin" style={{ marginTop: 8 }} />
          </div>
        </div>

        <h3 className="card-title" style={{ marginTop: 24 }}>İletişim bilgileri</h3>
        <div className="field">
          <label htmlFor="address">Adres</label>
          <textarea id="address" rows={3} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        </div>

        <div className="form-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
          <div className="field">
            <label htmlFor="emails">E-posta adresleri</label>
            <textarea id="emails" rows={4} value={form.emailsText} onChange={(e) => setForm({ ...form, emailsText: e.target.value })} placeholder={'info@example.com\ndestek@example.com'} />
            <small className="field-hint">Her satıra bir e-posta</small>
          </div>
          <div className="field">
            <label htmlFor="phones">Telefon numaraları</label>
            <textarea id="phones" rows={4} value={form.phonesText} onChange={(e) => setForm({ ...form, phonesText: e.target.value })} />
            <small className="field-hint">Her satıra bir telefon</small>
          </div>
          <div className="field">
            <label htmlFor="hours">Çalışma saatleri</label>
            <textarea id="hours" rows={4} value={form.workingHoursText} onChange={(e) => setForm({ ...form, workingHoursText: e.target.value })} />
            <small className="field-hint">Her satıra bir saat aralığı</small>
          </div>
        </div>

        <h3 className="card-title" style={{ marginTop: 24 }}>Ödeme entegrasyonu — web sitesi kriterleri</h3>
        <p className="field-hint" style={{ marginBottom: 12 }}>
          Yasal sayfalar admin&apos;den girilen içerikle API üzerinden dinamik yayınlanır (sabit adresler:{' '}
          <code>/hakkimizda</code>, <code>/on-bilgilendirme-formu</code>, <code>/teslimat-ve-iade</code>,{' '}
          <code>/gizlilik</code>, <code>/mesafeli-satis</code>).
          Storefront bu slug&apos;larla sayfa oluşturur veya doğrudan API HTML endpoint&apos;ini kullanır.
        </p>

        <div
          className="card"
          style={{
            marginBottom: 20,
            padding: 16,
            background: complianceStatus.completed === complianceStatus.total
              ? 'rgba(34, 197, 94, 0.08)'
              : 'rgba(234, 179, 8, 0.08)',
            border: `1px solid ${complianceStatus.completed === complianceStatus.total ? 'rgba(34, 197, 94, 0.35)' : 'rgba(234, 179, 8, 0.35)'}`,
          }}
        >
          <strong>
            Gereken kriterler: {complianceStatus.completed}/{complianceStatus.total}
          </strong>
          <ul style={{ margin: '12px 0 0', paddingLeft: 20 }}>
            {complianceStatus.items.map((item) => (
              <li key={item.key} style={{ color: item.met ? '#15803d' : 'inherit' }}>
                {item.met ? '✓' : '○'} {item.label}
              </li>
            ))}
          </ul>
        </div>

        {LEGAL_PAGE_FIELDS.map((page) => (
          <div key={page.slug} className="field" style={{ marginBottom: 16 }}>
            <label htmlFor={page.slug}>
              {page.label}{' '}
              <code style={{ fontWeight: 400 }}>/{page.slug}</code>
            </label>
            <textarea
              id={page.slug}
              rows={8}
              value={form[page.field]}
              onChange={(e) => setForm({ ...form, [page.field]: e.target.value })}
              placeholder={`${page.label} metnini girin. HTML veya düz metin.`}
            />
            {form.code && (
              <small className="field-hint">
                Önizleme:{' '}
                <code>/api/site-settings/{form.code}/legal-pages/{page.slug}/html</code>
              </small>
            )}
          </div>
        ))}

        <div className="field" style={{ marginTop: 16, maxWidth: 360 }}>
            <label>iyzico ile Öde logosu</label>
            {form.iyzicoPayLogoUrl && (
              <img src={form.iyzicoPayLogoUrl} alt="iyzico ile Öde" style={{ maxHeight: 32, marginBottom: 8, display: 'block' }} />
            )}
            <label className="btn btn-secondary" style={{ cursor: 'pointer', width: 'fit-content' }}>
              <IconUpload /> Yükle
              <input type="file" accept="image/*" hidden onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0], 'iyzicoPayLogoUrl')} />
            </label>
            <input value={form.iyzicoPayLogoUrl} onChange={(e) => setForm({ ...form, iyzicoPayLogoUrl: e.target.value })} placeholder="iyzico logo URL" style={{ marginTop: 8 }} />
            <small className="field-hint">
              Resmi logoyu{' '}
              <a href={IYZICO_LOGO_DOWNLOAD_URL} target="_blank" rel="noopener noreferrer">
                iyzico sitesinden
              </a>{' '}
              indirebilirsiniz.
            </small>
        </div>

        <h3 className="card-title" style={{ marginTop: 24 }}>Sosyal medya</h3>
        <div className="form-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
          <div className="field">
            <label htmlFor="facebook">Facebook</label>
            <input id="facebook" value={form.facebook} onChange={(e) => setForm({ ...form, facebook: e.target.value })} />
          </div>
          <div className="field">
            <label htmlFor="twitter">X (Twitter)</label>
            <input id="twitter" value={form.twitter} onChange={(e) => setForm({ ...form, twitter: e.target.value })} />
          </div>
          <div className="field">
            <label htmlFor="instagram">Instagram</label>
            <input id="instagram" value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} />
          </div>
          <div className="field">
            <label htmlFor="youtube">YouTube</label>
            <input id="youtube" value={form.youTube} onChange={(e) => setForm({ ...form, youTube: e.target.value })} />
          </div>
        </div>

        <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Kaydediliyor…' : isNew ? 'Oluştur' : 'Kaydet'}
          </button>
          <Link to="/site-settings" className="btn btn-ghost">İptal</Link>
        </div>
      </form>
    </>
  );
}
