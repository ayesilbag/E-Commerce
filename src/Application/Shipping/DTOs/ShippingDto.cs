namespace ECommerce.Application.Shipping.DTOs;

public class ShippingMethodDto
{
    public required string Id { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }
    public decimal Cost { get; set; }
    public int EstimatedDays { get; set; }
    public string? Provider { get; set; }
}

public class CalculateShippingCostRequest
{
    public required string ShippingMethodId { get; set; }
    public required ShippingItemRequest[] Items { get; set; }
    public required string PostalCode { get; set; }
}

public class ShippingItemRequest
{
    public required string ProductId { get; set; }
    public required int Quantity { get; set; }
    public required int Weight { get; set; }
}

public class ShippingCostResponse
{
    public decimal ShippingCost { get; set; }
    public DateTime EstimatedDelivery { get; set; }
}
