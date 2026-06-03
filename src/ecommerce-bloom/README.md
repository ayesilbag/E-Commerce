# Bizdenalbizdensat E-Commerce

Modern, responsive ve kullanıcı dostu e-ticaret platformu.

## 🚀 Özellikler

- ✅ Modern React + TypeScript + Vite
- ✅ Responsive tasarım (mobil, tablet, desktop)
- ✅ Shadcn UI component kütüphanesi
- ✅ Sepet ve Favori listesi yönetimi
- ✅ Kullanıcı kimlik doğrulama (Auth)
- ✅ Adres yönetimi
- ✅ Sipariş takibi
- ✅ Ürün detay sayfası
- ✅ Ürün arama ve filtreleme
- ✅ Toast bildirimleri
- ✅ Protected routes
- ✅ SEO optimizasyonu (robots.txt, sitemap.xml, meta etiketler)

## 🛠️ Kurulum

```bash
# Dependencies
npm install

# Development
npm run dev

# Build
npm run build

# Preview
npm run preview
```

## 📁 Proje Yapısı

```
src/
├── components/      # UI components
├── contexts/        # React contexts (Auth, Cart, Wishlist, Address)
├── pages/           # Sayfa bileşenleri
├── services/        # API servisleri
├── types/           # TypeScript tipleri
├── lib/             # Yardımcı fonksiyonlar
└── main.tsx         # Uygulama giriş noktası
```

## 🌐 Environment Variables

`.env.production`:
```
VITE_API_BASE_URL=https://api.bizdenalbizdensat.com
```

## 📦 Build & Deploy

```bash
# Production build
npm run build

# Build output: dist/
```

## 🔗 API Endpoints

Backend API dokümantasyonu için `API_SPECIFICATIONS.md` dosyasına bakınız.

## 📄 Lisans

MIT License
