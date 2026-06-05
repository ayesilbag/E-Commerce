import { emptyUiCopyForm, mergeUiCopyFromApi, uiCopyToApi, type UiCopyForm } from './storefront-ui-copy';
import { appPagesFromApi, appPagesToApi, emptyAppPagesJson } from './storefront-app-pages';

export type HeroSlideForm = {
  badge: string;
  title: string;
  highlight: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  ctaSecondaryLabel: string;
  ctaSecondaryHref: string;
  imageUrl: string;
  backgroundClass: string;
};

export type TrustItemForm = {
  icon: string;
  title: string;
  subtitle: string;
};

export type CampaignBannerForm = {
  size: 'large' | 'small';
  badge: string;
  title: string;
  subtitle: string;
  linkLabel: string;
  href: string;
  imageUrl: string;
  gradientClass: string;
};

export type ProductRowForm = {
  title: string;
  subtitle: string;
  viewAllHref: string;
  sort: string;
  limit: number;
};

export type FooterLinkForm = {
  label: string;
  href: string;
};

export type StorefrontContentForm = {
  footerDescription: string;
  heroSlides: HeroSlideForm[];
  trustItems: TrustItemForm[];
  campaignBanners: CampaignBannerForm[];
  productRows: ProductRowForm[];
  newsletterTitle: string;
  newsletterDescription: string;
  newsletterPlaceholder: string;
  newsletterButtonLabel: string;
  newsletterDisclaimer: string;
  newsletterSubmittingLabel: string;
  newsletterSuccessTitle: string;
  newsletterSuccessDescription: string;
  newsletterErrorTitle: string;
  newsletterEmptyEmailMessage: string;
  faqTitle: string;
  faqDescription: string;
  faqItems: Array<{ question: string; answer: string }>;
  faqFooterText: string;
  faqFooterButtonLabel: string;
  faqFooterButtonHref: string;
  contactMapTitle: string;
  contactMapDescription: string;
  contactMapEmbedUrl: string;
  contactMapEmptyMessage: string;
  footerQuickLinksTitle: string;
  footerCustomerServiceTitle: string;
  footerContactSectionTitle: string;
  footerCopyrightSuffix: string;
  footerAddressLabel: string;
  footerPhoneLabel: string;
  footerEmailLabel: string;
  footerWorkingHoursLabel: string;
  footerQuickLinks: FooterLinkForm[];
  footerCustomerServiceLinks: FooterLinkForm[];
  notFoundTitle: string;
  notFoundDescription: string;
  notFoundPrimaryButtonLabel: string;
  notFoundPrimaryButtonHref: string;
  notFoundSecondaryButtonLabel: string;
  notFoundSecondaryButtonHref: string;
  notFoundBackLinkLabel: string;
  uiCopy: UiCopyForm;
  appPagesJson: string;
};

