namespace ECommerce.Application.Newsletter.DTOs;

public class SubscribeRequest
{
    public required string Email { get; set; }
    public string? Name { get; set; }
}

public class UnsubscribeRequest
{
    public required string Email { get; set; }
}
