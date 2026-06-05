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

    private static readonly IReadOnlyDictionary<string, (Func<SiteSettings, string?> GetTitle, Func<SiteSettings, string?> GetContent)> Definitions =
        new Dictionary<string, (Func<SiteSettings, string?>, Func<SiteSettings, string?>)>(StringComparer.OrdinalIgnoreCase)
        {
            [AboutSlug] = (s => s.AboutPageTitle, s => s.AboutPageContent),
            [DeliveryReturnsSlug] = (s => s.DeliveryReturnsPageTitle, s => s.DeliveryReturnsPageContent),
            [PrivacyPolicySlug] = (s => s.PrivacyPolicyPageTitle, s => s.PrivacyPolicyPageContent),
            [DistanceSellingSlug] = (s => s.DistanceSellingAgreementPageTitle, s => s.DistanceSellingAgreementPageContent),
            [PreInformationSlug] = (s => s.PreInformationFormPageTitle, s => s.PreInformationFormPageContent),
        };

    public static bool TryGetDefinition(string slug, out Func<SiteSettings, string?> getTitle, out Func<SiteSettings, string?> getContent)
    {
        if (Definitions.TryGetValue(slug, out var def))
        {
            getTitle = def.GetTitle;
            getContent = def.GetContent;
            return true;
        }

        getTitle = _ => null;
        getContent = _ => null;
        return false;
    }

    public static IReadOnlyList<SiteLegalPageDto> ToDtos(SiteSettings settings) =>
        Definitions.Select(pair => CreateDto(settings, pair.Key, pair.Value.GetTitle, pair.Value.GetContent))
            .Where(d => d is not null)
            .Cast<SiteLegalPageDto>()
            .ToList();

    public static SiteLegalPageDto? ToDto(SiteSettings settings, string slug)
    {
        if (!TryGetDefinition(slug, out var getTitle, out var getContent))
            return null;

        return CreateDto(settings, slug.ToLowerInvariant(), getTitle, getContent);
    }

    private static SiteLegalPageDto? CreateDto(
        SiteSettings settings,
        string slug,
        Func<SiteSettings, string?> getTitle,
        Func<SiteSettings, string?> getContent)
    {
        var title = NullIfWhiteSpace(getTitle(settings));
        var content = NullIfWhiteSpace(getContent(settings));
        if (title is null && content is null)
            return null;

        return new SiteLegalPageDto
        {
            Slug = slug,
            Title = title,
            Path = $"/{slug}",
            Content = content,
        };
    }

    private static string? NullIfWhiteSpace(string? value) =>
        string.IsNullOrWhiteSpace(value) ? null : value.Trim();
}
