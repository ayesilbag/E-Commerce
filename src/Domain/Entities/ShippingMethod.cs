namespace ECommerce.Domain.Entities;

public class ShippingMethod : BaseEntity
{
    public required string Name { get; set; }
    public string? Description { get; set; }
    public decimal Cost { get; set; }
    public int EstimatedDays { get; set; }
    public string? Provider { get; set; }
}
