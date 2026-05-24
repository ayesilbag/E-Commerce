using ECommerce.Application.Cart.DTOs;
using ECommerce.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using ECommerce.Infrastructure.Identity;

namespace ECommerce.WebServer.Endpoints;

public class Cart : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        var group = app.MapGroup("/api/cart")
            .WithTags("Cart")
            .WithOpenApi();

        group.MapPost("/add", AddToCartAsync);
        group.MapGet("/", GetCartAsync).RequireAuthorization();
        group.MapPut("/items/{productId}", UpdateQuantityAsync).RequireAuthorization();
        group.MapDelete("/items/{productId}", RemoveItemAsync).RequireAuthorization();
        group.MapPost("/apply-coupon", ApplyCouponAsync).RequireAuthorization();
        group.MapDelete("/", ClearCartAsync).RequireAuthorization();
    }

    private async Task<IResult> AddToCartAsync(
        AddToCartRequest request,
        ApplicationDbContext context,
        HttpContext httpContext,
        CancellationToken cancellationToken)
    {
        var userId = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);

        // Get or create cart
        Domain.Entities.Cart? cart;
        if (!string.IsNullOrEmpty(userId))
        {
            cart = await context.Carts
                .Include(c => c.Items)
                .FirstOrDefaultAsync(c => c.UserId == userId, cancellationToken);
        }
        else
        {
            // Guest cart - use cart token from cookie
            var cartToken = httpContext.Request.Cookies["cart_token"];
            if (!string.IsNullOrEmpty(cartToken))
            {
                cart = await context.Carts
                    .Include(c => c.Items)
                    .FirstOrDefaultAsync(c => c.CartToken == cartToken, cancellationToken);
            }
            else
            {
                cart = null;
            }
        }

        if (cart == null)
        {
            cart = new Domain.Entities.Cart
            {
                Id = Guid.NewGuid().ToString(),
                UserId = userId,
                CartToken = userId == null ? Guid.NewGuid().ToString() : null,
                Items = new List<Domain.Entities.CartItem>(),
                Subtotal = 0,
                Tax = 0,
                Total = 0
            };
            context.Carts.Add(cart);
        }

        // Check if product exists
        var product = await context.Products
            .FirstOrDefaultAsync(p => p.Id == request.ProductId, cancellationToken);
        if (product is null)
            return Results.NotFound(new { success = false, error = new { code = "PRODUCT_NOT_FOUND", message = "Ürün bulunamadı" } });

        // Check if item already exists in cart
        var existingItem = cart.Items.FirstOrDefault(i => i.ProductId == request.ProductId);
        if (existingItem != null)
        {
            existingItem.Quantity += request.Quantity;
        }
        else
        {
            cart.Items.Add(new Domain.Entities.CartItem
            {
                Id = Guid.NewGuid().ToString(),
                CartId = cart.Id,
                ProductId = request.ProductId,
                Quantity = request.Quantity,
                VariantColor = request.Variant?.Color,
                VariantSize = request.Variant?.Size,
                VariantFit = request.Variant?.Fit,
                VariantSleeveType = request.Variant?.SleeveType,
                VariantNeckType = request.Variant?.NeckType,
                VariantMaterial = request.Variant?.Material,
                VariantSeason = request.Variant?.Season
            });
        }

        // Update totals
        cart.Subtotal = cart.Items.Sum(i =>
        {
            var itemProduct = context.Products.FirstOrDefault(p => p.Id == i.ProductId);
            return itemProduct?.Price * i.Quantity ?? 0;
        });
        cart.Tax = cart.Subtotal * 0.18m;
        cart.Total = cart.Subtotal + cart.Tax - cart.DiscountAmount;

        await context.SaveChangesAsync(cancellationToken);

        var cartDto = MapToCartDto(cart, context);
        return Results.Ok(new { success = true, message = "Sepete eklendi", data = new { cart = cartDto } });
    }

    private async Task<IResult> GetCartAsync(
        ApplicationDbContext context,
        HttpContext httpContext,
        CancellationToken cancellationToken)
    {
        var userId = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
            return Results.Unauthorized();

        var cart = await context.Carts
            .Include(x => x.Items)
            .FirstOrDefaultAsync(x => x.UserId == userId, cancellationToken);

        if (cart is null)
        {
            var emptyCart = new CartDto
            {
                Items = Array.Empty<CartItemDto>(),
                Subtotal = 0,
                Tax = 0,
                ShippingCost = 0,
                DiscountAmount = 0,
                Total = 0,
                ItemCount = 0
            };
            return Results.Ok(new { success = true, data = new { cart = emptyCart } });
        }

        var cartDto = MapToCartDto(cart, context);
        return Results.Ok(new { success = true, data = new { cart = cartDto } });
    }

    private async Task<IResult> UpdateQuantityAsync(
        string productId,
        UpdateQuantityRequest request,
        ApplicationDbContext context,
        HttpContext httpContext,
        CancellationToken cancellationToken)
    {
        var userId = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
            return Results.Unauthorized();

        var cart = await context.Carts
            .Include(x => x.Items)
            .FirstOrDefaultAsync(x => x.UserId == userId, cancellationToken);

        if (cart is null)
            return Results.NotFound(new { success = false, error = new { code = "CART_NOT_FOUND", message = "Sepet bulunamadı" } });

        var item = cart.Items.FirstOrDefault(x => x.ProductId == productId);
        if (item is null)
            return Results.NotFound(new { success = false, error = new { code = "ITEM_NOT_FOUND", message = "Ürün bulunamadı" } });

        item.Quantity = request.Quantity;
        cart.Subtotal = cart.Items.Sum(i =>
        {
            var itemProduct = context.Products.FirstOrDefault(p => p.Id == i.ProductId);
            return itemProduct?.Price * i.Quantity ?? 0;
        });
        cart.Tax = cart.Subtotal * 0.18m;
        cart.Total = cart.Subtotal + cart.Tax - cart.DiscountAmount;
        cart.ItemCount = cart.Items.Sum(i => i.Quantity);

        await context.SaveChangesAsync(cancellationToken);

        var cartDto = MapToCartDto(cart, context);
        return Results.Ok(new { success = true, message = "Miktar güncellendi", data = new { cart = new { itemCount = cartDto.ItemCount, total = cartDto.Total } } });
    }

    private async Task<IResult> RemoveItemAsync(
        string productId,
        ApplicationDbContext context,
        HttpContext httpContext,
        CancellationToken cancellationToken)
    {
        var userId = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
            return Results.Unauthorized();

        var cart = await context.Carts
            .Include(x => x.Items)
            .FirstOrDefaultAsync(x => x.UserId == userId, cancellationToken);

        if (cart is null)
            return Results.NotFound(new { success = false, error = new { code = "CART_NOT_FOUND", message = "Sepet bulunamadı" } });

        var item = cart.Items.FirstOrDefault(x => x.ProductId == productId);
        if (item is null)
            return Results.NotFound(new { success = false, error = new { code = "ITEM_NOT_FOUND", message = "Ürün bulunamadı" } });

        context.CartItems.Remove(item);
        cart.Subtotal = cart.Items.Sum(i =>
        {
            var itemProduct = context.Products.FirstOrDefault(p => p.Id == i.ProductId);
            return itemProduct?.Price * i.Quantity ?? 0;
        });
        cart.Tax = cart.Subtotal * 0.18m;
        cart.Total = cart.Subtotal + cart.Tax - cart.DiscountAmount;
        cart.ItemCount = cart.Items.Sum(i => i.Quantity);

        await context.SaveChangesAsync(cancellationToken);

        var cartDto = MapToCartDto(cart, context);
        return Results.Ok(new { success = true, message = "Ürün sepetten kaldırıldı", data = new { cart = new { itemCount = cartDto.ItemCount, total = cartDto.Total } } });
    }

    private async Task<IResult> ApplyCouponAsync(
        ApplyCouponRequest request,
        ApplicationDbContext context,
        HttpContext httpContext,
        CancellationToken cancellationToken)
    {
        var userId = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
            return Results.Unauthorized();

        var cart = await context.Carts
            .Include(c => c.Items)
            .FirstOrDefaultAsync(c => c.UserId == userId, cancellationToken);

        if (cart is null || cart.Items.Count == 0)
            return Results.BadRequest(new { success = false, message = "Sepet boş" });

        var code = request.CouponCode.Trim().ToUpperInvariant();
        var coupon = await context.Coupons
            .FirstOrDefaultAsync(c => c.Code == code && c.IsActive, cancellationToken);

        if (coupon is null)
            return Results.BadRequest(new { success = false, message = "Geçersiz kupon kodu" });

        var now = DateTime.UtcNow;
        if (coupon.ValidFrom.HasValue && now < coupon.ValidFrom.Value)
            return Results.BadRequest(new { success = false, message = "Kupon henüz geçerli değil" });

        if (coupon.ValidUntil.HasValue && now > coupon.ValidUntil.Value)
            return Results.BadRequest(new { success = false, message = "Kupon süresi dolmuş" });

        if (coupon.MaxUses.HasValue && coupon.UsedCount >= coupon.MaxUses.Value)
            return Results.BadRequest(new { success = false, message = "Kupon kullanım limiti dolmuş" });

        cart.Subtotal = cart.Items.Sum(i =>
        {
            var product = context.Products.FirstOrDefault(p => p.Id == i.ProductId);
            return (product?.Price ?? 0) * i.Quantity;
        });

        if (coupon.MinimumOrderAmount.HasValue && cart.Subtotal < coupon.MinimumOrderAmount.Value)
            return Results.BadRequest(new { success = false, message = $"Minimum sipariş tutarı {coupon.MinimumOrderAmount:N2} ₺" });

        decimal discount = 0;
        if (coupon.DiscountAmount.HasValue)
            discount = coupon.DiscountAmount.Value;
        else if (coupon.DiscountPercent.HasValue)
            discount = Math.Round(cart.Subtotal * coupon.DiscountPercent.Value / 100m, 2);

        discount = Math.Min(discount, cart.Subtotal);
        cart.DiscountAmount = discount;
        cart.DiscountCode = code;
        cart.Tax = (cart.Subtotal - cart.DiscountAmount) * 0.18m;
        cart.Total = cart.Subtotal - cart.DiscountAmount + cart.Tax;

        await context.SaveChangesAsync(cancellationToken);

        return Results.Ok(new
        {
            success = true,
            message = "Kupon başarıyla uygulandı",
            data = new
            {
                discountAmount = discount,
                discountPercent = coupon.DiscountPercent,
                newTotal = cart.Total
            }
        });
    }

    private async Task<IResult> ClearCartAsync(
        ApplicationDbContext context,
        HttpContext httpContext,
        CancellationToken cancellationToken)
    {
        var userId = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
            return Results.Unauthorized();

        var cart = await context.Carts
            .Include(x => x.Items)
            .FirstOrDefaultAsync(x => x.UserId == userId, cancellationToken);

        if (cart is not null)
        {
            context.CartItems.RemoveRange(cart.Items);
            await context.SaveChangesAsync(cancellationToken);
        }

        return Results.Ok(new { success = true, message = "Sepet temizlendi" });
    }

    private static CartDto MapToCartDto(Domain.Entities.Cart cart, ApplicationDbContext context)
    {
        var items = cart.Items.Select(item =>
        {
            var product = context.Products.FirstOrDefault(p => p.Id == item.ProductId);
            return new CartItemDto
            {
                ProductId = item.ProductId,
                ProductName = product?.Name ?? "",
                ProductImage = product?.Image ?? "",
                Quantity = item.Quantity,
                Price = product?.Price ?? 0,
                Subtotal = (product?.Price ?? 0) * item.Quantity,
                SelectedVariant = (item.VariantColor != null || item.VariantSize != null) ? new CartItemVariantDto
                {
                    Color = item.VariantColor,
                    Size = item.VariantSize,
                    Fit = item.VariantFit,
                    SleeveType = item.VariantSleeveType,
                    NeckType = item.VariantNeckType,
                    Material = item.VariantMaterial,
                    Season = item.VariantSeason
                } : null
            };
        }).ToArray();

        return new CartDto
        {
            Items = items,
            Subtotal = cart.Subtotal,
            Tax = cart.Tax,
            ShippingCost = cart.ShippingCost ?? 0,
            DiscountAmount = cart.DiscountAmount,
            DiscountCode = cart.DiscountCode,
            Total = cart.Total,
            ItemCount = items.Sum(i => i.Quantity)
        };
    }
}

public record UpdateQuantityRequest(int Quantity);
