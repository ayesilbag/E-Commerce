type FooterLinkForm = {
  label: string;
  href: string;
};

type UiCopyApiData = {
  legalPageUi?: {
    emptyStateTitle?: string | null;
    emptyStateDescription?: string | null;
    tocTitle?: string | null;
    contactBlockTitle?: string | null;
    contactBlockDescription?: string | null;
    emailLabel?: string | null;
    phoneLabel?: string | null;
    contactFormButtonLabel?: string | null;
    contactFormHref?: string | null;
  } | null;
  contactPageUi?: {
    infoSectionTitle?: string | null;
    formSectionTitle?: string | null;
    formIntro?: string | null;
    locationLabel?: string | null;
    emailLabel?: string | null;
    phoneLabel?: string | null;
    hoursLabel?: string | null;
    socialSectionTitle?: string | null;
    nameLabel?: string | null;
    emailFieldLabel?: string | null;
    subjectLabel?: string | null;
    messageLabel?: string | null;
    namePlaceholder?: string | null;
    emailPlaceholder?: string | null;
    subjectPlaceholder?: string | null;
    messagePlaceholder?: string | null;
    submitButtonLabel?: string | null;
    submittingLabel?: string | null;
    submitSuccessTitle?: string | null;
    submitSuccessDescription?: string | null;
    submitErrorTitle?: string | null;
    submitErrorFallback?: string | null;
  } | null;
  checkoutConsent?: {
    suffixText?: string | null;
    links?: Array<{ slug?: string; label?: string }>;
  } | null;
  navbar?: {
    shopSectionTitle?: string | null;
    accountSectionTitle?: string | null;
    searchPlaceholder?: string | null;
    categoriesLabel?: string | null;
    loginLabel?: string | null;
    accountLabel?: string | null;
    wishlistLabel?: string | null;
    cartLabel?: string | null;
    logoutLabel?: string | null;
    registerLabel?: string | null;
    greetingPrefix?: string | null;
    guestNameFallback?: string | null;
    primaryLinks?: FooterLinkForm[];
  } | null;
};

export type UiCopyForm = {
  legalEmptyStateTitle: string;
  legalEmptyStateDescription: string;
  legalTocTitle: string;
  legalContactBlockTitle: string;
  legalContactBlockDescription: string;
  legalEmailLabel: string;
  legalPhoneLabel: string;
  legalContactFormButtonLabel: string;
  legalContactFormHref: string;
  contactInfoSectionTitle: string;
  contactFormSectionTitle: string;
  contactFormIntro: string;
  contactLocationLabel: string;
  contactEmailLabel: string;
  contactPhoneLabel: string;
  contactHoursLabel: string;
  contactSocialSectionTitle: string;
  contactNameLabel: string;
  contactEmailFieldLabel: string;
  contactSubjectLabel: string;
  contactMessageLabel: string;
  contactNamePlaceholder: string;
  contactEmailPlaceholder: string;
  contactSubjectPlaceholder: string;
  contactMessagePlaceholder: string;
  contactSubmitButtonLabel: string;
  contactSubmittingLabel: string;
  contactSubmitSuccessTitle: string;
  contactSubmitSuccessDescription: string;
  contactSubmitErrorTitle: string;
  contactSubmitErrorFallback: string;
  checkoutConsentSuffix: string;
  checkoutConsentLinks: Array<{ slug: string; label: string }>;
  navbarShopSectionTitle: string;
  navbarAccountSectionTitle: string;
  navbarSearchPlaceholder: string;
  navbarCategoriesLabel: string;
  navbarLoginLabel: string;
  navbarAccountLabel: string;
  navbarWishlistLabel: string;
  navbarCartLabel: string;
  navbarLogoutLabel: string;
  navbarRegisterLabel: string;
  navbarGreetingPrefix: string;
  navbarGuestNameFallback: string;
  navbarPrimaryLinks: FooterLinkForm[];
};

export function emptyUiCopyForm(): UiCopyForm {
  return {
    legalEmptyStateTitle: '',
    legalEmptyStateDescription: '',
    legalTocTitle: '',
    legalContactBlockTitle: '',
    legalContactBlockDescription: '',
    legalEmailLabel: '',
    legalPhoneLabel: '',
    legalContactFormButtonLabel: '',
    legalContactFormHref: '/contact',
    contactInfoSectionTitle: '',
    contactFormSectionTitle: '',
    contactFormIntro: '',
    contactLocationLabel: '',
    contactEmailLabel: '',
    contactPhoneLabel: '',
    contactHoursLabel: '',
    contactSocialSectionTitle: '',
    contactNameLabel: '',
    contactEmailFieldLabel: '',
    contactSubjectLabel: '',
    contactMessageLabel: '',
    contactNamePlaceholder: '',
    contactEmailPlaceholder: '',
    contactSubjectPlaceholder: '',
    contactMessagePlaceholder: '',
    contactSubmitButtonLabel: '',
    contactSubmittingLabel: '',
    contactSubmitSuccessTitle: '',
    contactSubmitSuccessDescription: '',
    contactSubmitErrorTitle: '',
    contactSubmitErrorFallback: '',
    checkoutConsentSuffix: '',
    checkoutConsentLinks: [],
    navbarShopSectionTitle: '',
    navbarAccountSectionTitle: '',
    navbarSearchPlaceholder: '',
    navbarCategoriesLabel: '',
    navbarLoginLabel: '',
    navbarAccountLabel: '',
    navbarWishlistLabel: '',
    navbarCartLabel: '',
    navbarLogoutLabel: '',
    navbarRegisterLabel: '',
    navbarGreetingPrefix: '',
    navbarGuestNameFallback: '',
    navbarPrimaryLinks: [],
  };
}

