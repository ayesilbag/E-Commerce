using ECommerce.Application.Products.DTOs;
using ECommerce.Infrastructure.Data;
using ECommerce.WebServer.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.WebServer.Endpoints;

public class Products : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        var group = app.MapGroup("/api/products")
            .WithTags("Products")
            .WithOpenApi();

        group.MapGet("/", GetProductsAsync);
        group.MapGet("/{productId}", GetProductDetailAsync);
        group.MapGet("/{productId}/reviews", GetProductReviewsAsync);
    }

    private async Task<IResult> GetProductsAsync(
        ApplicationDbContext context,
        CancellationToken cancellationToken,
        [FromQuery] int page = 1,
        [FromQuery] int limit = 20,
        [FromQuery] string? search = null,
        [FromQuery] string? category = null,
        [FromQuery] decimal? minPrice = null,
        [FromQuery] decimal? maxPrice = null,
        [FromQuery] int? minRating = null,
        [FromQuery] string? sort = "featured",
        [FromQuery] string? color = null,
        [FromQuery] string? size = null)
    {
        var query = context.Products.Where(x => !x.IsDeleted && x.IsActive);

        // Apply filters
        if (!string.IsNullOrWhiteSpace(search))
        {
            query = query.Where(x => x.Name.Contains(search) || (x.Description != null && x.Description.Contains(search)));
        }

        if (!string.IsNullOrWhiteSpace(category))
        {
            query = query.Where(x => x.Category == category);
        }

        if (minPrice.HasValue)
        {
            query = query.Where(x => x.Price >= minPrice.Value);
        }

        if (maxPrice.HasValue)
        {
            query = query.Where(x => x.Price <= maxPrice.Value);
        }

        if (minRating.HasValue)
        {
            query = query.Where(x => x.Rating >= minRating.Value);
        }

        // Apply sorting
        query = sort switch
        {
            "price_asc" => query.OrderBy(x => x.Price),
            "price_desc" => query.OrderByDescending(x => x.Price),
            "newest" => query.OrderByDescending(x => x.Created),
            "rating" => query.OrderByDescending(x => x.Rating),
            _ => query.OrderByDescending(x => x.Created)
        };

        var totalCount = await query.CountAsync(cancellationToken);

        var productEntities = await query
            .Skip((page - 1) * limit)
            .Take(limit)
            .ToListAsync(cancellationToken);

        var products = productEntities.Select(ProductMapper.ToDto).ToList();

        // Get filters metadata
        var filters = new
        {
            categories = await context.Categories
                .Where(c => c.IsActive)
                .Select(c => c.Name)
                .Distinct()
                .ToListAsync(cancellationToken),
            priceRange = new
            {
                // MinAsync/MaxAsync throw on an empty Products set; nullable projection maps to SQL MIN/MAX which return null.
                min = await context.Products.Select(p => (decimal?)p.Price).MinAsync(cancellationToken) ?? 0,
                max = await context.Products.Select(p => (decimal?)p.Price).MaxAsync(cancellationToken) ?? 0
            },
            ratings = new[] { 1, 2, 3, 4, 5 },
            colors = new[] { "Siyah", "Beyaz", "Mavi", "Kırmızı", "Yeşil" },
            sizes = new[] { "XS", "S", "M", "L", "XL", "XXL" },
            materials = new[] { "Pamuk", "Polyester", "Karışık" },
            seasons = new[] { "Yaz", "Kış", "Sonbahar", "İlkbahar" }
        };

        var response = new
        {
            products,
            pagination = new
            {
                page,
                limit,
                total = totalCount,
                pages = (int)Math.Ceiling((double)totalCount / limit)
            },
            filters
        };

        return Results.Ok(new { success = true, data = response });
    }

    private async Task<IResult> GetProductDetailAsync(
        string productId,
        ApplicationDbContext context,
        CancellationToken cancellationToken)
    {
        var product = await context.Products
            .FirstOrDefaultAsync(p => p.Id == productId && !p.IsDeleted && p.IsActive, cancellationToken);

        if (product is null)
            return Results.NotFound(new { success = false, error = new { code = "PRODUCT_NOT_FOUND", message = "Ürün bulunamadı" } });

        var reviewsData = await context.Reviews
            .Where(r => r.ProductId == productId)
            .OrderByDescending(r => r.Created)
            .Take(5)
            .ToListAsync(cancellationToken);

        var reviews = reviewsData.Select(r => new ReviewDto
        {
            Id = r.Id,
            ProductId = r.ProductId,
            UserId = r.UserId,
            UserName = r.UserName,
            Rating = r.Rating,
            Title = r.Title,
            Comment = r.Comment,
            Images = r.Images != null ? r.Images.ToArray() : Array.Empty<string>(),
            Helpful = r.Helpful,
            CreatedAt = r.Created.DateTime
        }).ToList();

        // Get related products (same category, excluding current)
        var relatedProductEntities = await context.Products
            .Where(p => p.Category == product.Category && p.Id != product.Id && p.IsActive && !p.IsDeleted)
            .Take(4)
            .ToListAsync(cancellationToken);

        var relatedProducts = relatedProductEntities.Select(ProductMapper.ToDto).ToList();

        var productDetail = new
        {
            id = product.Id,
            name = product.Name,
            description = product.Description,
            longDescription = product.LongDescription,
            price = product.Price,
            originalPrice = product.OriginalPrice,
            category = product.Category,
            subcategory = product.Subcategory,
            image = product.Image,
            images = product.Images?.ToArray() ?? Array.Empty<string>(),
            stock = product.Stock,
            sku = product.Sku,
            specifications = Array.Empty<object>(),
            variants = Array.Empty<object>(),
            rating = product.Rating,
            reviewCount = product.ReviewCount,
            reviews = reviews,
            badge = product.Badge,
            tags = product.Tags?.ToArray() ?? Array.Empty<string>(),
            relatedProducts = relatedProducts.Select(p => new { id = p.Id, name = p.Name, price = p.Price })
        };

        return Results.Ok(new { success = true, data = productDetail });
    }

    private async Task<IResult> GetProductReviewsAsync(
        string productId,
        ApplicationDbContext context,
        CancellationToken cancellationToken,
        [FromQuery] int page = 1,
        [FromQuery] int limit = 10,
        [FromQuery] string? sort = "recent")
    {
        var totalCount = await context.Reviews
            .Where(r => r.ProductId == productId)
            .CountAsync(cancellationToken);

        var reviewsQuery = context.Reviews
            .Where(r => r.ProductId == productId);

        reviewsQuery = sort == "recent"
            ? reviewsQuery.OrderByDescending(r => r.Created)
            : reviewsQuery.OrderByDescending(r => r.Helpful);

        var reviews = await reviewsQuery
            .Skip((page - 1) * limit)
            .Take(limit)
            .ToListAsync(cancellationToken);

        var reviewDtos = reviews.Select(r => new ReviewDto
        {
            Id = r.Id,
            ProductId = r.ProductId,
            UserId = r.UserId,
            UserName = r.UserName,
            Rating = r.Rating,
            Title = r.Title,
            Comment = r.Comment,
            Images = (r.Images != null ? r.Images.ToArray() : Array.Empty<string>()),
            Helpful = r.Helpful,
            CreatedAt = r.Created.DateTime
        }).ToList();

        return Results.Ok(new { success = true, data = new { reviews = reviewDtos, pagination = new { page, limit, total = totalCount } } });
    }
}