export type StorefrontContentApi = {
  footerDescription?: string | null;
  heroSlides?: Array<{
    badge?: string;
    title?: string;
    highlight?: string;
    subtitle?: string;
    ctaLabel?: string;
    ctaHref?: string;
    ctaSecondaryLabel?: string | null;
    ctaSecondaryHref?: string | null;
    imageUrl?: string;
    backgroundClass?: string | null;
  }>;
  trustItems?: TrustItemForm[];
  campaignBanners?: Array<{
    size?: 'large' | 'small';
    badge?: string | null;
    title?: string;
    subtitle?: string | null;
    linkLabel?: string;
    href?: string;
    imageUrl?: string;
    gradientClass?: string | null;
  }>;
  productRows?: Array<{
    title?: string;
    subtitle?: string | null;
    viewAllHref?: string;
    sort?: string;
    limit?: number;
  }>;
  newsletter?: {
    title?: string;
    description?: string;
    placeholder?: string;
    buttonLabel?: string;
    disclaimer?: string | null;
    submittingLabel?: string | null;
    successTitle?: string | null;
    successDescription?: string | null;
    errorTitle?: string | null;
    emptyEmailMessage?: string | null;
  } | null;
  faq?: {
    title?: string;
    description?: string | null;
    items?: Array<{ question: string; answer: string }>;
    footerText?: string | null;
    footerButtonLabel?: string | null;
    footerButtonHref?: string | null;
  } | null;
  contactMap?: {
    title?: string;
    description?: string | null;
    embedUrl?: string | null;
    emptyMessage?: string | null;
  } | null;
  footerNav?: {
    quickLinksTitle?: string | null;
    customerServiceTitle?: string | null;
    contactSectionTitle?: string | null;
    copyrightSuffix?: string | null;
    addressLabel?: string | null;
    phoneLabel?: string | null;
    emailLabel?: string | null;
    workingHoursLabel?: string | null;
    quickLinks?: FooterLinkForm[];
    customerServiceLinks?: FooterLinkForm[];
  } | null;
  notFound?: {
    title?: string;
    description?: string | null;
    primaryButtonLabel?: string | null;
    primaryButtonHref?: string | null;
    secondaryButtonLabel?: string | null;
    secondaryButtonHref?: string | null;
    backLinkLabel?: string | null;
  } | null;
  legalPageUi?: ReturnType<typeof uiCopyToApi>['legalPageUi'];
  contactPageUi?: ReturnType<typeof uiCopyToApi>['contactPageUi'];
  checkoutConsent?: ReturnType<typeof uiCopyToApi>['checkoutConsent'];
  navbar?: ReturnType<typeof uiCopyToApi>['navbar'];
  appPagesUi?: Record<string, unknown> | null;
};

const emptyHeroSlide = (): HeroSlideForm => ({
  badge: '',
  title: '',
  highlight: '',
  subtitle: '',
  ctaLabel: '',
  ctaHref: '/shop',
  ctaSecondaryLabel: '',
  ctaSecondaryHref: '',
  imageUrl: '',
  backgroundClass: 'from-primary/10 to-primary/20',
});

const emptyTrustItem = (): TrustItemForm => ({
  icon: 'truck',
  title: '',
  subtitle: '',
});

const emptyCampaignBanner = (size: 'large' | 'small' = 'small'): CampaignBannerForm => ({
  size,
  badge: '',
  title: '',
  subtitle: '',
  linkLabel: '',
  href: '/shop',
  imageUrl: '',
  gradientClass: size === 'large' ? 'from-primary to-primary/80' : 'from-teal-500 to-teal-700',
});

const emptyProductRow = (): ProductRowForm => ({
  title: '',
  subtitle: '',
  viewAllHref: '/shop',
  sort: 'featured',
  limit: 12,
});

const emptyFooterLink = (): FooterLinkForm => ({ label: '', href: '/' });

export function emptyStorefrontContentForm(): StorefrontContentForm {
  return {
    footerDescription: '',
    heroSlides: [],
    trustItems: [],
    campaignBanners: [],
    productRows: [],
    newsletterTitle: '',
    newsletterDescription: '',
    newsletterPlaceholder: '',
    newsletterButtonLabel: '',
    newsletterDisclaimer: '',
    newsletterSubmittingLabel: '',
    newsletterSuccessTitle: '',
    newsletterSuccessDescription: '',
    newsletterErrorTitle: '',
    newsletterEmptyEmailMessage: '',
    faqTitle: '',
    faqDescription: '',
    faqItems: [],
    faqFooterText: '',
    faqFooterButtonLabel: '',
    faqFooterButtonHref: '',
    contactMapTitle: '',
    contactMapDescription: '',
    contactMapEmbedUrl: '',
    contactMapEmptyMessage: '',
    footerQuickLinksTitle: '',
    footerCustomerServiceTitle: '',
    footerContactSectionTitle: '',
    footerCopyrightSuffix: '',
    footerAddressLabel: '',
    footerPhoneLabel: '',
    footerEmailLabel: '',
    footerWorkingHoursLabel: '',
    footerQuickLinks: [],
    footerCustomerServiceLinks: [],
    notFoundTitle: '',
    notFoundDescription: '',
    notFoundPrimaryButtonLabel: '',
    notFoundPrimaryButtonHref: '/',
    notFoundSecondaryButtonLabel: '',
    notFoundSecondaryButtonHref: '/shop',
    notFoundBackLinkLabel: '',
    uiCopy: emptyUiCopyForm(),
    appPagesJson: emptyAppPagesJson(),
  };
}