export function mergeUiCopyFromApi(data?: UiCopyApiData | null): UiCopyForm {
  const empty = emptyUiCopyForm();
  if (!data) return empty;
  return {
    ...empty,
    legalEmptyStateTitle: data.legalPageUi?.emptyStateTitle ?? '',
    legalEmptyStateDescription: data.legalPageUi?.emptyStateDescription ?? '',
    legalTocTitle: data.legalPageUi?.tocTitle ?? '',
    legalContactBlockTitle: data.legalPageUi?.contactBlockTitle ?? '',
    legalContactBlockDescription: data.legalPageUi?.contactBlockDescription ?? '',
    legalEmailLabel: data.legalPageUi?.emailLabel ?? '',
    legalPhoneLabel: data.legalPageUi?.phoneLabel ?? '',
    legalContactFormButtonLabel: data.legalPageUi?.contactFormButtonLabel ?? '',
    legalContactFormHref: data.legalPageUi?.contactFormHref ?? '/contact',
    contactInfoSectionTitle: data.contactPageUi?.infoSectionTitle ?? '',
    contactFormSectionTitle: data.contactPageUi?.formSectionTitle ?? '',
    contactFormIntro: data.contactPageUi?.formIntro ?? '',
    contactLocationLabel: data.contactPageUi?.locationLabel ?? '',
    contactEmailLabel: data.contactPageUi?.emailLabel ?? '',
    contactPhoneLabel: data.contactPageUi?.phoneLabel ?? '',
    contactHoursLabel: data.contactPageUi?.hoursLabel ?? '',
    contactSocialSectionTitle: data.contactPageUi?.socialSectionTitle ?? '',
    contactNameLabel: data.contactPageUi?.nameLabel ?? '',
    contactEmailFieldLabel: data.contactPageUi?.emailFieldLabel ?? '',
    contactSubjectLabel: data.contactPageUi?.subjectLabel ?? '',
    contactMessageLabel: data.contactPageUi?.messageLabel ?? '',
    contactNamePlaceholder: data.contactPageUi?.namePlaceholder ?? '',
    contactEmailPlaceholder: data.contactPageUi?.emailPlaceholder ?? '',
    contactSubjectPlaceholder: data.contactPageUi?.subjectPlaceholder ?? '',
    contactMessagePlaceholder: data.contactPageUi?.messagePlaceholder ?? '',
    contactSubmitButtonLabel: data.contactPageUi?.submitButtonLabel ?? '',
    contactSubmittingLabel: data.contactPageUi?.submittingLabel ?? '',
    contactSubmitSuccessTitle: data.contactPageUi?.submitSuccessTitle ?? '',
    contactSubmitSuccessDescription: data.contactPageUi?.submitSuccessDescription ?? '',
    contactSubmitErrorTitle: data.contactPageUi?.submitErrorTitle ?? '',
    contactSubmitErrorFallback: data.contactPageUi?.submitErrorFallback ?? '',
    checkoutConsentSuffix: data.checkoutConsent?.suffixText ?? '',
    checkoutConsentLinks: (data.checkoutConsent?.links ?? []).map((l) => ({
      slug: l.slug ?? '',
      label: l.label ?? '',
    })),
    navbarShopSectionTitle: data.navbar?.shopSectionTitle ?? '',
    navbarAccountSectionTitle: data.navbar?.accountSectionTitle ?? '',
    navbarSearchPlaceholder: data.navbar?.searchPlaceholder ?? '',
    navbarCategoriesLabel: data.navbar?.categoriesLabel ?? '',
    navbarLoginLabel: data.navbar?.loginLabel ?? '',
    navbarAccountLabel: data.navbar?.accountLabel ?? '',
    navbarWishlistLabel: data.navbar?.wishlistLabel ?? '',
    navbarCartLabel: data.navbar?.cartLabel ?? '',
    navbarLogoutLabel: data.navbar?.logoutLabel ?? '',
    navbarRegisterLabel: data.navbar?.registerLabel ?? '',
    navbarGreetingPrefix: data.navbar?.greetingPrefix ?? '',
    navbarGuestNameFallback: data.navbar?.guestNameFallback ?? '',
    navbarPrimaryLinks: (data.navbar?.primaryLinks ?? []).map((l) => ({
      label: l.label ?? '',
      href: l.href ?? '/',
    })),
  };
}

