using ECommerce.Application.Settings.DTOs;
using ECommerce.Domain.Entities;

namespace ECommerce.Application.Settings;

public static class SiteLegalPages
{
    public const string AboutSlug = "hakkimizda";
    public const string DeliveryReturnsSlug = "teslimat-ve-iade";
    public const string PrivacyPolicySlug = "gizlilik";
    public const string DistanceSellingSlug = "mesafeli-satis";
    public const string PreInformationSlug = "on-bilgilendirme-formu";

    private static readonly IReadOnlyDictionary<string, (string Title, Func<SiteSettings, string?> GetContent)> Definitions =
        new Dictionary<string, (string, Func<SiteSettings, string?>)>(StringComparer.OrdinalIgnoreCase)
        {
            [AboutSlug] = ("Hakkımızda", s => s.AboutPageContent),
            [DeliveryReturnsSlug] = ("Teslimat ve İade Şartları", s => s.DeliveryReturnsPageContent),
            [PrivacyPolicySlug] = ("Gizlilik Sözleşmesi", s => s.PrivacyPolicyPageContent),
            [DistanceSellingSlug] = ("Mesafeli Satış Sözleşmesi", s => s.DistanceSellingAgreementPageContent),
            [PreInformationSlug] = ("Ön Bilgilendirme Formu", s => s.PreInformationFormPageContent)
        };

    public static bool TryGetDefinition(string slug, out string title, out Func<SiteSettings, string?> getContent)
    {
        if (Definitions.TryGetValue(slug, out var def))
        {
            title = def.Title;
            getContent = def.GetContent;
            return true;
        }

        title = string.Empty;
        getContent = _ => null;
        return false;
    }

    public static IReadOnlyList<SiteLegalPageDto> ToDtos(SiteSettings settings) =>
        Definitions.Select(pair => new SiteLegalPageDto
        {
            Slug = pair.Key,
            Title = pair.Value.Title,
            Path = $"/{pair.Key}",
            Content = pair.Value.GetContent(settings)
        }).ToList();

    public static SiteLegalPageDto? ToDto(SiteSettings settings, string slug)
    {
        if (!TryGetDefinition(slug, out var title, out var getContent))
            return null;

        return new SiteLegalPageDto
        {
            Slug = slug.ToLowerInvariant(),
            Title = title,
            Path = $"/{slug.ToLowerInvariant()}",
            Content = getContent(settings)
        };
    }
}
