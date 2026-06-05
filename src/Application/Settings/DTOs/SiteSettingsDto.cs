namespace ECommerce.Application.Settings.DTOs;

public class SiteSettingsDto
{
    public string Id { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string SiteName { get; set; } = string.Empty;
    public string? Domain { get; set; }
    public string? LogoUrl { get; set; }
    public string? FaviconUrl { get; set; }
    public string? Address { get; set; }
    public IReadOnlyList<string> Emails { get; set; } = [];
    public IReadOnlyList<string> Phones { get; set; } = [];
    public IReadOnlyList<string> WorkingHours { get; set; } = [];
    public SocialLinksDto SocialLinks { get; set; } = new();
    public PaymentComplianceDto PaymentCompliance { get; set; } = new();
    public PaymentComplianceStatusDto PaymentComplianceStatus { get; set; } = new();
    public SiteThemeDto Theme { get; set; } = new();
    public SiteSeoDto Seo { get; set; } = new();
    public SiteStorefrontContentDto StorefrontContent { get; set; } = new();
    public bool IsActive { get; set; } = true;
    public bool IsDefault { get; set; }
}

public class SiteThemeDto
{
    /// <summary>Light mode primary color as hex (e.g. "#8B5CF6"). Null = use storefront default.</summary>
    public string? PrimaryLight { get; set; }
    /// <summary>Dark mode primary color as hex. Null = same as PrimaryLight.</summary>
    public string? PrimaryDark { get; set; }
    public string? FontFamily { get; set; }
}

public class SiteSettingsListItemDto
{
    public string Id { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string SiteName { get; set; } = string.Empty;
    public string? Domain { get; set; }
    public bool IsActive { get; set; } = true;
    public bool IsDefault { get; set; }
    public int PaymentComplianceCompleted { get; set; }
    public int PaymentComplianceTotal { get; set; }
}

public class SocialLinksDto
{
    public string? Facebook { get; set; }
    public string? Twitter { get; set; }
    public string? Instagram { get; set; }
    public string? YouTube { get; set; }
}
