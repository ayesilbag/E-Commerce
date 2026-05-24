using ECommerce.Application.Products.DTOs;

namespace ECommerce.Application.Products.Queries.GetProductDetail;

public record GetProductDetailQuery(string ProductId) : IRequest<ProductDetailDto?>;

public class GetProductDetailQueryHandler : IRequestHandler<GetProductDetailQuery, ProductDetailDto?>
{
    private readonly IApplicationDbContext _context;

    public GetProductDetailQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ProductDetailDto?> Handle(GetProductDetailQuery request, CancellationToken cancellationToken)
    {
        var product = await _context.Products
            .Include(x => x.Specifications)
            .Include(x => x.Variants)
            .Include(x => x.Reviews)
            .FirstOrDefaultAsync(x => x.Id == request.ProductId, cancellationToken);

        if (product is null) return null;

        var variantIndex = 0;
        return new ProductDetailDto
        {
            Id = product.Id,
            Name = product.Name,
            Description = product.Description,
            LongDescription = product.LongDescription,
            Price = product.Price,
            OriginalPrice = product.OriginalPrice,
            Category = product.Category,
            Subcategory = product.Subcategory,
            Image = product.Image,
            Images = Array.Empty<string>(),
            Stock = product.Stock,
            Sku = product.Sku,
            Barcode = product.Barcode,
            Rating = product.Rating,
            ReviewCount = product.ReviewCount,
            Badge = product.Badge,
            IsActive = product.IsActive,
            IsFeatured = product.IsFeatured,
            Tags = Array.Empty<string>(),
            Specifications = product.Specifications.Select(s => new ProductSpecificationDto
            {
                Name = s.Name,
                Value = s.Value
            }).ToArray(),
            Variants = product.Variants.Select(v => new ProductVariantDto
            {
                Id = $"variant_{variantIndex++}",
                Color = v.Color,
                Size = v.Size,
                Fit = v.Fit,
                SleeveType = v.SleeveType,
                NeckType = v.NeckType,
                Material = v.Material,
                Season = v.Season,
                Stock = v.Stock,
                Price = v.Price,
                Sku = v.Sku
            }).ToArray(),
            Reviews = product.Reviews.Select(r => new ReviewDto
            {
                Id = r.Id,
                ProductId = r.ProductId,
                UserId = r.UserId,
                UserName = r.UserName,
                Rating = r.Rating,
                Title = r.Title,
                Comment = r.Comment,
                Images = r.Images,
                Helpful = r.Helpful,
                CreatedAt = r.Created.UtcDateTime
            }).ToArray(),
            RelatedProducts = Array.Empty<ProductDto>()
        };
    }
}
