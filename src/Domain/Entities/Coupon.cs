namespace ECommerce.Domain.Entities;

public class Coupon : BaseAuditableEntity
{
    public required string Code { get; set; }
    public string? Description { get; set; }
    public decimal? DiscountAmount { get; set; }
    public decimal? DiscountPercent { get; set; }
    public decimal? MinimumOrderAmount { get; set; }
    public int? MaxUses { get; set; }
    public int UsedCount { get; set; }
    public DateTime? ValidFrom { get; set; }
    public DateTime? ValidUntil { get; set; }
    public bool IsActive { get; set; } = true;
}
