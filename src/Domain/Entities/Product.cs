namespace ECommerce.Domain.Entities;

public class Product : BaseSoftDeletableEntity
{
    public required string Name { get; set; }
    public string? Description { get; set; }
    public string? LongDescription { get; set; }
    public required decimal Price { get; set; }
    public decimal? OriginalPrice { get; set; }
    public required string Category { get; set; }
    public string? Subcategory { get; set; }
    public string Image { get; set; } = string.Empty;
    public required string[] Images { get; set; } = Array.Empty<string>();

    public int Stock { get; set; }
    public required string Sku { get; set; }
    public string? Barcode { get; set; }

    public ICollection<ProductSpecification> Specifications { get; set; } = new List<ProductSpecification>();
    public ICollection<ProductVariant> Variants { get; set; } = new List<ProductVariant>();

    public decimal Rating { get; set; }
    public int ReviewCount { get; set; }
    public ICollection<Review> Reviews { get; set; } = new List<Review>();

    public string? Badge { get; set; }
    public bool IsActive { get; set; } = true;
    public bool IsFeatured { get; set; } = false;

    public required string[] Tags { get; set; } = Array.Empty<string>();
}