export function uiCopyToApi(ui: UiCopyForm): UiCopyApiData {
  const hasLegalUi =
    ui.legalEmptyStateTitle.trim() ||
    ui.legalTocTitle.trim() ||
    ui.legalContactBlockTitle.trim();
  const hasContactUi =
    ui.contactInfoSectionTitle.trim() ||
    ui.contactFormSectionTitle.trim() ||
    ui.contactSubmitButtonLabel.trim();
  const hasCheckout =
    ui.checkoutConsentSuffix.trim() || ui.checkoutConsentLinks.some((l) => l.label.trim());
  const hasNavbar =
    ui.navbarShopSectionTitle.trim() ||
    ui.navbarSearchPlaceholder.trim() ||
    ui.navbarCategoriesLabel.trim() ||
    ui.navbarLoginLabel.trim() ||
    ui.navbarPrimaryLinks.some((l) => l.label.trim());

  return {
    legalPageUi: hasLegalUi
      ? {
          emptyStateTitle: ui.legalEmptyStateTitle.trim() || null,
          emptyStateDescription: ui.legalEmptyStateDescription.trim() || null,
          tocTitle: ui.legalTocTitle.trim() || null,
          contactBlockTitle: ui.legalContactBlockTitle.trim() || null,
          contactBlockDescription: ui.legalContactBlockDescription.trim() || null,
          emailLabel: ui.legalEmailLabel.trim() || null,
          phoneLabel: ui.legalPhoneLabel.trim() || null,
          contactFormButtonLabel: ui.legalContactFormButtonLabel.trim() || null,
          contactFormHref: ui.legalContactFormHref.trim() || '/contact',
        }
      : null,
    contactPageUi: hasContactUi
      ? {
          infoSectionTitle: ui.contactInfoSectionTitle.trim() || null,
          formSectionTitle: ui.contactFormSectionTitle.trim() || null,
          formIntro: ui.contactFormIntro.trim() || null,
          locationLabel: ui.contactLocationLabel.trim() || null,
          emailLabel: ui.contactEmailLabel.trim() || null,
          phoneLabel: ui.contactPhoneLabel.trim() || null,
          hoursLabel: ui.contactHoursLabel.trim() || null,
          socialSectionTitle: ui.contactSocialSectionTitle.trim() || null,
          nameLabel: ui.contactNameLabel.trim() || null,
          emailFieldLabel: ui.contactEmailFieldLabel.trim() || null,
          subjectLabel: ui.contactSubjectLabel.trim() || null,
          messageLabel: ui.contactMessageLabel.trim() || null,
          namePlaceholder: ui.contactNamePlaceholder.trim() || null,
          emailPlaceholder: ui.contactEmailPlaceholder.trim() || null,
          subjectPlaceholder: ui.contactSubjectPlaceholder.trim() || null,
          messagePlaceholder: ui.contactMessagePlaceholder.trim() || null,
          submitButtonLabel: ui.contactSubmitButtonLabel.trim() || null,
          submittingLabel: ui.contactSubmittingLabel.trim() || null,
          submitSuccessTitle: ui.contactSubmitSuccessTitle.trim() || null,
          submitSuccessDescription: ui.contactSubmitSuccessDescription.trim() || null,
          submitErrorTitle: ui.contactSubmitErrorTitle.trim() || null,
          submitErrorFallback: ui.contactSubmitErrorFallback.trim() || null,
        }
      : null,
    checkoutConsent: hasCheckout
      ? {
          suffixText: ui.checkoutConsentSuffix.trim() || null,
          links: ui.checkoutConsentLinks
            .filter((l) => l.label.trim() && l.slug.trim())
            .map((l) => ({ slug: l.slug.trim(), label: l.label.trim() })),
        }
      : null,
    navbar: hasNavbar
      ? {
          shopSectionTitle: ui.navbarShopSectionTitle.trim() || null,
          accountSectionTitle: ui.navbarAccountSectionTitle.trim() || null,
          searchPlaceholder: ui.navbarSearchPlaceholder.trim() || null,
          categoriesLabel: ui.navbarCategoriesLabel.trim() || null,
          loginLabel: ui.navbarLoginLabel.trim() || null,
          accountLabel: ui.navbarAccountLabel.trim() || null,
          wishlistLabel: ui.navbarWishlistLabel.trim() || null,
          cartLabel: ui.navbarCartLabel.trim() || null,
          logoutLabel: ui.navbarLogoutLabel.trim() || null,
          registerLabel: ui.navbarRegisterLabel.trim() || null,
          greetingPrefix: ui.navbarGreetingPrefix.trim() || null,
          guestNameFallback: ui.navbarGuestNameFallback.trim() || null,
          primaryLinks: ui.navbarPrimaryLinks
            .filter((l) => l.label.trim() && l.href.trim())
            .map((l) => ({ label: l.label.trim(), href: l.href.trim() })),
        }
      : null,
  };
}
