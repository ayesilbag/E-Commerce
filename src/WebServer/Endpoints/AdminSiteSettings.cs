using ECommerce.Application.Settings;
using ECommerce.Application.Settings.DTOs;
using ECommerce.Domain.Constants;
using ECommerce.Domain.Entities;
using ECommerce.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.WebServer.Endpoints;

public class AdminSiteSettings : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        var group = app.MapGroup("/api/admin/site-settings")
            .WithTags("Admin")
            .WithOpenApi()
            .RequireAuthorization(Policies.Admin);

        group.MapGet("/", ListAsync);
        group.MapGet("/{id}", GetByIdAsync);
        group.MapPost("/", CreateAsync);
        group.MapPut("/{id}", UpdateAsync);
        group.MapDelete("/{id}", DeleteAsync);
    }

    private static async Task<IResult> ListAsync(
        ApplicationDbContext context,
        CancellationToken cancellationToken)
    {
        var items = await context.SiteSettings
            .OrderByDescending(s => s.IsDefault)
            .ThenBy(s => s.Name)
            .Select(s => SiteSettingsHelper.ToListItemDto(s))
            .ToListAsync(cancellationToken);

        return Results.Ok(new { success = true, data = items });
    }

    private static async Task<IResult> GetByIdAsync(
        string id,
        ApplicationDbContext context,
        CancellationToken cancellationToken)
    {
        var settings = await context.SiteSettings.FirstOrDefaultAsync(s => s.Id == id, cancellationToken);
        if (settings is null)
        {
            return Results.NotFound(new { success = false, message = "Site ayarları bulunamadı" });
        }

        return Results.Ok(new { success = true, data = SiteSettingsHelper.ToDto(settings) });
    }

    private static async Task<IResult> CreateAsync(
        AdminSiteSettingsRequest request,
        ApplicationDbContext context,
        CancellationToken cancellationToken)
    {
        var validation = ValidateRequest(request, isCreate: true);
        if (validation is not null)
            return validation;

        if (!SiteSettingsRules.TryNormalizeCode(request.Code, out var code))
        {
            return Results.BadRequest(new
            {
                success = false,
                message = "Geçersiz UI kodu. Küçük harf, rakam ve tire kullanın (ör. bizdenal, main-store)."
            });
        }

        var exists = await context.SiteSettings.AnyAsync(s => s.Code == code, cancellationToken);
        if (exists)
        {
            return Results.Conflict(new { success = false, message = "Bu UI kodu zaten kullanılıyor" });
        }

        var settings = new SiteSettings
        {
            Id = Guid.CreateVersion7().ToString(),
            Code = code,
            Name = request.Name.Trim(),
            SiteName = request.SiteName.Trim()
        };

        SiteSettingsHelper.ApplyUpdate(settings, request);

        if (settings.IsDefault)
        {
            await SiteSettingsHelper.ClearDefaultFlagAsync(context, settings.Id, cancellationToken);
        }

        context.SiteSettings.Add(settings);
        await context.SaveChangesAsync(cancellationToken);

        return Results.Created($"/api/admin/site-settings/{settings.Id}", new
        {
            success = true,
            data = SiteSettingsHelper.ToDto(settings)
        });
    }

    private static async Task<IResult> UpdateAsync(
        string id,
        AdminSiteSettingsRequest request,
        ApplicationDbContext context,
        CancellationToken cancellationToken)
    {
        var settings = await context.SiteSettings.FirstOrDefaultAsync(s => s.Id == id, cancellationToken);
        if (settings is null)
        {
            return Results.NotFound(new { success = false, message = "Site ayarları bulunamadı" });
        }

        var validation = ValidateRequest(request, isCreate: false);
        if (validation is not null)
            return validation;

        if (!string.IsNullOrWhiteSpace(request.Code))
        {
            if (!SiteSettingsRules.TryNormalizeCode(request.Code, out var code))
            {
                return Results.BadRequest(new
                {
                    success = false,
                    message = "Geçersiz UI kodu. Küçük harf, rakam ve tire kullanın (ör. bizdenal, main-store)."
                });
            }

            var codeTaken = await context.SiteSettings
                .AnyAsync(s => s.Code == code && s.Id != id, cancellationToken);

            if (codeTaken)
            {
                return Results.Conflict(new { success = false, message = "Bu UI kodu zaten kullanılıyor" });
            }

            settings.Code = code;
        }

        SiteSettingsHelper.ApplyUpdate(settings, request);

        if (settings.IsDefault)
        {
            await SiteSettingsHelper.ClearDefaultFlagAsync(context, settings.Id, cancellationToken);
        }

        await context.SaveChangesAsync(cancellationToken);

        return Results.Ok(new { success = true, data = SiteSettingsHelper.ToDto(settings) });
    }

    private static async Task<IResult> DeleteAsync(
        string id,
        ApplicationDbContext context,
        CancellationToken cancellationToken)
    {
        var settings = await context.SiteSettings.FirstOrDefaultAsync(s => s.Id == id, cancellationToken);
        if (settings is null)
        {
            return Results.NotFound(new { success = false, message = "Site ayarları bulunamadı" });
        }

        context.SiteSettings.Remove(settings);
        await context.SaveChangesAsync(cancellationToken);

        return Results.Ok(new { success = true, message = "Silindi" });
    }

    private static IResult? ValidateRequest(AdminSiteSettingsRequest request, bool isCreate)
    {
        if (isCreate && string.IsNullOrWhiteSpace(request.Code))
        {
            return Results.BadRequest(new { success = false, message = "UI kodu zorunludur" });
        }

        if (string.IsNullOrWhiteSpace(request.Name))
        {
            return Results.BadRequest(new { success = false, message = "Ad zorunludur" });
        }

        if (string.IsNullOrWhiteSpace(request.SiteName))
        {
            return Results.BadRequest(new { success = false, message = "Site adı zorunludur" });
        }

        return null;
    }
}

public class AdminSiteSettingsRequest
{
    public string? Code { get; set; }
    public string Name { get; set; } = string.Empty;
    public string SiteName { get; set; } = string.Empty;
    public string? Domain { get; set; }
    public string? LogoUrl { get; set; }
    public string? FaviconUrl { get; set; }
    public string? Address { get; set; }
    public List<string>? Emails { get; set; }
    public List<string>? Phones { get; set; }
    public List<string>? WorkingHours { get; set; }
    public SocialLinksDto? SocialLinks { get; set; }
    public PaymentComplianceDto? PaymentCompliance { get; set; }
    public bool IsActive { get; set; } = true;
    public bool IsDefault { get; set; }
}
