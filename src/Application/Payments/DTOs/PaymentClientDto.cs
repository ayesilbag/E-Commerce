namespace ECommerce.Application.Payments.DTOs;

public class PaymentClientDto
{
    public required string Id { get; set; }
    public required string Code { get; set; }
    public required string Name { get; set; }
    public string? TenantCode { get; set; }
    public required string ApiKey { get; set; }
    public bool HasSecretKey { get; set; }
    public bool IsSandbox { get; set; }
    public bool IsActive { get; set; }
    public bool IsDefault { get; set; }
    public string Locale { get; set; } = "tr";
    public string Currency { get; set; } = "TRY";
    public string? CallbackBaseUrl { get; set; }
    public string? EnabledInstallments { get; set; }
    public string? SuccessRedirectUrl { get; set; }
    public string? FailureRedirectUrl { get; set; }
}

public class PaymentClientPublicDto
{
    public required string Code { get; set; }
    public required string Name { get; set; }
    public bool IsSandbox { get; set; }
    public string Currency { get; set; } = "TRY";
}

public class PaymentSettingsDto
{
    public string? CallbackBaseUrl { get; set; }
    public string DefaultCurrency { get; set; } = "TRY";
}

public class IyzicoInitializeRequest
{
    public required string OrderId { get; set; }
    public string? PaymentClientCode { get; set; }
}

public class IyzicoInitializeResponse
{
    public required string Token { get; set; }
    public required string PaymentPageUrl { get; set; }
    public string? CheckoutFormContent { get; set; }
    public required string PaymentClientCode { get; set; }
    public required string ConversationId { get; set; }
}

public class IyzicoCallbackResult
{
    public bool Success { get; set; }
    public required string OrderId { get; set; }
    public string? PaymentId { get; set; }
    public string? Message { get; set; }
    public string? RedirectUrl { get; set; }
}
