using ECommerce.Application.Settings.DTOs;
using ECommerce.Domain.Entities;

namespace ECommerce.Application.Settings;

public static class PaymentComplianceRules
{
    public const int TotalCriteria = 6;

    public static PaymentComplianceDto ToDto(SiteSettings settings) => new()
    {
        LegalPages = SiteLegalPages.ToDtos(settings),
        AboutPageContent = settings.AboutPageContent,
        DeliveryReturnsPageContent = settings.DeliveryReturnsPageContent,
        PrivacyPolicyPageContent = settings.PrivacyPolicyPageContent,
        DistanceSellingAgreementPageContent = settings.DistanceSellingAgreementPageContent,
        PreInformationFormPageContent = settings.PreInformationFormPageContent,
        IyzicoPayLogoUrl = settings.IyzicoPayLogoUrl
    };

    public static void Apply(SiteSettings settings, PaymentComplianceDto? compliance)
    {
        if (compliance is null)
            return;

        settings.AboutPageContent = NullIfWhiteSpace(compliance.AboutPageContent);
        settings.DeliveryReturnsPageContent = NullIfWhiteSpace(compliance.DeliveryReturnsPageContent);
        settings.PrivacyPolicyPageContent = NullIfWhiteSpace(compliance.PrivacyPolicyPageContent);
        settings.DistanceSellingAgreementPageContent = NullIfWhiteSpace(compliance.DistanceSellingAgreementPageContent);
        settings.PreInformationFormPageContent = NullIfWhiteSpace(compliance.PreInformationFormPageContent);
        settings.IyzicoPayLogoUrl = NullIfWhiteSpace(compliance.IyzicoPayLogoUrl);
    }

    public static PaymentComplianceStatusDto BuildStatus(SiteSettings settings)
    {
        var items = new List<PaymentComplianceItemDto>
        {
            Item("aboutPage", "Hakkımızda sayfası", HasContent(settings.AboutPageContent)),
            Item("deliveryReturns", "Teslimat ve iade şartları", HasContent(settings.DeliveryReturnsPageContent)),
            Item("privacyPolicy", "Gizlilik sözleşmesi", HasContent(settings.PrivacyPolicyPageContent)),
            Item("distanceSelling", "Mesafeli satış sözleşmesi", HasContent(settings.DistanceSellingAgreementPageContent)),
            Item("preInformation", "Ön bilgilendirme formu", HasContent(settings.PreInformationFormPageContent)),
            Item("iyzicoLogo", "iyzico ile Öde logosu", !string.IsNullOrWhiteSpace(settings.IyzicoPayLogoUrl))
        };

        return new PaymentComplianceStatusDto
        {
            Completed = items.Count(i => i.Met),
            Total = TotalCriteria,
            Items = items
        };
    }

    private static bool HasContent(string? value) => !string.IsNullOrWhiteSpace(value);

    private static PaymentComplianceItemDto Item(string key, string label, bool met) =>
        new() { Key = key, Label = label, Met = met };

    private static string? NullIfWhiteSpace(string? value) =>
        string.IsNullOrWhiteSpace(value) ? null : value.Trim();
}
