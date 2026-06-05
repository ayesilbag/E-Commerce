namespace ECommerce.Infrastructure.Data.Seeding.SiteSettings;

/// <summary>
/// Tek bir storefront UI için marka kimliği. Yeni UI eklemek için <see cref="SiteSettingsSeedProfiles"/> listesine profil ekleyin.
/// </summary>
public sealed record SiteSettingsBrandProfile(
    string Code,
    string AdminName,
    string SiteName,
    string Domain,
    string DisplayName,
    string Tagline,
    string PrimaryEmail,
    string SupportPhoneDisplay,
    string ThemePrimaryLight,
    string ThemePrimaryDark,
    bool IsDefault,
    string? ThemeFontFamily = null)
{
    public bool IsTedarik => Code.Equals(SiteSettingsSeedProfiles.Tedarikdukkani.Code, StringComparison.OrdinalIgnoreCase);

    public bool IsBizdenal => Code.Equals(SiteSettingsSeedProfiles.Bizdenalbizdensat.Code, StringComparison.OrdinalIgnoreCase);
}
