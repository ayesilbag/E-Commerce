namespace ECommerce.Infrastructure.Data.Seeding.SiteSettings;

internal static class SiteSettingsSeedSharedContact
{
    public const string Address =
        "Karabağlar Mahallesi\n5760 Sokak No:22/A\nKarabağlar İZMİR";

    public static readonly IReadOnlyList<string> Phones =
    [
        "0 554 449 04 49 (Selçuk Bey)",
        "0 555 891 66 61 (Selçuk Bey)",
        "0 532 310 74 54 (Serkan Bey)",
        "0 541 310 74 54 (Serkan Bey)",
    ];

    public static readonly IReadOnlyList<string> WorkingHours =
    [
        "Pazartesi                  08:00–21:00",
        "Salı                                 08:00–21:00",
        "Çarşamba              08:00–21:00",
        "Perşembe              08:00–21:00",
        "Cuma                          08:00–21:00",
        "Cumartesi              08:00–21:00",
        "Pazar                            08:00–21:00",
    ];

    /// <summary>iyzico ile Öde — mevcut upload path (ortak).</summary>
    public const string IyzicoPayLogoUrl = "/uploads/site/ef98d04ba81145beb8f3eab5b1a7e59c.png";
}
