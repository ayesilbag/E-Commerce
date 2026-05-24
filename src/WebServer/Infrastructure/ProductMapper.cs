using ECommerce.Application.Products.DTOs;
using ECommerce.Domain.Entities;

namespace ECommerce.WebServer.Infrastructure;

internal static class ProductMapper
{
    public static ProductDto ToDto(Product product) => new()
    {
        Id = product.Id,
        Name = product.Name,
        Description = product.Description,
        Price = product.Price,
        OriginalPrice = product.OriginalPrice,
        Category = product.Category,
        Subcategory = product.Subcategory,
        Image = product.Image,
        Images = product.Images?.ToArray() ?? Array.Empty<string>(),
        Stock = product.Stock,
        Sku = product.Sku,
        Rating = product.Rating,
        ReviewCount = product.ReviewCount,
        Badge = product.Badge,
        IsActive = product.IsActive,
        IsFeatured = product.IsFeatured,
        Tags = product.Tags?.ToArray() ?? Array.Empty<string>()
    };
}
