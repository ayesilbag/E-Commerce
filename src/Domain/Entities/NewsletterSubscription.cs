using ECommerce.Domain.Enums;

namespace ECommerce.Domain.Entities;

public class NewsletterSubscription : BaseEntity
{
    public required string Email { get; set; }
    public string? Name { get; set; }
    public NewsletterSubscriptionStatus Status { get; set; } = NewsletterSubscriptionStatus.Subscribed;
    public string? VerificationToken { get; set; }
    public bool IsVerified { get; set; } = false;
    public DateTime SubscribedAt { get; set; }
    public DateTime? UnsubscribedAt { get; set; }
}
