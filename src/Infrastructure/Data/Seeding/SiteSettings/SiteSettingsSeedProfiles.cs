namespace ECommerce.Infrastructure.Data.Seeding.SiteSettings;

/// <summary>
/// Seed edilecek UI profilleri. 3. UI geldiğinde buraya yeni <see cref="SiteSettingsBrandProfile"/> eklemeniz yeterli.
/// </summary>
public static class SiteSettingsSeedProfiles
{
    public static readonly SiteSettingsBrandProfile Bizdenalbizdensat = new(
        Code: "bizdenalbizdensat",
        AdminName: "Bizden Al Bizden Sat",
        SiteName: "bizdenalbizdensat.com",
        Domain: "https://www.bizdenalbizdensat.com",
        DisplayName: "Bizden Al Bizden Sat",
        Tagline: "Teknoloji ve yaşam kategorilerinde güvenilir online alışveriş.",
        PrimaryEmail: "info@bizdenalbizdensat.com",
        SupportPhoneDisplay: "0 554 449 04 49",
        ThemePrimaryLight: "#2563EB",
        ThemePrimaryDark: "#60A5FA",
        IsDefault: true);

    public static readonly SiteSettingsBrandProfile Tedarikdukkani = new(
        Code: "tedarikdukkani",
        AdminName: "Tedarik Dükkanı",
        SiteName: "tedarikdukkani.com",
        Domain: "https://www.tedarikdukkani.com",
        DisplayName: "Tedarik Dükkanı",
        Tagline: "Kurumsal tedarik ve toptan alışverişte hızlı, şeffaf çözümler.",
        PrimaryEmail: "info@tedarikdukkani.com",
        SupportPhoneDisplay: "0 554 449 04 49",
        ThemePrimaryLight: "#059669",
        ThemePrimaryDark: "#34D399",
        IsDefault: false);

    public static IReadOnlyList<SiteSettingsBrandProfile> All { get; } =
    [
        Bizdenalbizdensat,
        Tedarikdukkani,
    ];
}
