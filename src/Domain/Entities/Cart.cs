namespace ECommerce.Domain.Entities;

public class Cart : BaseEntity
{
    public string? UserId { get; set; }
    public string? CartToken { get; set; }

    public ICollection<CartItem> Items { get; set; } = new List<CartItem>();
    public decimal Subtotal { get; set; }
    public decimal Tax { get; set; }
    public decimal? ShippingCost { get; set; }
    public decimal DiscountAmount { get; set; }
    public string? DiscountCode { get; set; }
    public decimal Total { get; set; }
    public int ItemCount { get; set; }
}
