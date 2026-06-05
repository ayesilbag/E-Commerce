# Site Settings Seed

Uygulama başlangıcında (`ApplicationDbContextInitialiser.TrySeedAsync`) iki UI için profesyonel başlangıç verisi oluşturulur. Admin yalnızca düzenler; boş alanlar otomatik doldurulur, dolu alanlar **ezilmez**.

## Seed edilen UI'lar

| Code | Varsayılan | Tema | E-posta |
|------|------------|------|---------|
| `bizdenalbizdensat` | Evet | Mavi `#2563EB` | info@bizdenalbizdensat.com |
| `tedarikdukkani` | Hayır | Yeşil `#059669` | info@tedarikdukkani.com |

Ortak iletişim: Karabağlar / İzmir adresi, telefon listesi, çalışma saatleri (verdiğiniz API datasından).

## Her UI için doldurulan alanlar

- Marka, domain, tema renkleri
- Yasal sayfalar (başlık + HTML, markaya göre kişiselleştirilmiş)
- iyzico logosu (`/uploads/site/ef98d04ba81145beb8f3eab5b1a7e59c.png`)
- Vitrin: hero, güven bandı, kampanyalar, ürün rafları, bülten, SSS, footer, navbar, iletişim UI, checkout onayı, 404
- AppPagesUi JSON (sepet, mağaza, auth, checkout, sipariş vb.)
- SEO varsayılanları ve sayfa bazlı title/description

## 3. UI eklemek

1. `src/Infrastructure/Data/Seeding/SiteSettings/SiteSettingsSeedProfiles.cs` içine yeni profil ekleyin:

```csharp
public static readonly SiteSettingsBrandProfile YeniMagaza = new(
    Code: "yenimagaza",
    AdminName: "Yeni Mağaza",
    SiteName: "yenimagaza.com",
    Domain: "https://www.yenimagaza.com",
    DisplayName: "Yeni Mağaza",
    Tagline: "…",
    PrimaryEmail: "info@yenimagaza.com",
    SupportPhoneDisplay: "0 …",
    ThemePrimaryLight: "#…",
    ThemePrimaryDark: "#…",
    IsDefault: false);
```

2. Profili `All` listesine ekleyin.
3. WebServer'ı yeniden başlatın — kayıt yoksa tam seed, varsa yalnızca boş alanlar doldurulur.

İsteğe bağlı: `SiteSettingsStorefrontContentFactory` içinde code'a göre hero metinlerini özelleştirin.

## Kaynak dosyalar

```
src/Infrastructure/Data/Seeding/SiteSettings/
  SiteSettingsSeedProfiles.cs      — UI listesi
  SiteSettingsSeeder.cs            — idempotent seed mantığı
  SiteSettingsLegalContentFactory.cs
  SiteSettingsStorefrontContentFactory.cs
  SiteSettingsSeoFactory.cs
  SiteSettingsAppPagesUiFactory.cs
  Resources/app-pages-ui.seed.json — ortak sayfa metinleri
```

## Mevcut veritabanı

Kayıtlar zaten varsa (sizin API export'unuz gibi):

- **Yasal içerik** korunur; yalnızca **boş başlıklar** doldurulur (6/6 uyumluluk için).
- **StorefrontContentJson** boşsa tam vitrin seed'i yazılır.
- **SEO** boşsa markaya göre doldurulur.

WebServer yeniden başlatıldığında seed otomatik çalışır.
