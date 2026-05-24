namespace ECommerce.Domain.Entities;

public class WishlistItem : BaseEntity
{
    public required string UserId { get; set; }
    public required string ProductId { get; set; }
    public Product? Product { get; set; }
}
