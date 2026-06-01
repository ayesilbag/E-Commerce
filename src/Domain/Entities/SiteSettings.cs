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
    public bool IsActive { get; set; } = true;
    public bool IsDefault { get; set; }
}
