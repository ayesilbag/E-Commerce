namespace ECommerce.Infrastructure.Data.Seeding.SiteSettings;

internal static class SiteSettingsLegalContentFactory
{
    public sealed record LegalPagesSeed(
        string AboutTitle,
        string AboutContent,
        string DeliveryReturnsTitle,
        string DeliveryReturnsContent,
        string PrivacyTitle,
        string PrivacyContent,
        string DistanceSellingTitle,
        string DistanceSellingContent,
        string PreInformationTitle,
        string PreInformationContent);

    public static LegalPagesSeed Create(SiteSettingsBrandProfile brand)
    {
        var url = brand.Domain.TrimEnd('/');
        var mail = brand.PrimaryEmail;

        return new LegalPagesSeed(
            AboutTitle: "Hakkımızda",
            AboutContent: About(brand, url, mail),
            DeliveryReturnsTitle: "Teslimat ve İade Şartları",
            DeliveryReturnsContent: DeliveryReturns(brand, mail),
            PrivacyTitle: "Gizlilik Sözleşmesi",
            PrivacyContent: Privacy(brand, mail),
            DistanceSellingTitle: "Mesafeli Satış Sözleşmesi",
            DistanceSellingContent: DistanceSelling(brand, url, mail),
            PreInformationTitle: "Ön Bilgilendirme Formu",
            PreInformationContent: PreInformation(brand, url, mail));
    }

    private static string About(SiteSettingsBrandProfile brand, string url, string mail)
    {
        if (brand.IsTedarik)
        {
            return $"""
                <p><strong>{brand.DisplayName}</strong>, <a href="{url}">{brand.SiteName}</a> üzerinden {brand.Tagline.ToLowerInvariant()}</p>
                <h2>Misyonumuz</h2>
                <p>İşletmelerin tedarik süreçlerini hızlandırmak, stok ve maliyet yönetimini kolaylaştırmak için şeffaf fiyatlandırma ve güvenilir sevkiyat sunmak.</p>
                <h2>Hizmetlerimiz</h2>
                <ul>
                  <li>Toplu sipariş ve palette göre fiyatlandırma</li>
                  <li>Güncel stok bilgisi ve hızlı sevkiyat</li>
                  <li>Faturalı teslimat ve resmi evrak desteği</li>
                  <li>Kurumsal müşteri temsilcisi ve sipariş takibi</li>
                  <li>Güvenli ödeme altyapısı (3D Secure, iyzico)</li>
                </ul>
                <h2>İletişim</h2>
                <p>E-posta: <a href="mailto:{mail}">{mail}</a><br />Telefon: {brand.SupportPhoneDisplay}</p>
                """;
        }

        return $"""
            <p><strong>{brand.DisplayName}</strong>, <a href="{url}">{brand.SiteName}</a> üzerinden teknoloji ve yaşam kategorilerinde perakende e-ticaret hizmeti sunar.</p>
            <h2>Misyonumuz</h2>
            <p>Güvenilir tedarik, şeffaf fiyatlandırma ve satış sonrası destek ile müşterilerimize sorunsuz bir alışveriş deneyimi sağlamak.</p>
            <h2>Hizmetlerimiz</h2>
            <ul>
              <li>Geniş ürün yelpazesi ve güncel stok bilgisi</li>
              <li>Güvenli ödeme altyapısı (3D Secure destekli kart ödemeleri)</li>
              <li>Standart, hızlı ve express kargo seçenekleri</li>
              <li>14 gün cayma hakkı ve iade süreçleri</li>
              <li>Müşteri destek hattı ve e-posta desteği</li>
            </ul>
            <h2>İletişim</h2>
            <p>E-posta: <a href="mailto:{mail}">{mail}</a><br />Telefon: {brand.SupportPhoneDisplay}</p>
            """;
    }

