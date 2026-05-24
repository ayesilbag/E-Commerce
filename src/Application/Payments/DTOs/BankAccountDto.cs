namespace ECommerce.Application.Payments.DTOs;

public class BankAccountDto
{
    public required string Id { get; set; }
    public required string BankName { get; set; }
    public required string AccountHolder { get; set; }
    public required string Iban { get; set; }
    public string? BranchName { get; set; }
    public required string Currency { get; set; }
    public string? Instructions { get; set; }
    public int SortOrder { get; set; }
    public bool IsActive { get; set; }
}

public class BankTransferInstructionsDto
{
    public required string Type { get; set; }
    public required string OrderNumber { get; set; }
    public required string Message { get; set; }
    public required BankAccountDto[] Accounts { get; set; }
}
