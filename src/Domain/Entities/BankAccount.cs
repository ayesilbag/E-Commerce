namespace ECommerce.Domain.Entities;

/// <summary>Bank transfer (havale/EFT) account shown at checkout.</summary>
public class BankAccount : BaseEntity
{
    public required string BankName { get; set; }
    public required string AccountHolder { get; set; }
    public required string Iban { get; set; }
    public string? BranchName { get; set; }
    public string Currency { get; set; } = "TRY";
    public string? Instructions { get; set; }
    public int SortOrder { get; set; }
    public bool IsActive { get; set; } = true;
}
