using ECommerce.Application.Common.DTOs;

namespace ECommerce.Application.Products.DTOs;

public class ProductListRequest
{
    public int Page { get; set; } = 1;
    public int Limit { get; set; } = 20;
    public string? Search { get; set; }
    public string? Category { get; set; }
    public decimal? MinPrice { get; set; }
    public decimal? MaxPrice { get; set; }
    public int? MinRating { get; set; }
    public string[] Colors { get; set; } = Array.Empty<string>();
    public string[] Sizes { get; set; } = Array.Empty<string>();
    public string? Sort { get; set; } = "featured"; // featured, price_asc, price_desc, newest, rating
}

public class ProductListResponse
{
    public required ProductDto[] Products { get; set; }
    public required PaginationDto Pagination { get; set; }
    public required ProductFiltersDto Filters { get; set; }
}

public class ProductFiltersDto
{
    public required string[] Categories { get; set; }
    public required PriceRangeDto PriceRange { get; set; }
    public required int[] Ratings { get; set; }
    public required string[] Colors { get; set; }
    public required string[] Sizes { get; set; }
    public required string[] Materials { get; set; }
    public required string[] Seasons { get; set; }
}

public class PriceRangeDto
{
    public decimal Min { get; set; }
    public decimal Max { get; set; }
}
