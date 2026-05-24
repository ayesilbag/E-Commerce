using ECommerce.Application.Common.Models;
using ECommerce.Application.Products.DTOs;

namespace ECommerce.Application.Products.Queries.GetProducts;

public record GetProductsQuery(ProductListRequest Request) : IRequest<PaginatedList<ProductDto>>;

public class GetProductsQueryHandler : IRequestHandler<GetProductsQuery, PaginatedList<ProductDto>>
{
    private readonly IApplicationDbContext _context;

    public GetProductsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PaginatedList<ProductDto>> Handle(GetProductsQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Products.AsQueryable();

        // Apply filters
        if (!string.IsNullOrWhiteSpace(request.Request.Search))
        {
            query = query.Where(x => x.Name.Contains(request.Request.Search) ||
                                     x.Description!.Contains(request.Request.Search));
        }

        if (!string.IsNullOrWhiteSpace(request.Request.Category))
        {
            query = query.Where(x => x.Category == request.Request.Category);
        }

        if (request.Request.MinPrice.HasValue)
        {
            query = query.Where(x => x.Price >= request.Request.MinPrice.Value);
        }

        if (request.Request.MaxPrice.HasValue)
        {
            query = query.Where(x => x.Price <= request.Request.MaxPrice.Value);
        }

        if (request.Request.MinRating.HasValue)
        {
            query = query.Where(x => x.Rating >= request.Request.MinRating.Value);
        }

        // Apply sorting
        query = request.Request.Sort switch
        {
            "price_asc" => query.OrderBy(x => x.Price),
            "price_desc" => query.OrderByDescending(x => x.Price),
            "newest" => query.OrderByDescending(x => x.Created),
            "rating" => query.OrderByDescending(x => x.Rating),
            _ => query.Where(x => x.IsFeatured).OrderByDescending(x => x.Created)
        };

        var totalCount = await query.CountAsync(cancellationToken);

        var items = await query
            .Skip((request.Request.Page - 1) * request.Request.Limit)
            .Take(request.Request.Limit)
            .Select(x => new ProductDto
            {
                Id = x.Id,
                Name = x.Name,
                Description = x.Description,
                Price = x.Price,
                OriginalPrice = x.OriginalPrice,
                Category = x.Category,
                Subcategory = x.Subcategory,
                Image = x.Image,
                Images = Array.Empty<string>(),
                Stock = x.Stock,
                Sku = x.Sku,
                Rating = x.Rating,
                ReviewCount = x.ReviewCount,
                Badge = x.Badge,
                IsActive = x.IsActive,
                IsFeatured = x.IsFeatured,
                Tags = Array.Empty<string>()
            })
            .ToListAsync(cancellationToken);

        return new PaginatedList<ProductDto>(items, totalCount, request.Request.Page, request.Request.Limit);
    }
}
