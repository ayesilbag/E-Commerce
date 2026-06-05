/** Mağaza sayfa akışıyla aynı sırada — admin site ayarları navigasyonu */
export const SITE_SETTINGS_SECTIONS = [
  { id: 'genel', label: 'Genel', path: '—' },
  { id: 'marka-tema', label: 'Marka & Tema', path: '—' },
  { id: 'seo-genel', label: 'SEO (Genel)', path: '<head>' },
  { id: 'navbar', label: 'Navbar', path: 'Tüm sayfalar' },
  { id: 'anasayfa', label: 'Anasayfa', path: '/' },
  { id: 'magaza-sayfalari', label: 'Mağaza & Sayfalar', path: '/shop …' },
  { id: 'iletisim', label: 'İletişim', path: '/contact' },
  { id: 'yasal', label: 'Yasal Sayfalar', path: '/about …' },
  { id: 'sepet-odeme', label: 'Sepet & Ödeme', path: '/checkout …' },
  { id: 'footer', label: 'Footer', path: 'Alt bilgi' },
  { id: 'diger', label: '404 & Diğer', path: '*' },
] as const;

export type SiteSettingsSectionId = (typeof SITE_SETTINGS_SECTIONS)[number]['id'];
