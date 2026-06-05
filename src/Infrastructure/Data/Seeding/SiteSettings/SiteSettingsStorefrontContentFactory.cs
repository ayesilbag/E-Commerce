using ECommerce.Application.Settings.DTOs;

namespace ECommerce.Infrastructure.Data.Seeding.SiteSettings;

internal static class SiteSettingsStorefrontContentFactory
{
    public static SiteStorefrontContentDto Create(SiteSettingsBrandProfile brand) =>
        brand.IsTedarik ? CreateTedarik(brand) : CreateBizdenal(brand);

    private static SiteStorefrontContentDto CreateBizdenal(SiteSettingsBrandProfile brand) =>
        Build(
            brand,
            hero: new HeroSlideDto
            {
                Badge = "Yeni Sezon",
                Title = "En Yeni Ürünleri",
                Highlight = "Keşfedin",
                Subtitle = "Sezonun seçilmiş ürünleri, güvenli ödeme ve hızlı kargo avantajıyla.",
                CtaLabel = "Alışverişe Başla",
                CtaHref = "/shop",
                CtaSecondaryLabel = "Kategorileri Gör",
                CtaSecondaryHref = "/categories",
                BackgroundClass = "from-primary/10 to-primary/20",
            },
            trustItems:
            [
                new TrustBarItemDto { Icon = "truck", Title = "Hızlı Kargo", Subtitle = "1–3 iş günü içinde kargoya teslim" },
                new TrustBarItemDto { Icon = "refresh-cw", Title = "14 Gün İade", Subtitle = "Cayma hakkı kapsamında kolay iade" },
                new TrustBarItemDto { Icon = "shield-check", Title = "Güvenli Ödeme", Subtitle = "3D Secure ve iyzico altyapısı" },
                new TrustBarItemDto { Icon = "award", Title = "Orijinal Ürün", Subtitle = "%100 orijinallik garantisi" },
            ],
            campaigns:
            [
                new CampaignBannerDto
                {
                    Size = "large",
                    Badge = "Kampanya",
                    Title = "Seçili Ürünlerde İndirim",
                    Subtitle = "Stoklar tükenmeden inceleyin",
                    LinkLabel = "Fırsatları Gör",
                    Href = "/shop?sort=discounted",
                    GradientClass = "from-primary/80 to-primary",
                },
                new CampaignBannerDto
                {
                    Size = "small",
                    Badge = "Yeni",
                    Title = "Yeni Gelenler",
                    LinkLabel = "Keşfet",
                    Href = "/shop?sort=newest",
                    GradientClass = "from-slate-700 to-slate-900",
                },
                new CampaignBannerDto
                {
                    Size = "small",
                    Badge = "Popüler",
                    Title = "Çok Satanlar",
                    LinkLabel = "İncele",
                    Href = "/shop?sort=featured",
                    GradientClass = "from-blue-600 to-indigo-700",
                },
            ],
            productRows:
            [
                new HomeProductRowDto
                {
                    Title = "Çok Satanlar",
                    Subtitle = "Müşterilerimizin en çok tercih ettiği ürünler",
                    ViewAllHref = "/shop?sort=featured",
                    Sort = "featured",
                    Limit = 12,
                },
                new HomeProductRowDto
                {
                    Title = "Yeni Gelenler",
                    Subtitle = "Mağazamıza yeni eklenen ürünler",
                    ViewAllHref = "/shop?sort=newest",
                    Sort = "newest",
                    Limit = 12,
                },
                new HomeProductRowDto
                {
                    Title = "Fırsat Ürünleri",
                    Subtitle = "İndirimli ürünlerde sınırlı stok",
                    ViewAllHref = "/shop?sort=discounted",
                    Sort = "discounted",
                    Limit = 12,
                },
            ],
            newsletter: new NewsletterSectionDto
            {
                Title = "Bültenimize Abone Olun",
                Description = "Kampanyalar, yeni ürünler ve fırsatlardan ilk siz haberdar olun.",
                Placeholder = "E-posta adresinizi girin",
                ButtonLabel = "Abone Ol",
                Disclaimer = "Abone olarak gizlilik politikamızı kabul etmiş olursunuz.",
                SubmittingLabel = "Gönderiliyor…",
                SuccessTitle = "Abonelik başarılı",
                SuccessDescription = "Bültenimize kaydoldunuz. Teşekkür ederiz!",
                ErrorTitle = "Abonelik başarısız",
                EmptyEmailMessage = "Lütfen e-posta adresinizi girin.",
            },
            faqItems:
            [
                new FaqItemDto
                {
                    Question = "Siparişim ne zaman kargoya verilir?",
                    Answer = "Ödemeniz onaylandıktan sonra siparişiniz 1–3 iş günü içinde kargoya teslim edilir.",
                },
                new FaqItemDto
                {
                    Question = "İade süreci nasıl işler?",
                    Answer = "Ürünü teslim aldıktan sonra 14 gün içinde cayma hakkınızı kullanabilirsiniz.",
                },
                new FaqItemDto
                {
                    Question = "Hangi ödeme yöntemlerini kabul ediyorsunuz?",
                    Answer = "Kredi ve banka kartı ile 3D Secure destekli güvenli ödeme kullanılmaktadır.",
                },
            ],
            contactIntro: "Sorularınız veya destek talepleriniz için formu doldurun; en kısa sürede size dönüş yapacağız.");

