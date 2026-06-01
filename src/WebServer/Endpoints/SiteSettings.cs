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

        group.MapGet("/{code}", GetByCodeAsync);
        group.MapGet("/", GetDefaultAsync);
    }

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
        IsActive = settings.IsActive,
        IsDefault = settings.IsDefault
    };

    public static SiteSettingsListItemDto ToListItemDto(SiteSettings settings) => new()
    {
        Id = settings.Id,
        Code = settings.Code,
        Name = settings.Name,
        SiteName = settings.SiteName,
        Domain = settings.Domain,
        IsActive = settings.IsActive,
        IsDefault = settings.IsDefault
    };

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
        settings.IsActive = request.IsActive;
        settings.IsDefault = request.IsDefault;
    }

    private static string? NullIfWhiteSpace(string? value) =>
        string.IsNullOrWhiteSpace(value) ? null : value.Trim();
}
