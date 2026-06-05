namespace ECommerce.Application.Settings.DTOs;

public class SiteStorefrontContentDto
{
    public string? FooterDescription { get; set; }
    public IReadOnlyList<HeroSlideDto> HeroSlides { get; set; } = [];
    public IReadOnlyList<TrustBarItemDto> TrustItems { get; set; } = [];
    public IReadOnlyList<CampaignBannerDto> CampaignBanners { get; set; } = [];
    public IReadOnlyList<HomeProductRowDto> ProductRows { get; set; } = [];
    public NewsletterSectionDto? Newsletter { get; set; }
    public FaqSectionDto? Faq { get; set; }
    public ContactMapDto? ContactMap { get; set; }
    public FooterNavDto? FooterNav { get; set; }
    public NotFoundPageDto? NotFound { get; set; }
    public LegalPageUiDto? LegalPageUi { get; set; }
    public ContactPageUiDto? ContactPageUi { get; set; }
    public CheckoutConsentUiDto? CheckoutConsent { get; set; }
    public NavbarUiDto? Navbar { get; set; }
    public AppPagesUiDto? AppPagesUi { get; set; }
}

public class HeroSlideDto
{
    public string Badge { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Highlight { get; set; } = string.Empty;
    public string Subtitle { get; set; } = string.Empty;
    public string CtaLabel { get; set; } = string.Empty;
    public string CtaHref { get; set; } = string.Empty;
    public string? CtaSecondaryLabel { get; set; }
    public string? CtaSecondaryHref { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public string? BackgroundClass { get; set; }
}

public class TrustBarItemDto
{
    /// <summary>Lucide icon key: truck, refresh-cw, shield-check, award</summary>
    public string Icon { get; set; } = "truck";
    public string Title { get; set; } = string.Empty;
    public string Subtitle { get; set; } = string.Empty;
}

public class CampaignBannerDto
{
    /// <summary>large | small</summary>
    public string Size { get; set; } = "small";
    public string? Badge { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Subtitle { get; set; }
    public string LinkLabel { get; set; } = string.Empty;
    public string Href { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public string? GradientClass { get; set; }
}

public class HomeProductRowDto
{
    public string Title { get; set; } = string.Empty;
    public string? Subtitle { get; set; }
    public string ViewAllHref { get; set; } = "/shop";
    public string Sort { get; set; } = "featured";
    public int Limit { get; set; } = 12;
}

public class NewsletterSectionDto
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Placeholder { get; set; } = string.Empty;
    public string ButtonLabel { get; set; } = string.Empty;
    public string? Disclaimer { get; set; }
    public string? SubmittingLabel { get; set; }
    public string? SuccessTitle { get; set; }
    public string? SuccessDescription { get; set; }
    public string? ErrorTitle { get; set; }
    public string? EmptyEmailMessage { get; set; }
}

public class FaqSectionDto
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public IReadOnlyList<FaqItemDto> Items { get; set; } = [];
    public string? FooterText { get; set; }
    public string? FooterButtonLabel { get; set; }
    public string? FooterButtonHref { get; set; }
}

public class FaqItemDto
{
    public string Question { get; set; } = string.Empty;
    public string Answer { get; set; } = string.Empty;
}

public class ContactMapDto
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? EmbedUrl { get; set; }
    public string? EmptyMessage { get; set; }
}

public class FooterNavDto
{
    public string? QuickLinksTitle { get; set; }
    public string? CustomerServiceTitle { get; set; }
    public string? ContactSectionTitle { get; set; }
    public string? CopyrightSuffix { get; set; }
    public string? AddressLabel { get; set; }
    public string? PhoneLabel { get; set; }
    public string? EmailLabel { get; set; }
    public string? WorkingHoursLabel { get; set; }
    public IReadOnlyList<FooterLinkDto> QuickLinks { get; set; } = [];
    public IReadOnlyList<FooterLinkDto> CustomerServiceLinks { get; set; } = [];
}

public class FooterLinkDto
{
    public string Label { get; set; } = string.Empty;
    public string Href { get; set; } = string.Empty;
}

public class NotFoundPageDto
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? PrimaryButtonLabel { get; set; }
    public string? PrimaryButtonHref { get; set; }
    public string? SecondaryButtonLabel { get; set; }
    public string? SecondaryButtonHref { get; set; }
    public string? BackLinkLabel { get; set; }
}

public class LegalPageUiDto
{
    public string? EmptyStateTitle { get; set; }
    public string? EmptyStateDescription { get; set; }
    public string? TocTitle { get; set; }
    public string? ContactBlockTitle { get; set; }
    public string? ContactBlockDescription { get; set; }
    public string? EmailLabel { get; set; }
    public string? PhoneLabel { get; set; }
    public string? ContactFormButtonLabel { get; set; }
    public string? ContactFormHref { get; set; }
}

public class ContactPageUiDto
{
    public string? InfoSectionTitle { get; set; }
    public string? FormSectionTitle { get; set; }
    public string? LocationLabel { get; set; }
    public string? EmailLabel { get; set; }
    public string? PhoneLabel { get; set; }
    public string? HoursLabel { get; set; }
    public string? NameLabel { get; set; }
    public string? EmailFieldLabel { get; set; }
    public string? SubjectLabel { get; set; }
    public string? MessageLabel { get; set; }
    public string? NamePlaceholder { get; set; }
    public string? EmailPlaceholder { get; set; }
    public string? SubjectPlaceholder { get; set; }
    public string? MessagePlaceholder { get; set; }
    public string? SubmitButtonLabel { get; set; }
    public string? SubmittingLabel { get; set; }
    public string? SocialSectionTitle { get; set; }
    public string? FormIntro { get; set; }
    public string? SubmitSuccessTitle { get; set; }
    public string? SubmitSuccessDescription { get; set; }
    public string? SubmitErrorTitle { get; set; }
    public string? SubmitErrorFallback { get; set; }
}

public class CheckoutConsentLinkDto
{
    public string Slug { get; set; } = string.Empty;
    public string Label { get; set; } = string.Empty;
}

public class CheckoutConsentUiDto
{
    public IReadOnlyList<CheckoutConsentLinkDto> Links { get; set; } = [];
    public string? SuffixText { get; set; }
}

public class NavbarUiDto
{
    public string? ShopSectionTitle { get; set; }
    public string? AccountSectionTitle { get; set; }
    public string? SearchPlaceholder { get; set; }
    public string? CategoriesLabel { get; set; }
    public string? LoginLabel { get; set; }
    public string? AccountLabel { get; set; }
    public string? WishlistLabel { get; set; }
    public string? CartLabel { get; set; }
    public string? LogoutLabel { get; set; }
    public string? RegisterLabel { get; set; }
    public string? GreetingPrefix { get; set; }
    public string? GuestNameFallback { get; set; }
    public IReadOnlyList<FooterLinkDto> PrimaryLinks { get; set; } = [];
}
