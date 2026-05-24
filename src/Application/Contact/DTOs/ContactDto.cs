namespace ECommerce.Application.Contact.DTOs;

public class ContactMessageRequest
{
    public required string Name { get; set; }
    public required string Email { get; set; }
    public string? Phone { get; set; }
    public required string Subject { get; set; }
    public required string Message { get; set; }
}

public class ContactMessageResponse
{
    public required string TicketId { get; set; }
}

public class NewsletterSubscribeRequest
{
    public required string Email { get; set; }
    public string? Name { get; set; }
}

public class NewsletterUnsubscribeRequest
{
    public required string Email { get; set; }
}
