namespace ECommerce.Application.Settings.DTOs;

/// <summary>iyzico ve benzeri ödeme sağlayıcılarının gerektirdiği web sitesi kriterleri.</summary>
public class PaymentComplianceDto
{
    public IReadOnlyList<SiteLegalPageDto> LegalPages { get; set; } = [];
    public string? AboutPageContent { get; set; }
    public string? DeliveryReturnsPageContent { get; set; }
    public string? PrivacyPolicyPageContent { get; set; }
    public string? DistanceSellingAgreementPageContent { get; set; }
    public string? PreInformationFormPageContent { get; set; }
    public string? IyzicoPayLogoUrl { get; set; }
}

public class SiteLegalPageDto
{
    public required string Slug { get; set; }
    public required string Title { get; set; }
    public required string Path { get; set; }
    public string? Content { get; set; }
}

public class PaymentComplianceStatusDto
{
    public int Completed { get; set; }
    public int Total { get; set; }
    public IReadOnlyList<PaymentComplianceItemDto> Items { get; set; } = [];
}

public class PaymentComplianceItemDto
{
    public required string Key { get; set; }
    public required string Label { get; set; }
    public bool Met { get; set; }
}
