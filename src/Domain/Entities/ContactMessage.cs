using ECommerce.Domain.Enums;

namespace ECommerce.Domain.Entities;

public class ContactMessage : BaseAuditableEntity
{
    public required string Name { get; set; }
    public required string Email { get; set; }
    public string? Phone { get; set; }
    public required string Subject { get; set; }
    public required string Message { get; set; }
    public ContactMessageStatus Status { get; set; } = ContactMessageStatus.New;
    public string[]? Attachments { get; set; }
    public string? ReplyMessage { get; set; }
    public string? RepliedBy { get; set; }
    public DateTime? RepliedAt { get; set; }
}
