namespace ECommerce.Domain.Entities;

/// <summary>Storefront branding and contact info for a single UI instance.</summary>
public class SiteSettings : BaseEntity
{
    /// <summary>Unique slug used by storefront (e.g. bizdenal, digitalep).</summary>
    public required string Code { get; set; }

    /// <summary>Admin display name.</summary>
    public required string Name { get; set; }

    public string SiteName { get; set; } = string.Empty;
    public string? Domain { get; set; }
    public string? LogoUrl { get; set; }
    public string? FaviconUrl { get; set; }
    public string? Address { get; set; }
    public List<string> Emails { get; set; } = [];
    public List<string> Phones { get; set; } = [];
    public List<string> WorkingHours { get; set; } = [];
    public string? FacebookUrl { get; set; }
    public string? TwitterUrl { get; set; }
    public string? InstagramUrl { get; set; }
    public string? YouTubeUrl { get; set; }

    // iyzico / ödeme entegrasyonu — yasal sayfa içerikleri (sabit slug: /hakkimizda vb.)
    public string? AboutPageTitle { get; set; }
    public string? AboutPageContent { get; set; }
    public string? DeliveryReturnsPageTitle { get; set; }
    public string? DeliveryReturnsPageContent { get; set; }
    public string? PrivacyPolicyPageTitle { get; set; }
    public string? PrivacyPolicyPageContent { get; set; }
    public string? DistanceSellingAgreementPageTitle { get; set; }
    public string? DistanceSellingAgreementPageContent { get; set; }
    public string? PreInformationFormPageTitle { get; set; }
    public string? PreInformationFormPageContent { get; set; }
    public string? IyzicoPayLogoUrl { get; set; }

    // Tema renkleri (hex, ör. "#8B5CF6"). null ise varsayılan CSS değerleri kullanılır.
    public string? ThemePrimaryLight { get; set; }
    public string? ThemePrimaryDark { get; set; }
    public string? ThemeFontFamily { get; set; }

    // SEO — global defaults + per-page JSON (SiteSeoRules)
    public string? SeoDefaultTitle { get; set; }
    public string? SeoDefaultDescription { get; set; }
    public string? SeoDefaultKeywords { get; set; }
    public string? SeoOgImageUrl { get; set; }
    public string? SeoTwitterHandle { get; set; }
    public string? PageSeoJson { get; set; }

    /// <summary>Homepage hero, trust bar, campaigns, newsletter, FAQ, footer copy (JSON).</summary>
    public string? StorefrontContentJson { get; set; }

    public bool IsActive { get; set; } = true;
    public bool IsDefault { get; set; }
}
