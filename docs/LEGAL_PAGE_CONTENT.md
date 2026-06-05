# Yasal Sayfa HTML İçerikleri

Admin → **Site ayarları** → UI düzenle → **Ödeme entegrasyonu** bölümündeki ilgili textarea'ya HTML'i yapıştırın ve **Kaydet**'e basın.

| Sayfa | Admin slug | Storefront URL |
|-------|------------|----------------|
| Hakkımızda | `hakkimizda` | `/about` |
| Ön Bilgilendirme Formu | `on-bilgilendirme-formu` | `/pre-information` |
| Teslimat ve İade Şartları | `teslimat-ve-iade` | `/delivery-returns` |
| Gizlilik Sözleşmesi | `gizlilik` | `/privacy` |
| Mesafeli Satış Sözleşmesi | `mesafeli-satis` | `/distance-selling` |

**CSS sınıfları:** Storefront `legal-content` stilleri şu sınıfları destekler: `legal-lead`, `legal-highlight`, `legal-stats`, `legal-stat`, `legal-grid-2`, `legal-card`, `legal-steps`

**Not:** İletişim bilgilerini kendi kaydınıza göre güncelleyin.

---

## 1. Hakkımızda

**Admin alanı:** `aboutPageContent`

```html
<p class="legal-lead">Bizden Al Bizden Sat, bizdenalbizdensat.com üzerinden teknoloji ve yaşam kategorilerinde güvenilir perakende e-ticaret hizmeti sunar.</p>

<div class="legal-stats">
  <div class="legal-stat"><strong>10.000+</strong><span>Mutlu müşteri</span></div>
  <div class="legal-stat"><strong>5.000+</strong><span>Ürün çeşidi</span></div>
  <div class="legal-stat"><strong>7/24</strong><span>Online destek</span></div>
  <div class="legal-stat"><strong>%100</strong><span>Güvenli ödeme</span></div>
</div>

<h2>Hikayemiz</h2>
<p>Kaliteli ürünleri uygun fiyatlarla müşterilerimize ulaştırmak amacıyla kurulduk. Geniş ürün yelpazemiz, hızlı kargo seçeneklerimiz ve müşteri odaklı destek ekibimizle her siparişinizde yanınızdayız.</p>

<div class="legal-grid-2">
  <div class="legal-card">
    <h3>Misyonumuz</h3>
    <p>Güvenilir tedarik, şeffaf fiyatlandırma ve satış sonrası destek ile müşterilerimize sorunsuz bir alışveriş deneyimi sağlamak.</p>
  </div>
  <div class="legal-card">
    <h3>Vizyonumuz</h3>
    <p>Türkiye'nin güvenilir ve tercih edilen online alışveriş platformlarından biri olmak.</p>
  </div>
</div>

<h2>Hizmetlerimiz</h2>
<ul>
  <li>Geniş ürün yelpazesi ve güncel stok bilgisi</li>
  <li>Güvenli ödeme altyapısı (3D Secure destekli kart ödemeleri)</li>
  <li>Standart, hızlı ve express kargo seçenekleri</li>
  <li>14 gün cayma hakkı ve şeffaf iade süreçleri</li>
  <li>Müşteri destek hattı ve e-posta desteği</li>
</ul>

<div class="legal-highlight">
  <strong>Müşteri memnuniyeti önceliğimizdir.</strong> Sipariş öncesi ve sonrası tüm süreçlerde yanınızdayız.
</div>

<h2>İletişim</h2>
<table>
  <tbody>
    <tr><th>E-posta</th><td><a href="mailto:info@bizdenalbizdensat.com">info@bizdenalbizdensat.com</a></td></tr>
    <tr><th>Telefon</th><td>0 554 449 04 49</td></tr>
    <tr><th>Web sitesi</th><td>bizdenalbizdensat.com</td></tr>
  </tbody>
</table>
```

---

## 2. Ön Bilgilendirme Formu

**Admin alanı:** `preInformationFormPageContent`

