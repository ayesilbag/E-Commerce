using ECommerce.Application.Payments;
using ECommerce.Application.Payments.DTOs;
using ECommerce.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using ECommerce.Infrastructure.Identity;

namespace ECommerce.WebServer.Endpoints;

public class Payments : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        var group = app.MapGroup("/api/payments")
            .WithTags("Payments")
            .WithOpenApi();

        group.MapPost("/validate", ValidatePaymentAsync);
        group.MapGet("/bank-accounts", GetBankAccountsAsync);
        group.MapGet("/methods", GetPaymentMethodsAsync).RequireAuthorization();
        group.MapPost("/process", ProcessPaymentAsync).RequireAuthorization();
    }

    private static async Task<IResult> GetBankAccountsAsync(
        ApplicationDbContext context,
        CancellationToken cancellationToken)
    {
        var accounts = await context.BankAccounts
            .Where(a => a.IsActive)
            .OrderBy(a => a.SortOrder)
            .ThenBy(a => a.BankName)
            .ToListAsync(cancellationToken);

        return Results.Ok(new
        {
            success = true,
            data = accounts.Select(BankAccountRules.ToDto),
            message = BankAccountRules.DefaultTransferMessage
        });
    }

    private IResult ValidatePaymentAsync(
        ValidatePaymentRequest request)
    {
        // Basic validation (in real implementation, use payment gateway API)
        if (string.IsNullOrWhiteSpace(request.CardNumber) || request.CardNumber.Length < 16)
            return Results.BadRequest(new { success = false, message = "Geçersiz kart numarası" });

        if (string.IsNullOrWhiteSpace(request.CardName))
            return Results.BadRequest(new { success = false, message = "Kart üzerindeki isim gerekli" });

        if (string.IsNullOrWhiteSpace(request.ExpiryDate))
            return Results.BadRequest(new { success = false, message = "Son kullanma tarihi gerekli" });

        if (string.IsNullOrWhiteSpace(request.Cvv) || request.Cvv.Length < 3)
            return Results.BadRequest(new { success = false, message = "CVV gerekli" });

        // Validate expiry date format (MM/YY)
        if (!request.ExpiryDate.Contains("/") || request.ExpiryDate.Length != 5)
            return Results.BadRequest(new { success = false, message = "Geçersiz son kullanma tarihi formatı (MM/YY)" });

        return Results.Ok(new { success = true, message = "Ödeme bilgileri doğru" });
    }

    private Task<IResult> GetPaymentMethodsAsync(
        ApplicationDbContext context,
        HttpContext httpContext,
        CancellationToken cancellationToken)
    {
        var userId = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
            return Task.FromResult(Results.Unauthorized());

        // In a real implementation, you would retrieve saved payment methods from database
        // For now, return empty list as we don't store payment methods
        var paymentMethods = new List<Application.Payments.DTOs.PaymentMethodDto>();

        return Task.FromResult(Results.Ok(new { success = true, data = paymentMethods }));
    }

    private async Task<IResult> ProcessPaymentAsync(
        ProcessPaymentRequest request,
        ApplicationDbContext context,
        HttpContext httpContext,
        CancellationToken cancellationToken)
    {
        var userId = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
            return Results.Unauthorized();

        // Validate order exists and belongs to user
        var order = await context.Orders
            .FirstOrDefaultAsync(o => o.Id == request.OrderId && o.UserId == userId, cancellationToken);
        if (order is null)
            return Results.NotFound(new { success = false, message = "Sipariş bulunamadı" });

        // In a real implementation, you would call payment gateway API here
        // For demo purposes, simulate successful payment
        var transactionId = $"TXN-{DateTime.UtcNow:yyyyMMdd}-{new Random().Next(10000, 99999)}";

        // Update order status
        order.PaymentStatus = Domain.Enums.PaymentStatus.Completed;
        order.PaidAt = DateTime.UtcNow;
        order.TransactionId = transactionId;
        order.Status = Domain.Enums.OrderStatus.Confirmed;

        await context.SaveChangesAsync(cancellationToken);

        var response = new Application.Payments.DTOs.ProcessPaymentResponse
        {
            TransactionId = transactionId,
            Status = "completed",
            Amount = request.Amount
        };

        return Results.Ok(new { success = true, message = "Ödeme başarıyla işlendi", data = response });
    }
}
