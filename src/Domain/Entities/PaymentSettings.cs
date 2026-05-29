namespace ECommerce.Domain.Entities;

/// <summary>Global payment gateway defaults (single row).</summary>
public class PaymentSettings : BaseEntity
{
    public const string GlobalId = "global";

    /// <summary>Default callback base when client override is empty.</summary>
    public string? CallbackBaseUrl { get; set; }

    /// <summary>Default currency for new clients and UI hints.</summary>
    public string DefaultCurrency { get; set; } = "TRY";
}
