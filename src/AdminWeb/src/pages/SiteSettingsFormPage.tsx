import { FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api, uploadImage } from '../api/client';
import { IconUpload } from '../components/Icons';
import PageHeader from '../components/PageHeader';
import { emptyPageSeoRows, mergePageSeoFromApi, type PageSeoFormRow } from '../constants/storefront-pages';
import {
  emptyStorefrontContentForm,
  mergeStorefrontContentFromApi,
  storefrontContentToApi,
  type StorefrontContentApi,
} from '../constants/storefront-content';
import StorefrontContentSection from '../components/StorefrontContentSection';
import SiteSettingsSection from '../components/SiteSettingsSection';
import SiteSettingsSectionNav from '../components/SiteSettingsSectionNav';
import SiteUiCopySection from '../components/SiteUiCopySection';
import AppPagesUiSection from '../components/AppPagesUiSection';
import PageSeoFields from '../components/PageSeoFields';

type SocialLinks = {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  youTube?: string;
};

type PaymentCompliance = {
  aboutPageTitle?: string | null;
  aboutPageContent?: string | null;
  deliveryReturnsPageTitle?: string | null;
  deliveryReturnsPageContent?: string | null;
  privacyPolicyPageTitle?: string | null;
  privacyPolicyPageContent?: string | null;
  distanceSellingAgreementPageTitle?: string | null;
  distanceSellingAgreementPageContent?: string | null;
  preInformationFormPageTitle?: string | null;
  preInformationFormPageContent?: string | null;
  iyzicoPayLogoUrl?: string | null;
};

