# Sayfa arayüz metinleri (AppPagesUi JSON)

**Site Ayarları → Vitrin içeriği → Sayfa arayüz metinleri** alanına aşağıdaki JSON yapısını yapıştırın. Otomatik seed yoktur.

Alan adları **camelCase** olmalıdır. Boş bırakılan metinler mağazada gösterilmez.

## Bölümler

| Bölüm | Kapsam |
|--------|--------|
| `global` | Yükleniyor, kapat, hata ekranı, ürün fallback adı |
| `auth` | Giriş, kayıt, şifremi unuttum, şifre sıfırlama |
| `account` | Hesap sayfası menü ve özet kartları |
| `cart` | Sepet yan paneli |
| `wishlist` | Favori paneli ve favori sayfası |
| `shop` | Mağaza filtreleri, sıralama, boş durum |
| `checkout` | Sipariş, adres, ödeme, havale, şehir/ilçe listesi |
| `orders` | Sipariş listesi |
| `product` | Ürün detay ve ürün kartı |
| `category` | Kategori sayfası ve anasayfa kategori bandı |
| `context` | Sepet/favori toast mesajları (context) |

## Örnek JSON (başlangıç şablonu)

Aşağıdaki şablonu kopyalayıp ihtiyaca göre genişletin. `checkout.cities` ve `checkout.districtsByCity` için Türkiye il/ilçe listesini admin'e eklemeniz gerekir.

