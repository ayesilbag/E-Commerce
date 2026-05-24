namespace ECommerce.Domain.Entities;

/// <summary>Catalog shipping methods selectable at checkout (admin-managed).</summary>
public class ShippingOption : BaseEntity
{
    public required string Name { get; set; }
    public string? Description { get; set; }
    public decimal Cost { get; set; }
    public int EstimatedDays { get; set; }
    public string? Provider { get; set; }
    public bool IsActive { get; set; } = true;
}
