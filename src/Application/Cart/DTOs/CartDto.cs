namespace ECommerce.Application.Cart.DTOs;

public class CartDto
{
    public required CartItemDto[] Items { get; set; }
    public decimal Subtotal { get; set; }
    public decimal Tax { get; set; }
    public decimal? ShippingCost { get; set; }
    public decimal DiscountAmount { get; set; }
    public string? DiscountCode { get; set; }
    public decimal Total { get; set; }
    public int ItemCount { get; set; }
}

public class CartItemDto
{
    public required string ProductId { get; set; }
    public required string ProductName { get; set; }
    public required string ProductImage { get; set; }
    public int Quantity { get; set; }
    public decimal Price { get; set; }
    public decimal Subtotal { get; set; }
    public CartItemVariantDto? SelectedVariant { get; set; }
}

public class CartItemVariantDto
{
    public string? Color { get; set; }
    public string? Size { get; set; }
    public string? Fit { get; set; }
    public string? SleeveType { get; set; }
    public string? NeckType { get; set; }
    public string? Material { get; set; }
    public string? Season { get; set; }
}

public class AddToCartRequest
{
    public required string ProductId { get; set; }
    public int Quantity { get; set; } = 1;
    public CartItemVariantDto? Variant { get; set; }
}

public class UpdateCartQuantityRequest
{
    public required int Quantity { get; set; }
}

public class ApplyCouponRequest
{
    public required string CouponCode { get; set; }
}

public class CouponResponse
{
    public decimal DiscountAmount { get; set; }
    public decimal DiscountPercent { get; set; }
    public decimal NewTotal { get; set; }
}
