using ECommerce.Application.Payments;
using ECommerce.Application.Payments.DTOs;
using ECommerce.Domain.Constants;
using ECommerce.Domain.Entities;
using ECommerce.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.WebServer.Endpoints;

public class AdminPaymentSettings : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        var group = app.MapGroup("/api/admin/payment-settings")
            .WithTags("Admin")
            .WithOpenApi()
            .RequireAuthorization(Policies.Admin);

        group.MapGet("/", GetAsync);
        group.MapPut("/", UpdateAsync);
    }

    private static async Task<PaymentSettings> GetOrCreateAsync(
        ApplicationDbContext context,
        CancellationToken cancellationToken)
    {
        var settings = await context.PaymentSettings
            .FirstOrDefaultAsync(s => s.Id == PaymentSettings.GlobalId, cancellationToken);

        if (settings is not null)
            return settings;

        settings = new PaymentSettings
        {
            Id = PaymentSettings.GlobalId,
            DefaultCurrency = "TRY"
        };

        context.PaymentSettings.Add(settings);
        await context.SaveChangesAsync(cancellationToken);
        return settings;
    }

    private static async Task<IResult> GetAsync(
        ApplicationDbContext context,
        CancellationToken cancellationToken)
    {
        var settings = await GetOrCreateAsync(context, cancellationToken);

        return Results.Ok(new
        {
            success = true,
            data = new PaymentSettingsDto
            {
                CallbackBaseUrl = settings.CallbackBaseUrl,
                DefaultCurrency = settings.DefaultCurrency
            }
        });
    }

    private static async Task<IResult> UpdateAsync(
        AdminPaymentSettingsRequest request,
        ApplicationDbContext context,
        CancellationToken cancellationToken)
    {
        if (!PaymentClientRules.TryNormalizeCurrency(request.DefaultCurrency, out var currency))
        {
            return Results.BadRequest(new
            {
                success = false,
                message = $"Geçersiz para birimi. Desteklenen: {string.Join(", ", PaymentClientRules.SupportedCurrencies)}"
            });
        }

        var settings = await GetOrCreateAsync(context, cancellationToken);
        settings.CallbackBaseUrl = PaymentClientRules.NormalizeCallbackBaseUrl(request.CallbackBaseUrl);
        settings.DefaultCurrency = currency;

        await context.SaveChangesAsync(cancellationToken);

        return Results.Ok(new
        {
            success = true,
            data = new PaymentSettingsDto
            {
                CallbackBaseUrl = settings.CallbackBaseUrl,
                DefaultCurrency = settings.DefaultCurrency
            }
        });
    }
}

public class AdminPaymentSettingsRequest
{
    public string? CallbackBaseUrl { get; set; }
    public string? DefaultCurrency { get; set; }
}
