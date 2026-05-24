namespace ECommerce.Application.Products.DTOs;

public class ProductDto
{
    public required string Id { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }
    public required decimal Price { get; set; }
    public decimal? OriginalPrice { get; set; }
    public required string Category { get; set; }
    public string? Subcategory { get; set; }
    public required string Image { get; set; }
    public required string[] Images { get; set; }
    public int Stock { get; set; }
    public required string Sku { get; set; }
    public decimal Rating { get; set; }
    public int ReviewCount { get; set; }
    public string? Badge { get; set; }
    public bool IsActive { get; set; }
    public bool IsFeatured { get; set; }
    public required string[] Tags { get; set; }
}

public class ProductDetailDto : ProductDto
{
    public string? LongDescription { get; set; }
    public string? Barcode { get; set; }
    public ProductSpecificationDto[] Specifications { get; set; } = Array.Empty<ProductSpecificationDto>();
    public ProductVariantDto[] Variants { get; set; } = Array.Empty<ProductVariantDto>();
    public ReviewDto[] Reviews { get; set; } = Array.Empty<ReviewDto>();
    public ProductDto[] RelatedProducts { get; set; } = Array.Empty<ProductDto>();
}

public class ProductSpecificationDto
{
    public required string Name { get; set; }
    public required string Value { get; set; }
}

public class ProductVariantDto
{
    public required string Id { get; set; }
    public string? Color { get; set; }
    public string? Size { get; set; }
    public string? Fit { get; set; }
    public string? SleeveType { get; set; }
    public string? NeckType { get; set; }
    public string? Material { get; set; }
    public string? Season { get; set; }
    public int Stock { get; set; }
    public decimal? Price { get; set; }
    public string? Sku { get; set; }
}
