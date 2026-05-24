namespace ECommerce.Domain.Entities;

public class CartItem : BaseEntity
{
    public required string ProductId { get; set; }
    public Product Product { get; set; } = null!;
    public int Quantity { get; set; }
    public string? VariantColor { get; set; }
    public string? VariantSize { get; set; }
    public string? VariantFit { get; set; }
    public string? VariantSleeveType { get; set; }
    public string? VariantNeckType { get; set; }
    public string? VariantMaterial { get; set; }
    public string? VariantSeason { get; set; }

    public required string CartId { get; set; }
    public Cart Cart { get; set; } = null!;
}
