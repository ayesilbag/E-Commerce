namespace ECommerce.Domain.Entities;

public class ProductVariant
{
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
