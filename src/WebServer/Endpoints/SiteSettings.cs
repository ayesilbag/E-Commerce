using ECommerce.Application.Settings;
using ECommerce.Application.Settings.DTOs;
using ECommerce.Domain.Entities;
using ECommerce.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.WebServer.Endpoints;

public class SiteSettingsEndpoint : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        var group = app.MapGroup("/api/site-settings")
            .WithTags("SiteSettings")
            .WithOpenApi();

        group.MapGet("/{code}/legal-pages/{slug}", GetLegalPageAsync);
        group.MapGet("/{code}/legal-pages/{slug}/html", GetLegalPageHtmlAsync);
        group.MapGet("/{code}", GetByCodeAsync);
        group.MapGet("/", GetDefaultAsync);
    }

    private static async Task<IResult> GetLegalPageAsync(
        string code,
        string slug,
        ApplicationDbContext context,
        CancellationToken cancellationToken)
    {
        if (!SiteSettingsRules.TryNormalizeCode(code, out var normalizedCode))
        {
            return Results.BadRequest(new { success = false, message = "Geçersiz UI kodu" });
        }

        var settings = await SiteSettingsHelper.GetActiveByCodeAsync(context, normalizedCode, cancellationToken);
        if (settings is null)
        {
            return Results.NotFound(new { success = false, message = "Site ayarları bulunamadı" });
        }

        var page = SiteLegalPages.ToDto(settings, slug);
        if (page is null)
        {
            return Results.NotFound(new { success = false, message = "Sayfa bulunamadı" });
        }

        if (string.IsNullOrWhiteSpace(page.Content))
        {
            return Results.NotFound(new { success = false, message = "Sayfa içeriği henüz yayınlanmadı" });
        }

        return Results.Ok(new
        {
            success = true,
            data = new
            {
                page.Slug,
                page.Title,
                page.Path,
                page.Content,
                siteName = settings.SiteName,
                code = settings.Code
            }
        });
    }

    private static async Task<IResult> GetLegalPageHtmlAsync(
        string code,
        string slug,
        ApplicationDbContext context,
        CancellationToken cancellationToken)
    {
        if (!SiteSettingsRules.TryNormalizeCode(code, out var normalizedCode))
        {
            return Results.BadRequest("Geçersiz UI kodu");
        }

        var settings = await SiteSettingsHelper.GetActiveByCodeAsync(context, normalizedCode, cancellationToken);
        if (settings is null)
        {
            return Results.NotFound("Site ayarları bulunamadı");
        }

        var page = SiteLegalPages.ToDto(settings, slug);
        if (page is null || string.IsNullOrWhiteSpace(page.Content))
        {
            return Results.NotFound("Sayfa bulunamadı");
        }

        var body = LooksLikeHtml(page.Content)
            ? page.Content
            : $"<div style=\"white-space:pre-wrap;font-family:system-ui,sans-serif;line-height:1.6\">{System.Net.WebUtility.HtmlEncode(page.Content)}</div>";

        var html = $"""
            <!DOCTYPE html>
            <html lang="tr">
            <head>
              <meta charset="utf-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1" />
              <title>{System.Net.WebUtility.HtmlEncode(page.Title)} — {System.Net.WebUtility.HtmlEncode(settings.SiteName)}</title>
            </head>
            <body style="max-width:48rem;margin:2rem auto;padding:0 1rem;font-family:system-ui,sans-serif;color:#111">
              <h1>{System.Net.WebUtility.HtmlEncode(page.Title)}</h1>
              {body}
            </body>
            </html>
            """;

        return Results.Content(html, "text/html; charset=utf-8");
    }

    private static bool LooksLikeHtml(string content) =>
        content.Contains('<') && content.Contains('>');

    private static async Task<IResult> GetByCodeAsync(
        string code,
        ApplicationDbContext context,
        CancellationToken cancellationToken)
    {
        if (!SiteSettingsRules.TryNormalizeCode(code, out var normalizedCode))
        {
            return Results.BadRequest(new { success = false, message = "Geçersiz UI kodu" });
        }

        var settings = await SiteSettingsHelper.GetActiveByCodeAsync(context, normalizedCode, cancellationToken);
        if (settings is null)
        {
            return Results.NotFound(new { success = false, message = "Site ayarları bulunamadı" });
        }

        return Results.Ok(new { success = true, data = SiteSettingsHelper.ToDto(settings) });
    }

    private static async Task<IResult> GetDefaultAsync(
        ApplicationDbContext context,
        CancellationToken cancellationToken)
    {
        var settings = await SiteSettingsHelper.GetDefaultAsync(context, cancellationToken);
        if (settings is null)
        {
            return Results.NotFound(new { success = false, message = "Varsayılan site ayarları bulunamadı" });
        }

        return Results.Ok(new { success = true, data = SiteSettingsHelper.ToDto(settings) });
    }
}