    private static SiteStorefrontContentDto CreateTedarik(SiteSettingsBrandProfile brand) =>
        Build(
            brand,
            hero: new HeroSlideDto
            {
                Badge = "Kurumsal Tedarik",
                Title = "Tedarik Süreçlerinizi",
                Highlight = "Hızlandırın",
                Subtitle = "Toplu sipariş, faturalı teslimat ve güncel stok bilgisi tek platformda.",
                CtaLabel = "Ürünleri İncele",
                CtaHref = "/shop",
                CtaSecondaryLabel = "İletişime Geç",
                CtaSecondaryHref = "/contact",
                BackgroundClass = "from-primary/10 to-primary/20",
            },
            trustItems:
            [
                new TrustBarItemDto { Icon = "truck", Title = "Hızlı Sevkiyat", Subtitle = "1–3 iş günü depo çıkışı" },
                new TrustBarItemDto { Icon = "shield-check", Title = "Faturalı Teslimat", Subtitle = "E-fatura ve resmi evrak" },
                new TrustBarItemDto { Icon = "award", Title = "Toplu Sipariş", Subtitle = "Palette göre fiyat avantajı" },
                new TrustBarItemDto { Icon = "refresh-cw", Title = "Kurumsal Destek", Subtitle = "Özel müşteri temsilcisi" },
            ],
            campaigns:
            [
                new CampaignBannerDto
                {
                    Size = "large",
                    Badge = "Toptan",
                    Title = "Toplu Alımlarda Avantajlı Fiyat",
                    Subtitle = "Palette ve adet bazlı fiyatlandırma",
                    LinkLabel = "Ürünleri Gör",
                    Href = "/shop",
                    GradientClass = "from-primary/80 to-primary",
                },
                new CampaignBannerDto
                {
                    Size = "small",
                    Badge = "Stokta",
                    Title = "Stokta Hazır Ürünler",
                    LinkLabel = "Listele",
                    Href = "/shop?sort=featured",
                    GradientClass = "from-emerald-700 to-teal-800",
                },
                new CampaignBannerDto
                {
                    Size = "small",
                    Badge = "Teklif",
                    Title = "Kurumsal Teklif Alın",
                    LinkLabel = "İletişim",
                    Href = "/contact",
                    GradientClass = "from-slate-700 to-slate-900",
                },
            ],
            productRows:
            [
                new HomeProductRowDto
                {
                    Title = "Kurumsal Favoriler",
                    Subtitle = "Sık tercih edilen tedarik ürünleri",
                    ViewAllHref = "/shop?sort=featured",
                    Sort = "featured",
                    Limit = 12,
                },
                new HomeProductRowDto
                {
                    Title = "Stokta Olanlar",
                    Subtitle = "Hemen sevk edilebilir ürünler",
                    ViewAllHref = "/shop?sort=newest",
                    Sort = "newest",
                    Limit = 12,
                },
                new HomeProductRowDto
                {
                    Title = "Toptan Avantajlı",
                    Subtitle = "Toplu alıma uygun ürünler",
                    ViewAllHref = "/shop?sort=discounted",
                    Sort = "discounted",
                    Limit = 12,
                },
            ],
            newsletter: new NewsletterSectionDto
            {
                Title = "Kurumsal Bülten",
                Description = "Stok güncellemeleri, fiyat duyuruları ve tedarik haberleri.",
                Placeholder = "Kurumsal e-posta adresiniz",
                ButtonLabel = "Abone Ol",
                Disclaimer = "Abone olarak gizlilik politikamızı kabul etmiş olursunuz.",
                SubmittingLabel = "Gönderiliyor…",
                SuccessTitle = "Kayıt alındı",
                SuccessDescription = "Kurumsal bültenimize eklendiniz.",
                ErrorTitle = "Kayıt başarısız",
                EmptyEmailMessage = "Lütfen e-posta adresinizi girin.",
            },
            faqItems:
            [
                new FaqItemDto
                {
                    Question = "Toplu sipariş nasıl verilir?",
                    Answer = "Ürünleri sepete ekleyip adetleri belirleyerek sipariş oluşturabilirsiniz. Yüksek hacimli alımlar için iletişim formundan teklif isteyebilirsiniz.",
                },
                new FaqItemDto
                {
                    Question = "Fatura ve evrak süreci nasıl işler?",
                    Answer = "Siparişleriniz faturalı olarak hazırlanır; e-fatura ve sevkiyat evrakları sipariş sürecinde paylaşılır.",
                },
                new FaqItemDto
                {
                    Question = "Minimum sipariş adedi var mı?",
                    Answer = "Ürün bazında minimum adet bilgisi ürün sayfasında belirtilir. Kurumsal talepler için bizimle iletişime geçebilirsiniz.",
                },
            ],
            contactIntro: "Toplu sipariş, teklif ve kurumsal destek talepleriniz için formu doldurun; satış ekibimiz size dönüş yapacaktır.");