export function mergeStorefrontContentFromApi(data?: StorefrontContentApi | null): StorefrontContentForm {
  if (!data) return emptyStorefrontContentForm();

  return {
    footerDescription: data.footerDescription ?? '',
    heroSlides: (data.heroSlides ?? []).map((s) => ({
      badge: s.badge ?? '',
      title: s.title ?? '',
      highlight: s.highlight ?? '',
      subtitle: s.subtitle ?? '',
      ctaLabel: s.ctaLabel ?? '',
      ctaHref: s.ctaHref ?? '/shop',
      ctaSecondaryLabel: s.ctaSecondaryLabel ?? '',
      ctaSecondaryHref: s.ctaSecondaryHref ?? '',
      imageUrl: s.imageUrl ?? '',
      backgroundClass: s.backgroundClass ?? 'from-primary/10 to-primary/20',
    })),
    trustItems: (data.trustItems ?? []).map((t) => ({
      icon: t.icon ?? 'truck',
      title: t.title ?? '',
      subtitle: t.subtitle ?? '',
    })),
    campaignBanners: (data.campaignBanners ?? []).map((b) => ({
      size: b.size === 'large' ? 'large' : 'small',
      badge: b.badge ?? '',
      title: b.title ?? '',
      subtitle: b.subtitle ?? '',
      linkLabel: b.linkLabel ?? '',
      href: b.href ?? '/shop',
      imageUrl: b.imageUrl ?? '',
      gradientClass: b.gradientClass ?? '',
    })),
    productRows: (data.productRows ?? []).map((r) => ({
      title: r.title ?? '',
      subtitle: r.subtitle ?? '',
      viewAllHref: r.viewAllHref ?? '/shop',
      sort: r.sort ?? 'featured',
      limit: r.limit ?? 12,
    })),
    newsletterTitle: data.newsletter?.title ?? '',
    newsletterDescription: data.newsletter?.description ?? '',
    newsletterPlaceholder: data.newsletter?.placeholder ?? '',
    newsletterButtonLabel: data.newsletter?.buttonLabel ?? '',
    newsletterDisclaimer: data.newsletter?.disclaimer ?? '',
    newsletterSubmittingLabel: data.newsletter?.submittingLabel ?? '',
    newsletterSuccessTitle: data.newsletter?.successTitle ?? '',
    newsletterSuccessDescription: data.newsletter?.successDescription ?? '',
    newsletterErrorTitle: data.newsletter?.errorTitle ?? '',
    newsletterEmptyEmailMessage: data.newsletter?.emptyEmailMessage ?? '',
    faqTitle: data.faq?.title ?? '',
    faqDescription: data.faq?.description ?? '',
    faqItems: (data.faq?.items ?? []).map((i) => ({
      question: i.question ?? '',
      answer: i.answer ?? '',
    })),
    faqFooterText: data.faq?.footerText ?? '',
    faqFooterButtonLabel: data.faq?.footerButtonLabel ?? '',
    faqFooterButtonHref: data.faq?.footerButtonHref ?? '',
    contactMapTitle: data.contactMap?.title ?? '',
    contactMapDescription: data.contactMap?.description ?? '',
    contactMapEmbedUrl: data.contactMap?.embedUrl ?? '',
    contactMapEmptyMessage: data.contactMap?.emptyMessage ?? '',
    footerQuickLinksTitle: data.footerNav?.quickLinksTitle ?? '',
    footerCustomerServiceTitle: data.footerNav?.customerServiceTitle ?? '',
    footerContactSectionTitle: data.footerNav?.contactSectionTitle ?? '',
    footerCopyrightSuffix: data.footerNav?.copyrightSuffix ?? '',
    footerAddressLabel: data.footerNav?.addressLabel ?? '',
    footerPhoneLabel: data.footerNav?.phoneLabel ?? '',
    footerEmailLabel: data.footerNav?.emailLabel ?? '',
    footerWorkingHoursLabel: data.footerNav?.workingHoursLabel ?? '',
    footerQuickLinks: (data.footerNav?.quickLinks ?? []).map((l) => ({
      label: l.label ?? '',
      href: l.href ?? '/',
    })),
    footerCustomerServiceLinks: (data.footerNav?.customerServiceLinks ?? []).map((l) => ({
      label: l.label ?? '',
      href: l.href ?? '/',
    })),
    notFoundTitle: data.notFound?.title ?? '',
    notFoundDescription: data.notFound?.description ?? '',
    notFoundPrimaryButtonLabel: data.notFound?.primaryButtonLabel ?? '',
    notFoundPrimaryButtonHref: data.notFound?.primaryButtonHref ?? '/',
    notFoundSecondaryButtonLabel: data.notFound?.secondaryButtonLabel ?? '',
    notFoundSecondaryButtonHref: data.notFound?.secondaryButtonHref ?? '/shop',
    notFoundBackLinkLabel: data.notFound?.backLinkLabel ?? '',
    uiCopy: mergeUiCopyFromApi(data),
    appPagesJson: appPagesFromApi(data.appPagesUi),
  };
}

