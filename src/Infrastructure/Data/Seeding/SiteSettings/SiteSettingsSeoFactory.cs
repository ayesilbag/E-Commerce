using ECommerce.Application.Settings.DTOs;

namespace ECommerce.Infrastructure.Data.Seeding.SiteSettings;

internal static class SiteSettingsSeoFactory
{
    public static SiteSeoDto Create(SiteSettingsBrandProfile brand)
    {
        var siteLabel = brand.SiteName;
        var desc = brand.Tagline;
        var homeTitle = brand.IsTedarik
            ? $"{brand.DisplayName} — Kurumsal Tedarik"
            : $"{brand.DisplayName} — Online Alışveriş";
        var keywords = brand.IsTedarik
            ? $"tedarik, toptan alışveriş, kurumsal satın alma, {brand.SiteName}"
            : $"e-ticaret, online alışveriş, {brand.SiteName}";

        return new SiteSeoDto
        {
            DefaultTitle = homeTitle,
            DefaultDescription = desc,
            DefaultKeywords = keywords,
            Pages =
            [
                Page("home", "Anasayfa", "/", homeTitle, desc),
                Page("shop", "Mağaza", "/shop", $"Mağaza | {siteLabel}", "Tüm ürünleri keşfedin."),
                Page("contact", "İletişim", "/contact", $"İletişim | {siteLabel}", "Bize ulaşın."),
                Page("about", "Hakkımızda", "/about", $"Hakkımızda | {siteLabel}", $"{brand.DisplayName} hakkında bilgi."),
                Page("pre-information", "Ön Bilgilendirme", "/pre-information", $"Ön Bilgilendirme Formu | {siteLabel}", null),
                Page("delivery-returns", "Teslimat ve İade", "/delivery-returns", $"Teslimat ve İade | {siteLabel}", null),
                Page("privacy", "Gizlilik", "/privacy", $"Gizlilik Sözleşmesi | {siteLabel}", null),
                Page("distance-selling", "Mesafeli Satış", "/distance-selling", $"Mesafeli Satış Sözleşmesi | {siteLabel}", null),
                Page("login", "Giriş", "/login", $"Giriş | {siteLabel}", null),
                Page("register", "Kayıt", "/register", $"Kayıt Ol | {siteLabel}", null),
                Page("checkout", "Ödeme", "/checkout", $"Ödeme | {siteLabel}", null),
                Page("wishlist", "Favoriler", "/wishlist", $"Favorilerim | {siteLabel}", null),
            ],
        };
    }

    private static PageSeoDto Page(string key, string label, string path, string title, string? description) =>
        new()
        {
            PageKey = key,
            Label = label,
            Path = path,
            Title = title,
            Description = description,
            Keywords = null,
            OgImageUrl = null,
        };
}
