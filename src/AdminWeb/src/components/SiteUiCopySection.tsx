import { emptyFooterLink, type StorefrontContentForm } from '../constants/storefront-content';
import type { UiCopyForm } from '../constants/storefront-ui-copy';

export type SiteUiCopyPart = 'navbar' | 'contact' | 'legal' | 'checkout';

type Props = {
  part: SiteUiCopyPart;
  form: StorefrontContentForm;
  onChange: (next: StorefrontContentForm) => void;
};

function patchUi(ui: UiCopyForm, patch: Partial<UiCopyForm>): UiCopyForm {
  return { ...ui, ...patch };
}

function patchUiList<T>(items: T[], index: number, patch: Partial<T>): T[] {
  return items.map((item, i) => (i === index ? { ...item, ...patch } : item));
}

export default function SiteUiCopySection({ part, form, onChange }: Props) {
  const ui = form.uiCopy;
  const setUi = (next: UiCopyForm) => onChange({ ...form, uiCopy: next });

  if (part === 'navbar') {
    return (
      <>
      <h4 className="site-settings-subtitle">Menü metinleri</h4>
      <div className="form-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <div className="field">
          <label>Arama placeholder</label>
          <input value={ui.navbarSearchPlaceholder} onChange={(e) => setUi(patchUi(ui, { navbarSearchPlaceholder: e.target.value }))} />
        </div>
        <div className="field">
          <label>Kategoriler etiketi</label>
          <input value={ui.navbarCategoriesLabel} onChange={(e) => setUi(patchUi(ui, { navbarCategoriesLabel: e.target.value }))} />
        </div>
        <div className="field">
          <label>Giriş yap etiketi</label>
          <input value={ui.navbarLoginLabel} onChange={(e) => setUi(patchUi(ui, { navbarLoginLabel: e.target.value }))} />
        </div>
        <div className="field">
          <label>Hesabım etiketi</label>
          <input value={ui.navbarAccountLabel} onChange={(e) => setUi(patchUi(ui, { navbarAccountLabel: e.target.value }))} />
        </div>
        <div className="field">
          <label>Favoriler etiketi</label>
          <input value={ui.navbarWishlistLabel} onChange={(e) => setUi(patchUi(ui, { navbarWishlistLabel: e.target.value }))} />
        </div>
        <div className="field">
          <label>Sepet etiketi</label>
          <input value={ui.navbarCartLabel} onChange={(e) => setUi(patchUi(ui, { navbarCartLabel: e.target.value }))} />
        </div>
        <div className="field">
          <label>Çıkış yap etiketi</label>
          <input value={ui.navbarLogoutLabel} onChange={(e) => setUi(patchUi(ui, { navbarLogoutLabel: e.target.value }))} />
        </div>
        <div className="field">
          <label>Kayıt ol etiketi</label>
          <input value={ui.navbarRegisterLabel} onChange={(e) => setUi(patchUi(ui, { navbarRegisterLabel: e.target.value }))} />
        </div>
        <div className="field">
          <label>Mobil mağaza bölüm başlığı</label>
          <input value={ui.navbarShopSectionTitle} onChange={(e) => setUi(patchUi(ui, { navbarShopSectionTitle: e.target.value }))} />
        </div>
        <div className="field">
          <label>Mobil hesap bölüm başlığı</label>
          <input value={ui.navbarAccountSectionTitle} onChange={(e) => setUi(patchUi(ui, { navbarAccountSectionTitle: e.target.value }))} />
        </div>
        <div className="field">
          <label>Selamlama öneki</label>
          <input value={ui.navbarGreetingPrefix} onChange={(e) => setUi(patchUi(ui, { navbarGreetingPrefix: e.target.value }))} placeholder="Merhaba," />
        </div>
        <div className="field">
          <label>Varsayılan kullanıcı adı</label>
          <input value={ui.navbarGuestNameFallback} onChange={(e) => setUi(patchUi(ui, { navbarGuestNameFallback: e.target.value }))} />
        </div>
      </div>
      <p className="field-hint" style={{ marginBottom: 8 }}>Ana menü linkleri (masaüstü + mobil)</p>
      {ui.navbarPrimaryLinks.map((link, index) => (
        <div key={index} className="form-grid card" style={{ gridTemplateColumns: '1fr 1fr auto', marginBottom: 8, padding: 12, alignItems: 'end' }}>
          <div className="field">
            <label>Metin</label>
            <input value={link.label} onChange={(e) => setUi(patchUi(ui, { navbarPrimaryLinks: patchUiList(ui.navbarPrimaryLinks, index, { label: e.target.value }) }))} />
          </div>
          <div className="field">
            <label>Link</label>
            <input value={link.href} onChange={(e) => setUi(patchUi(ui, { navbarPrimaryLinks: patchUiList(ui.navbarPrimaryLinks, index, { href: e.target.value }) }))} />
          </div>
          <button type="button" className="btn btn-ghost" onClick={() => setUi(patchUi(ui, { navbarPrimaryLinks: ui.navbarPrimaryLinks.filter((_, i) => i !== index) }))}>Sil</button>
        </div>
      ))}
      <button type="button" className="btn btn-secondary" style={{ marginBottom: 20 }} onClick={() => setUi(patchUi(ui, { navbarPrimaryLinks: [...ui.navbarPrimaryLinks, emptyFooterLink()] }))}>
        + Navbar linki ekle
      </button>
      </>
    );
  }

  if (part === 'contact') {
    return (
      <>
      <h4 className="site-settings-subtitle">İletişim formu metinleri</h4>
      <div className="form-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <div className="field">
          <label>Bilgiler bölüm başlığı</label>
          <input value={ui.contactInfoSectionTitle} onChange={(e) => setUi(patchUi(ui, { contactInfoSectionTitle: e.target.value }))} />
        </div>
        <div className="field">
          <label>Form bölüm başlığı</label>
          <input value={ui.contactFormSectionTitle} onChange={(e) => setUi(patchUi(ui, { contactFormSectionTitle: e.target.value }))} />
        </div>
        <div className="field">
          <label>Sosyal medya bölüm başlığı</label>
          <input value={ui.contactSocialSectionTitle} onChange={(e) => setUi(patchUi(ui, { contactSocialSectionTitle: e.target.value }))} />
        </div>
      </div>
      <div className="field">
        <label>Form giriş metni</label>
        <textarea rows={2} value={ui.contactFormIntro} onChange={(e) => setUi(patchUi(ui, { contactFormIntro: e.target.value }))} />
      </div>
      <div className="form-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
        {([
          ['contactLocationLabel', 'Konum etiketi'],
          ['contactEmailLabel', 'E-posta etiketi'],
          ['contactPhoneLabel', 'Telefon etiketi'],
          ['contactHoursLabel', 'Çalışma saatleri etiketi'],
          ['contactNameLabel', 'Ad alan etiketi'],
          ['contactEmailFieldLabel', 'E-posta alan etiketi'],
          ['contactSubjectLabel', 'Konu etiketi'],
          ['contactMessageLabel', 'Mesaj etiketi'],
          ['contactNamePlaceholder', 'Ad placeholder'],
          ['contactEmailPlaceholder', 'E-posta placeholder'],
          ['contactSubjectPlaceholder', 'Konu placeholder'],
          ['contactMessagePlaceholder', 'Mesaj placeholder'],
          ['contactSubmitButtonLabel', 'Gönder butonu'],
          ['contactSubmittingLabel', 'Gönderiliyor metni'],
          ['contactSubmitSuccessTitle', 'Başarı toast başlığı'],
          ['contactSubmitSuccessDescription', 'Başarı toast açıklaması'],
          ['contactSubmitErrorTitle', 'Hata toast başlığı'],
          ['contactSubmitErrorFallback', 'Hata toast varsayılan metni'],
        ] as const).map(([key, label]) => (
          <div className="field" key={key}>
            <label>{label}</label>
            <input value={ui[key]} onChange={(e) => setUi(patchUi(ui, { [key]: e.target.value }))} />
          </div>
        ))}
      </div>
      </>
    );
  }

  if (part === 'legal') {
    return (
      <>
      <h4 className="site-settings-subtitle">Yasal sayfa arayüzü</h4>
      <div className="form-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        {([
          ['legalEmptyStateTitle', 'Boş durum başlığı'],
          ['legalEmptyStateDescription', 'Boş durum açıklaması'],
          ['legalTocTitle', 'İçindekiler başlığı'],
          ['legalContactBlockTitle', 'İletişim bloğu başlığı'],
          ['legalContactBlockDescription', 'İletişim bloğu açıklaması'],
          ['legalEmailLabel', 'E-posta etiketi'],
          ['legalPhoneLabel', 'Telefon etiketi'],
          ['legalContactFormButtonLabel', 'İletişim formu butonu'],
        ] as const).map(([key, label]) => (
          <div className="field" key={key}>
            <label>{label}</label>
            <input value={ui[key]} onChange={(e) => setUi(patchUi(ui, { [key]: e.target.value }))} />
          </div>
        ))}
        <div className="field">
          <label>İletişim formu linki</label>
          <input value={ui.legalContactFormHref} onChange={(e) => setUi(patchUi(ui, { legalContactFormHref: e.target.value }))} />
        </div>
      </div>
      </>
    );
  }

  return (
    <>
      <h4 className="site-settings-subtitle">Ödeme — sözleşme onayı</h4>
      <div className="field">
        <label>Onay metni sonu (suffix)</label>
        <input value={ui.checkoutConsentSuffix} onChange={(e) => setUi(patchUi(ui, { checkoutConsentSuffix: e.target.value }))} />
      </div>
      {ui.checkoutConsentLinks.map((link, index) => (
        <div key={index} className="form-grid card" style={{ gridTemplateColumns: '1fr 1fr auto', marginBottom: 8, padding: 12, alignItems: 'end' }}>
          <div className="field">
            <label>Slug (privacy-policy vb.)</label>
            <input value={link.slug} onChange={(e) => setUi(patchUi(ui, { checkoutConsentLinks: patchUiList(ui.checkoutConsentLinks, index, { slug: e.target.value }) }))} />
          </div>
          <div className="field">
            <label>Link metni</label>
            <input value={link.label} onChange={(e) => setUi(patchUi(ui, { checkoutConsentLinks: patchUiList(ui.checkoutConsentLinks, index, { label: e.target.value }) }))} />
          </div>
          <button type="button" className="btn btn-ghost" onClick={() => setUi(patchUi(ui, { checkoutConsentLinks: ui.checkoutConsentLinks.filter((_, i) => i !== index) }))}>Sil</button>
        </div>
      ))}
      <button type="button" className="btn btn-secondary" onClick={() => setUi(patchUi(ui, { checkoutConsentLinks: [...ui.checkoutConsentLinks, { slug: '', label: '' }] }))}>
        + Onay linki ekle
      </button>
    </>
  );
}
