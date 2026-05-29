namespace ECommerce.Domain.Entities;

/// <summary>iyzico merchant configuration for a store/client.</summary>
public class PaymentClient : BaseEntity
{
    /// <summary>Unique slug used in callback URL and API (e.g. main-store).</summary>
    public required string Code { get; set; }

    public required string Name { get; set; }

    /// <summary>Optional tenant host prefix match (see ITenant.Code).</summary>
    public string? TenantCode { get; set; }

    public required string ApiKey { get; set; }

    public required string SecretKey { get; set; }

    public bool IsSandbox { get; set; } = true;

    public bool IsActive { get; set; } = true;

    public bool IsDefault { get; set; }

    public string Locale { get; set; } = "tr";

    /// <summary>ISO currency code (TRY, USD, EUR, GBP, NOK, CHF).</summary>
    public string Currency { get; set; } = "TRY";

    /// <summary>Override global callback base URL for this client (HTTPS, no trailing slash).</summary>
    public string? CallbackBaseUrl { get; set; }

    /// <summary>Comma-separated installment options, e.g. "2,3,6,9".</summary>
    public string? EnabledInstallments { get; set; }

    /// <summary>Redirect after successful payment. Supports {orderId}.</summary>
    public string? SuccessRedirectUrl { get; set; }

    /// <summary>Redirect after failed payment. Supports {orderId}.</summary>
    public string? FailureRedirectUrl { get; set; }
}
