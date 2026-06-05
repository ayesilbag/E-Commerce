using System.Reflection;
using System.Text.Json;
using ECommerce.Application.Settings.DTOs;

namespace ECommerce.Infrastructure.Data.Seeding.SiteSettings;

internal static class SiteSettingsAppPagesUiFactory
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        PropertyNameCaseInsensitive = true,
    };

    private static AppPagesUiDto? _sharedBase;

    public static AppPagesUiDto CreateFor(SiteSettingsBrandProfile brand)
    {
        var ui = CloneBase();

        if (brand.IsTedarik)
        {
            ui.Auth ??= new AuthUiDto();
            ui.Auth.LoginSubtitle = "Kurumsal hesabınızla giriş yapın";
            ui.Auth.RegisterSubtitle = "Kurumsal alışveriş için hesap oluşturun";
            ui.Auth.RegisterKvkkConsentText =
                "KVKK aydınlatma metnini, Gizlilik Sözleşmesini ve Mesafeli Satış Sözleşmesini okudum, kabul ediyorum.";

            ui.Shop ??= new ShopUiDto();
            ui.Shop.SearchPlaceholder = "Ürün, SKU veya kategori ara…";
            ui.Shop.EmptyTitle = "Aramanıza uygun ürün bulunamadı";

            ui.Cart ??= new CartUiDto();
            ui.Cart.ShippingNote = "Kargo, vergi ve toplu sipariş indirimleri ödeme adımında hesaplanır.";

            ui.Checkout ??= new CheckoutUiDto();
            ui.Checkout.OrderSummaryTitle = "Sipariş Özeti";
            ui.Checkout.ContinueToPaymentButton = "Siparişi Onayla ve Öde";

            ui.Orders ??= new OrdersUiDto();
            ui.Orders.PageSubtitle = "Kurumsal siparişlerinizi buradan takip edebilirsiniz";
        }
        else
        {
            ui.Auth ??= new AuthUiDto();
            ui.Auth.LoginSubtitle = "Alışverişe devam etmek için bilgilerinizi girin";
            ui.Auth.RegisterSubtitle = "E-posta ve şifre ile kaydolun";
            ui.Auth.RegisterKvkkConsentText =
                "KVKK metnini ve Mesafeli Satış Sözleşmesini okudum ve kabul ediyorum.";
        }

        return ui;
    }

    private static AppPagesUiDto CloneBase()
    {
        var json = JsonSerializer.Serialize(LoadSharedBase(), JsonOptions);
        return JsonSerializer.Deserialize<AppPagesUiDto>(json, JsonOptions)
            ?? throw new InvalidOperationException("Failed to clone app-pages-ui seed.");
    }

    private static AppPagesUiDto LoadSharedBase()
    {
        if (_sharedBase is not null) return _sharedBase;

        var assembly = typeof(SiteSettingsAppPagesUiFactory).Assembly;
        const string resourceName = "ECommerce.Infrastructure.Data.Seeding.SiteSettings.Resources.app-pages-ui.seed.json";

        using var stream = assembly.GetManifestResourceStream(resourceName)
            ?? throw new InvalidOperationException($"Embedded resource not found: {resourceName}");

        using var reader = new StreamReader(stream);
        var json = reader.ReadToEnd();

        _sharedBase = JsonSerializer.Deserialize<AppPagesUiDto>(json, JsonOptions)
            ?? throw new InvalidOperationException("Failed to deserialize app-pages-ui seed JSON.");

        return _sharedBase;
    }
}