```html
<p class="legal-lead">6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği kapsamında, sipariş öncesinde bilgilendirilmeniz amacıyla hazırlanmıştır.</p>

<h2>1. Satıcı Bilgileri</h2>
<table>
  <tbody>
    <tr><th>Unvan</th><td>Bizden Al Bizden Sat</td></tr>
    <tr><th>Web sitesi</th><td>bizdenalbizdensat.com</td></tr>
    <tr><th>E-posta</th><td>info@bizdenalbizdensat.com</td></tr>
    <tr><th>Telefon</th><td>0 554 449 04 49</td></tr>
  </tbody>
</table>

<h2>2. Ürün / Hizmet Bilgileri</h2>
<p>Satın almak istediğiniz ürünün temel nitelikleri, satış fiyatı (vergiler dahil), ödeme şekli ve teslimat koşulları ürün sayfasında ve sipariş özetinde ayrıntılı olarak gösterilmektedir.</p>

<h2>3. Fiyat ve Ödeme</h2>
<ul>
  <li>Ürün fiyatları Türk Lirası (TRY) cinsindendir ve KDV dahildir.</li>
  <li>Kargo bedeli sepet aşamasında ayrıca gösterilir.</li>
  <li>Ödeme; kredi kartı ve banka kartı ile 3D Secure destekli güvenli ödeme altyapısı üzerinden yapılır.</li>
</ul>

<div class="legal-highlight">
  Ödeme bilgileriniz PCI-DSS uyumlu ödeme sağlayıcıları aracılığıyla güvenle işlenir; kart bilgileriniz tarafımızca saklanmaz.
</div>

<h2>4. Teslimat</h2>
<p>Ürünler, sipariş onayından itibaren seçilen kargo yöntemine göre belirtilen süre içinde teslim edilir. Teslimat adresi sipariş sırasında tarafınızca belirlenir.</p>

<h2>5. Cayma Hakkı</h2>
<p>Ürünü teslim aldığınız tarihten itibaren <strong>14 gün</strong> içinde hiçbir gerekçe göstermeksizin cayma hakkına sahipsiniz. Ayrıntılar Teslimat ve İade Şartları sayfamızda yer almaktadır.</p>

<h2>6. Şikayet ve İtiraz</h2>
<p>Şikayet ve itirazlarınızı <a href="mailto:info@bizdenalbizdensat.com">info@bizdenalbizdensat.com</a> adresine iletebilir veya 0 554 449 04 49 numarasından bize ulaşabilirsiniz. Tüketici hakem heyetlerine ve tüketici mahkemelerine başvuru hakkınız saklıdır.</p>
```

---

## 3. Teslimat ve İade Şartları

**Admin alanı:** `deliveryReturnsPageContent`

```html
<p class="legal-lead">Siparişlerinizin teslimatı ve iade süreçleri hakkında bilmeniz gereken tüm detaylar aşağıdadır.</p>

<h2>Teslimat Koşulları</h2>
<ul>
  <li>Siparişler, ödeme onayından sonra 1–3 iş günü içinde kargoya verilir.</li>
  <li>Standart teslimat süresi 3–5 iş günüdür.</li>
  <li>Hızlı ve express kargo seçenekleri ödeme aşamasında sunulur.</li>
  <li>Kargo takip numaranız, siparişiniz kargoya verildiğinde e-posta ile iletilir.</li>
</ul>

<h2>Kargo Ücretleri</h2>
<p>Kargo bedeli sepet aşamasında gösterilir. Kampanya dönemlerinde belirli tutarın üzerindeki siparişlerde ücretsiz kargo uygulanabilir.</p>

<h2>Teslimat Sırasında Dikkat Edilmesi Gerekenler</h2>
<div class="legal-highlight">
  Kargo görevlisinin yanında paketi kontrol ediniz. Hasarlı paketleri teslim almadan tutanak tutturunuz.
</div>

<h2>İade Koşulları</h2>
<p>6502 sayılı Kanun uyarınca, ürünü teslim aldığınız tarihten itibaren <strong>14 gün</strong> içinde cayma hakkınızı kullanabilirsiniz.</p>

<div class="legal-grid-2">
  <div class="legal-card">
    <h3>İade edilebilir</h3>
    <ul>
      <li>Orijinal ambalajında, kullanılmamış ürünler</li>
      <li>Faturası ve aksesuarları eksiksiz ürünler</li>
    </ul>
  </div>
  <div class="legal-card">
    <h3>İade edilemez</h3>
    <ul>
      <li>Ambalajı açılmış hijyen ürünleri</li>
      <li>Kişiselleştirilmiş ürünler</li>
      <li>Aktivasyonu yapılmış dijital içerikler</li>
    </ul>
  </div>
</div>

<h2>İade Süreci</h2>
<ol class="legal-steps">
  <li><strong>1</strong><span><a href="mailto:info@bizdenalbizdensat.com">info@bizdenalbizdensat.com</a> adresine sipariş numaranız ve iade nedeninizle başvurun.</span></li>
  <li><strong>2</strong><span>Onay sonrası ürünü belirtilen adrese gönderin.</span></li>
  <li><strong>3</strong><span>Ürün depomuza ulaştıktan sonra 14 gün içinde ödemeniz iade edilir.</span></li>
</ol>
```

---

## 4. Gizlilik Sözleşmesi

**Admin alanı:** `privacyPolicyPageContent`

