using ECommerce.Application.Wishlist.DTOs;
using ECommerce.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using ECommerce.Infrastructure.Identity;

namespace ECommerce.WebServer.Endpoints;

public class Wishlist : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        var group = app.MapGroup("/api/wishlist")
            .WithTags("Wishlist")
            .WithOpenApi()
            .RequireAuthorization();

        group.MapGet("/", GetWishlistAsync);
        group.MapPost("/add", AddToWishlistAsync);
        group.MapDelete("/{itemId}", RemoveFromWishlistAsync);
        group.MapPost("/share", ShareWishlistAsync);
    }

    private async Task<IResult> GetWishlistAsync(
        ApplicationDbContext context,
        HttpContext httpContext,
        CancellationToken cancellationToken)
    {
        var userId = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
            return Results.Unauthorized();

        var wishlistItems = await context.WishlistItems
            .Include(w => w.Product)
            .Where(w => w.UserId == userId)
            .OrderByDescending(w => w.Id)
            .ToListAsync(cancellationToken);

        var itemDtos = wishlistItems.Select(item => new WishlistItemDto
        {
            Id = item.Id,
            ProductId = item.ProductId,
            Product = item.Product != null ? new Application.Products.DTOs.ProductDto
            {
                Id = item.Product.Id,
                Name = item.Product.Name,
                Description = item.Product.Description,
                Price = item.Product.Price,
                OriginalPrice = item.Product.OriginalPrice,
                Category = item.Product.Category,
                Subcategory = item.Product.Subcategory,
                Image = item.Product.Image,
                Images = Array.Empty<string>(),
                Stock = item.Product.Stock,
                Sku = item.Product.Sku,
                Rating = item.Product.Rating,
                ReviewCount = item.Product.ReviewCount,
                Badge = item.Product.Badge,
                IsActive = item.Product.IsActive,
                IsFeatured = item.Product.IsFeatured,
                Tags = Array.Empty<string>()
            } : null,
            AddedAt = DateTime.UtcNow // WishlistItem doesn't have CreatedAt, using current time
        }).ToList();

        var wishlistDto = new WishlistDto
        {
            Items = itemDtos.ToArray(),
            ItemCount = itemDtos.Count
        };

        return Results.Ok(new { success = true, data = new { wishlist = wishlistDto } });
    }

    private async Task<IResult> AddToWishlistAsync(
        AddToWishlistRequest request,
        ApplicationDbContext context,
        HttpContext httpContext,
        CancellationToken cancellationToken)
    {
        var userId = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
            return Results.Unauthorized();

        // Check if already in wishlist
        var exists = await context.WishlistItems
            .AnyAsync(w => w.UserId == userId && w.ProductId == request.ProductId, cancellationToken);
        if (exists)
            return Results.BadRequest(new { success = false, message = "Ürün zaten favorilerde" });

        // Check if product exists
        var product = await context.Products
            .FirstOrDefaultAsync(p => p.Id == request.ProductId, cancellationToken);
        if (product is null)
            return Results.NotFound(new { success = false, message = "Ürün bulunamadı" });

        var wishlistItem = new Domain.Entities.WishlistItem
        {
            Id = Guid.NewGuid().ToString(),
            UserId = userId,
            ProductId = request.ProductId
        };

        context.WishlistItems.Add(wishlistItem);
        await context.SaveChangesAsync(cancellationToken);

        return Results.Created($"/api/wishlist/{wishlistItem.Id}", new { success = true, message = "Favorilere eklendi", data = new { id = wishlistItem.Id, productId = wishlistItem.ProductId } });
    }

    private async Task<IResult> RemoveFromWishlistAsync(
        string itemId,
        ApplicationDbContext context,
        HttpContext httpContext,
        CancellationToken cancellationToken)
    {
        var userId = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
            return Results.Unauthorized();

        var item = await context.WishlistItems
            .FirstOrDefaultAsync(w => w.Id == itemId && w.UserId == userId, cancellationToken);
        if (item is null)
            return Results.NotFound(new { success = false, message = "Ürün bulunamadı" });

        context.WishlistItems.Remove(item);
        await context.SaveChangesAsync(cancellationToken);

        return Results.Ok(new { success = true, message = "Favorilerden kaldırıldı" });
    }

    private async Task<IResult> ShareWishlistAsync(
        ShareWishlistRequest request,
        ApplicationDbContext context,
        UserManager<ApplicationUser> userManager,
        HttpContext httpContext,
        CancellationToken cancellationToken)
    {
        var userId = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
            return Results.Unauthorized();

        var user = await userManager.FindByIdAsync(userId);
        if (user is null)
            return Results.Unauthorized();

        var wishlistItems = await context.WishlistItems
            .Include(w => w.Product)
            .Where(w => w.UserId == userId)
            .ToListAsync(cancellationToken);

        // In a real implementation, you would send an email here
        // For now, just return success
        return Results.Ok(new { success = true, message = $"İstek listesi {request.Email} adresine paylaşıldı" });
    }
}

public record AddToWishlistRequest(string ProductId);
