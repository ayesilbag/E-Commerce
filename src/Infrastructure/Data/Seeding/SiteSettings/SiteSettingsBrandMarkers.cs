namespace ECommerce.Infrastructure.Data.Seeding.SiteSettings;

internal static class SiteSettingsBrandMarkers
{
    public static string[] MarkersFor(SiteSettingsBrandProfile profile) =>
    [
        profile.Code,
        profile.DisplayName,
        profile.SiteName,
        profile.PrimaryEmail,
        profile.Domain,
    ];
}
