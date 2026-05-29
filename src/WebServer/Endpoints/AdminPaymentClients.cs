using ECommerce.Application.Payments;
using ECommerce.Application.Payments.DTOs;
using ECommerce.Domain.Constants;
using ECommerce.Domain.Entities;
using ECommerce.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.WebServer.Endpoints;

public class AdminPaymentClients : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        var group = app.MapGroup("/api/admin/payment-clients")
            .WithTags("Admin")
            .WithOpenApi()
            .RequireAuthorization(Policies.Admin);

        group.MapGet("/", ListAsync);
        group.MapPost("/", CreateAsync);
        group.MapPut("/{id}", UpdateAsync);
        group.MapDelete("/{id}", DeleteAsync);
    }

    private static async Task<IResult> ListAsync(
        ApplicationDbContext context,
        CancellationToken cancellationToken)
    {
        var clients = await context.PaymentClients
            .OrderBy(c => c.Name)
            .ToListAsync(cancellationToken);

        return Results.Ok(new
        {
            success = true,
            data = clients.Select(c => PaymentClientRules.ToAdminDto(c))
        });
    }

    private static async Task<IResult> CreateAsync(
        AdminPaymentClientRequest request,
        ApplicationDbContext context,
        CancellationToken cancellationToken)
    {
        var validation = ValidateRequest(request);
        if (validation is not null)
            return validation;

        var code = request.Code!.Trim().ToLowerInvariant();
        if (await context.PaymentClients.AnyAsync(c => c.Code == code, cancellationToken))
            return Results.BadRequest(new { success = false, message = "Bu kod zaten kullanılıyor" });

        if (request.IsDefault)
            await ClearDefaultAsync(context, null, cancellationToken);

        var globalSettings = await context.PaymentSettings
            .FirstOrDefaultAsync(s => s.Id == PaymentSettings.GlobalId, cancellationToken);
        var defaultCurrency = globalSettings?.DefaultCurrency ?? "TRY";

        var client = new PaymentClient
        {
            Id = Guid.NewGuid().ToString(),
            Code = code,
            Name = request.Name!.Trim(),
            TenantCode = string.IsNullOrWhiteSpace(request.TenantCode) ? null : request.TenantCode.Trim().ToUpperInvariant(),
            ApiKey = request.ApiKey!.Trim(),
            SecretKey = request.SecretKey!.Trim(),
            IsSandbox = request.IsSandbox,
            IsActive = request.IsActive,
            IsDefault = request.IsDefault,
            Locale = string.IsNullOrWhiteSpace(request.Locale) ? "tr" : request.Locale.Trim().ToLowerInvariant(),
            Currency = PaymentClientRules.NormalizeCurrency(request.Currency, defaultCurrency),
            CallbackBaseUrl = PaymentClientRules.NormalizeCallbackBaseUrl(request.CallbackBaseUrl),
            EnabledInstallments = string.IsNullOrWhiteSpace(request.EnabledInstallments) ? null : request.EnabledInstallments.Trim(),
            SuccessRedirectUrl = string.IsNullOrWhiteSpace(request.SuccessRedirectUrl) ? null : request.SuccessRedirectUrl.Trim(),
            FailureRedirectUrl = string.IsNullOrWhiteSpace(request.FailureRedirectUrl) ? null : request.FailureRedirectUrl.Trim()
        };

        context.PaymentClients.Add(client);
        await context.SaveChangesAsync(cancellationToken);

        return Results.Created($"/api/admin/payment-clients/{client.Id}", new { success = true, data = PaymentClientRules.ToAdminDto(client) });
    }

    private static async Task<IResult> UpdateAsync(
        string id,
        AdminPaymentClientRequest request,
        ApplicationDbContext context,
        CancellationToken cancellationToken)
    {
        var client = await context.PaymentClients.FirstOrDefaultAsync(c => c.Id == id, cancellationToken);
        if (client is null)
            return Results.NotFound(new { success = false, message = "Ödeme istemcisi bulunamadı" });

        var validation = ValidateRequest(request, isUpdate: true);
        if (validation is not null)
            return validation;

        var code = request.Code!.Trim().ToLowerInvariant();
        if (await context.PaymentClients.AnyAsync(c => c.Code == code && c.Id != id, cancellationToken))
            return Results.BadRequest(new { success = false, message = "Bu kod zaten kullanılıyor" });

        if (request.IsDefault && !client.IsDefault)
            await ClearDefaultAsync(context, id, cancellationToken);

        client.Code = code;
        client.Name = request.Name!.Trim();
        client.TenantCode = string.IsNullOrWhiteSpace(request.TenantCode) ? null : request.TenantCode.Trim().ToUpperInvariant();
        client.ApiKey = request.ApiKey!.Trim();
        if (!string.IsNullOrWhiteSpace(request.SecretKey))
            client.SecretKey = request.SecretKey.Trim();
        client.IsSandbox = request.IsSandbox;
        client.IsActive = request.IsActive;
        client.IsDefault = request.IsDefault;
        client.Locale = string.IsNullOrWhiteSpace(request.Locale) ? client.Locale : request.Locale.Trim().ToLowerInvariant();
        if (!string.IsNullOrWhiteSpace(request.Currency))
            client.Currency = PaymentClientRules.NormalizeCurrency(request.Currency, client.Currency);
        client.CallbackBaseUrl = PaymentClientRules.NormalizeCallbackBaseUrl(request.CallbackBaseUrl);
        client.EnabledInstallments = string.IsNullOrWhiteSpace(request.EnabledInstallments) ? null : request.EnabledInstallments.Trim();
        client.SuccessRedirectUrl = string.IsNullOrWhiteSpace(request.SuccessRedirectUrl) ? null : request.SuccessRedirectUrl.Trim();
        client.FailureRedirectUrl = string.IsNullOrWhiteSpace(request.FailureRedirectUrl) ? null : request.FailureRedirectUrl.Trim();

        await context.SaveChangesAsync(cancellationToken);
        return Results.Ok(new { success = true, data = PaymentClientRules.ToAdminDto(client) });
    }

    private static async Task<IResult> DeleteAsync(
        string id,
        ApplicationDbContext context,
        CancellationToken cancellationToken)
    {
        var client = await context.PaymentClients.FirstOrDefaultAsync(c => c.Id == id, cancellationToken);
        if (client is null)
            return Results.NotFound(new { success = false, message = "Ödeme istemcisi bulunamadı" });

        var hasSessions = await context.PaymentSessions.AnyAsync(s => s.PaymentClientId == id, cancellationToken);
        if (hasSessions)
            return Results.BadRequest(new { success = false, message = "Bu istemciye bağlı ödeme oturumları var, silinemez" });

        context.PaymentClients.Remove(client);
        await context.SaveChangesAsync(cancellationToken);
        return Results.Ok(new { success = true, message = "Silindi" });
    }

    private static async Task ClearDefaultAsync(ApplicationDbContext context, string? exceptId, CancellationToken cancellationToken)
    {
        var defaults = await context.PaymentClients
            .Where(c => c.IsDefault && (exceptId == null || c.Id != exceptId))
            .ToListAsync(cancellationToken);

        foreach (var c in defaults)
            c.IsDefault = false;
    }

    private static IResult? ValidateRequest(AdminPaymentClientRequest request, bool isUpdate = false)
    {
        if (string.IsNullOrWhiteSpace(request.Code))
            return Results.BadRequest(new { success = false, message = "Kod zorunludur" });

        if (string.IsNullOrWhiteSpace(request.Name))
            return Results.BadRequest(new { success = false, message = "Ad zorunludur" });

        if (string.IsNullOrWhiteSpace(request.ApiKey))
            return Results.BadRequest(new { success = false, message = "API anahtarı zorunludur" });

        if (!isUpdate && string.IsNullOrWhiteSpace(request.SecretKey))
            return Results.BadRequest(new { success = false, message = "Gizli anahtar zorunludur" });

        if (!string.IsNullOrWhiteSpace(request.Currency) &&
            !PaymentClientRules.TryNormalizeCurrency(request.Currency, out _))
        {
            return Results.BadRequest(new
            {
                success = false,
                message = $"Geçersiz para birimi. Desteklenen: {string.Join(", ", PaymentClientRules.SupportedCurrencies)}"
            });
        }

        return null;
    }
}

public class AdminPaymentClientRequest
{
    public string? Code { get; set; }
    public string? Name { get; set; }
    public string? TenantCode { get; set; }
    public string? ApiKey { get; set; }
    public string? SecretKey { get; set; }
    public bool IsSandbox { get; set; } = true;
    public bool IsActive { get; set; } = true;
    public bool IsDefault { get; set; }
    public string? Locale { get; set; }
    public string? Currency { get; set; }
    public string? CallbackBaseUrl { get; set; }
    public string? EnabledInstallments { get; set; }
    public string? SuccessRedirectUrl { get; set; }
    public string? FailureRedirectUrl { get; set; }
}