internal static class SiteSettingsHelper
{
    public static async Task<SiteSettings?> GetActiveByCodeAsync(
        ApplicationDbContext context,
        string code,
        CancellationToken cancellationToken) =>
        await context.SiteSettings
            .FirstOrDefaultAsync(s => s.Code == code && s.IsActive, cancellationToken);

    public static async Task<SiteSettings?> GetDefaultAsync(
        ApplicationDbContext context,
        CancellationToken cancellationToken) =>
        await context.SiteSettings
            .Where(s => s.IsActive)
            .OrderByDescending(s => s.IsDefault)
            .ThenBy(s => s.Name)
            .FirstOrDefaultAsync(cancellationToken);

    public static SiteSettingsDto ToDto(SiteSettings settings) => new()
    {
        Id = settings.Id,
        Code = settings.Code,
        Name = settings.Name,
        SiteName = settings.SiteName,
        Domain = settings.Domain,
        LogoUrl = settings.LogoUrl,
        FaviconUrl = settings.FaviconUrl,
        Address = settings.Address,
        Emails = settings.Emails,
        Phones = settings.Phones,
        WorkingHours = settings.WorkingHours,
        SocialLinks = new SocialLinksDto
        {
            Facebook = settings.FacebookUrl,
            Twitter = settings.TwitterUrl,
            Instagram = settings.InstagramUrl,
            YouTube = settings.YouTubeUrl
        },
        PaymentCompliance = PaymentComplianceRules.ToDto(settings),
        PaymentComplianceStatus = PaymentComplianceRules.BuildStatus(settings),
        Theme = new SiteThemeDto
        {
            PrimaryLight = settings.ThemePrimaryLight,
            PrimaryDark = settings.ThemePrimaryDark,
            FontFamily = settings.ThemeFontFamily
        },
        Seo = SiteSeoRules.ToDto(settings),
        StorefrontContent = SiteStorefrontContentRules.ToDto(settings),
        IsActive = settings.IsActive,
        IsDefault = settings.IsDefault
    };

    public static SiteSettingsListItemDto ToListItemDto(SiteSettings settings)
    {
        var status = PaymentComplianceRules.BuildStatus(settings);
        return new()
        {
            Id = settings.Id,
            Code = settings.Code,
            Name = settings.Name,
            SiteName = settings.SiteName,
            Domain = settings.Domain,
            IsActive = settings.IsActive,
            IsDefault = settings.IsDefault,
            PaymentComplianceCompleted = status.Completed,
            PaymentComplianceTotal = status.Total
        };
    }

    public static List<string> NormalizeList(IEnumerable<string>? values) =>
        values?
            .Select(v => v.Trim())
            .Where(v => !string.IsNullOrWhiteSpace(v))
            .ToList() ?? [];

    public static async Task ClearDefaultFlagAsync(
        ApplicationDbContext context,
        string? exceptId,
        CancellationToken cancellationToken)
    {
        var defaults = await context.SiteSettings
            .Where(s => s.IsDefault && s.Id != exceptId)
            .ToListAsync(cancellationToken);

        foreach (var item in defaults)
        {
            item.IsDefault = false;
        }
    }

    public static void ApplyUpdate(SiteSettings settings, AdminSiteSettingsRequest request)
    {
        settings.Name = request.Name.Trim();
        settings.SiteName = request.SiteName.Trim();
        settings.Domain = NullIfWhiteSpace(request.Domain);
        settings.LogoUrl = NullIfWhiteSpace(request.LogoUrl);
        settings.FaviconUrl = NullIfWhiteSpace(request.FaviconUrl);
        settings.Address = NullIfWhiteSpace(request.Address);
        settings.Emails = NormalizeList(request.Emails);
        settings.Phones = NormalizeList(request.Phones);
        settings.WorkingHours = NormalizeList(request.WorkingHours);
        settings.FacebookUrl = NullIfWhiteSpace(request.SocialLinks?.Facebook);
        settings.TwitterUrl = NullIfWhiteSpace(request.SocialLinks?.Twitter);
        settings.InstagramUrl = NullIfWhiteSpace(request.SocialLinks?.Instagram);
        settings.YouTubeUrl = NullIfWhiteSpace(request.SocialLinks?.YouTube);
        PaymentComplianceRules.Apply(settings, request.PaymentCompliance);
        settings.ThemePrimaryLight = NullIfWhiteSpace(request.Theme?.PrimaryLight);
        settings.ThemePrimaryDark = NullIfWhiteSpace(request.Theme?.PrimaryDark);
        settings.ThemeFontFamily = NullIfWhiteSpace(request.Theme?.FontFamily);
        SiteSeoRules.Apply(settings, request.Seo);
        SiteStorefrontContentRules.Apply(settings, request.StorefrontContent);
        settings.IsActive = request.IsActive;
        settings.IsDefault = request.IsDefault;
    }

    private static string? NullIfWhiteSpace(string? value) =>
        string.IsNullOrWhiteSpace(value) ? null : value.Trim();
}
