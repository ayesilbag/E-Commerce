namespace ECommerce.Application.Payments.DTOs;

public class ValidatePaymentRequest
{
    public required string CardNumber { get; set; }
    public required string CardName { get; set; }
    public required string ExpiryDate { get; set; }
    public required string Cvv { get; set; }
}

public class PaymentMethodDto
{
    public required string Id { get; set; }
    public required string Type { get; set; }
    public string? CardName { get; set; }
    public string? CardLast4 { get; set; }
    public string? CardBrand { get; set; }
    public bool IsDefault { get; set; }
}

public class ProcessPaymentRequest
{
    public required string OrderId { get; set; }
    public required PaymentMethodDetails PaymentMethod { get; set; }
    public decimal Amount { get; set; }
}

public class PaymentMethodDetails
{
    public required string Type { get; set; }
    public string? CardNumber { get; set; }
    public string? CardName { get; set; }
    public string? ExpiryDate { get; set; }
    public string? Cvv { get; set; }
}

public class ProcessPaymentResponse
{
    public required string TransactionId { get; set; }
    public required string Status { get; set; }
    public decimal Amount { get; set; }
}
