using ECommerce.Domain.Enums;

namespace ECommerce.Domain.Entities;

public class Order : BaseAuditableEntity
{
    public required string OrderNumber { get; set; }
    public required string UserId { get; set; }
    public OrderStatus Status { get; set; } = OrderStatus.Pending;

    public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();

    public decimal Subtotal { get; set; }
    public decimal DiscountAmount { get; set; }
    public string? DiscountCode { get; set; }
    public decimal ShippingCost { get; set; }
    public decimal Tax { get; set; }
    public decimal Total { get; set; }

    public required string ShippingAddressId { get; set; }
    public Address ShippingAddress { get; set; } = null!;
    public required ShippingMethod ShippingMethod { get; set; }
    public string? TrackingNumber { get; set; }

    public required PaymentMethod PaymentMethod { get; set; }
    public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.Pending;
    public string? TransactionId { get; set; }

    public DateTime? PaidAt { get; set; }
    public DateTime? ShippedAt { get; set; }
    public DateTime? DeliveredAt { get; set; }
    public DateTime? CancelledAt { get; set; }

    public string? Notes { get; set; }
    public string? CancellationReason { get; set; }
}