    private static string DeliveryReturns(SiteSettingsBrandProfile brand, string mail) =>
        $"""
        <h2>1. Teslimat Süreleri ve Yöntemi</h2>
        <p>Siparişiniz, ödemenin onaylanmasını takiben <strong>1–3 iş günü</strong> içinde anlaşmalı kargo firmasına teslim edilir. Resmî tatil ve hafta sonları iş gününe dahil değildir.</p>
        <table>
          <thead><tr><th>Kargo türü</th><th>Tahmini süre</th></tr></thead>
          <tbody>
            <tr><td>Standart kargo</td><td>3–5 iş günü</td></tr>
            <tr><td>Hızlı kargo</td><td>2 iş günü</td></tr>
            <tr><td>Express kargo</td><td>1 iş günü (bölgeye göre değişebilir)</td></tr>
          </tbody>
        </table>
        <p>Teslimat yalnızca Türkiye sınırları içinde yapılır. Kargo ücreti sipariş özetinde ayrıca gösterilir; kampanyalı dönemlerde ücretsiz kargo uygulanabilir.</p>
        <h2>2. Teslimatın Gecikmesi</h2>
        <p>Mücbir sebep, olağanüstü hava koşulları veya tedarikçi kaynaklı gecikmelerde müşteri bilgilendirilir; yeni teslimat tarihi paylaşılır.</p>
        <h2>3. Hasarlı veya Eksik Teslimat</h2>
        <p>Kargo tesliminde ambalaj hasarı veya eksik ürün fark ederseniz tutanak tutturarak <strong>3 iş günü</strong> içinde <a href="mailto:{mail}">{mail}</a> adresine bildirin.</p>
        <h2>4. Cayma Hakkı ve İade</h2>
        <p>Mesafeli sözleşmelerde tüketici, malı teslim aldığı tarihten itibaren <strong>14 gün</strong> içinde cayma hakkını kullanabilir (6502 sayılı Kanun m.48 ve Mesafeli Sözleşmeler Yönetmeliği).</p>
        <ul>
          <li>Ürün kullanılmamış, aksesuarları eksiksiz ve orijinal ambalajında olmalıdır.</li>
          <li>Fatura veya e-fatura bilgisi iade sürecinde ibraz edilmelidir.</li>
          <li>Cayma bildirimi yazılı olarak (e-posta veya kayıtlı destek talebi) yapılmalıdır.</li>
        </ul>
        <p>İade onayı sonrası ödeme, yasal süreler içinde aynı ödeme yöntemine iade edilir.</p>
        <h2>5. İade Kargo Masrafı</h2>
        <p>Cayma hakkı kapsamındaki iadelerde, aksi ürün sayfasında belirtilmedikçe iade kargo ücreti tüketiciye aittir. Satıcı kaynaklı hatalarda kargo masrafı satıcıya aittir.</p>
        """;

    private static string Privacy(SiteSettingsBrandProfile brand, string mail) =>
        $"""
        <h2>1. Veri Sorumlusu</h2>
        <p><strong>{brand.DisplayName}</strong> ({brand.SiteName}), 6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) kapsamında veri sorumlusudur.</p>
        <h2>2. İşlenen Kişisel Veriler</h2>
        <ul>
          <li><strong>Kimlik:</strong> ad, soyad</li>
          <li><strong>İletişim:</strong> e-posta, telefon, teslimat/fatura adresi</li>
          <li><strong>Müşteri işlem:</strong> sipariş geçmişi, sepet, fatura bilgileri</li>
          <li><strong>İşlem güvenliği:</strong> IP, oturum logları, ödeme doğrulama kayıtları (kart numarası saklanmaz)</li>
          <li><strong>Pazarlama:</strong> bülten izni verilmişse e-posta tercihleri</li>
        </ul>
        <h2>3. İşleme Amaçları ve Hukuki Sebepler</h2>
        <p>Verileriniz; sözleşmenin kurulması ve ifası, hukuki yükümlülüklerin yerine getirilmesi, meşru menfaat ve açık rızanıza dayalı olarak sipariş, teslimat, faturalama, müşteri hizmetleri, dolandırıcılık önleme ve (izin vermeniz halinde) kampanya iletişimi amaçlarıyla işlenir.</p>
        <h2>4. Aktarım</h2>
        <p>Veriler; kargo firmaları, ödeme hizmet sağlayıcıları (ör. iyzico), barındırma/e-posta altyapı sağlayıcıları ve kanunen yetkili kamu kurumlarıyla paylaşılabilir.</p>
        <h2>5. Saklama Süresi</h2>
        <p>Ticari ve vergi mevzuatı gereği en az 5 yıl; uyuşmazlık halinde zamanaşımı süreleri boyunca saklanır.</p>
        <h2>6. Haklarınız</h2>
        <p>KVKK m.11 kapsamında bilgi talep etme, düzeltme, silme, işlemeyi kısıtlama ve itiraz haklarına sahipsiniz. Başvuru: <a href="mailto:{mail}">{mail}</a></p>
        <h2>7. Çerezler</h2>
        <p>Site deneyimini iyileştirmek için zorunlu ve (tercihinize bağlı) analitik/pazarlama çerezleri kullanılabilir. Tarayıcı ayarlarından çerezleri yönetebilirsiniz.</p>
        """;

