using ECommerce.Domain.Enums;

namespace ECommerce.Domain.Entities;

public class PaymentMethod
{
    public required string Type { get; set; }
    public string? CardName { get; set; }
    public string? CardLast4 { get; set; }
    public string? CardBrand { get; set; }
}
