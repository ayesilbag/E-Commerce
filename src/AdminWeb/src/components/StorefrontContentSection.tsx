import { uploadImage } from '../api/client';
import { IconUpload } from './Icons';
import {
  emptyCampaignBanner,
  emptyFooterLink,
  emptyHeroSlide,
  emptyProductRow,
  emptyTrustItem,
  type StorefrontContentForm,
} from '../constants/storefront-content';
export type StorefrontContentPart = 'home' | 'contact' | 'footer' | 'not-found';

type Props = {
  part: StorefrontContentPart;
  form: StorefrontContentForm;
  onChange: (next: StorefrontContentForm) => void;
};

function patchList<T>(items: T[], index: number, patch: Partial<T>): T[] {
  return items.map((item, i) => (i === index ? { ...item, ...patch } : item));
}

export default function StorefrontContentSection({ part, form, onChange }: Props) {
  const uploadHeroImage = async (index: number, file: File) => {
    const result = await uploadImage(file, 'site');
    onChange({
      ...form,
      heroSlides: patchList(form.heroSlides, index, { imageUrl: result.url }),
    });
  };

  const uploadCampaignImage = async (index: number, file: File) => {
    const result = await uploadImage(file, 'site');
    onChange({
      ...form,
      campaignBanners: patchList(form.campaignBanners, index, { imageUrl: result.url }),
    });
  };

  if (part === 'home') {
    return (
      <>
      <h4 className="site-settings-subtitle">Hero slaytları</h4>
      {form.heroSlides.map((slide, index) => (
        <details key={index} open className="card" style={{ marginBottom: 12, padding: 12 }}>
          <summary style={{ cursor: 'pointer', fontWeight: 600 }}>
            Slayt {index + 1}{slide.title ? `: ${slide.title}` : ''}
          </summary>
          <div className="form-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginTop: 12 }}>
            <div className="field">
              <label>Rozet</label>
              <input value={slide.badge} onChange={(e) => onChange({ ...form, heroSlides: patchList(form.heroSlides, index, { badge: e.target.value }) })} />
            </div>
            <div className="field">
              <label>Başlık</label>
              <input value={slide.title} onChange={(e) => onChange({ ...form, heroSlides: patchList(form.heroSlides, index, { title: e.target.value }) })} />
            </div>
            <div className="field">
              <label>Vurgu metni</label>
              <input value={slide.highlight} onChange={(e) => onChange({ ...form, heroSlides: patchList(form.heroSlides, index, { highlight: e.target.value }) })} />
            </div>
            <div className="field">
              <label>Arka plan sınıfı (Tailwind)</label>
              <input value={slide.backgroundClass} onChange={(e) => onChange({ ...form, heroSlides: patchList(form.heroSlides, index, { backgroundClass: e.target.value }) })} placeholder="from-primary/10 to-primary/20" />
            </div>
          </div>
          <div className="field">
            <label>Alt başlık</label>
            <textarea rows={2} value={slide.subtitle} onChange={(e) => onChange({ ...form, heroSlides: patchList(form.heroSlides, index, { subtitle: e.target.value }) })} />
          </div>
          <div className="form-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
            <div className="field">
              <label>Birincil buton</label>
              <input value={slide.ctaLabel} onChange={(e) => onChange({ ...form, heroSlides: patchList(form.heroSlides, index, { ctaLabel: e.target.value }) })} placeholder="Alışverişe Başla" />
            </div>
            <div className="field">
              <label>Birincil link</label>
              <input value={slide.ctaHref} onChange={(e) => onChange({ ...form, heroSlides: patchList(form.heroSlides, index, { ctaHref: e.target.value }) })} placeholder="/shop" />
            </div>
            <div className="field">
              <label>İkincil buton</label>
              <input value={slide.ctaSecondaryLabel} onChange={(e) => onChange({ ...form, heroSlides: patchList(form.heroSlides, index, { ctaSecondaryLabel: e.target.value }) })} />
            </div>
            <div className="field">
              <label>İkincil link</label>
              <input value={slide.ctaSecondaryHref} onChange={(e) => onChange({ ...form, heroSlides: patchList(form.heroSlides, index, { ctaSecondaryHref: e.target.value }) })} />
            </div>
          </div>
          <div className="field">
            <label>Görsel</label>
            {slide.imageUrl && <img src={slide.imageUrl} alt="" style={{ maxHeight: 80, marginBottom: 8, borderRadius: 8 }} />}
            <label className="btn btn-secondary" style={{ cursor: 'pointer', width: 'fit-content' }}>
              <IconUpload /> Görsel yükle
              <input type="file" accept="image/*" hidden onChange={(e) => e.target.files?.[0] && uploadHeroImage(index, e.target.files[0])} />
            </label>
            <input value={slide.imageUrl} onChange={(e) => onChange({ ...form, heroSlides: patchList(form.heroSlides, index, { imageUrl: e.target.value }) })} placeholder="veya görsel URL" style={{ marginTop: 8 }} />
          </div>
          <button type="button" className="btn btn-ghost" onClick={() => onChange({ ...form, heroSlides: form.heroSlides.filter((_, i) => i !== index) })}>
            Slaytı sil
          </button>
        </details>
      ))}
      <button type="button" className="btn btn-secondary" style={{ marginBottom: 16 }} onClick={() => onChange({ ...form, heroSlides: [...form.heroSlides, emptyHeroSlide()] })}>
        + Hero slayt ekle
      </button>

      <h4 style={{ marginBottom: 8, fontSize: 15 }}>Güven bandı</h4>
      {form.trustItems.map((item, index) => (
        <div key={index} className="form-grid card" style={{ gridTemplateColumns: '120px 1fr 1fr auto', marginBottom: 8, padding: 12, alignItems: 'end' }}>
          <div className="field">
            <label>İkon</label>
            <select value={item.icon} onChange={(e) => onChange({ ...form, trustItems: patchList(form.trustItems, index, { icon: e.target.value }) })}>
              <option value="truck">Kargo</option>
              <option value="refresh-cw">İade</option>
              <option value="shield-check">Güvenlik</option>
              <option value="award">Kalite</option>
            </select>
          </div>
          <div className="field">
            <label>Başlık</label>
            <input value={item.title} onChange={(e) => onChange({ ...form, trustItems: patchList(form.trustItems, index, { title: e.target.value }) })} />
          </div>
          <div className="field">
            <label>Alt metin</label>
            <input value={item.subtitle} onChange={(e) => onChange({ ...form, trustItems: patchList(form.trustItems, index, { subtitle: e.target.value }) })} />
          </div>
          <button type="button" className="btn btn-ghost" onClick={() => onChange({ ...form, trustItems: form.trustItems.filter((_, i) => i !== index) })}>Sil</button>
        </div>
      ))}
      <button type="button" className="btn btn-secondary" style={{ marginBottom: 16 }} onClick={() => onChange({ ...form, trustItems: [...form.trustItems, emptyTrustItem()] })}>
        + Güven bandı öğesi
      </button>

      <h4 style={{ marginBottom: 8, fontSize: 15 }}>Kampanya bannerları</h4>
      {form.campaignBanners.map((banner, index) => (
        <details key={index} className="card" style={{ marginBottom: 12, padding: 12 }}>
          <summary style={{ cursor: 'pointer', fontWeight: 600 }}>
            Banner {index + 1} ({banner.size}){banner.title ? `: ${banner.title}` : ''}
          </summary>
          <div className="form-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', marginTop: 12 }}>
            <div className="field">
              <label>Boyut</label>
              <select value={banner.size} onChange={(e) => onChange({ ...form, campaignBanners: patchList(form.campaignBanners, index, { size: e.target.value as 'large' | 'small' }) })}>
                <option value="large">Büyük</option>
                <option value="small">Küçük</option>
              </select>
            </div>
            <div className="field">
              <label>Rozet</label>
              <input value={banner.badge} onChange={(e) => onChange({ ...form, campaignBanners: patchList(form.campaignBanners, index, { badge: e.target.value }) })} />
            </div>
            <div className="field">
              <label>Başlık</label>
              <input value={banner.title} onChange={(e) => onChange({ ...form, campaignBanners: patchList(form.campaignBanners, index, { title: e.target.value }) })} />
            </div>
            <div className="field">
              <label>Link metni</label>
              <input value={banner.linkLabel} onChange={(e) => onChange({ ...form, campaignBanners: patchList(form.campaignBanners, index, { linkLabel: e.target.value }) })} />
            </div>
            <div className="field">
              <label>Link</label>
              <input value={banner.href} onChange={(e) => onChange({ ...form, campaignBanners: patchList(form.campaignBanners, index, { href: e.target.value }) })} />
            </div>
            <div className="field">
              <label>Gradient sınıfı</label>
              <input value={banner.gradientClass} onChange={(e) => onChange({ ...form, campaignBanners: patchList(form.campaignBanners, index, { gradientClass: e.target.value }) })} />
            </div>
          </div>
          <div className="field">
            <label>Alt metin</label>
            <input value={banner.subtitle} onChange={(e) => onChange({ ...form, campaignBanners: patchList(form.campaignBanners, index, { subtitle: e.target.value }) })} />
          </div>
          <div className="field">
            <label>Görsel</label>
            {banner.imageUrl && <img src={banner.imageUrl} alt="" style={{ maxHeight: 60, marginBottom: 8, borderRadius: 8 }} />}
            <label className="btn btn-secondary" style={{ cursor: 'pointer', width: 'fit-content' }}>
              <IconUpload /> Görsel yükle
              <input type="file" accept="image/*" hidden onChange={(e) => e.target.files?.[0] && uploadCampaignImage(index, e.target.files[0])} />
            </label>
            <input value={banner.imageUrl} onChange={(e) => onChange({ ...form, campaignBanners: patchList(form.campaignBanners, index, { imageUrl: e.target.value }) })} style={{ marginTop: 8 }} />
          </div>
          <button type="button" className="btn btn-ghost" onClick={() => onChange({ ...form, campaignBanners: form.campaignBanners.filter((_, i) => i !== index) })}>Banner sil</button>
        </details>
      ))}
      <button type="button" className="btn btn-secondary" style={{ marginBottom: 16 }} onClick={() => onChange({ ...form, campaignBanners: [...form.campaignBanners, emptyCampaignBanner()] })}>
        + Kampanya banner ekle
      </button>

      <h4 style={{ marginBottom: 8, fontSize: 15 }}>Anasayfa ürün rafları</h4>
      {form.productRows.map((row, index) => (
        <div key={index} className="form-grid card" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', marginBottom: 8, padding: 12 }}>
          <div className="field">
            <label>Başlık</label>
            <input value={row.title} onChange={(e) => onChange({ ...form, productRows: patchList(form.productRows, index, { title: e.target.value }) })} />
          </div>
          <div className="field">
            <label>Alt başlık</label>
            <input value={row.subtitle} onChange={(e) => onChange({ ...form, productRows: patchList(form.productRows, index, { subtitle: e.target.value }) })} />
          </div>
          <div className="field">
            <label>Tümünü gör linki</label>
            <input value={row.viewAllHref} onChange={(e) => onChange({ ...form, productRows: patchList(form.productRows, index, { viewAllHref: e.target.value }) })} />
          </div>
          <div className="field">
            <label>Sıralama</label>
            <select value={row.sort} onChange={(e) => onChange({ ...form, productRows: patchList(form.productRows, index, { sort: e.target.value }) })}>
              <option value="featured">Öne çıkan</option>
              <option value="newest">Yeni</option>
              <option value="discounted">İndirimli</option>
              <option value="price-low">Fiyat (düşük)</option>
              <option value="price-high">Fiyat (yüksek)</option>
              <option value="rating">Puan</option>
            </select>
          </div>
          <div className="field">
            <label>Limit</label>
            <input type="number" min={1} max={48} value={row.limit} onChange={(e) => onChange({ ...form, productRows: patchList(form.productRows, index, { limit: Number(e.target.value) || 12 }) })} />
          </div>
          <button type="button" className="btn btn-ghost" onClick={() => onChange({ ...form, productRows: form.productRows.filter((_, i) => i !== index) })}>Sil</button>
        </div>
      ))}
      <button type="button" className="btn btn-secondary" style={{ marginBottom: 16 }} onClick={() => onChange({ ...form, productRows: [...form.productRows, emptyProductRow()] })}>
        + Ürün rafı ekle
      </button>

      <h4 style={{ marginBottom: 8, fontSize: 15 }}>Bülten bölümü</h4>
      <div className="form-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <div className="field">
          <label>Başlık</label>
          <input value={form.newsletterTitle} onChange={(e) => onChange({ ...form, newsletterTitle: e.target.value })} />
        </div>
        <div className="field">
          <label>Buton metni</label>
          <input value={form.newsletterButtonLabel} onChange={(e) => onChange({ ...form, newsletterButtonLabel: e.target.value })} />
        </div>
        <div className="field">
          <label>Placeholder</label>
          <input value={form.newsletterPlaceholder} onChange={(e) => onChange({ ...form, newsletterPlaceholder: e.target.value })} />
        </div>
      </div>
      <div className="field">
        <label>Açıklama</label>
        <textarea rows={2} value={form.newsletterDescription} onChange={(e) => onChange({ ...form, newsletterDescription: e.target.value })} />
      </div>
      <div className="field">
        <label>Alt not (KVKK vb.)</label>
        <textarea rows={2} value={form.newsletterDisclaimer} onChange={(e) => onChange({ ...form, newsletterDisclaimer: e.target.value })} />
      </div>
      <div className="form-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <div className="field">
          <label>Gönderiliyor metni</label>
          <input value={form.newsletterSubmittingLabel} onChange={(e) => onChange({ ...form, newsletterSubmittingLabel: e.target.value })} />
        </div>
        <div className="field">
          <label>Başarı toast başlığı</label>
          <input value={form.newsletterSuccessTitle} onChange={(e) => onChange({ ...form, newsletterSuccessTitle: e.target.value })} />
        </div>
        <div className="field">
          <label>Başarı toast açıklaması</label>
          <input value={form.newsletterSuccessDescription} onChange={(e) => onChange({ ...form, newsletterSuccessDescription: e.target.value })} />
        </div>
        <div className="field">
          <label>Hata toast başlığı</label>
          <input value={form.newsletterErrorTitle} onChange={(e) => onChange({ ...form, newsletterErrorTitle: e.target.value })} />
        </div>
        <div className="field">
          <label>Boş e-posta mesajı</label>
          <input value={form.newsletterEmptyEmailMessage} onChange={(e) => onChange({ ...form, newsletterEmptyEmailMessage: e.target.value })} />
        </div>
      </div>
      </>
    );
  }

  if (part === 'contact') {
    return (
      <>
      <h4 className="site-settings-subtitle">SSS bölümü</h4>
      <div className="form-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <div className="field">
          <label>Bölüm başlığı</label>
          <input value={form.faqTitle} onChange={(e) => onChange({ ...form, faqTitle: e.target.value })} />
        </div>
        <div className="field">
          <label>Alt buton metni</label>
          <input value={form.faqFooterButtonLabel} onChange={(e) => onChange({ ...form, faqFooterButtonLabel: e.target.value })} />
        </div>
        <div className="field">
          <label>Alt buton linki</label>
          <input value={form.faqFooterButtonHref} onChange={(e) => onChange({ ...form, faqFooterButtonHref: e.target.value })} />
        </div>
      </div>
      <div className="field">
        <label>Bölüm açıklaması</label>
        <textarea rows={2} value={form.faqDescription} onChange={(e) => onChange({ ...form, faqDescription: e.target.value })} />
      </div>
      {form.faqItems.map((item, index) => (
        <div key={index} className="card" style={{ marginBottom: 8, padding: 12 }}>
          <div className="field">
            <label>Soru</label>
            <input value={item.question} onChange={(e) => onChange({ ...form, faqItems: patchList(form.faqItems, index, { question: e.target.value }) })} />
          </div>
          <div className="field">
            <label>Cevap</label>
            <textarea rows={3} value={item.answer} onChange={(e) => onChange({ ...form, faqItems: patchList(form.faqItems, index, { answer: e.target.value }) })} />
          </div>
          <button type="button" className="btn btn-ghost" onClick={() => onChange({ ...form, faqItems: form.faqItems.filter((_, i) => i !== index) })}>Soru sil</button>
        </div>
      ))}
      <button type="button" className="btn btn-secondary" style={{ marginBottom: 8 }} onClick={() => onChange({ ...form, faqItems: [...form.faqItems, { question: '', answer: '' }] })}>
        + SSS sorusu ekle
      </button>
      <div className="field">
        <label>SSS alt metni</label>
        <input value={form.faqFooterText} onChange={(e) => onChange({ ...form, faqFooterText: e.target.value })} />
      </div>

      <h4 className="site-settings-subtitle">Harita</h4>
      <div className="form-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <div className="field">
          <label>Başlık</label>
          <input value={form.contactMapTitle} onChange={(e) => onChange({ ...form, contactMapTitle: e.target.value })} />
        </div>
        <div className="field">
          <label>Embed URL (Google Maps iframe src)</label>
          <input value={form.contactMapEmbedUrl} onChange={(e) => onChange({ ...form, contactMapEmbedUrl: e.target.value })} placeholder="https://www.google.com/maps/embed?..." />
        </div>
      </div>
      <div className="field">
        <label>Açıklama</label>
        <textarea rows={2} value={form.contactMapDescription} onChange={(e) => onChange({ ...form, contactMapDescription: e.target.value })} />
      </div>
      <div className="field">
        <label>Harita yokken gösterilecek mesaj</label>
        <input value={form.contactMapEmptyMessage} onChange={(e) => onChange({ ...form, contactMapEmptyMessage: e.target.value })} />
      </div>
      </>
    );
  }

  if (part === 'footer') {
    return (
      <>
      <div className="field">
        <label htmlFor="footer-description">Footer açıklama metni</label>
        <textarea
          id="footer-description"
          rows={3}
          value={form.footerDescription}
          onChange={(e) => onChange({ ...form, footerDescription: e.target.value })}
          placeholder="Mağaza hakkında kısa tanıtım metni"
        />
      </div>

      <h4 className="site-settings-subtitle">Footer menü</h4>
      <div className="form-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <div className="field">
          <label>Hızlı linkler başlığı</label>
          <input value={form.footerQuickLinksTitle} onChange={(e) => onChange({ ...form, footerQuickLinksTitle: e.target.value })} />
        </div>
        <div className="field">
          <label>Müşteri hizmetleri başlığı</label>
          <input value={form.footerCustomerServiceTitle} onChange={(e) => onChange({ ...form, footerCustomerServiceTitle: e.target.value })} />
        </div>
        <div className="field">
          <label>İletişim bölümü başlığı</label>
          <input value={form.footerContactSectionTitle} onChange={(e) => onChange({ ...form, footerContactSectionTitle: e.target.value })} />
        </div>
        <div className="field">
          <label>Telif metni (suffix)</label>
          <input value={form.footerCopyrightSuffix} onChange={(e) => onChange({ ...form, footerCopyrightSuffix: e.target.value })} placeholder="Tüm hakları saklıdır." />
        </div>
      </div>
      <div className="form-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
        <div className="field">
          <label>Adres etiketi</label>
          <input value={form.footerAddressLabel} onChange={(e) => onChange({ ...form, footerAddressLabel: e.target.value })} />
        </div>
        <div className="field">
          <label>Telefon etiketi</label>
          <input value={form.footerPhoneLabel} onChange={(e) => onChange({ ...form, footerPhoneLabel: e.target.value })} />
        </div>
        <div className="field">
          <label>E-posta etiketi</label>
          <input value={form.footerEmailLabel} onChange={(e) => onChange({ ...form, footerEmailLabel: e.target.value })} />
        </div>
        <div className="field">
          <label>Çalışma saatleri etiketi</label>
          <input value={form.footerWorkingHoursLabel} onChange={(e) => onChange({ ...form, footerWorkingHoursLabel: e.target.value })} />
        </div>
      </div>

      <p className="field-hint" style={{ marginBottom: 8 }}>Hızlı linkler</p>
      {form.footerQuickLinks.map((link, index) => (
        <div key={index} className="form-grid card" style={{ gridTemplateColumns: '1fr 1fr auto', marginBottom: 8, padding: 12, alignItems: 'end' }}>
          <div className="field">
            <label>Metin</label>
            <input value={link.label} onChange={(e) => onChange({ ...form, footerQuickLinks: patchList(form.footerQuickLinks, index, { label: e.target.value }) })} />
          </div>
          <div className="field">
            <label>Link</label>
            <input value={link.href} onChange={(e) => onChange({ ...form, footerQuickLinks: patchList(form.footerQuickLinks, index, { href: e.target.value }) })} />
          </div>
          <button type="button" className="btn btn-ghost" onClick={() => onChange({ ...form, footerQuickLinks: form.footerQuickLinks.filter((_, i) => i !== index) })}>Sil</button>
        </div>
      ))}
      <button type="button" className="btn btn-secondary" style={{ marginBottom: 16 }} onClick={() => onChange({ ...form, footerQuickLinks: [...form.footerQuickLinks, emptyFooterLink()] })}>
        + Hızlı link ekle
      </button>

      <p className="field-hint" style={{ marginBottom: 8 }}>Müşteri hizmetleri linkleri</p>
      {form.footerCustomerServiceLinks.map((link, index) => (
        <div key={index} className="form-grid card" style={{ gridTemplateColumns: '1fr 1fr auto', marginBottom: 8, padding: 12, alignItems: 'end' }}>
          <div className="field">
            <label>Metin</label>
            <input value={link.label} onChange={(e) => onChange({ ...form, footerCustomerServiceLinks: patchList(form.footerCustomerServiceLinks, index, { label: e.target.value }) })} />
          </div>
          <div className="field">
            <label>Link</label>
            <input value={link.href} onChange={(e) => onChange({ ...form, footerCustomerServiceLinks: patchList(form.footerCustomerServiceLinks, index, { href: e.target.value }) })} />
          </div>
          <button type="button" className="btn btn-ghost" onClick={() => onChange({ ...form, footerCustomerServiceLinks: form.footerCustomerServiceLinks.filter((_, i) => i !== index) })}>Sil</button>
        </div>
      ))}
      <button type="button" className="btn btn-secondary" style={{ marginBottom: 16 }} onClick={() => onChange({ ...form, footerCustomerServiceLinks: [...form.footerCustomerServiceLinks, emptyFooterLink()] })}>
        + Müşteri hizmeti linki ekle
      </button>
      </>
    );
  }

  return (
    <>
      <h4 className="site-settings-subtitle">404 sayfası</h4>
      <div className="form-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <div className="field">
          <label>Başlık</label>
          <input value={form.notFoundTitle} onChange={(e) => onChange({ ...form, notFoundTitle: e.target.value })} />
        </div>
        <div className="field">
          <label>Geri dön link metni</label>
          <input value={form.notFoundBackLinkLabel} onChange={(e) => onChange({ ...form, notFoundBackLinkLabel: e.target.value })} />
        </div>
      </div>
      <div className="field">
        <label>Açıklama</label>
        <textarea rows={2} value={form.notFoundDescription} onChange={(e) => onChange({ ...form, notFoundDescription: e.target.value })} />
      </div>
      <div className="form-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <div className="field">
          <label>Birincil buton metni</label>
          <input value={form.notFoundPrimaryButtonLabel} onChange={(e) => onChange({ ...form, notFoundPrimaryButtonLabel: e.target.value })} />
        </div>
        <div className="field">
          <label>Birincil buton linki</label>
          <input value={form.notFoundPrimaryButtonHref} onChange={(e) => onChange({ ...form, notFoundPrimaryButtonHref: e.target.value })} />
        </div>
        <div className="field">
          <label>İkincil buton metni</label>
          <input value={form.notFoundSecondaryButtonLabel} onChange={(e) => onChange({ ...form, notFoundSecondaryButtonLabel: e.target.value })} />
        </div>
        <div className="field">
          <label>İkincil buton linki</label>
          <input value={form.notFoundSecondaryButtonHref} onChange={(e) => onChange({ ...form, notFoundSecondaryButtonHref: e.target.value })} />
        </div>
      </div>
    </>
  );
}
