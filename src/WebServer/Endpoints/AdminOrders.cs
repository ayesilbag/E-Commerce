using ECommerce.Application.Payments;
using ECommerce.Application.Payments.DTOs;
using ECommerce.Domain.Constants;
using ECommerce.Domain.Enums;
using ECommerce.Infrastructure.Data;
using ECommerce.Infrastructure.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.WebServer.Endpoints;

public class AdminOrders : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        var group = app.MapGroup("/api/admin/orders")
            .WithTags("Admin")
            .WithOpenApi()
            .RequireAuthorization(Policies.Admin);

        group.MapGet("/", ListAsync);
        group.MapGet("/{orderId}", GetAsync);
        group.MapPatch("/{orderId}/status", UpdateStatusAsync);
    }

    private static async Task<IResult> ListAsync(
        ApplicationDbContext context,
        UserManager<ApplicationUser> userManager,
        CancellationToken cancellationToken,
        [FromQuery] int page = 1,
        [FromQuery] int limit = 20,
        [FromQuery] string? status = null,
        [FromQuery] string? search = null)
    {
        var query = context.Orders
            .Include(o => o.Items)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(status) && Enum.TryParse<OrderStatus>(status, true, out var orderStatus))
        {
            query = query.Where(o => o.Status == orderStatus);
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            query = query.Where(o => o.OrderNumber.Contains(search));
        }

        var total = await query.CountAsync(cancellationToken);
        var orders = await query
            .OrderByDescending(o => o.Created)
            .Skip((page - 1) * limit)
            .Take(limit)
            .ToListAsync(cancellationToken);

        var userIds = orders.Select(o => o.UserId).Distinct().ToList();
        var users = await userManager.Users
            .Where(u => userIds.Contains(u.Id))
            .Select(u => new { u.Id, u.Email, u.FullName })
            .ToListAsync(cancellationToken);

        var items = orders.Select(o =>
        {
            var user = users.FirstOrDefault(u => u.Id == o.UserId);
            return new
            {
                o.Id,
                o.OrderNumber,
                status = o.Status.ToString(),
                paymentStatus = o.PaymentStatus.ToString(),
                o.Total,
                itemCount = o.Items.Count,
                customerName = user?.FullName ?? "—",
                customerEmail = user?.Email ?? "—",
                created = o.Created
            };
        });

        return Results.Ok(new
        {
            success = true,
            data = new
            {
                orders = items,
                pagination = new { page, limit, total, pages = (int)Math.Ceiling(total / (double)limit) }
            }
        });
    }

    private static async Task<IResult> GetAsync(
        string orderId,
        ApplicationDbContext context,
        UserManager<ApplicationUser> userManager,
        CancellationToken cancellationToken)
    {
        var order = await context.Orders
            .Include(o => o.Items)
            .Include(o => o.ShippingAddress)
            .FirstOrDefaultAsync(o => o.Id == orderId, cancellationToken);

        if (order is null)
        {
            return Results.NotFound(new { success = false, message = "Sipariş bulunamadı" });
        }

        var user = await userManager.FindByIdAsync(order.UserId);

        BankTransferInstructionsDto? bankTransferInstructions = null;
        if (BankAccountRules.IsBankTransfer(order.PaymentMethod.Type)
            && order.PaymentStatus == PaymentStatus.Pending)
        {
            var accounts = await context.BankAccounts
                .Where(a => a.IsActive)
                .OrderBy(a => a.SortOrder)
                .ThenBy(a => a.BankName)
                .ToListAsync(cancellationToken);

            bankTransferInstructions = new BankTransferInstructionsDto
            {
                Type = "BankTransfer",
                OrderNumber = order.OrderNumber,
                Message = $"{BankAccountRules.DefaultTransferMessage} Sipariş no: {order.OrderNumber}",
                Accounts = accounts.Select(BankAccountRules.ToDto).ToArray()
            };
        }

        return Results.Ok(new
        {
            success = true,
            data = new
            {
                order.Id,
                order.OrderNumber,
                status = order.Status.ToString(),
                paymentStatus = order.PaymentStatus.ToString(),
                paymentMethodType = order.PaymentMethod.Type,
                bankTransferInstructions,
                order.Subtotal,
                order.DiscountAmount,
                order.DiscountCode,
                order.ShippingCost,
                order.Tax,
                order.Total,
                order.TrackingNumber,
                order.Notes,
                customer = new { user?.FullName, user?.Email },
                shippingAddress = order.ShippingAddress is null ? null : new
                {
                    order.ShippingAddress.FullName,
                    order.ShippingAddress.Phone,
                    order.ShippingAddress.AddressLine,
                    order.ShippingAddress.City,
                    order.ShippingAddress.District,
                    order.ShippingAddress.PostalCode
                },
                shippingMethod = new
                {
                    order.ShippingMethod.Name,
                    order.ShippingMethod.Provider,
                    order.ShippingMethod.Cost
                },
                items = order.Items.Select(i => new
                {
                    i.Id,
                    i.ProductId,
                    i.ProductName,
                    i.ProductImage,
                    i.Quantity,
                    i.Price,
                    i.Subtotal
                }),
                created = order.Created,
                paidAt = order.PaidAt,
                shippedAt = order.ShippedAt,
                deliveredAt = order.DeliveredAt
            }
        });
    }

    private static async Task<IResult> UpdateStatusAsync(
        string orderId,
        AdminOrderStatusRequest request,
        ApplicationDbContext context,
        CancellationToken cancellationToken)
    {
        var order = await context.Orders.FirstOrDefaultAsync(o => o.Id == orderId, cancellationToken);
        if (order is null)
        {
            return Results.NotFound(new { success = false, message = "Sipariş bulunamadı" });
        }

        if (!Enum.TryParse<OrderStatus>(request.Status, true, out var newStatus))
        {
            return Results.BadRequest(new { success = false, message = "Geçersiz durum" });
        }

        order.Status = newStatus;
        order.LastModified = DateTimeOffset.UtcNow;

        if (!string.IsNullOrWhiteSpace(request.TrackingNumber))
        {
            order.TrackingNumber = request.TrackingNumber.Trim();
        }

        var now = DateTime.UtcNow;
        switch (newStatus)
        {
            case OrderStatus.Shipped:
                order.ShippedAt ??= now;
                break;
            case OrderStatus.Delivered:
                order.DeliveredAt ??= now;
                break;
            case OrderStatus.Cancelled:
                order.CancelledAt ??= now;
                order.CancellationReason = request.CancellationReason;
                break;
            case OrderStatus.Confirmed:
            case OrderStatus.Processing:
                order.PaymentStatus = PaymentStatus.Completed;
                order.PaidAt ??= now;
                break;
        }

        await context.SaveChangesAsync(cancellationToken);
        return Results.Ok(new { success = true, message = "Sipariş güncellendi", data = new { status = order.Status.ToString() } });
    }
}

public class AdminOrderStatusRequest
{
    public required string Status { get; set; }
    public string? TrackingNumber { get; set; }
    public string? CancellationReason { get; set; }
}
