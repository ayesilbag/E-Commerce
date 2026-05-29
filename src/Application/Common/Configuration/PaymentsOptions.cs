namespace ECommerce.Application.Common.Configuration;

public class PaymentsOptions
{
    public const string SectionName = "Payments";

    /// <summary>Public base URL for iyzico callback (must be HTTPS in production).</summary>
    public string CallbackBaseUrl { get; set; } = string.Empty;

    public string DefaultSuccessRedirectUrl { get; set; } = "/payment/result?status=success&orderId={orderId}";

    public string DefaultFailureRedirectUrl { get; set; } = "/payment/result?status=failed&orderId={orderId}";
}
