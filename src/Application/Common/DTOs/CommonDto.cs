namespace ECommerce.Application.Common.DTOs;

public class PaginationDto
{
    public int Page { get; set; }
    public int Limit { get; set; }
    public int Total { get; set; }
    public int Pages { get; set; }
}

public class AddressDto
{
    public required string Id { get; set; }
    public required string FullName { get; set; }
    public required string Phone { get; set; }
    public required string AddressLine { get; set; }
    public required string City { get; set; }
    public required string District { get; set; }
    public required string PostalCode { get; set; }
    public required string Country { get; set; }
    public bool IsDefault { get; set; }
    public required string Type { get; set; }
}

public class ShippingMethodDto
{
    public required string Id { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }
    public decimal Cost { get; set; }
    public int EstimatedDays { get; set; }
    public string? Provider { get; set; }
}

public class PaymentMethodDto
{
    public required string Type { get; set; }
    public string? CardName { get; set; }
    public string? CardLast4 { get; set; }
    public string? CardBrand { get; set; }
}
