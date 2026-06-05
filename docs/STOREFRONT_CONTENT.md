# Vitrin içeriği (admin referansı)

Bu dosya, **Site Ayarları → Vitrin içeriği** bölümüne manuel girilecek örnek metinleri içerir. Otomatik seed yoktur; admin panelinden girilir.

## Footer açıklama

```
En son teknoloji ürünlerini uygun fiyatlarla sunan e-ticaret platformumuzda güvenli alışveriş deneyimi.
```

## Hero slaytları (örnek 1)

| Alan | Değer |
|------|--------|
| Rozet | Yeni Koleksiyon |
| Başlık | En Yeni Ürünleri |
| Vurgu | Keşfet |
| Alt başlık | Sezonun en yeni ürünleri sizin için seçildi. |
| Birincil buton / link | Alışverişe Başla → `/shop` |
| İkincil buton / link | Kategorileri Gör → `/categories` |
| Arka plan sınıfı | `from-primary/10 to-primary/20` |
| Görsel | Admin'den yükleyin |

## Güven bandı (4 öğe)

1. **Kargo** — Ücretsiz Kargo / 500₺ ve üzeri siparişlerde  
2. **İade** — 30 Gün İade / Koşulsuz iade garantisi  
3. **Güvenlik** — Güvenli Ödeme / 256-bit SSL şifrelemesi  
4. **Kalite** — Orijinal Ürün / %100 orijinallik garantisi  

## Kampanya bannerları

1. **Büyük** — Sınırlı Süre / %50'ye Kadar İndirim → `/shop?sort=discounted`  
2. **Küçük** — Yeni Gelenler → `/shop?sort=newest`  
3. **Küçük** — Flash Fırsat → `/shop`  

## Anasayfa ürün rafları

| Başlık | Alt başlık | Link | Sıralama | Limit |
|--------|------------|------|----------|-------|
| Çok Satanlar | Müşterilerimizin en çok tercih ettiği ürünler | `/shop?sort=featured` | featured | 12 |
| Yeni Gelenler | Mağazamıza yeni eklenen ürünler | `/shop?sort=newest` | newest | 12 |
| Fırsatlar | Sınırlı stok, sınırsız tasarruf | `/shop?sort=discounted` | discounted | 12 |

## Bülten

- **Başlık:** Bültenimize Abone Olun  
- **Açıklama:** En son ürünler, özel teklifler ve haberler e-posta kutunuza.  
- **Placeholder:** E-posta adresinizi girin  
- **Buton:** Abone Ol  
- **Alt not:** Abone olarak Gizlilik Politikamızı kabul etmiş olursunuz.

## İletişim — SSS

**Bölüm başlığı:** Sıkça Sorulan Sorular  

Örnek sorular: kargo seçenekleri, iade politikası, sipariş takibi, uluslararası kargo.

**Alt metin:** Hâlâ sorularınız var mı?  
**Alt buton:** Tüm SSS'leri Görüntüle → `/contact#faq`

## İletişim — Harita

- **Başlık:** Haritada Bizi Bulun  
- **Açıklama:** Adres alanından veya buradan girilir.  
- **Embed URL:** Google Maps iframe `src` adresi  
- **Harita yokken mesaj:** Harita bilgisi yakında eklenecektir.

## Footer menü

| Alan | Örnek |
|------|--------|
| Hızlı linkler başlığı | Hızlı Linkler |
| Müşteri hizmetleri başlığı | Müşteri Hizmetleri |
| İletişim bölümü başlığı | İletişim |
| Telif metni | Tüm hakları saklıdır. |
| Adres / Telefon / E-posta / Çalışma saatleri etiketleri | Adres:, Telefon:, E-posta:, Çalışma Saatleri: |

**Hızlı linkler:** Anasayfa `/` · Mağaza `/shop` · Kategoriler `/categories` · Hakkımızda `/about` · İletişim `/contact`

**Müşteri hizmetleri:** SSS `/contact#faq` · Teslimat `/delivery-returns` · Sipariş Takibi `/orders` · Yasal sayfalar

Alt yasal link şeridi, admin'de içeriği girilmiş yasal sayfaların başlıklarından otomatik oluşur.

## 404 sayfası

| Alan | Örnek |
|------|--------|
| Başlık | Sayfa Bulunamadı |
| Açıklama | Aradığınız sayfa taşınmış, silinmiş veya hiç var olmamış olabilir. |
| Birincil buton | Ana Sayfaya Dön → `/` |
| İkincil buton | Ürünleri Keşfet → `/shop` |
| Geri link | Önceki sayfaya dön |

## Arayüz metinleri (Navbar, iletişim, yasal arayüz, ödeme onayı)

### Navbar

| Alan | Örnek |
|------|--------|
| Arama placeholder | Ürün, kategori veya marka ara |
| Kategoriler etiketi | Kategoriler |
| Giriş yap / Hesabım | Giriş Yap · Hesabım |
| Favoriler / Sepet | Favorilerim · Sepetim |
| Çıkış yap / Kayıt ol | Çıkış Yap · Kayıt Ol |
| Mobil bölüm başlıkları | Mağaza · Hesabım |
| Selamlama | Merhaba, |
| Varsayılan kullanıcı adı | Kullanıcı |

**Ana menü linkleri:** Mağaza `/shop` · Hakkımızda `/about` · İletişim `/contact`

### İletişim sayfası

| Alan | Örnek |
|------|--------|
| Bilgiler bölüm başlığı | İletişim Bilgileri |
| Form bölüm başlığı | Bize Mesaj Gönderin |
| Form giriş metni | Aşağıdaki formu doldurun… |
| Konum / E-posta / Telefon / Saat etiketleri | Konumumuz · E-posta Adresi · … |
| Form alan etiketleri ve placeholder'lar | Adınız Soyadınız · ahmet@example.com · … |
| Gönder butonu / Gönderiliyor | Mesaj Gönder · Gönderiliyor… |
| Toast mesajları | Mesaj gönderildi · Mesaj gönderilemedi |

### Yasal sayfa arayüzü

Boş durum, içindekiler başlığı, iletişim bloğu metinleri ve etiketler.

### Ödeme — sözleşme onayı

**Suffix:** okudum, kabul ediyorum.  
**Linkler:** `privacy-policy` → Gizlilik Politikası · `distance-selling-agreement` → Mesafeli Satış Sözleşmesi

### Bülten toast metinleri

Gönderiliyor, başarı/hata başlıkları, boş e-posta mesajı — **Bülten bölümü** altında ayrı alanlar.

## Sayfa arayüz metinleri (JSON)

Giriş, hesap, mağaza, sepet, ödeme, ürün ve toast mesajları için **AppPagesUi JSON** alanını kullanın. Örnek şablon: `docs/APP_PAGES_UI.md`.

## SEO

Yasal sayfalar ve SEO ayrı admin bölümlerinden yönetilir (`docs/LEGAL_PAGE_CONTENT.md`).