```json
{
  "global": {
    "loadingLabel": "Yükleniyor...",
    "closeLabel": "Kapat",
    "productFallbackName": "Ürün",
    "errorTitle": "Bir Hata Oluştu",
    "errorMessage": "Üzgünüz, bir sorun oluştu. Lütfen daha sonra tekrar deneyin.",
    "retryButtonLabel": "Tekrar Dene",
    "homeButtonLabel": "Ana Sayfa",
    "errorBoundaryTitle": "Bir Hata Oluştu",
    "errorBoundaryMessage": "Beklenmeyen bir hata oluştu. Sayfayı yenileyerek tekrar deneyebilirsiniz.",
    "errorBoundaryReloadButton": "Sayfayı Yenile"
  },
  "auth": {
    "loginTitle": "Hesabınıza Giriş Yapın",
    "loginSubtitle": "Alışverişe devam etmek için bilgilerinizi girin",
    "emailLabel": "E-Posta",
    "emailPlaceholder": "E-posta adresiniz",
    "passwordLabel": "Şifre",
    "passwordPlaceholder": "Şifreniz",
    "forgotPasswordLink": "Şifrenizi mi unuttunuz?",
    "rememberMeLabel": "Beni hatırla",
    "loginButtonLabel": "Giriş Yap",
    "loginSubmittingLabel": "Giriş yapılıyor...",
    "loginErrorTitle": "Giriş başarısız",
    "loginNoAccountText": "Hesabınız yok mu?",
    "loginRegisterLink": "Kayıt Ol",
    "registerTitle": "Hesap Oluştur",
    "registerSubtitle": "Email ve şifre ile kaydolun",
    "registerButtonLabel": "Kayıt Ol",
    "registerSubmittingLabel": "Hesap oluşturuluyor...",
    "registerKvkkConsentText": "KVKK metnini ve Mesafeli Satış Sözleşmesini okudum ve kabul ediyorum.",
    "registerHasAccountText": "Zaten bir hesabınız var mı?",
    "registerLoginLink": "Giriş Yap",
    "forgotTitle": "Şifrenizi mi Unuttunuz?",
    "forgotSubmitLabel": "Bağlantı Gönder",
    "forgotBackToLogin": "Girişe Dön"
  },
  "cart": {
    "titlePrefix": "Sepetim",
    "emptyTitle": "Sepetiniz boş",
    "emptyDescription": "Henüz sepetinize ürün eklemediniz.",
    "continueShoppingButton": "Alışverişe Devam Et",
    "subtotalLabel": "Ara Toplam",
    "shippingNote": "Kargo ve vergiler ödeme sırasında hesaplanır.",
    "checkoutButton": "Ödemeye Geç",
    "loginRequiredNote": "Ödemeye geçmek için giriş yapmanız gerekiyor",
    "loginAndContinueButton": "Giriş Yap ve Devam Et"
  },
  "wishlist": {
    "sidebarTitlePrefix": "Favorilerim",
    "sidebarEmptyTitle": "Favorileriniz boş",
    "pageTitle": "Favorilerim",
    "pageEmptyTitle": "Favorileriniz boş",
    "pageStartShopping": "Alışverişe Başla"
  },
  "shop": {
    "productsLoadError": "Ürünler yüklenirken hata oluştu",
    "filtersButtonLabel": "Filtreler",
    "clearFiltersLabel": "Filtreleri Temizle",
    "searchPlaceholder": "Ürün ara...",
    "sortLabel": "Sırala",
    "emptyTitle": "Ürün bulunamadı",
    "sortOptions": [
      { "value": "featured", "label": "Öne Çıkanlar" },
      { "value": "price-low", "label": "Fiyat: Düşükten Yükseğe" },
      { "value": "newest", "label": "En Yeniler" }
    ],
    "filterCategoryTitle": "Kategori Ara",
    "filterPriceTitle": "Fiyat",
    "priceRangeOptions": [
      { "value": "0-300", "label": "₺300 Altı" },
      { "value": "300-600", "label": "₺300 - ₺600" },
      { "value": "1000+", "label": "₺1000 Üzeri" }
    ],
    "genderOptions": ["Kadın", "Erkek", "Unisex"],
    "colorOptions": ["Siyah", "Beyaz", "Mavi"]
  },
  "checkout": {
    "defaultCountry": "Türkiye",
    "addressTabLabel": "ADRES BİLGİLERİ",
    "paymentTabLabel": "ÖDEME BİLGİLERİ",
    "orderSummaryTitle": "Sipariş Özeti",
    "cartTotalLabel": "Sepet Toplamı",
    "grandTotalLabel": "Genel Toplam",
    "continueToPaymentButton": "Ödemeye Geç",
    "fullNameLabel": "Ad Soyad *",
    "cityLabel": "Şehir *",
    "cityPlaceholder": "Şehir seçin",
    "cities": ["İstanbul", "Ankara", "İzmir"],
    "districtsByCity": {
      "İstanbul": ["Kadıköy", "Beşiktaş", "Üsküdar"],
      "Ankara": ["Çankaya", "Keçiören"],
      "İzmir": ["Konak", "Karşıyaka"]
    },
    "orderStatusLabels": [
      { "value": "Pending", "label": "Beklemede" },
      { "value": "Delivered", "label": "Teslim Edildi" }
    ],
    "paymentStatusLabels": [
      { "value": "Pending", "label": "Ödeme Bekleniyor" },
      { "value": "Completed", "label": "Ödeme Tamamlandı" }
    ]
  },
  "orders": {
    "pageTitle": "Siparişlerim",
    "pageSubtitle": "Tüm siparişlerinizi buradan takip edebilirsiniz",
    "emptyTitle": "Henüz siparişiniz yok",
    "startShoppingButton": "Alışverişe Başla",
    "statusOptions": [
      { "value": "Pending", "label": "Beklemede" },
      { "value": "Shipped", "label": "Kargolandı" }
    ]
  },
  "product": {
    "addToCartButton": "Sepete Ekle",
    "cardAddToCartButton": "Sepete Ekle",
    "saleBadge": "İndirim",
    "newBadge": "Yeni",
    "breadcrumbHome": "Anasayfa",
    "breadcrumbShop": "Mağaza"
  },
  "category": {
    "sectionTitle": "Kategoriler",
    "viewAllLink": "Tümünü Gör →",
    "allCategoriesTitle": "Kategoriler"
  },
  "context": {
    "cartAddSuccessTitle": "Sepete eklendi",
    "cartAddErrorTitle": "Sepete ekleme hatası",
    "cartRemoveInfoTitle": "Sepetten kaldırıldı",
    "wishlistAddSuccessTitle": "Favorilere eklendi",
    "wishlistAlreadyInTitle": "Zaten favorilerinizde"
  }
}
```

## SEO sayfa başlıkları

Sayfa `<title>` değerleri **Site Ayarları → SEO** bölümünden yönetilir (`PageSeoManager`). AppPagesUi yalnızca sayfa içi metinler içindir.

## Navbar / iletişim / yasal arayüz

Navbar, iletişim formu, yasal sayfa arayüzü ve ödeme onayı metinleri ayrı alanlarda yönetilir — bkz. `docs/STOREFRONT_CONTENT.md`.
