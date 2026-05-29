using ECommerce.Application.Orders.DTOs;
using ECommerce.Application.Payments;
using ECommerce.Application.Payments.DTOs;
using ECommerce.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using ECommerce.Infrastructure.Identity;

namespace ECommerce.WebServer.Endpoints;

public class Orders : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        var group = app.MapGroup("/api/orders")
            .WithTags("Orders")
            .WithOpenApi()
            .RequireAuthorization();

        group.MapPost("/", CreateOrderAsync);
        group.MapGet("/", GetOrdersAsync);
        group.MapGet("/{orderId}", GetOrderDetailAsync);
        group.MapPost("/{orderId}/cancel", CancelOrderAsync);
        group.MapPost("/{orderId}/return", ReturnOrderAsync);
    }

    private async Task<IResult> CreateOrderAsync(
        CreateOrderRequest request,
        ApplicationDbContext context,
        UserManager<ApplicationUser> userManager,
        HttpContext httpContext,
        CancellationToken cancellationToken)
    {
        var userId = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
            return Results.Unauthorized();

        // Get cart items
        var cart = await context.Carts
            .Include(c => c.Items)
            .FirstOrDefaultAsync(c => c.UserId == userId, cancellationToken);

        if (cart?.Items == null || cart.Items.Count == 0)
            return Results.BadRequest(new { success = false, message = "Sepet boş" });

        // Get shipping address
        var address = await context.Addresses
            .FirstOrDefaultAsync(a => a.Id == request.ShippingAddressId && a.UserId == userId, cancellationToken);
        if (address is null)
            return Results.BadRequest(new { success = false, message = "Geçersiz adres" });

        if (BankAccountRules.IsBankTransfer(request.PaymentMethod.Type))
        {
            var hasActiveAccount = await context.BankAccounts.AnyAsync(a => a.IsActive, cancellationToken);
            if (!hasActiveAccount)
            {
                return Results.BadRequest(new
                {
                    success = false,
                    message = "Havale ile ödeme şu an kullanılamıyor. Lütfen farklı bir ödeme yöntemi seçin."
                });
            }
        }

        if (PaymentClientRules.IsIyzicoPayment(request.PaymentMethod.Type))
        {
            var hasIyzico = await context.PaymentClients.AnyAsync(c => c.IsActive, cancellationToken);
            if (!hasIyzico)
            {
                return Results.BadRequest(new
                {
                    success = false,
                    message = "Kart ile ödeme (iyzico) şu an kullanılamıyor."
                });
            }
        }

        // Create order
        var order = new Domain.Entities.Order
        {
            Id = Guid.NewGuid().ToString(),
            OrderNumber = $"ORD-{DateTime.UtcNow:yyyyMMdd}-{new Random().Next(1000, 9999)}",
            UserId = userId,
            Status = Domain.Enums.OrderStatus.Pending,
            ShippingAddressId = address.Id,
            ShippingAddress = address,
            ShippingMethod = request.ShippingMethod,
            PaymentMethod = request.PaymentMethod,
            PaymentStatus = Domain.Enums.PaymentStatus.Pending,
            Notes = request.Notes,
            Created = DateTimeOffset.UtcNow,
            Subtotal = cart.Subtotal,
            DiscountAmount = cart.DiscountAmount,
            Tax = cart.Tax,
            Total = cart.Total,
            Items = cart.Items.Select(item => new Domain.Entities.OrderItem
            {
                Id = Guid.NewGuid().ToString(),
                ProductId = item.ProductId,
                ProductName = "", // Will be populated from product
                ProductImage = "",
                Quantity = item.Quantity,
                Price = 0, // Will be populated from product
                Subtotal = 0
            }).ToList()
        };

        // Calculate totals and populate product info
        decimal subtotal = 0;
        var productIds = cart.Items.Select(i => i.ProductId).ToList();
        var products = await context.Products
            .Where(p => productIds.Contains(p.Id))
            .ToListAsync(cancellationToken);

        foreach (var item in order.Items)
        {
            var product = products.FirstOrDefault(p => p.Id == item.ProductId);
            if (product != null)
            {
                item.ProductName = product.Name;
                item.ProductImage = product.Image;
                item.Price = product.Price;
                item.Subtotal = product.Price * item.Quantity;
                subtotal += item.Subtotal;
            }
        }

        order.Subtotal = subtotal;
        order.Total = subtotal + order.Tax + order.ShippingCost - order.DiscountAmount;

        context.Orders.Add(order);

        // Clear cart
        context.CartItems.RemoveRange(cart.Items);

        await context.SaveChangesAsync(cancellationToken);

        var orderDto = MapToOrderDto(order);
        BankTransferInstructionsDto? paymentInstructions = null;
        object? iyzicoPayment = null;

        if (PaymentClientRules.IsIyzicoPayment(request.PaymentMethod.Type))
        {
            iyzicoPayment = new
            {
                type = "iyzico",
                orderId = order.Id,
                message = "Sipariş oluşturuldu. Ödeme için POST /api/payments/iyzico/initialize çağrısı yapın."
            };
        }

        if (BankAccountRules.IsBankTransfer(request.PaymentMethod.Type))
        {
            var accounts = await context.BankAccounts
                .Where(a => a.IsActive)
                .OrderBy(a => a.SortOrder)
                .ThenBy(a => a.BankName)
                .ToListAsync(cancellationToken);

            paymentInstructions = new BankTransferInstructionsDto
            {
                Type = "BankTransfer",
                OrderNumber = order.OrderNumber,
                Message = $"{BankAccountRules.DefaultTransferMessage} Sipariş no: {order.OrderNumber}",
                Accounts = accounts.Select(BankAccountRules.ToDto).ToArray()
            };
        }

        return Results.Created($"/api/orders/{order.Id}", new
        {
            success = true,
            message = "Sipariş başarıyla oluşturuldu",
            data = new { order = orderDto, paymentInstructions, iyzicoPayment }
        });
    }

    private async Task<IResult> GetOrdersAsync(
        ApplicationDbContext context,
        HttpContext httpContext,
        CancellationToken cancellationToken,
        [FromQuery] int page = 1,
        [FromQuery] int limit = 10,
        [FromQuery] string? status = "all")
    {
        var userId = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
            return Results.Unauthorized();

        var query = context.Orders
            .Where(o => o.UserId == userId);

        if (status != "all" && Enum.TryParse<Domain.Enums.OrderStatus>(status, true, out var statusEnum))
        {
            query = query.Where(o => o.Status == statusEnum);
        }

        var totalCount = await query.CountAsync(cancellationToken);
        var orders = await query
            .OrderByDescending(o => o.Created)
            .Skip((page - 1) * limit)
            .Take(limit)
            .Select(o => new OrderDto
            {
                Id = o.Id,
                OrderNumber = o.OrderNumber,
                Status = o.Status,
                PaymentStatus = o.PaymentStatus,
                Subtotal = o.Subtotal,
                DiscountAmount = o.DiscountAmount,
                ShippingCost = o.ShippingCost,
                Tax = o.Tax,
                Total = o.Total,
                Created = o.Created.DateTime,
                Items = Array.Empty<OrderItemDto>()
            })
            .ToListAsync(cancellationToken);

        return Results.Ok(new { success = true, data = new { orders, pagination = new { page, limit, total = totalCount, pages = (int)Math.Ceiling((double)totalCount / limit) } } });
    }

    private async Task<IResult> GetOrderDetailAsync(
        string orderId,
        ApplicationDbContext context,
        HttpContext httpContext,
        CancellationToken cancellationToken)
    {
        var userId = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
            return Results.Unauthorized();

        var order = await context.Orders
            .Include(o => o.Items)
            .Include(o => o.ShippingAddress)
            .FirstOrDefaultAsync(o => o.Id == orderId && o.UserId == userId, cancellationToken);

        if (order is null)
            return Results.NotFound(new { success = false, message = "Sipariş bulunamadı" });

        var orderDto = MapToOrderDto(order, includeItems: true);
        return Results.Ok(new { success = true, data = new { order = orderDto } });
    }

    private async Task<IResult> CancelOrderAsync(
        string orderId,
        CancelOrderRequest request,
        ApplicationDbContext context,
        HttpContext httpContext,
        CancellationToken cancellationToken)
    {
        var userId = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
            return Results.Unauthorized();

        var order = await context.Orders
            .FirstOrDefaultAsync(o => o.Id == orderId && o.UserId == userId, cancellationToken);

        if (order is null)
            return Results.NotFound(new { success = false, message = "Sipariş bulunamadı" });

        if (order.Status != Domain.Enums.OrderStatus.Pending)
            return Results.BadRequest(new { success = false, message = "Sadece bekleyen siparişler iptal edilebilir" });

        order.Status = Domain.Enums.OrderStatus.Cancelled;
        order.CancelledAt = DateTime.UtcNow;
        order.CancellationReason = request.Reason;

        await context.SaveChangesAsync(cancellationToken);

        return Results.Ok(new { success = true, message = "Sipariş başarıyla iptal edildi", data = new { order = new { id = order.Id, status = order.Status } } });
    }

    private async Task<IResult> ReturnOrderAsync(
        string orderId,
        ReturnOrderRequest request,
        ApplicationDbContext context,
        HttpContext httpContext,
        CancellationToken cancellationToken)
    {
        var userId = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
            return Results.Unauthorized();

        var order = await context.Orders
            .Include(o => o.Items)
            .FirstOrDefaultAsync(o => o.Id == orderId && o.UserId == userId, cancellationToken);

        if (order is null)
            return Results.NotFound(new { success = false, error = new { code = "ORDER_NOT_FOUND", message = "Sipariş bulunamadı" } });

        if (order.Status != Domain.Enums.OrderStatus.Delivered && order.Status != Domain.Enums.OrderStatus.Shipped)
            return Results.BadRequest(new { success = false, message = "Sadece teslim edilmiş veya kargoya verilmiş siparişler iade edilebilir" });

        // Create return record (in real implementation, you would have a separate Returns table)
        var returnId = $"RET-{DateTime.UtcNow:yyyyMMdd}-{new Random().Next(1000, 9999)}";

        // Calculate refund amount (simplified - all items)
        var refundAmount = order.Total;

        var response = new
        {
            returnId = returnId,
            status = "pending",
            refundAmount = refundAmount
        };

        return Results.Created($"/api/orders/{orderId}/return", new { success = true, message = "İade talebi oluşturuldu", data = response });
    }

    private static OrderDto MapToOrderDto(Domain.Entities.Order order, bool includeItems = false)
    {
        return new OrderDto
        {
            Id = order.Id,
            OrderNumber = order.OrderNumber,
            Status = order.Status,
            PaymentStatus = order.PaymentStatus,
            Subtotal = order.Subtotal,
            DiscountAmount = order.DiscountAmount,
            ShippingCost = order.ShippingCost,
            Tax = order.Tax,
            Total = order.Total,
            Created = order.Created.DateTime,
            Items = includeItems ? order.Items.Select(item => new OrderItemDto
            {
                Id = item.Id,
                ProductId = item.ProductId,
                ProductName = item.ProductName,
                ProductImage = item.ProductImage,
                Quantity = item.Quantity,
                Price = item.Price,
                Subtotal = item.Subtotal
            }).ToArray() : Array.Empty<OrderItemDto>()
        };
    }
}

public record CreateOrderRequest(
    string ShippingAddressId,
    Domain.Entities.ShippingMethod ShippingMethod,
    Domain.Entities.PaymentMethod PaymentMethod,
    string? Notes
);

public record CancelOrderRequest(string Reason);

public record ReturnOrderRequest(
    ReturnItemRequest[] Items,
    string? Notes
);

public record ReturnItemRequest(
    string ItemId,
    int Quantity,
    string Reason
);