    private static string DistanceSelling(SiteSettingsBrandProfile brand, string url, string mail) =>
        $"""
        <h2>Mesafeli Satış Sözleşmesi</h2>
        <p>İşbu sözleşme, aşağıda bilgileri yer alan <strong>Satıcı</strong> ile <strong>Alıcı</strong> arasında, 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği uyarınca elektronik ortamda kurulmuştur.</p>
        <h2>Madde 1 — Taraflar</h2>
        <p><strong>Satıcı:</strong><br />
        Unvan: {brand.DisplayName}<br />
        Web: <a href="{url}">{url}</a><br />
        E-posta: {mail}<br />
        Telefon: {brand.SupportPhoneDisplay}</p>
        <p><strong>Alıcı:</strong> Sipariş sırasında sisteme girilen ad-soyad, adres ve iletişim bilgileri esas alınır.</p>
        <h2>Madde 2 — Konu</h2>
        <p>Alıcının, Satıcıya ait internet sitesinden elektronik ortamda siparişini verdiği mal/ürünlerin satışı ve teslimine ilişkin tarafların hak ve yükümlülüklerinin belirlenmesidir.</p>
        <h2>Madde 3 — Ürün ve Bedel</h2>
        <p>Ürünün türü, miktarı, marka/modeli, KDV dahil satış bedeli, varsa kargo ücreti sipariş özet ekranında ve onay e-postasında gösterilir.</p>
        <h2>Madde 4 — Ödeme</h2>
        <p>Ödeme; kredi/banka kartı veya sitede sunulan diğer yöntemlerle, güvenli ödeme altyapısı üzerinden tahsil edilir. Sipariş, ödeme onayı ile kesinleşir.</p>
        <h2>Madde 5 — Teslimat</h2>
        <p>Ürün, Alıcının bildirdiği adrese, <a href="/delivery-returns">Teslimat ve İade Şartları</a>’nda belirtilen süre ve usulle teslim edilir.</p>
        <h2>Madde 6 — Cayma Hakkı</h2>
        <p>Alıcı, malı teslim aldığı tarihten itibaren 14 gün içinde cayma hakkını kullanabilir. Usul <a href="/delivery-returns">Teslimat ve İade Şartları</a>’nda açıklanmıştır.</p>
        <h2>Madde 7 — Ayıplı Mal</h2>
        <p>Ayıplı mal durumunda tüketici, seçimlik haklarını (ücretsiz onarım, yenisi ile değişim, bedel indirimi veya sözleşmeden dönme) kullanabilir.</p>
        <h2>Madde 8 — Uyuşmazlık</h2>
        <p>Şikâyet ve itirazlarda, her yıl Gümrük ve Ticaret Bakanlığınca ilan edilen parasal sınırlara göre İl/İlçe Tüketici Hakem Heyetleri ile Tüketici Mahkemeleri yetkilidir.</p>
        <p>Alıcı, siparişi onaylayarak işbu sözleşmenin tüm maddelerini okuduğunu ve kabul ettiğini beyan eder.</p>
        """;

    private static string PreInformation(SiteSettingsBrandProfile brand, string url, string mail) =>
        $"""
        <h2>Ön Bilgilendirme Formu</h2>
        <p>İşbu form, 6502 sayılı Kanun ve Mesafeli Sözleşmeler Yönetmeliği’nin 5. maddesi uyarınca, sipariş öncesi tüketicinin bilgilendirilmesi amacıyla hazırlanmıştır.</p>
        <h2>1. Satıcının Kimliği</h2>
        <p>
          <strong>Ticari unvan:</strong> {brand.DisplayName}<br />
          <strong>İnternet adresi:</strong> <a href="{url}">{url}</a><br />
          <strong>E-posta:</strong> <a href="mailto:{mail}">{mail}</a><br />
          <strong>Telefon:</strong> {brand.SupportPhoneDisplay}<br />
          <strong>MERSİS / Vergi no:</strong> (Şirket sicil bilgileri fatura üzerinde yer alır.)
        </p>
        <h2>2. Mal / Hizmetin Temel Nitelikleri</h2>
        <p>Sipariş konusu ürünler; {brand.Tagline.ToLowerInvariant()} Her ürünün adı, modeli, miktarı, satış bedeli ve varsa vergiler sipariş özeti ekranında gösterilir.</p>
        <h2>3. Toplam Bedel (Vergiler Dahil)</h2>
        <p>Ürünlerin KDV dahil satış fiyatı, varsa indirim tutarı, kargo ücreti ve ödenecek <strong>genel toplam</strong> sipariş onay adımında listelenir.</p>
        <h2>4. Ödeme, Teslimat ve İfa</h2>
        <ul>
          <li><strong>Ödeme:</strong> Kredi/banka kartı veya sitede sunulan diğer güvenli yöntemlerle peşin tahsilat.</li>
          <li><strong>Teslimat:</strong> Ödeme onayından sonra 1–3 iş günü içinde kargoya verilir.</li>
          <li><strong>Teslimat adresi:</strong> Alıcının siparişte belirttiği Türkiye içi adres.</li>
        </ul>
        <h2>5. Cayma Hakkı</h2>
        <p>Tüketici, malı teslim aldığı tarihten itibaren <strong>14 gün</strong> içinde cayma hakkına sahiptir. Detaylar <a href="/delivery-returns">Teslimat ve İade Şartları</a> sayfasındadır.</p>
        <h2>6. Garanti ve Müşteri Hizmetleri</h2>
        <p>Ürünler, üretici/tedarikçi garantisi kapsamındadır. Destek: {mail} / {brand.SupportPhoneDisplay}</p>
        <h2>7. Uyuşmazlık Çözümü</h2>
        <p>Şikâyetleriniz için öncelikle satıcıya başvurabilirsiniz. Çözülemeyen uyuşmazlıklarda Tüketici Hakem Heyetleri ve Tüketici Mahkemeleri yetkilidir.</p>
        <h2>8. Onay</h2>
        <p>Sipariş onay adımında; işbu Ön Bilgilendirme Formu, <a href="/distance-selling">Mesafeli Satış Sözleşmesi</a> ve <a href="/privacy">Gizlilik Sözleşmesi</a>’ni okuduğunuzu ve kabul ettiğinizi beyan etmiş olursunuz.</p>
        """;
}
