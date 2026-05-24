namespace ECommerce.Domain.Entities;

public class OrderItem : BaseEntity
{
    public required string ProductId { get; set; }
    public required string ProductName { get; set; }
    public required string ProductImage { get; set; }
    public int Quantity { get; set; }
    public decimal Price { get; set; }
    public decimal Subtotal { get; set; }
    public string? VariantColor { get; set; }
    public string? VariantSize { get; set; }
    public string? VariantFit { get; set; }

    public Order Order { get; set; } = null!;
}
