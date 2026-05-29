using System.Security.Claims;
using ECommerce.Application.Common.Configuration;
using ECommerce.Application.Common.Interfaces;
using ECommerce.Application.Payments;
using ECommerce.Application.Payments.DTOs;
using ECommerce.Domain.Entities;
using ECommerce.Domain.Enums;
using ECommerce.Infrastructure.Data;
using ECommerce.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace ECommerce.WebServer.Endpoints;

public class IyzicoPayments : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        var group = app.MapGroup("/api/payments/iyzico")
            .WithTags("Payments")
            .WithOpenApi();

        group.MapGet("/clients", ListActiveClientsAsync);
        group.MapPost("/initialize", InitializeAsync).RequireAuthorization();
        group.MapPost("/callback/{clientCode}", CallbackAsync).DisableAntiforgery();
        group.MapGet("/callback/{clientCode}", CallbackGetAsync).DisableAntiforgery();
    }

    private static async Task<IResult> ListActiveClientsAsync(
        ApplicationDbContext context,
        CancellationToken cancellationToken)
    {
        var clients = await context.PaymentClients
            .Where(c => c.IsActive)
            .OrderByDescending(c => c.IsDefault)
            .ThenBy(c => c.Name)
            .ToListAsync(cancellationToken);

        return Results.Ok(new
        {
            success = true,
            data = clients.Select(PaymentClientRules.ToPublicDto)
        });
    }

    private static async Task<IResult> InitializeAsync(
        IyzicoInitializeRequest request,
        ApplicationDbContext context,
        UserManager<ApplicationUser> userManager,
        IPaymentClientResolver clientResolver,
        IIyzicoCheckoutService checkoutService,
        ITenant tenant,
        IOptions<PaymentsOptions> paymentsOptions,
        HttpContext httpContext,
        CancellationToken cancellationToken)
    {
        var userId = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
            return Results.Unauthorized();

        var client = await clientResolver.ResolveAsync(request.PaymentClientCode, tenant.Code, cancellationToken);
        if (client is null)
        {
            return Results.BadRequest(new
            {
                success = false,
                message = "Aktif iyzico ödeme yapılandırması bulunamadı. Admin panelinden ödeme istemcisi ekleyin."
            });
        }

        var order = await context.Orders
            .Include(o => o.Items)
            .Include(o => o.ShippingAddress)
            .FirstOrDefaultAsync(o => o.Id == request.OrderId && o.UserId == userId, cancellationToken);

        if (order is null)
            return Results.NotFound(new { success = false, message = "Sipariş bulunamadı" });

        if (order.PaymentStatus == PaymentStatus.Completed)
            return Results.BadRequest(new { success = false, message = "Sipariş zaten ödendi" });

        if (order.Status == OrderStatus.Cancelled)
            return Results.BadRequest(new { success = false, message = "İptal edilmiş sipariş için ödeme başlatılamaz" });

        var user = await userManager.FindByIdAsync(userId);
        if (user is null)
            return Results.Unauthorized();

        var globalSettings = await context.PaymentSettings
            .FirstOrDefaultAsync(s => s.Id == PaymentSettings.GlobalId, cancellationToken);

        var requestBase = $"{httpContext.Request.Scheme}://{httpContext.Request.Host}";
        var callbackBase = PaymentClientRules.ResolveCallbackBaseUrl(
            client,
            globalSettings,
            paymentsOptions.Value.CallbackBaseUrl,
            requestBase);

        var callbackUrl = PaymentClientRules.BuildIyzicoCallbackUrl(callbackBase, client.Code);

        try
        {
            var buyer = new ApplicationUserInfo(
                user.Id,
                user.Email ?? "customer@example.com",
                string.IsNullOrWhiteSpace(user.FullName) ? user.Email ?? "Müşteri" : user.FullName,
                user.PhoneNumber,
                httpContext.Connection.RemoteIpAddress?.ToString() ?? "127.0.0.1");

            var result = await checkoutService.InitializeAsync(order, client, buyer, callbackUrl, cancellationToken);

            return Results.Ok(new { success = true, data = result });
        }
        catch (Exception ex)
        {
            return Results.BadRequest(new { success = false, message = ex.Message });
        }
    }

    private static Task<IResult> CallbackGetAsync(
        string clientCode,
        HttpContext httpContext,
        ApplicationDbContext context,
        IPaymentClientResolver clientResolver,
        IIyzicoCheckoutService checkoutService,
        IOptions<PaymentsOptions> paymentsOptions,
        CancellationToken cancellationToken)
    {
        var token = httpContext.Request.Query["token"].FirstOrDefault();
        return HandleCallbackAsync(clientCode, token, context, clientResolver, checkoutService, paymentsOptions, cancellationToken);
    }

    private static async Task<IResult> CallbackAsync(
        string clientCode,
        HttpContext httpContext,
        ApplicationDbContext context,
        IPaymentClientResolver clientResolver,
        IIyzicoCheckoutService checkoutService,
        IOptions<PaymentsOptions> paymentsOptions,
        CancellationToken cancellationToken)
    {
        var token = httpContext.Request.Form["token"].FirstOrDefault()
                    ?? httpContext.Request.Query["token"].FirstOrDefault();

        return await HandleCallbackAsync(clientCode, token, context, clientResolver, checkoutService, paymentsOptions, cancellationToken);
    }

    private static async Task<IResult> HandleCallbackAsync(
        string clientCode,
        string? token,
        ApplicationDbContext context,
        IPaymentClientResolver clientResolver,
        IIyzicoCheckoutService checkoutService,
        IOptions<PaymentsOptions> paymentsOptions,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(token))
            return Results.BadRequest(new { success = false, message = "Token eksik" });

        var client = await clientResolver.ResolveAsync(clientCode, null, cancellationToken);
        if (client is null || !client.IsActive)
            return Results.NotFound(new { success = false, message = "Ödeme istemcisi bulunamadı" });

        try
        {
            var result = await checkoutService.CompleteCallbackAsync(client, token, cancellationToken);

            var redirect = result.RedirectUrl
                           ?? (result.Success
                               ? paymentsOptions.Value.DefaultSuccessRedirectUrl
                               : paymentsOptions.Value.DefaultFailureRedirectUrl);

            redirect = redirect.Replace("{orderId}", result.OrderId, StringComparison.Ordinal);

            if (!string.IsNullOrEmpty(redirect) && (redirect.StartsWith("http", StringComparison.OrdinalIgnoreCase) || redirect.StartsWith('/')))
            {
                return Results.Redirect(redirect);
            }

            return Results.Ok(new { success = result.Success, data = result });
        }
        catch (Exception ex)
        {
            return Results.BadRequest(new { success = false, message = ex.Message });
        }
    }
}
