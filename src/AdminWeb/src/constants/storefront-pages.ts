/** Backend SiteStorefrontPages ile aynı sırada */
export const STOREFRONT_PAGE_SEO_DEFINITIONS = [
  { pageKey: 'home', label: 'Anasayfa', path: '/' },
  { pageKey: 'shop', label: 'Mağaza', path: '/shop' },
  { pageKey: 'contact', label: 'İletişim', path: '/contact' },
  { pageKey: 'about', label: 'Hakkımızda', path: '/about' },
  { pageKey: 'pre-information', label: 'Ön Bilgilendirme Formu', path: '/pre-information' },
  { pageKey: 'delivery-returns', label: 'Teslimat ve İade', path: '/delivery-returns' },
  { pageKey: 'privacy', label: 'Gizlilik Sözleşmesi', path: '/privacy' },
  { pageKey: 'distance-selling', label: 'Mesafeli Satış Sözleşmesi', path: '/distance-selling' },
  { pageKey: 'login', label: 'Giriş', path: '/login' },
  { pageKey: 'register', label: 'Kayıt', path: '/register' },
  { pageKey: 'checkout', label: 'Ödeme', path: '/checkout' },
  { pageKey: 'wishlist', label: 'Favoriler', path: '/wishlist' },
] as const;

export type PageSeoFormRow = {
  pageKey: string;
  label: string;
  path: string;
  title: string;
  description: string;
  keywords: string;
  ogImageUrl: string;
};

export function emptyPageSeoRows(): PageSeoFormRow[] {
  return STOREFRONT_PAGE_SEO_DEFINITIONS.map((p) => ({
    pageKey: p.pageKey,
    label: p.label,
    path: p.path,
    title: '',
    description: '',
    keywords: '',
    ogImageUrl: '',
  }));
}

export function mergePageSeoFromApi(
  pages: Array<{
    pageKey: string;
    label: string;
    path: string;
    title?: string | null;
    description?: string | null;
    keywords?: string | null;
    ogImageUrl?: string | null;
  }> | undefined,
): PageSeoFormRow[] {
  const defaults = emptyPageSeoRows();
  if (!pages?.length) return defaults;

  return defaults.map((def) => {
    const fromApi = pages.find((p) => p.pageKey === def.pageKey);
    return {
      ...def,
      label: fromApi?.label ?? def.label,
      path: fromApi?.path ?? def.path,
      title: fromApi?.title ?? '',
      description: fromApi?.description ?? '',
      keywords: fromApi?.keywords ?? '',
      ogImageUrl: fromApi?.ogImageUrl ?? '',
    };
  });
}
