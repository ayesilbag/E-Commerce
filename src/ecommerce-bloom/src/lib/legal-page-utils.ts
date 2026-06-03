import { getLegalPath, type LegalSlug } from '@/constants/legal-pages';
import type { PaymentCompliance, SiteLegalPage } from '@/types';

/** Storefront uses English paths; API slug is only for content fetch. */
export function resolveLegalPath(
  slug: LegalSlug,
  _legalPages?: SiteLegalPage[] | null
): string {
  return getLegalPath(slug);
}

export function resolveLegalTitle(
  slug: LegalSlug,
  legalPages: SiteLegalPage[] | undefined | null,
  fallback: string
): string {
  return legalPages?.find((p) => p.slug === slug)?.title ?? fallback;
}

export const PAYMENT_LEGAL_LINKS: { slug: LegalSlug; defaultTitle: string }[] = [
  { slug: 'hakkimizda', defaultTitle: 'Hakkımızda' },
  { slug: 'on-bilgilendirme-formu', defaultTitle: 'Ön Bilgilendirme Formu' },
  { slug: 'teslimat-ve-iade', defaultTitle: 'Teslimat ve İade' },
  { slug: 'gizlilik', defaultTitle: 'Gizlilik Politikası' },
  { slug: 'mesafeli-satis', defaultTitle: 'Mesafeli Satış Sözleşmesi' },
];

const FALLBACK_CONTENT_KEYS: Record<
  LegalSlug,
  keyof Pick<
    PaymentCompliance,
    | 'aboutPageContent'
    | 'preInformationFormPageContent'
    | 'deliveryReturnsPageContent'
    | 'privacyPolicyPageContent'
    | 'distanceSellingAgreementPageContent'
  >
> = {
  hakkimizda: 'aboutPageContent',
  'on-bilgilendirme-formu': 'preInformationFormPageContent',
  'teslimat-ve-iade': 'deliveryReturnsPageContent',
  gizlilik: 'privacyPolicyPageContent',
  'mesafeli-satis': 'distanceSellingAgreementPageContent',
};

export function getLegalFallbackContent(
  slug: LegalSlug,
  compliance?: PaymentCompliance | null
): string | null {
  const key = FALLBACK_CONTENT_KEYS[slug];
  const value = compliance?.[key];
  return value?.trim() ? value : null;
}

export function resolveLegalPageContent(
  slug: LegalSlug,
  compliance?: PaymentCompliance | null,
  legalPages?: SiteLegalPage[] | null
): { title: string; content: string | null } {
  const page = legalPages?.find((p) => p.slug === slug);
  const title =
    page?.title ??
    PAYMENT_LEGAL_LINKS.find((l) => l.slug === slug)?.defaultTitle ??
    'Yasal Sayfa';
  const content = page?.content?.trim() || getLegalFallbackContent(slug, compliance);

  return { title, content: content ?? null };
}
