/** API slug — backend `GET .../legal-pages/{slug}` (UI_SITE_SETTINGS.md) */
export const LEGAL_SLUGS = [
  'hakkimizda',
  'on-bilgilendirme-formu',
  'teslimat-ve-iade',
  'gizlilik',
  'mesafeli-satis',
] as const;

export type LegalSlug = (typeof LEGAL_SLUGS)[number];

/** Storefront routes (English) */
export const LEGAL_PAGE_ROUTES: { slug: LegalSlug; path: string }[] = [
  { slug: 'hakkimizda', path: '/about' },
  { slug: 'on-bilgilendirme-formu', path: '/pre-information' },
  { slug: 'teslimat-ve-iade', path: '/delivery-returns' },
  { slug: 'gizlilik', path: '/privacy' },
  { slug: 'mesafeli-satis', path: '/distance-selling' },
];

/** Legacy paths → English storefront routes */
export const LEGACY_LEGAL_REDIRECTS: { from: string; to: string }[] = [
  { from: '/hakkimizda', to: '/about' },
  { from: '/on-bilgilendirme-formu', to: '/pre-information' },
  { from: '/on-bilgilendirme', to: '/pre-information' },
  { from: '/teslimat-ve-iade', to: '/delivery-returns' },
  { from: '/gizlilik', to: '/privacy' },
  { from: '/mesafeli-satis', to: '/distance-selling' },
];

export function isLegalSlug(slug: string): slug is LegalSlug {
  return (LEGAL_SLUGS as readonly string[]).includes(slug);
}

export function getLegalPath(slug: LegalSlug): string {
  return LEGAL_PAGE_ROUTES.find((r) => r.slug === slug)?.path ?? `/${slug}`;
}
