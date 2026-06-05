using System.Text.Json;
using ECommerce.Application.Settings.DTOs;
using ECommerce.Domain.Entities;

namespace ECommerce.Application.Settings;

public static class SiteSeoRules
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        WriteIndented = false,
    };

    public static SiteSeoDto ToDto(SiteSettings settings)
    {
        var stored = DeserializePageSeo(settings.PageSeoJson);
        var pages = SiteStorefrontPages.Definitions.Select(def =>
        {
            stored.TryGetValue(def.Key, out var value);
            return new PageSeoDto
            {
                PageKey = def.Key,
                Label = def.Label,
                Path = def.Path,
                Title = NullIfWhiteSpace(value?.Title),
                Description = NullIfWhiteSpace(value?.Description),
                Keywords = NullIfWhiteSpace(value?.Keywords),
                OgImageUrl = NullIfWhiteSpace(value?.OgImageUrl),
            };
        }).ToList();

        return new SiteSeoDto
        {
            DefaultTitle = settings.SeoDefaultTitle,
            DefaultDescription = settings.SeoDefaultDescription,
            DefaultKeywords = settings.SeoDefaultKeywords,
            OgImageUrl = settings.SeoOgImageUrl,
            TwitterHandle = settings.SeoTwitterHandle,
            Pages = pages,
        };
    }

    public static void Apply(SiteSettings settings, SiteSeoDto? seo)
    {
        if (seo is null) return;

        settings.SeoDefaultTitle = NullIfWhiteSpace(seo.DefaultTitle);
        settings.SeoDefaultDescription = NullIfWhiteSpace(seo.DefaultDescription);
        settings.SeoDefaultKeywords = NullIfWhiteSpace(seo.DefaultKeywords);
        settings.SeoOgImageUrl = NullIfWhiteSpace(seo.OgImageUrl);
        settings.SeoTwitterHandle = NullIfWhiteSpace(seo.TwitterHandle);

        var map = DeserializePageSeo(settings.PageSeoJson);
        foreach (var page in seo.Pages)
        {
            if (string.IsNullOrWhiteSpace(page.PageKey)) continue;

            var hasValue = !string.IsNullOrWhiteSpace(page.Title)
                || !string.IsNullOrWhiteSpace(page.Description)
                || !string.IsNullOrWhiteSpace(page.Keywords)
                || !string.IsNullOrWhiteSpace(page.OgImageUrl);

            if (!hasValue)
            {
                map.Remove(page.PageKey);
                continue;
            }

            map[page.PageKey] = new PageSeoValue
            {
                Title = NullIfWhiteSpace(page.Title),
                Description = NullIfWhiteSpace(page.Description),
                Keywords = NullIfWhiteSpace(page.Keywords),
                OgImageUrl = NullIfWhiteSpace(page.OgImageUrl),
            };
        }

        settings.PageSeoJson = map.Count == 0 ? null : JsonSerializer.Serialize(map, JsonOptions);
    }

    public static PageSeoDto? ResolveForPath(SiteSettings settings, string pathname)
    {
        var def = SiteStorefrontPages.FindByPath(pathname);
        if (def is null) return null;

        var dto = ToDto(settings);
        return dto.Pages.FirstOrDefault(p => p.PageKey == def.Key);
    }

    internal static Dictionary<string, PageSeoValue> DeserializePageSeo(string? json)
    {
        if (string.IsNullOrWhiteSpace(json)) return new Dictionary<string, PageSeoValue>(StringComparer.OrdinalIgnoreCase);
        try
        {
            return JsonSerializer.Deserialize<Dictionary<string, PageSeoValue>>(json, JsonOptions)
                ?? new Dictionary<string, PageSeoValue>(StringComparer.OrdinalIgnoreCase);
        }
        catch
        {
            return new Dictionary<string, PageSeoValue>(StringComparer.OrdinalIgnoreCase);
        }
    }

    private static string? NullIfWhiteSpace(string? value) =>
        string.IsNullOrWhiteSpace(value) ? null : value.Trim();
}

public class PageSeoValue
{
    public string? Title { get; set; }
    public string? Description { get; set; }
    public string? Keywords { get; set; }
    public string? OgImageUrl { get; set; }
}