    private static SiteStorefrontContentDto Build(
        SiteSettingsBrandProfile brand,
        HeroSlideDto hero,
        IReadOnlyList<TrustBarItemDto> trustItems,
        IReadOnlyList<CampaignBannerDto> campaigns,
        IReadOnlyList<HomeProductRowDto> productRows,
        NewsletterSectionDto newsletter,
        IReadOnlyList<FaqItemDto> faqItems,
        string contactIntro) =>
        new()
        {
            FooterDescription = brand.Tagline,
            HeroSlides = [hero],
            TrustItems = trustItems,
            CampaignBanners = campaigns,
            ProductRows = productRows,
            Newsletter = newsletter,
            Faq = new FaqSectionDto
            {
                Title = "Sıkça Sorulan Sorular",
                Description = brand.IsTedarik
                    ? "Kurumsal sipariş, teslimat ve evrak süreçleri hakkında sık sorulanlar."
                    : "Sipariş, teslimat ve iade süreçleri hakkında merak ettikleriniz.",
                Items = faqItems,
                FooterText = "Aradığınız cevabı bulamadınız mı?",
                FooterButtonLabel = "Bize Ulaşın",
                FooterButtonHref = "/contact",
            },
            ContactMap = new ContactMapDto
            {
                Title = "Haritada Bizi Bulun",
                Description = brand.IsTedarik
                    ? "Depo ve ofis adresimiz aşağıdadır."
                    : "Showroom ve depo adresimiz aşağıdadır.",
                EmptyMessage = "Harita bilgisi yakında eklenecektir.",
            },
            FooterNav = new FooterNavDto
            {
                QuickLinksTitle = "Hızlı Linkler",
                CustomerServiceTitle = "Müşteri Hizmetleri",
                ContactSectionTitle = "İletişim",
                CopyrightSuffix = "Tüm hakları saklıdır.",
                AddressLabel = "Adres:",
                PhoneLabel = "Telefon:",
                EmailLabel = "E-posta:",
                WorkingHoursLabel = "Çalışma Saatleri:",
                QuickLinks =
                [
                    new FooterLinkDto { Label = "Anasayfa", Href = "/" },
                    new FooterLinkDto { Label = brand.IsTedarik ? "Ürünler" : "Mağaza", Href = "/shop" },
                    new FooterLinkDto { Label = "Kategoriler", Href = "/categories" },
                    new FooterLinkDto { Label = "Hakkımızda", Href = "/about" },
                    new FooterLinkDto { Label = "İletişim", Href = "/contact" },
                ],
                CustomerServiceLinks =
                [
                    new FooterLinkDto { Label = "SSS", Href = "/contact#faq" },
                    new FooterLinkDto { Label = "Teslimat ve İade", Href = "/delivery-returns" },
                    new FooterLinkDto { Label = "Siparişlerim", Href = "/orders" },
                    new FooterLinkDto { Label = "Gizlilik", Href = "/privacy" },
                ],
            },
            NotFound = new NotFoundPageDto
            {
                Title = "Sayfa Bulunamadı",
                Description = "Aradığınız sayfa taşınmış, silinmiş veya hiç var olmamış olabilir.",
                PrimaryButtonLabel = "Ana Sayfaya Dön",
                PrimaryButtonHref = "/",
                SecondaryButtonLabel = brand.IsTedarik ? "Ürünleri Gör" : "Ürünleri Keşfet",
                SecondaryButtonHref = "/shop",
                BackLinkLabel = "Önceki sayfaya dön",
            },
            Navbar = new NavbarUiDto
            {
                SearchPlaceholder = brand.IsTedarik ? "Ürün, SKU veya kategori ara" : "Ürün, kategori veya marka ara",
                CategoriesLabel = "Kategoriler",
                LoginLabel = "Giriş Yap",
                AccountLabel = "Hesabım",
                WishlistLabel = "Favorilerim",
                CartLabel = "Sepetim",
                LogoutLabel = "Çıkış Yap",
                RegisterLabel = "Kayıt Ol",
                ShopSectionTitle = brand.IsTedarik ? "Ürünler" : "Mağaza",
                AccountSectionTitle = "Hesabım",
                GreetingPrefix = "Merhaba,",
                GuestNameFallback = "Kullanıcı",
                PrimaryLinks =
                [
                    new FooterLinkDto { Label = brand.IsTedarik ? "Ürünler" : "Mağaza", Href = "/shop" },
                    new FooterLinkDto { Label = "Hakkımızda", Href = "/about" },
                    new FooterLinkDto { Label = "İletişim", Href = "/contact" },
                ],
            },
            ContactPageUi = new ContactPageUiDto
            {
                InfoSectionTitle = "İletişim Bilgileri",
                FormSectionTitle = brand.IsTedarik ? "Teklif ve Destek Talebi" : "Bize Mesaj Gönderin",
                SocialSectionTitle = "Sosyal Medya",
                FormIntro = contactIntro,
                LocationLabel = "Konumumuz",
                EmailLabel = "E-posta Adresi",
                PhoneLabel = "Telefon",
                HoursLabel = "Çalışma Saatleri",
                NameLabel = "Ad Soyad",
                EmailFieldLabel = "E-posta",
                SubjectLabel = "Konu",
                MessageLabel = "Mesajınız",
                NamePlaceholder = "Adınız Soyadınız",
                EmailPlaceholder = brand.PrimaryEmail.Contains('@')
                    ? brand.PrimaryEmail.Split('@')[0] + "@firma.com"
                    : "ornek@firma.com",
                SubjectPlaceholder = brand.IsTedarik ? "Teklif / sipariş konusu" : "Mesaj konusu",
                MessagePlaceholder = "Mesajınızı buraya yazın…",
                SubmitButtonLabel = "Mesaj Gönder",
                SubmittingLabel = "Gönderiliyor…",
                SubmitSuccessTitle = "Mesajınız alındı",
                SubmitSuccessDescription = "En kısa sürede sizinle iletişime geçeceğiz.",
                SubmitErrorTitle = "Mesaj gönderilemedi",
                SubmitErrorFallback = "Lütfen daha sonra tekrar deneyin.",
            },
            LegalPageUi = new LegalPageUiDto
            {
                EmptyStateTitle = "İçerik henüz yayınlanmadı",
                EmptyStateDescription = "Bu sayfa için içerik admin panelinden eklenecektir.",
                TocTitle = "İçindekiler",
                ContactBlockTitle = "Sorularınız mı var?",
                ContactBlockDescription = "Yasal metinler hakkında destek ekibimizle iletişime geçebilirsiniz.",
                EmailLabel = "E-posta",
                PhoneLabel = "Telefon",
                ContactFormButtonLabel = "İletişim Formu",
                ContactFormHref = "/contact",
            },
            CheckoutConsent = new CheckoutConsentUiDto
            {
                Links =
                [
                    new CheckoutConsentLinkDto { Slug = "gizlilik", Label = "Gizlilik Sözleşmesi" },
                    new CheckoutConsentLinkDto { Slug = "mesafeli-satis", Label = "Mesafeli Satış Sözleşmesi" },
                    new CheckoutConsentLinkDto { Slug = "on-bilgilendirme-formu", Label = "Ön Bilgilendirme Formu" },
                ],
                SuffixText = "okudum, kabul ediyorum.",
            },
            AppPagesUi = SiteSettingsAppPagesUiFactory.CreateFor(brand),
        };
}
