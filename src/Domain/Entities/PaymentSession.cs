using ECommerce.Domain.Enums;

namespace ECommerce.Domain.Entities;

/// <summary>Tracks an iyzico Checkout Form session for an order.</summary>
public class PaymentSession : BaseEntity
{
    public required string OrderId { get; set; }
    public Order Order { get; set; } = null!;

    public required string PaymentClientId { get; set; }
    public PaymentClient PaymentClient { get; set; } = null!;

    public required string ConversationId { get; set; }
    public required string Token { get; set; }

    public string? IyzicoPaymentId { get; set; }
    public PaymentSessionStatus Status { get; set; } = PaymentSessionStatus.Initialized;
    public string? IyzicoPaymentStatus { get; set; }
    public string? ErrorMessage { get; set; }

    public decimal Price { get; set; }
    public decimal PaidPrice { get; set; }
    public string Currency { get; set; } = "TRY";
}
