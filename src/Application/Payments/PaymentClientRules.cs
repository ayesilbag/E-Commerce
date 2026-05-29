using ECommerce.Application.Payments.DTOs;
using ECommerce.Domain.Entities;

namespace ECommerce.Application.Payments;

public static class PaymentClientRules
{
    public static readonly string[] SupportedCurrencies = ["TRY", "USD", "EUR", "GBP", "NOK", "CHF"];

    public static readonly string[] IyzicoPaymentTypes =
    [
        "iyzico",
        "Iyzico",
        "credit_card_iyzico",
        "CreditCardIyzico"
    ];

    public static bool IsIyzicoPayment(string? paymentType) =>
        !string.IsNullOrWhiteSpace(paymentType) &&
        IyzicoPaymentTypes.Contains(paymentType, StringComparer.OrdinalIgnoreCase);

    public static PaymentClientDto ToAdminDto(PaymentClient client, bool includeSecrets = false) => new()
    {
        Id = client.Id,
        Code = client.Code,
        Name = client.Name,
        TenantCode = client.TenantCode,
        ApiKey = client.ApiKey,
        HasSecretKey = !string.IsNullOrEmpty(client.SecretKey),
        IsSandbox = client.IsSandbox,
        IsActive = client.IsActive,
        IsDefault = client.IsDefault,
        Locale = client.Locale,
        Currency = client.Currency,
        CallbackBaseUrl = client.CallbackBaseUrl,
        EnabledInstallments = client.EnabledInstallments,
        SuccessRedirectUrl = client.SuccessRedirectUrl,
        FailureRedirectUrl = client.FailureRedirectUrl
    };

    public static PaymentClientPublicDto ToPublicDto(PaymentClient client) => new()
    {
        Code = client.Code,
        Name = client.Name,
        IsSandbox = client.IsSandbox,
        Currency = client.Currency
    };

    public static List<int> ParseInstallments(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
            return [];

        return value
            .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
            .Select(s => int.TryParse(s, out var n) ? n : 0)
            .Where(n => n > 0)
            .Distinct()
            .ToList();
    }

    public static string GetBaseUrl(PaymentClient client) =>
        client.IsSandbox
            ? "https://sandbox-api.iyzipay.com"
            : "https://api.iyzipay.com";

    public static string NormalizeCurrency(string? currency, string fallback = "TRY")
    {
        var normalized = string.IsNullOrWhiteSpace(currency)
            ? fallback
            : currency.Trim().ToUpperInvariant();

        return SupportedCurrencies.Contains(normalized, StringComparer.OrdinalIgnoreCase)
            ? normalized
            : fallback;
    }

    public static bool TryNormalizeCurrency(string? currency, out string normalized)
    {
        normalized = string.IsNullOrWhiteSpace(currency)
            ? string.Empty
            : currency.Trim().ToUpperInvariant();

        if (!SupportedCurrencies.Contains(normalized, StringComparer.OrdinalIgnoreCase))
            return false;

        return true;
    }

    public static string? NormalizeCallbackBaseUrl(string? url)
    {
        if (string.IsNullOrWhiteSpace(url))
            return null;

        return url.Trim().TrimEnd('/');
    }

    public static string ResolveCallbackBaseUrl(
        PaymentClient? client,
        PaymentSettings? globalSettings,
        string? appsettingsCallbackBase,
        string requestFallbackBase)
    {
        var clientBase = NormalizeCallbackBaseUrl(client?.CallbackBaseUrl);
        if (!string.IsNullOrEmpty(clientBase))
            return clientBase;

        var globalBase = NormalizeCallbackBaseUrl(globalSettings?.CallbackBaseUrl);
        if (!string.IsNullOrEmpty(globalBase))
            return globalBase;

        var configBase = NormalizeCallbackBaseUrl(appsettingsCallbackBase);
        if (!string.IsNullOrEmpty(configBase))
            return configBase;

        return NormalizeCallbackBaseUrl(requestFallbackBase) ?? requestFallbackBase;
    }

    public static string BuildIyzicoCallbackUrl(string callbackBase, string clientCode) =>
        $"{callbackBase}/api/payments/iyzico/callback/{clientCode}";
}