const LEGAL_PAGE_FIELDS = [
  { key: 'aboutPage', label: 'Hakkımızda', slug: 'hakkimizda', storePath: '/about', seoPageKey: 'about', field: 'aboutPageContent' as const, titleField: 'aboutPageTitle' as const },
  { key: 'preInformation', label: 'Ön bilgilendirme formu', slug: 'on-bilgilendirme-formu', storePath: '/pre-information', seoPageKey: 'pre-information', field: 'preInformationFormPageContent' as const, titleField: 'preInformationFormPageTitle' as const },
  { key: 'deliveryReturns', label: 'Teslimat ve iade şartları', slug: 'teslimat-ve-iade', storePath: '/delivery-returns', seoPageKey: 'delivery-returns', field: 'deliveryReturnsPageContent' as const, titleField: 'deliveryReturnsPageTitle' as const },
  { key: 'privacyPolicy', label: 'Gizlilik sözleşmesi', slug: 'gizlilik', storePath: '/privacy', seoPageKey: 'privacy', field: 'privacyPolicyPageContent' as const, titleField: 'privacyPolicyPageTitle' as const },
  { key: 'distanceSelling', label: 'Mesafeli satış sözleşmesi', slug: 'mesafeli-satis', storePath: '/distance-selling', seoPageKey: 'distance-selling', field: 'distanceSellingAgreementPageContent' as const, titleField: 'distanceSellingAgreementPageTitle' as const },
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

type SiteTheme = {
  primaryLight?: string | null;
  primaryDark?: string | null;
  fontFamily?: string | null;
};

type SiteSeo = {
  defaultTitle?: string | null;
  defaultDescription?: string | null;
  defaultKeywords?: string | null;
  ogImageUrl?: string | null;
  twitterHandle?: string | null;
  pages?: Array<{
    pageKey: string;
    label: string;
    path: string;
    title?: string | null;
    description?: string | null;
    keywords?: string | null;
    ogImageUrl?: string | null;
  }>;
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
  theme?: SiteTheme | null;
  seo?: SiteSeo | null;
  storefrontContent?: StorefrontContentApi | null;
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
  aboutPageTitle: '',
  aboutPageContent: '',
  deliveryReturnsPageTitle: '',
  deliveryReturnsPageContent: '',
  privacyPolicyPageTitle: '',
  privacyPolicyPageContent: '',
  distanceSellingAgreementPageTitle: '',
  distanceSellingAgreementPageContent: '',
  preInformationFormPageTitle: '',
  preInformationFormPageContent: '',
  iyzicoPayLogoUrl: '',
  themePrimaryLight: '#8B5CF6',
  themePrimaryDark: '#A78BFA',
  themeFontFamily: '',
  seoDefaultTitle: '',
  seoDefaultDescription: '',
  seoDefaultKeywords: '',
  seoOgImageUrl: '',
  seoTwitterHandle: '',
  pageSeo: emptyPageSeoRows(),
  storefrontContent: emptyStorefrontContentForm(),
  isActive: true,
  isDefault: false,
};

const IYZICO_LOGO_DOWNLOAD_URL = 'https://www.iyzico.com';

function buildComplianceStatus(form: typeof emptyForm): PaymentComplianceStatus {
  const pageItems = LEGAL_PAGE_FIELDS.map((p) => ({
    key: p.key,
    label: p.label,
    met: Boolean(form[p.titleField].trim()) && Boolean(form[p.field].trim()),
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
    aboutPageTitle: data.paymentCompliance?.aboutPageTitle ?? '',
    aboutPageContent: data.paymentCompliance?.aboutPageContent ?? '',
    deliveryReturnsPageTitle: data.paymentCompliance?.deliveryReturnsPageTitle ?? '',
    deliveryReturnsPageContent: data.paymentCompliance?.deliveryReturnsPageContent ?? '',
    privacyPolicyPageTitle: data.paymentCompliance?.privacyPolicyPageTitle ?? '',
    privacyPolicyPageContent: data.paymentCompliance?.privacyPolicyPageContent ?? '',
    distanceSellingAgreementPageTitle: data.paymentCompliance?.distanceSellingAgreementPageTitle ?? '',
    distanceSellingAgreementPageContent: data.paymentCompliance?.distanceSellingAgreementPageContent ?? '',
    preInformationFormPageTitle: data.paymentCompliance?.preInformationFormPageTitle ?? '',
    preInformationFormPageContent: data.paymentCompliance?.preInformationFormPageContent ?? '',
    iyzicoPayLogoUrl: data.paymentCompliance?.iyzicoPayLogoUrl ?? '',
    themePrimaryLight: data.theme?.primaryLight ?? '#8B5CF6',
    themePrimaryDark: data.theme?.primaryDark ?? '#A78BFA',
    themeFontFamily: data.theme?.fontFamily ?? '',
    seoDefaultTitle: data.seo?.defaultTitle ?? '',
    seoDefaultDescription: data.seo?.defaultDescription ?? '',
    seoDefaultKeywords: data.seo?.defaultKeywords ?? '',
    seoOgImageUrl: data.seo?.ogImageUrl ?? '',
    seoTwitterHandle: data.seo?.twitterHandle ?? '',
    pageSeo: mergePageSeoFromApi(data.seo?.pages),
    storefrontContent: mergeStorefrontContentFromApi(data.storefrontContent),
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
    field: 'logoUrl' | 'faviconUrl' | 'iyzicoPayLogoUrl' | 'seoOgImageUrl',
  ) => {
    const result = await uploadImage(file, 'site');
    setForm((prev) => ({ ...prev, [field]: result.url }));
  };

  const updatePageSeo = (pageKey: string, patch: Partial<PageSeoFormRow>) => {
    setForm((prev) => ({
      ...prev,
      pageSeo: prev.pageSeo.map((p) => (p.pageKey === pageKey ? { ...p, ...patch } : p)),
    }));
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
        aboutPageTitle: form.aboutPageTitle || null,
        aboutPageContent: form.aboutPageContent || null,
        deliveryReturnsPageTitle: form.deliveryReturnsPageTitle || null,
        deliveryReturnsPageContent: form.deliveryReturnsPageContent || null,
        privacyPolicyPageTitle: form.privacyPolicyPageTitle || null,
        privacyPolicyPageContent: form.privacyPolicyPageContent || null,
        distanceSellingAgreementPageTitle: form.distanceSellingAgreementPageTitle || null,
        distanceSellingAgreementPageContent: form.distanceSellingAgreementPageContent || null,
        preInformationFormPageTitle: form.preInformationFormPageTitle || null,
        preInformationFormPageContent: form.preInformationFormPageContent || null,
        iyzicoPayLogoUrl: form.iyzicoPayLogoUrl || null,
      },
      theme: {
        primaryLight: form.themePrimaryLight || null,
        primaryDark: form.themePrimaryDark || null,
        fontFamily: form.themeFontFamily || null,
      },
      seo: {
        defaultTitle: form.seoDefaultTitle || null,
        defaultDescription: form.seoDefaultDescription || null,
        defaultKeywords: form.seoDefaultKeywords || null,
        ogImageUrl: form.seoOgImageUrl || null,
        twitterHandle: form.seoTwitterHandle || null,
        pages: form.pageSeo.map((p) => ({
          pageKey: p.pageKey,
          label: p.label,
          path: p.path,
          title: p.title || null,
          description: p.description || null,
          keywords: p.keywords || null,
          ogImageUrl: p.ogImageUrl || null,
        })),
      },
      storefrontContent: storefrontContentToApi(form.storefrontContent),
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
        subtitle="Mağaza sayfa sırasına göre düzenlenmiş site ayarları"
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

      <div className="site-settings-layout">
        <SiteSettingsSectionNav />

        <form className="card site-settings-form" onSubmit={onSubmit}>
          <SiteSettingsSection
            id="genel"
            title="Genel"
            description="UI kodu ve yönetim ayarları. Storefront .env dosyasındaki VITE_UI_CODE ile eşleşmelidir."
          >
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
                <small className="field-hint">Oluşturduktan sonra değiştirilemez.</small>
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
          </SiteSettingsSection>

          <SiteSettingsSection
            id="marka-tema"
            title="Marka & Tema"
            path="—"
            description="Logo, favicon ve renk teması tüm sayfalarda kullanılır."
          >
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

            <h4 className="site-settings-subtitle">Renk teması</h4>
            <p className="field-hint" style={{ marginBottom: 12 }}>
              Boş bırakırsanız varsayılan mor tema kullanılır.
            </p>
            <div className="form-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
              <div className="field">
                <label htmlFor="theme-primary-light">Açık tema ana rengi</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input
                    type="color"
                    id="theme-primary-light"
                    value={form.themePrimaryLight}
                    onChange={(e) => setForm({ ...form, themePrimaryLight: e.target.value })}
                    style={{ width: 44, height: 36, padding: 2, border: '1px solid #d1d5db', borderRadius: 6, cursor: 'pointer' }}
                  />
                  <input
                    value={form.themePrimaryLight}
                    onChange={(e) => setForm({ ...form, themePrimaryLight: e.target.value })}
                    placeholder="#8B5CF6"
                    style={{ flex: 1 }}
                  />
                </div>
              </div>
              <div className="field">
                <label htmlFor="theme-primary-dark">Koyu tema ana rengi</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input
                    type="color"
                    id="theme-primary-dark"
                    value={form.themePrimaryDark}
                    onChange={(e) => setForm({ ...form, themePrimaryDark: e.target.value })}
                    style={{ width: 44, height: 36, padding: 2, border: '1px solid #d1d5db', borderRadius: 6, cursor: 'pointer' }}
                  />
                  <input
                    value={form.themePrimaryDark}
                    onChange={(e) => setForm({ ...form, themePrimaryDark: e.target.value })}
                    placeholder="#A78BFA"
                    style={{ flex: 1 }}
                  />
                </div>
              </div>
              <div className="field">
                <label htmlFor="theme-font">Font ailesi</label>
                <input
                  id="theme-font"
                  value={form.themeFontFamily}
                  onChange={(e) => setForm({ ...form, themeFontFamily: e.target.value })}
                  placeholder="Inter, Poppins, Roboto …"
                />
                <small className="field-hint">Boş bırakılırsa Inter kullanılır.</small>
              </div>
            </div>

            {(form.themePrimaryLight || form.themePrimaryDark) && (
              <div style={{ marginTop: 12, display: 'flex', gap: 12, alignItems: 'center' }}>
                <span className="field-hint">Önizleme:</span>
                {form.themePrimaryLight && (
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '4px 12px', borderRadius: 6,
                    background: form.themePrimaryLight, color: '#fff',
                    fontSize: 13, fontWeight: 500,
                  }}>
                    Açık tema
                  </span>
                )}
                {form.themePrimaryDark && (
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '4px 12px', borderRadius: 6,
                    background: form.themePrimaryDark, color: '#fff',
                    fontSize: 13, fontWeight: 500,
                  }}>
                    Koyu tema
                  </span>
                )}
              </div>
            )}
          </SiteSettingsSection>
          <SiteSettingsSection
            id="seo-genel"
            title="SEO (Genel)"
            path="<head>"
            description="Tarayıcı sekmesi, arama motorları ve sosyal paylaşım için varsayılan meta değerleri."
          >
            <div className="form-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
              <div className="field">
                <label htmlFor="seo-default-title">Varsayılan site başlığı</label>
                <input
                  id="seo-default-title"
                  value={form.seoDefaultTitle}
                  onChange={(e) => setForm({ ...form, seoDefaultTitle: e.target.value })}
                  placeholder="Bizdenalbizdensat — Online Alışveriş"
                />
              </div>
              <div className="field">
                <label htmlFor="seo-twitter">Twitter / X kullanıcı adı</label>
                <input
                  id="seo-twitter"
                  value={form.seoTwitterHandle}
                  onChange={(e) => setForm({ ...form, seoTwitterHandle: e.target.value })}
                  placeholder="@magaza"
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="seo-default-description">Varsayılan meta açıklama</label>
              <textarea
                id="seo-default-description"
                rows={3}
                value={form.seoDefaultDescription}
                onChange={(e) => setForm({ ...form, seoDefaultDescription: e.target.value })}
                placeholder="Site geneli arama motoru açıklaması"
              />
            </div>

            <div className="field">
              <label htmlFor="seo-default-keywords">Varsayılan anahtar kelimeler</label>
              <input
                id="seo-default-keywords"
                value={form.seoDefaultKeywords}
                onChange={(e) => setForm({ ...form, seoDefaultKeywords: e.target.value })}
                placeholder="e-ticaret, alışveriş, online mağaza"
              />
            </div>

            <div className="field" style={{ maxWidth: 360 }}>
              <label>Varsayılan OG görseli (sosyal paylaşım)</label>
              {form.seoOgImageUrl && (
                <img src={form.seoOgImageUrl} alt="OG önizleme" style={{ maxHeight: 80, marginBottom: 8, display: 'block', borderRadius: 8 }} />
              )}
              <label className="btn btn-secondary" style={{ cursor: 'pointer', width: 'fit-content' }}>
                <IconUpload /> Görsel yükle
                <input type="file" accept="image/*" hidden onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0], 'seoOgImageUrl')} />
              </label>
              <input value={form.seoOgImageUrl} onChange={(e) => setForm({ ...form, seoOgImageUrl: e.target.value })} placeholder="veya görsel URL" style={{ marginTop: 8 }} />
            </div>
          </SiteSettingsSection>

          <SiteSettingsSection
            id="navbar"
            title="Navbar"
            path="Tüm sayfalar"
            description="Üst menü metinleri ve linkleri."
          >
            <SiteUiCopySection
              part="navbar"
              form={form.storefrontContent}
              onChange={(storefrontContent) => setForm((prev) => ({ ...prev, storefrontContent }))}
            />
          </SiteSettingsSection>

          <SiteSettingsSection
            id="anasayfa"
            title="Anasayfa"
            path="/"
            description="Hero → güven bandı → kampanyalar → ürün rafları → bülten sırası mağazadaki anasayfa ile aynıdır. Örnekler: docs/STOREFRONT_CONTENT.md"
          >
            <StorefrontContentSection
              part="home"
              form={form.storefrontContent}
              onChange={(storefrontContent) => setForm((prev) => ({ ...prev, storefrontContent }))}
            />
            <PageSeoFields
              pages={form.pageSeo}
              pageKeys={['home']}
              onUpdate={updatePageSeo}
            />
          </SiteSettingsSection>

          <SiteSettingsSection
            id="magaza-sayfalari"
            title="Mağaza & Uygulama Sayfaları"
            path="/shop, /product, /login …"
            description="Mağaza, ürün, kategori, giriş, hesap, sipariş ve sepet sayfalarındaki arayüz metinleri (JSON)."
          >
            <AppPagesUiSection
              value={form.storefrontContent.appPagesJson}
              onChange={(appPagesJson) =>
                setForm((prev) => ({
                  ...prev,
                  storefrontContent: { ...prev.storefrontContent, appPagesJson },
                }))
              }
            />
            <PageSeoFields
              pages={form.pageSeo}
              pageKeys={['shop', 'login', 'register']}
              onUpdate={updatePageSeo}
            />
          </SiteSettingsSection>

          <SiteSettingsSection
            id="iletisim"
            title="İletişim"
            path="/contact"
            description="İletişim bilgileri footer ve iletişim sayfasında kullanılır."
          >
            <h4 className="site-settings-subtitle">İletişim bilgileri</h4>
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

            <StorefrontContentSection
              part="contact"
              form={form.storefrontContent}
              onChange={(storefrontContent) => setForm((prev) => ({ ...prev, storefrontContent }))}
            />
            <SiteUiCopySection
              part="contact"
              form={form.storefrontContent}
              onChange={(storefrontContent) => setForm((prev) => ({ ...prev, storefrontContent }))}
            />
            <PageSeoFields
              pages={form.pageSeo}
              pageKeys={['contact']}
              onUpdate={updatePageSeo}
            />
          </SiteSettingsSection>

          <SiteSettingsSection
            id="yasal"
            title="Yasal Sayfalar"
            path="/about, /privacy …"
            description={
              <>
                Yasal sayfa içerikleri admin&apos;den girilen HTML ile yayınlanır. Hazır metinler:{' '}
                <code>docs/LEGAL_PAGE_CONTENT.md</code>
              </>
            }
          >
            <div
              className="card site-settings-compliance"
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
                Ödeme uyumluluğu: {complianceStatus.completed}/{complianceStatus.total}
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
              <details key={page.slug} open className="card site-settings-details site-settings-legal-page">
                <summary>
                  {page.label} <code>{page.storePath}</code>
                </summary>
                <div className="site-settings-details-body">
                  <div className="field">
                    <label htmlFor={`${page.slug}-title`}>Sayfa başlığı</label>
                    <input
                      id={`${page.slug}-title`}
                      value={form[page.titleField]}
                      onChange={(e) => setForm({ ...form, [page.titleField]: e.target.value })}
                      placeholder="Mağazada görünen sayfa başlığı"
                    />
                  </div>
                  <div className="field">
                    <label htmlFor={page.slug}>İçerik (HTML)</label>
                    <textarea
                      id={page.slug}
                      rows={8}
                      value={form[page.field]}
                      onChange={(e) => setForm({ ...form, [page.field]: e.target.value })}
                      placeholder={`${page.label} metnini girin. HTML veya düz metin.`}
                    />
                    {form.code && (
                      <small className="field-hint">
                        API: <code>/api/site-settings/{form.code}/legal-pages/{page.slug}/html</code>
                      </small>
                    )}
                  </div>
                  <PageSeoFields
                    pages={form.pageSeo}
                    pageKeys={[page.seoPageKey]}
                    onUpdate={updatePageSeo}
                    title="Bu sayfanın SEO"
                  />
                </div>
              </details>
            ))}

            <SiteUiCopySection
              part="legal"
              form={form.storefrontContent}
              onChange={(storefrontContent) => setForm((prev) => ({ ...prev, storefrontContent }))}
            />
          </SiteSettingsSection>

          <SiteSettingsSection
            id="sepet-odeme"
            title="Sepet & Ödeme"
            path="/checkout, /orders …"
            description="Ödeme onay metinleri, iyzico logosu ve ilgili sayfa SEO."
          >
            <SiteUiCopySection
              part="checkout"
              form={form.storefrontContent}
              onChange={(storefrontContent) => setForm((prev) => ({ ...prev, storefrontContent }))}
            />
            <PageSeoFields
              pages={form.pageSeo}
              pageKeys={['checkout', 'wishlist']}
              onUpdate={updatePageSeo}
            />

            <h4 className="site-settings-subtitle">iyzico ile Öde logosu</h4>
            <div className="field" style={{ maxWidth: 360 }}>
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
          </SiteSettingsSection>

          <SiteSettingsSection
            id="footer"
            title="Footer"
            path="Alt bilgi"
            description="Footer menüsü, açıklama metni ve sosyal medya linkleri."
          >
            <StorefrontContentSection
              part="footer"
              form={form.storefrontContent}
              onChange={(storefrontContent) => setForm((prev) => ({ ...prev, storefrontContent }))}
            />

            <h4 className="site-settings-subtitle">Sosyal medya</h4>
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
          </SiteSettingsSection>

          <SiteSettingsSection
            id="diger"
            title="404 & Diğer"
            path="*"
            description="Bulunamayan sayfa metinleri."
          >
            <StorefrontContentSection
              part="not-found"
              form={form.storefrontContent}
              onChange={(storefrontContent) => setForm((prev) => ({ ...prev, storefrontContent }))}
            />
          </SiteSettingsSection>

          <div className="site-settings-form-actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Kaydediliyor…' : isNew ? 'Oluştur' : 'Kaydet'}
            </button>
            <Link to="/site-settings" className="btn btn-ghost">İptal</Link>
          </div>
        </form>
      </div>
    </>
  );
}
