using ECommerce.Application.Products.DTOs;

namespace ECommerce.Application.Wishlist.DTOs;

public class WishlistDto
{
    public required WishlistItemDto[] Items { get; set; }
    public int ItemCount { get; set; }
}

public class WishlistItemDto
{
    public required string Id { get; set; }
    public required string ProductId { get; set; }
    public ProductDto? Product { get; set; }
    public DateTime AddedAt { get; set; }
}

public class ShareWishlistRequest
{
    public required string Email { get; set; }
    public string? Message { get; set; }
}
