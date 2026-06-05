namespace ECommerce.Application.Settings;

/// <summary>Storefront routes with admin-managed SEO (WordPress-style per page).</summary>
public static class SiteStorefrontPages
{
    public record PageDefinition(string Key, string Label, string Path);

    public static readonly IReadOnlyList<PageDefinition> Definitions =
    [
        new("home", "Anasayfa", "/"),
        new("shop", "Mağaza", "/shop"),
        new("contact", "İletişim", "/contact"),
        new("about", "Hakkımızda", "/about"),
        new("pre-information", "Ön Bilgilendirme Formu", "/pre-information"),
        new("delivery-returns", "Teslimat ve İade", "/delivery-returns"),
        new("privacy", "Gizlilik Sözleşmesi", "/privacy"),
        new("distance-selling", "Mesafeli Satış Sözleşmesi", "/distance-selling"),
        new("login", "Giriş", "/login"),
        new("register", "Kayıt", "/register"),
        new("checkout", "Ödeme", "/checkout"),
        new("wishlist", "Favoriler", "/wishlist"),
    ];

    public static PageDefinition? FindByPath(string pathname)
    {
        var path = NormalizePath(pathname);
        return Definitions.FirstOrDefault(p => p.Path == path)
            ?? Definitions.FirstOrDefault(p => path.StartsWith(p.Path + "/", StringComparison.OrdinalIgnoreCase) && p.Path != "/");
    }

    public static PageDefinition? FindByKey(string key) =>
        Definitions.FirstOrDefault(p => string.Equals(p.Key, key, StringComparison.OrdinalIgnoreCase));

    public static string NormalizePath(string pathname)
    {
        if (string.IsNullOrWhiteSpace(pathname)) return "/";
        var path = pathname.Split('?')[0].Split('#')[0];
        if (!path.StartsWith('/')) path = "/" + path;
        if (path.Length > 1 && path.EndsWith('/')) path = path.TrimEnd('/');
        return path;
    }
}
