using ECommerce.Application.Payments.DTOs;
using ECommerce.Domain.Entities;

namespace ECommerce.Application.Payments;

public static class BankAccountRules
{
    public const string DefaultTransferMessage =
        "Havale/EFT açıklama alanına sipariş numaranızı yazınız.";

    public static string NormalizeIban(string iban) =>
        new string(iban.Where(char.IsLetterOrDigit).ToArray()).ToUpperInvariant();

    public static bool TryNormalizeIban(string iban, out string normalized, out string error)
    {
        normalized = NormalizeIban(iban);
        if (normalized.Length != 26 || !normalized.StartsWith("TR", StringComparison.Ordinal))
        {
            error = "Geçerli bir TR IBAN giriniz (26 karakter).";
            return false;
        }

        error = string.Empty;
        return true;
    }

    public static bool IsBankTransfer(string? paymentType) =>
        string.Equals(paymentType, "BankTransfer", StringComparison.OrdinalIgnoreCase)
        || string.Equals(paymentType, "bank_transfer", StringComparison.OrdinalIgnoreCase)
        || string.Equals(paymentType, "havale", StringComparison.OrdinalIgnoreCase);

    public static BankAccountDto ToDto(BankAccount account) => new()
    {
        Id = account.Id,
        BankName = account.BankName,
        AccountHolder = account.AccountHolder,
        Iban = account.Iban,
        BranchName = account.BranchName,
        Currency = account.Currency,
        Instructions = account.Instructions,
        SortOrder = account.SortOrder,
        IsActive = account.IsActive
    };

    public static string MaskIban(string iban)
    {
        if (iban.Length < 8)
            return iban;

        return $"{iban[..4]} **** **** {iban[^4..]}";
    }
}