export function storefrontContentToApi(form: StorefrontContentForm): StorefrontContentApi {
  const hasNewsletter = Boolean(form.newsletterTitle.trim());
  const hasFaq = Boolean(form.faqTitle.trim() || form.faqItems.some((i) => i.question.trim()));
  const hasContactMap = Boolean(form.contactMapTitle.trim());
  const hasFooterNav =
    Boolean(form.footerQuickLinksTitle.trim()) ||
    Boolean(form.footerCustomerServiceTitle.trim()) ||
    Boolean(form.footerContactSectionTitle.trim()) ||
    Boolean(form.footerCopyrightSuffix.trim()) ||
    form.footerQuickLinks.some((l) => l.label.trim()) ||
    form.footerCustomerServiceLinks.some((l) => l.label.trim());
  const hasNotFound = Boolean(form.notFoundTitle.trim());

  const api: StorefrontContentApi = {
    footerDescription: form.footerDescription.trim() || null,
    heroSlides: form.heroSlides
      .filter((s) => s.title.trim() || s.imageUrl.trim())
      .map((s) => ({
        badge: s.badge.trim(),
        title: s.title.trim(),
        highlight: s.highlight.trim(),
        subtitle: s.subtitle.trim(),
        ctaLabel: s.ctaLabel.trim(),
        ctaHref: s.ctaHref.trim() || '/shop',
        ctaSecondaryLabel: s.ctaSecondaryLabel.trim() || null,
        ctaSecondaryHref: s.ctaSecondaryHref.trim() || null,
        imageUrl: s.imageUrl.trim(),
        backgroundClass: s.backgroundClass.trim() || null,
      })),
    trustItems: form.trustItems
      .filter((t) => t.title.trim())
      .map((t) => ({
        icon: t.icon.trim() || 'truck',
        title: t.title.trim(),
        subtitle: t.subtitle.trim(),
      })),
    campaignBanners: form.campaignBanners
      .filter((b) => b.title.trim())
      .map((b) => ({
        size: b.size,
        badge: b.badge.trim() || null,
        title: b.title.trim(),
        subtitle: b.subtitle.trim() || null,
        linkLabel: b.linkLabel.trim(),
        href: b.href.trim() || '/shop',
        imageUrl: b.imageUrl.trim(),
        gradientClass: b.gradientClass.trim() || null,
      })),
    productRows: form.productRows
      .filter((r) => r.title.trim())
      .map((r) => ({
        title: r.title.trim(),
        subtitle: r.subtitle.trim() || null,
        viewAllHref: r.viewAllHref.trim() || '/shop',
        sort: r.sort.trim() || 'featured',
        limit: r.limit > 0 ? r.limit : 12,
      })),
    newsletter: hasNewsletter
      ? {
          title: form.newsletterTitle.trim(),
          description: form.newsletterDescription.trim(),
          placeholder: form.newsletterPlaceholder.trim(),
          buttonLabel: form.newsletterButtonLabel.trim(),
          disclaimer: form.newsletterDisclaimer.trim() || null,
          submittingLabel: form.newsletterSubmittingLabel.trim() || null,
          successTitle: form.newsletterSuccessTitle.trim() || null,
          successDescription: form.newsletterSuccessDescription.trim() || null,
          errorTitle: form.newsletterErrorTitle.trim() || null,
          emptyEmailMessage: form.newsletterEmptyEmailMessage.trim() || null,
        }
      : null,
    faq: hasFaq
      ? {
          title: form.faqTitle.trim(),
          description: form.faqDescription.trim() || null,
          items: form.faqItems
            .filter((i) => i.question.trim())
            .map((i) => ({
              question: i.question.trim(),
              answer: i.answer.trim(),
            })),
          footerText: form.faqFooterText.trim() || null,
          footerButtonLabel: form.faqFooterButtonLabel.trim() || null,
          footerButtonHref: form.faqFooterButtonHref.trim() || null,
        }
      : null,
    contactMap: hasContactMap
      ? {
          title: form.contactMapTitle.trim(),
          description: form.contactMapDescription.trim() || null,
          embedUrl: form.contactMapEmbedUrl.trim() || null,
          emptyMessage: form.contactMapEmptyMessage.trim() || null,
        }
      : null,
    footerNav: hasFooterNav
      ? {
          quickLinksTitle: form.footerQuickLinksTitle.trim() || null,
          customerServiceTitle: form.footerCustomerServiceTitle.trim() || null,
          contactSectionTitle: form.footerContactSectionTitle.trim() || null,
          copyrightSuffix: form.footerCopyrightSuffix.trim() || null,
          addressLabel: form.footerAddressLabel.trim() || null,
          phoneLabel: form.footerPhoneLabel.trim() || null,
          emailLabel: form.footerEmailLabel.trim() || null,
          workingHoursLabel: form.footerWorkingHoursLabel.trim() || null,
          quickLinks: form.footerQuickLinks
            .filter((l) => l.label.trim() && l.href.trim())
            .map((l) => ({ label: l.label.trim(), href: l.href.trim() })),
          customerServiceLinks: form.footerCustomerServiceLinks
            .filter((l) => l.label.trim() && l.href.trim())
            .map((l) => ({ label: l.label.trim(), href: l.href.trim() })),
        }
      : null,
    notFound: hasNotFound
      ? {
          title: form.notFoundTitle.trim(),
          description: form.notFoundDescription.trim() || null,
          primaryButtonLabel: form.notFoundPrimaryButtonLabel.trim() || null,
          primaryButtonHref: form.notFoundPrimaryButtonHref.trim() || '/',
          secondaryButtonLabel: form.notFoundSecondaryButtonLabel.trim() || null,
          secondaryButtonHref: form.notFoundSecondaryButtonHref.trim() || '/shop',
          backLinkLabel: form.notFoundBackLinkLabel.trim() || null,
        }
      : null,
    ...uiCopyToApi(form.uiCopy),
    appPagesUi: (() => {
      try {
        return appPagesToApi(form.appPagesJson);
      } catch {
        return null;
      }
    })(),
  };

  return api;
}

export { emptyHeroSlide, emptyTrustItem, emptyCampaignBanner, emptyProductRow, emptyFooterLink };
