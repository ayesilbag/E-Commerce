import { getLegalPath, type LegalSlug } from '@/constants/legal-pages';
import type { PaymentCompliance, SiteLegalPage } from '@/types';

export function resolveLegalPath(
  slug: LegalSlug,
  _legalPages?: SiteLegalPage[] | null
): string {
  return getLegalPath(slug);
}

const TITLE_FIELDS: Record<LegalSlug, keyof PaymentCompliance> = {
  hakkimizda: 'aboutPageTitle',
  'on-bilgilendirme-formu': 'preInformationFormPageTitle',
  'teslimat-ve-iade': 'deliveryReturnsPageTitle',
  gizlilik: 'privacyPolicyPageTitle',
  'mesafeli-satis': 'distanceSellingAgreementPageTitle',
};

const CONTENT_FIELDS: Record<LegalSlug, keyof PaymentCompliance> = {
  hakkimizda: 'aboutPageContent',
  'on-bilgilendirme-formu': 'preInformationFormPageContent',
  'teslimat-ve-iade': 'deliveryReturnsPageContent',
  gizlilik: 'privacyPolicyPageContent',
  'mesafeli-satis': 'distanceSellingAgreementPageContent',
};

export function resolveLegalTitle(
  slug: LegalSlug,
  legalPages: SiteLegalPage[] | undefined | null,
  compliance?: PaymentCompliance | null
): string | null {
  const fromPage = legalPages?.find((p) => p.slug === slug)?.title?.trim();
  if (fromPage) return fromPage;

  const key = TITLE_FIELDS[slug];
  const fromCompliance = compliance?.[key];
  if (typeof fromCompliance === 'string' && fromCompliance.trim()) {
    return fromCompliance.trim();
  }

  return null;
}

export const PAYMENT_LEGAL_LINKS: { slug: LegalSlug }[] = [
  { slug: 'hakkimizda' },
  { slug: 'on-bilgilendirme-formu' },
  { slug: 'teslimat-ve-iade' },
  { slug: 'gizlilik' },
  { slug: 'mesafeli-satis' },
];

export function getLegalFallbackContent(
  slug: LegalSlug,
  compliance?: PaymentCompliance | null
): string | null {
  const key = CONTENT_FIELDS[slug];
  const value = compliance?.[key];
  return typeof value === 'string' && value.trim() ? value : null;
}

export function resolveLegalPageContent(
  slug: LegalSlug,
  compliance?: PaymentCompliance | null,
  legalPages?: SiteLegalPage[] | null
): { title: string | null; content: string | null } {
  const page = legalPages?.find((p) => p.slug === slug);
  const title = page?.title?.trim() || resolveLegalTitle(slug, legalPages, compliance);
  const content = page?.content?.trim() || getLegalFallbackContent(slug, compliance);

  return { title, content: content ?? null };
}
