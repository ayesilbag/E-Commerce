using System.Text.Json;
using ECommerce.Application.Settings.DTOs;
using ECommerce.Domain.Entities;

namespace ECommerce.Application.Settings;

public static class SiteStorefrontContentRules
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        WriteIndented = false,
    };

    public static SiteStorefrontContentDto ToDto(SiteSettings settings)
    {
        if (string.IsNullOrWhiteSpace(settings.StorefrontContentJson))
        {
            return new SiteStorefrontContentDto();
        }

        try
        {
            return JsonSerializer.Deserialize<SiteStorefrontContentDto>(settings.StorefrontContentJson, JsonOptions)
                ?? new SiteStorefrontContentDto();
        }
        catch
        {
            return new SiteStorefrontContentDto();
        }
    }

    public static void Apply(SiteSettings settings, SiteStorefrontContentDto? content)
    {
        if (content is null) return;

        var normalized = Normalize(content);
        var hasValue =
            !string.IsNullOrWhiteSpace(normalized.FooterDescription)
            || normalized.HeroSlides.Count > 0
            || normalized.TrustItems.Count > 0
            || normalized.CampaignBanners.Count > 0
            || normalized.ProductRows.Count > 0
            || HasNewsletter(normalized.Newsletter)
            || HasFaq(normalized.Faq)
            || HasContactMap(normalized.ContactMap)
            || HasFooterNav(normalized.FooterNav)
            || HasNotFound(normalized.NotFound)
            || HasLegalPageUi(normalized.LegalPageUi)
            || HasContactPageUi(normalized.ContactPageUi)
            || HasCheckoutConsent(normalized.CheckoutConsent)
            || HasNavbar(normalized.Navbar)
            || HasAppPagesUi(normalized.AppPagesUi);

        settings.StorefrontContentJson = hasValue
            ? JsonSerializer.Serialize(normalized, JsonOptions)
            : null;
    }

    private static SiteStorefrontContentDto Normalize(SiteStorefrontContentDto content) => new()
    {
        FooterDescription = NullIfWhiteSpace(content.FooterDescription),
        HeroSlides = content.HeroSlides
            .Where(s => !string.IsNullOrWhiteSpace(s.Title) || !string.IsNullOrWhiteSpace(s.ImageUrl))
            .Select(s => new HeroSlideDto
            {
                Badge = s.Badge?.Trim() ?? string.Empty,
                Title = s.Title?.Trim() ?? string.Empty,
                Highlight = s.Highlight?.Trim() ?? string.Empty,
                Subtitle = s.Subtitle?.Trim() ?? string.Empty,
                CtaLabel = s.CtaLabel?.Trim() ?? string.Empty,
                CtaHref = s.CtaHref?.Trim() ?? string.Empty,
                CtaSecondaryLabel = NullIfWhiteSpace(s.CtaSecondaryLabel),
                CtaSecondaryHref = NullIfWhiteSpace(s.CtaSecondaryHref),
                ImageUrl = s.ImageUrl?.Trim() ?? string.Empty,
                BackgroundClass = NullIfWhiteSpace(s.BackgroundClass),
            })
            .ToList(),
        TrustItems = content.TrustItems
            .Where(t => !string.IsNullOrWhiteSpace(t.Title))
            .Select(t => new TrustBarItemDto
            {
                Icon = string.IsNullOrWhiteSpace(t.Icon) ? "truck" : t.Icon.Trim().ToLowerInvariant(),
                Title = t.Title.Trim(),
                Subtitle = t.Subtitle?.Trim() ?? string.Empty,
            })
            .ToList(),
        CampaignBanners = content.CampaignBanners
            .Where(b => !string.IsNullOrWhiteSpace(b.Title))
            .Select(b => new CampaignBannerDto
            {
                Size = string.Equals(b.Size, "large", StringComparison.OrdinalIgnoreCase) ? "large" : "small",
                Badge = NullIfWhiteSpace(b.Badge),
                Title = b.Title.Trim(),
                Subtitle = NullIfWhiteSpace(b.Subtitle),
                LinkLabel = b.LinkLabel?.Trim() ?? string.Empty,
                Href = b.Href?.Trim() ?? string.Empty,
                ImageUrl = b.ImageUrl?.Trim() ?? string.Empty,
                GradientClass = NullIfWhiteSpace(b.GradientClass),
            })
            .ToList(),
        ProductRows = content.ProductRows
            .Where(r => !string.IsNullOrWhiteSpace(r.Title))
            .Select(r => new HomeProductRowDto
            {
                Title = r.Title.Trim(),
                Subtitle = NullIfWhiteSpace(r.Subtitle),
                ViewAllHref = string.IsNullOrWhiteSpace(r.ViewAllHref) ? "/shop" : r.ViewAllHref.Trim(),
                Sort = string.IsNullOrWhiteSpace(r.Sort) ? "featured" : r.Sort.Trim(),
                Limit = r.Limit > 0 ? Math.Min(r.Limit, 48) : 12,
            })
            .ToList(),
        Newsletter = HasNewsletter(content.Newsletter)
            ? new NewsletterSectionDto
            {
                Title = content.Newsletter!.Title.Trim(),
                Description = content.Newsletter.Description?.Trim() ?? string.Empty,
                Placeholder = content.Newsletter.Placeholder?.Trim() ?? string.Empty,
                ButtonLabel = content.Newsletter.ButtonLabel?.Trim() ?? string.Empty,
                Disclaimer = NullIfWhiteSpace(content.Newsletter.Disclaimer),
                SubmittingLabel = NullIfWhiteSpace(content.Newsletter.SubmittingLabel),
                SuccessTitle = NullIfWhiteSpace(content.Newsletter.SuccessTitle),
                SuccessDescription = NullIfWhiteSpace(content.Newsletter.SuccessDescription),
                ErrorTitle = NullIfWhiteSpace(content.Newsletter.ErrorTitle),
                EmptyEmailMessage = NullIfWhiteSpace(content.Newsletter.EmptyEmailMessage),
            }
            : null,
        Faq = HasFaq(content.Faq)
            ? new FaqSectionDto
            {
                Title = content.Faq!.Title.Trim(),
                Description = NullIfWhiteSpace(content.Faq.Description),
                Items = content.Faq.Items
                    .Where(i => !string.IsNullOrWhiteSpace(i.Question))
                    .Select(i => new FaqItemDto
                    {
                        Question = i.Question.Trim(),
                        Answer = i.Answer?.Trim() ?? string.Empty,
                    })
                    .ToList(),
                FooterText = NullIfWhiteSpace(content.Faq.FooterText),
                FooterButtonLabel = NullIfWhiteSpace(content.Faq.FooterButtonLabel),
                FooterButtonHref = NullIfWhiteSpace(content.Faq.FooterButtonHref),
            }
            : null,
        ContactMap = HasContactMap(content.ContactMap)
            ? new ContactMapDto
            {
                Title = content.ContactMap!.Title.Trim(),
                Description = NullIfWhiteSpace(content.ContactMap.Description),
                EmbedUrl = NullIfWhiteSpace(content.ContactMap.EmbedUrl),
                EmptyMessage = NullIfWhiteSpace(content.ContactMap.EmptyMessage),
            }
            : null,
        FooterNav = HasFooterNav(content.FooterNav)
            ? new FooterNavDto
            {
                QuickLinksTitle = NullIfWhiteSpace(content.FooterNav!.QuickLinksTitle),
                CustomerServiceTitle = NullIfWhiteSpace(content.FooterNav.CustomerServiceTitle),
                ContactSectionTitle = NullIfWhiteSpace(content.FooterNav.ContactSectionTitle),
                CopyrightSuffix = NullIfWhiteSpace(content.FooterNav.CopyrightSuffix),
                AddressLabel = NullIfWhiteSpace(content.FooterNav.AddressLabel),
                PhoneLabel = NullIfWhiteSpace(content.FooterNav.PhoneLabel),
                EmailLabel = NullIfWhiteSpace(content.FooterNav.EmailLabel),
                WorkingHoursLabel = NullIfWhiteSpace(content.FooterNav.WorkingHoursLabel),
                QuickLinks = NormalizeFooterLinks(content.FooterNav.QuickLinks),
                CustomerServiceLinks = NormalizeFooterLinks(content.FooterNav.CustomerServiceLinks),
            }
            : null,
        NotFound = HasNotFound(content.NotFound)
            ? new NotFoundPageDto
            {
                Title = content.NotFound!.Title.Trim(),
                Description = NullIfWhiteSpace(content.NotFound.Description),
                PrimaryButtonLabel = NullIfWhiteSpace(content.NotFound.PrimaryButtonLabel),
                PrimaryButtonHref = NullIfWhiteSpace(content.NotFound.PrimaryButtonHref) ?? "/",
                SecondaryButtonLabel = NullIfWhiteSpace(content.NotFound.SecondaryButtonLabel),
                SecondaryButtonHref = NullIfWhiteSpace(content.NotFound.SecondaryButtonHref) ?? "/shop",
                BackLinkLabel = NullIfWhiteSpace(content.NotFound.BackLinkLabel),
            }
            : null,
        LegalPageUi = HasLegalPageUi(content.LegalPageUi) ? NormalizeLegalPageUi(content.LegalPageUi!) : null,
        ContactPageUi = HasContactPageUi(content.ContactPageUi) ? NormalizeContactPageUi(content.ContactPageUi!) : null,
        CheckoutConsent = HasCheckoutConsent(content.CheckoutConsent) ? NormalizeCheckoutConsent(content.CheckoutConsent!) : null,
        Navbar = HasNavbar(content.Navbar) ? NormalizeNavbar(content.Navbar!) : null,
        AppPagesUi = HasAppPagesUi(content.AppPagesUi) ? content.AppPagesUi : null,
    };

    private static List<FooterLinkDto> NormalizeFooterLinks(IEnumerable<FooterLinkDto>? links) =>
        links?
            .Where(l => !string.IsNullOrWhiteSpace(l.Label) && !string.IsNullOrWhiteSpace(l.Href))
            .Select(l => new FooterLinkDto
            {
                Label = l.Label.Trim(),
                Href = l.Href.Trim(),
            })
            .ToList() ?? [];

    private static bool HasNewsletter(NewsletterSectionDto? n) =>
        n is not null && !string.IsNullOrWhiteSpace(n.Title);

    private static bool HasFaq(FaqSectionDto? f) =>
        f is not null && (!string.IsNullOrWhiteSpace(f.Title) || f.Items.Any(i => !string.IsNullOrWhiteSpace(i.Question)));

    private static bool HasContactMap(ContactMapDto? m) =>
        m is not null && !string.IsNullOrWhiteSpace(m.Title);

    private static bool HasFooterNav(FooterNavDto? nav) =>
        nav is not null && (
            !string.IsNullOrWhiteSpace(nav.QuickLinksTitle)
            || !string.IsNullOrWhiteSpace(nav.CustomerServiceTitle)
            || !string.IsNullOrWhiteSpace(nav.ContactSectionTitle)
            || !string.IsNullOrWhiteSpace(nav.CopyrightSuffix)
            || nav.QuickLinks.Any(l => !string.IsNullOrWhiteSpace(l.Label))
            || nav.CustomerServiceLinks.Any(l => !string.IsNullOrWhiteSpace(l.Label)));

    private static bool HasNotFound(NotFoundPageDto? page) =>
        page is not null && !string.IsNullOrWhiteSpace(page.Title);

    private static bool HasLegalPageUi(LegalPageUiDto? ui) =>
        ui is not null && (
            !string.IsNullOrWhiteSpace(ui.EmptyStateTitle)
            || !string.IsNullOrWhiteSpace(ui.TocTitle)
            || !string.IsNullOrWhiteSpace(ui.ContactBlockTitle));

    private static bool HasContactPageUi(ContactPageUiDto? ui) =>
        ui is not null && (
            !string.IsNullOrWhiteSpace(ui.InfoSectionTitle)
            || !string.IsNullOrWhiteSpace(ui.FormSectionTitle)
            || !string.IsNullOrWhiteSpace(ui.SubmitButtonLabel));

    private static bool HasCheckoutConsent(CheckoutConsentUiDto? ui) =>
        ui is not null && (ui.Links.Any(l => !string.IsNullOrWhiteSpace(l.Label)) || !string.IsNullOrWhiteSpace(ui.SuffixText));

    private static bool HasNavbar(NavbarUiDto? ui) =>
        ui is not null && (
            !string.IsNullOrWhiteSpace(ui.ShopSectionTitle)
            || !string.IsNullOrWhiteSpace(ui.SearchPlaceholder)
            || !string.IsNullOrWhiteSpace(ui.CategoriesLabel)
            || !string.IsNullOrWhiteSpace(ui.LoginLabel)
            || ui.PrimaryLinks.Any(l => !string.IsNullOrWhiteSpace(l.Label)));

    private static LegalPageUiDto NormalizeLegalPageUi(LegalPageUiDto ui) => new()
    {
        EmptyStateTitle = NullIfWhiteSpace(ui.EmptyStateTitle),
        EmptyStateDescription = NullIfWhiteSpace(ui.EmptyStateDescription),
        TocTitle = NullIfWhiteSpace(ui.TocTitle),
        ContactBlockTitle = NullIfWhiteSpace(ui.ContactBlockTitle),
        ContactBlockDescription = NullIfWhiteSpace(ui.ContactBlockDescription),
        EmailLabel = NullIfWhiteSpace(ui.EmailLabel),
        PhoneLabel = NullIfWhiteSpace(ui.PhoneLabel),
        ContactFormButtonLabel = NullIfWhiteSpace(ui.ContactFormButtonLabel),
        ContactFormHref = NullIfWhiteSpace(ui.ContactFormHref) ?? "/contact",
    };

    private static ContactPageUiDto NormalizeContactPageUi(ContactPageUiDto ui) => new()
    {
        InfoSectionTitle = NullIfWhiteSpace(ui.InfoSectionTitle),
        FormSectionTitle = NullIfWhiteSpace(ui.FormSectionTitle),
        LocationLabel = NullIfWhiteSpace(ui.LocationLabel),
        EmailLabel = NullIfWhiteSpace(ui.EmailLabel),
        PhoneLabel = NullIfWhiteSpace(ui.PhoneLabel),
        HoursLabel = NullIfWhiteSpace(ui.HoursLabel),
        NameLabel = NullIfWhiteSpace(ui.NameLabel),
        EmailFieldLabel = NullIfWhiteSpace(ui.EmailFieldLabel),
        SubjectLabel = NullIfWhiteSpace(ui.SubjectLabel),
        MessageLabel = NullIfWhiteSpace(ui.MessageLabel),
        NamePlaceholder = NullIfWhiteSpace(ui.NamePlaceholder),
        EmailPlaceholder = NullIfWhiteSpace(ui.EmailPlaceholder),
        SubjectPlaceholder = NullIfWhiteSpace(ui.SubjectPlaceholder),
        MessagePlaceholder = NullIfWhiteSpace(ui.MessagePlaceholder),
        SubmitButtonLabel = NullIfWhiteSpace(ui.SubmitButtonLabel),
        SubmittingLabel = NullIfWhiteSpace(ui.SubmittingLabel),
        SocialSectionTitle = NullIfWhiteSpace(ui.SocialSectionTitle),
        FormIntro = NullIfWhiteSpace(ui.FormIntro),
        SubmitSuccessTitle = NullIfWhiteSpace(ui.SubmitSuccessTitle),
        SubmitSuccessDescription = NullIfWhiteSpace(ui.SubmitSuccessDescription),
        SubmitErrorTitle = NullIfWhiteSpace(ui.SubmitErrorTitle),
        SubmitErrorFallback = NullIfWhiteSpace(ui.SubmitErrorFallback),
    };

    private static CheckoutConsentUiDto NormalizeCheckoutConsent(CheckoutConsentUiDto ui) => new()
    {
        Links = ui.Links
            .Where(l => !string.IsNullOrWhiteSpace(l.Label) && !string.IsNullOrWhiteSpace(l.Slug))
            .Select(l => new CheckoutConsentLinkDto { Slug = l.Slug.Trim().ToLowerInvariant(), Label = l.Label.Trim() })
            .ToList(),
        SuffixText = NullIfWhiteSpace(ui.SuffixText),
    };

    private static NavbarUiDto NormalizeNavbar(NavbarUiDto ui) => new()
    {
        ShopSectionTitle = NullIfWhiteSpace(ui.ShopSectionTitle),
        AccountSectionTitle = NullIfWhiteSpace(ui.AccountSectionTitle),
        SearchPlaceholder = NullIfWhiteSpace(ui.SearchPlaceholder),
        CategoriesLabel = NullIfWhiteSpace(ui.CategoriesLabel),
        LoginLabel = NullIfWhiteSpace(ui.LoginLabel),
        AccountLabel = NullIfWhiteSpace(ui.AccountLabel),
        WishlistLabel = NullIfWhiteSpace(ui.WishlistLabel),
        CartLabel = NullIfWhiteSpace(ui.CartLabel),
        LogoutLabel = NullIfWhiteSpace(ui.LogoutLabel),
        RegisterLabel = NullIfWhiteSpace(ui.RegisterLabel),
        GreetingPrefix = NullIfWhiteSpace(ui.GreetingPrefix),
        GuestNameFallback = NullIfWhiteSpace(ui.GuestNameFallback),
        PrimaryLinks = NormalizeFooterLinks(ui.PrimaryLinks),
    };

    private static string? NullIfWhiteSpace(string? value) =>
        string.IsNullOrWhiteSpace(value) ? null : value.Trim();

    private static bool HasAppPagesUi(AppPagesUiDto? ui) =>
        ui is not null && (
            ui.Global is not null
            || ui.Auth is not null
            || ui.Account is not null
            || ui.Cart is not null
            || ui.Wishlist is not null
            || ui.Shop is not null
            || ui.Checkout is not null
            || ui.Orders is not null
            || ui.Product is not null
            || ui.Category is not null
            || ui.Context is not null);
}
