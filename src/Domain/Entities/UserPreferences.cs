namespace ECommerce.Domain.Entities;

public class UserPreferences : BaseEntity
{
    public required string UserId { get; set; }
    public bool Newsletter { get; set; } = true;
    public bool Notifications { get; set; } = true;
    public string Language { get; set; } = "tr";
    public string Currency { get; set; } = "TRY";
}