```html
<p class="legal-lead">6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında bilgilendirme metnidir. Kişisel verilerinizin güvenliği bizim için önceliklidir.</p>

<h2>1. Veri Sorumlusu</h2>
<table>
  <tbody>
    <tr><th>Unvan</th><td>Bizden Al Bizden Sat</td></tr>
    <tr><th>Web sitesi</th><td>bizdenalbizdensat.com</td></tr>
    <tr><th>E-posta</th><td>info@bizdenalbizdensat.com</td></tr>
    <tr><th>Telefon</th><td>0 554 449 04 49</td></tr>
  </tbody>
</table>

<h2>2. Toplanan Kişisel Veriler</h2>
<ul>
  <li>Kimlik ve iletişim bilgileri (ad, soyad, e-posta, telefon, adres)</li>
  <li>Sipariş ve ödeme bilgileri</li>
  <li>Üyelik ve oturum bilgileri</li>
  <li>Site kullanım verileri (çerezler, IP adresi, tarayıcı bilgisi)</li>
</ul>

<h2>3. Verilerin İşlenme Amaçları</h2>
<ul>
  <li>Sipariş ve teslimat süreçlerinin yürütülmesi</li>
  <li>Ödeme işlemlerinin gerçekleştirilmesi</li>
  <li>Müşteri hizmetleri ve destek faaliyetleri</li>
  <li>Yasal yükümlülüklerin yerine getirilmesi</li>
  <li>Onayınız halinde kampanya ve bilgilendirme iletişimi</li>
</ul>

<h2>4. Verilerin Aktarılması</h2>
<p>Kişisel verileriniz; kargo firmaları, ödeme kuruluşları ve yasal mercilerle yalnızca hizmetin ifası veya yasal zorunluluk kapsamında paylaşılabilir.</p>

<h2>5. Çerezler (Cookies)</h2>
<p>Web sitemiz kullanıcı deneyimini iyileştirmek amacıyla çerezler kullanır. Tarayıcı ayarlarınızdan çerezleri yönetebilirsiniz.</p>

<div class="legal-highlight">
  Kişisel verileriniz SSL şifreleme ile korunmaktadır. Ödeme bilgileriniz güvenli ödeme sağlayıcıları aracılığıyla işlenir.
</div>

<h2>6. Haklarınız</h2>
<p>KVKK'nın 11. maddesi kapsamında verilerinize erişme, düzeltme, silme, işlenmesini kısıtlama ve itiraz etme haklarına sahipsiniz. Taleplerinizi <a href="mailto:info@bizdenalbizdensat.com">info@bizdenalbizdensat.com</a> adresine iletebilirsiniz.</p>
```

---

## 5. Mesafeli Satış Sözleşmesi

**Admin alanı:** `distanceSellingAgreementPageContent`

```html
<p class="legal-lead">6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri uyarınca düzenlenmiştir.</p>

<h2>MADDE 1 — TARAFLAR</h2>
<h3>1.1. Satıcı</h3>
<table>
  <tbody>
    <tr><th>Unvan</th><td>Bizden Al Bizden Sat</td></tr>
    <tr><th>Web sitesi</th><td>bizdenalbizdensat.com</td></tr>
    <tr><th>E-posta</th><td>info@bizdenalbizdensat.com</td></tr>
    <tr><th>Telefon</th><td>0 554 449 04 49</td></tr>
  </tbody>
</table>
<h3>1.2. Alıcı</h3>
<p>Sipariş sırasında belirtilen ad, soyad, adres ve iletişim bilgilerine sahip tüketici.</p>

<h2>MADDE 2 — KONU</h2>
<p>İşbu sözleşmenin konusu, Alıcı'nın Satıcı'ya ait bizdenalbizdensat.com internet sitesi üzerinden elektronik ortamda sipariş verdiği ürünlerin satışı ve teslimine ilişkin tarafların hak ve yükümlülüklerinin belirlenmesidir.</p>

<h2>MADDE 3 — SÖZLEŞME KONUSU ÜRÜN</h2>
<p>Ürünün türü, miktarı, marka/modeli, satış bedeli, ödeme ve teslimat bilgileri sipariş onay ekranında ve e-posta onayında belirtilmiştir.</p>

<h2>MADDE 4 — GENEL HÜKÜMLER</h2>
<ul>
  <li>Alıcı, sipariş öncesi Ön Bilgilendirme Formu'nu okuduğunu ve kabul ettiğini beyan eder.</li>
  <li>Satıcı, siparişi makul sürede teslim etmekle yükümlüdür.</li>
  <li>Ürün bedeli, sipariş sırasında belirtilen yöntemle tahsil edilir.</li>
</ul>

<h2>MADDE 5 — CAYMA HAKKI</h2>
<p>Alıcı, ürünü teslim aldığı tarihten itibaren 14 gün içinde cayma hakkını kullanabilir. Cayma hakkının kullanımı, ürünün iade koşullarına uygun olması halinde geçerlidir.</p>

<h2>MADDE 6 — UYUŞMAZLIKLARIN ÇÖZÜMÜ</h2>
<p>İşbu sözleşmeden doğan uyuşmazlıklarda, Ticaret Bakanlığı tarafından belirlenen parasal sınırlar dahilinde İl/İlçe Tüketici Hakem Heyetleri; bu sınırları aşan durumlarda Tüketici Mahkemeleri yetkilidir.</p>

<div class="legal-highlight">
  Alıcı, siparişi onayladığı anda işbu sözleşmenin tüm hükümlerini okuduğunu, anladığını ve kabul ettiğini beyan eder.
</div>
```
