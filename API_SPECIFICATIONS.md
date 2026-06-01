# Purplify E-Commerce API Specifications & Data Models

## 📋 İçindekiler

1. [Genel Bilgiler](#genel-bilgiler)
2. [Kimlik Doğrulama](#kimlik-doğrulama)
3. [Veri Modelleri](#veri-modelleri)
4. [API Endpoints](#api-endpoints)
5. [Ekran Bazlı API Çağrıları](#ekran-bazlı-api-çağrıları)

---

## Genel Bilgiler

### API Mimarisi

- **Base URL:** `https://api.purplify.com/v1`
- **Auth Method:** JWT Token
- **Response Format:** JSON
- **Content-Type:** application/json

### HTTP Status Codes

```
200 - OK (Başarılı)
201 - Created (Oluşturuldu)
400 - Bad Request (Hatalı istek)
401 - Unauthorized (Yetkisiz)
403 - Forbidden (Yasak)
404 - Not Found (Bulunamadı)
409 - Conflict (Çakışma)
500 - Internal Server Error (Sunucu hatası)
```

---

## Kimlik Doğrulama

### Authentication Model

```typescript
// JWT Token Structure
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "Bearer",
  "expires_in": 3600
}

// Token Payload
{
  "userId": "user_123",
  "email": "user@example.com",
  "role": "customer",
  "iat": 1704067200,
  "exp": 1704070800
}
```

---

## Veri Modelleri

### 1. User Model

```typescript
interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  password: string;
  avatar?: string;
  role: "customer" | "admin" | "vendor";
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  addresses?: Address[];
  preferences?: UserPreferences;
}

interface UserPreferences {
  newsletter: boolean;
  notifications: boolean;
  language: "tr" | "en";
  currency: "TRY" | "USD" | "EUR";
}

interface Address {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  type: "home" | "work" | "other";
  createdAt: string;
}
```

### 2. Product Model

```typescript
interface Product {
  id: string;
  name: string;
  description: string;
  longDescription?: string;
  price: number;
  originalPrice?: number;
  category: string;
  subcategory?: string;
  image: string;
  images: string[];

  // Inventory
  stock: number;
  sku: string;
  barcode?: string;

  // Specifications
  specifications: ProductSpecification[];
  variants: ProductVariant[];

  // Ratings & Reviews
  rating: number;
  reviewCount: number;
  reviews?: Review[];

  // Visibility
  badge?: "Sale" | "New" | "Hot" | "Limited";
  isActive: boolean;
  isFeatured: boolean;

  // Metadata
  tags: string[];
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

interface ProductSpecification {
  name: string;
  value: string;
}

interface ProductVariant {
  id: string;
  productId: string;
  color?: string;
  size?: string;
  fit?: string;
  sleeveType?: string;
  neckType?: string;
  material?: string;
  season?: string;
  stock: number;
  price?: number;
  sku?: string;
}

interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  helpful: number;
  createdAt: string;
}
```

### 3. Category Model

```typescript
interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  icon?: string;
  parentCategoryId?: string;
  subcategories?: Category[];
  productCount: number;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}
```

### 4. Order Model

```typescript
interface Order {
  id: string;
  orderNumber: string; // ORD-XXXXXX
  userId: string;
  status: OrderStatus;
  items: OrderItem[];

  // Pricing
  subtotal: number;
  discountAmount: number;
  discountCode?: string;
  shippingCost: number;
  tax: number;
  total: number;

  // Shipping
  shippingAddress: Address;
  shippingMethod: ShippingMethod;
  trackingNumber?: string;

  // Payment
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  transactionId?: string;

  // Timeline
  createdAt: string;
  updatedAt: string;
  paidAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
  cancelledAt?: string;

  // Additional
  notes?: string;
  cancellationReason?: string;
}

type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "returned";
type PaymentStatus = "pending" | "completed" | "failed" | "refunded";

interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number; // Unit price
  subtotal: number; // quantity * price
  variant?: {
    color?: string;
    size?: string;
    fit?: string;
  };
}

interface ShippingMethod {
  id: string;
  name: string;
  description?: string;
  cost: number;
  estimatedDays: number;
  provider?: string;
}

interface PaymentMethod {
  id: string;
  type:
    | "credit_card"
    | "debit_card"
    | "bank_transfer"
    | "wallet"
    | "cash_on_delivery";
  cardName?: string;
  cardLast4?: string;
  cardBrand?: string;
}
```

### 5. Cart Model

```typescript
interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  selectedVariant?: {
    color?: string;
    size?: string;
    fit?: string;
    sleeveType?: string;
    neckType?: string;
    material?: string;
    season?: string;
  };
  addedAt: string;
}

interface Cart {
  userId?: string;
  cartToken?: string; // For guest users
  items: CartItem[];
  subtotal: number;
  tax: number;
  shippingCost?: number;
  discountAmount: number;
  discountCode?: string;
  total: number;
  updatedAt: string;
}
```

### 6. Wishlist Model

```typescript
interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  product?: Product;
  addedAt: string;
}

interface Wishlist {
  userId: string;
  items: WishlistItem[];
  itemCount: number;
  updatedAt: string;
}
```

### 7. Contact Message Model

```typescript
interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: "new" | "read" | "replied" | "closed";
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
  reply?: {
    message: string;
    repliedBy: string;
    repliedAt: string;
  };
}
```

### 8. Newsletter Subscription Model

```typescript
interface NewsletterSubscription {
  id: string;
  email: string;
  name?: string;
  status: "subscribed" | "unsubscribed" | "bounced";
  verificationToken?: string;
  isVerified: boolean;
  subscribedAt: string;
  unsubscribedAt?: string;
}
```

### 9. Site Settings Model

```typescript
interface SiteSettings {
  id: string;
  code: string;           // UI tanımlayıcı (ör. bizdenal, digitalep)
  name: string;           // Admin görünen ad
  siteName: string;
  domain?: string;
  logoUrl?: string;
  faviconUrl?: string;
  address?: string;
  emails: string[];
  phones: string[];
  workingHours: string[];
  socialLinks: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    youTube?: string;
  };
  isActive: boolean;
  isDefault: boolean;
}
```

---

## API Endpoints

### 🔐 Authentication Endpoints

#### POST /auth/register

Yeni kullanıcı kaydı

**Request:**

```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "+905551234567",
  "password": "SecurePassword123!",
  "confirmPassword": "SecurePassword123!"
}
```

**Response (201):**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "john@example.com",
      "fullName": "John Doe",
      "phone": "+905551234567"
    },
    "tokens": {
      "access_token": "eyJhbGciOiJIUzI1NiIs...",
      "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
      "expires_in": 3600
    }
  }
}
```

**Error (400):**

```json
{
  "success": false,
  "error": {
    "code": "EMAIL_ALREADY_EXISTS",
    "message": "Bu email adresi zaten kayıtlı"
  }
}
```

---

#### POST /auth/login

Kullanıcı girişi

**Request:**

```json
{
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "john@example.com",
      "fullName": "John Doe"
    },
    "tokens": {
      "access_token": "eyJhbGciOiJIUzI1NiIs...",
      "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
      "expires_in": 3600
    }
  }
}
```

---

#### POST /auth/refresh-token

Token yenileme

**Request:**

```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "expires_in": 3600
  }
}
```

---

#### POST /auth/logout

Çıkış

**Headers:** `Authorization: Bearer <token>`

**Response (200):**

```json
{
  "success": true,
  "message": "Başarıyla çıkış yaptınız"
}
```

---

### 👤 User Endpoints

#### GET /users/profile

Kullanıcı profilini getir

**Headers:** `Authorization: Bearer <token>`

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "user_123",
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "+905551234567",
    "avatar": "https://...",
    "createdAt": "2023-03-15T10:30:00Z",
    "addresses": [
      {
        "id": "addr_123",
        "fullName": "John Doe",
        "phone": "+905551234567",
        "address": "Mevlana Cad. No:45",
        "city": "Istanbul",
        "district": "Besiktash",
        "postalCode": "34350",
        "country": "Turkey",
        "type": "home",
        "isDefault": true
      }
    ],
    "preferences": {
      "newsletter": true,
      "notifications": true,
      "language": "tr",
      "currency": "TRY"
    }
  }
}
```

---

#### PUT /users/profile

Kullanıcı profilini güncelle

**Headers:** `Authorization: Bearer <token>`

**Request:**

```json
{
  "fullName": "John Doe",
  "phone": "+905551234567",
  "avatar": "https://..."
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Profil başarıyla güncellendi",
  "data": {
    "id": "user_123",
    "fullName": "John Doe",
    "email": "john@example.com"
  }
}
```

---

#### POST /users/addresses

Yeni adres ekle

**Headers:** `Authorization: Bearer <token>`

**Request:**

```json
{
  "fullName": "John Doe",
  "phone": "+905551234567",
  "address": "Mevlana Cad. No:45",
  "city": "Istanbul",
  "district": "Besiktash",
  "postalCode": "34350",
  "country": "Turkey",
  "type": "home",
  "isDefault": false
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Adres başarıyla eklendi",
  "data": {
    "id": "addr_123",
    "fullName": "John Doe",
    "address": "Mevlana Cad. No:45"
  }
}
```

---

#### PUT /users/addresses/:addressId

Adresi güncelle

**Headers:** `Authorization: Bearer <token>`

**Request:**

```json
{
  "fullName": "John Doe",
  "phone": "+905551234567",
  "address": "Mevlana Cad. No:50"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Adres başarıyla güncellendi"
}
```

---

#### DELETE /users/addresses/:addressId

Adresi sil

**Headers:** `Authorization: Bearer <token>`

**Response (200):**

```json
{
  "success": true,
  "message": "Adres başarıyla silindi"
}
```

---

#### PUT /users/preferences

Kullanıcı tercihlerini güncelle

**Headers:** `Authorization: Bearer <token>`

**Request:**

```json
{
  "newsletter": true,
  "notifications": false,
  "language": "tr",
  "currency": "TRY"
}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "newsletter": true,
    "notifications": false,
    "language": "tr",
    "currency": "TRY"
  }
}
```

---

### 📦 Product Endpoints

#### GET /products

Ürün listesini getir (filtreleme, arama, pagination)

**Query Parameters:**

```
GET /products?page=1&limit=20&search=tişört&category=Kıyafet&minPrice=500&maxPrice=1000&sort=featured&rating=4&color=Siyah&size=M
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "prod_1093560416",
        "name": "SPORTİVEA Spor Oversize Kalıp %100 PAMUK Unisex T-shirt",
        "price": 759.0,
        "originalPrice": 899.0,
        "category": "Kıyafet",
        "image": "https://...",
        "rating": 5.0,
        "reviewCount": 245,
        "stock": 200,
        "badge": "Sale"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "pages": 8
    },
    "filters": {
      "categories": ["Kıyafet", "Aksesuar"],
      "priceRange": { "min": 100, "max": 5000 },
      "ratings": [1, 2, 3, 4, 5],
      "colors": ["Siyah", "Beyaz", "Mavi"],
      "sizes": ["XS", "S", "M", "L", "XL", "XXL"],
      "materials": ["Pamuk", "Polyester", "Karışık"],
      "seasons": ["Yaz", "Kış", "Sonbahar", "İlkbahar"]
    }
  }
}
```

---

#### GET /products/:productId

Ürün detaylarını getir

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "prod_1093560416",
    "name": "SPORTİVEA Spor Oversize Kalıp %100 PAMUK Unisex T-shirt",
    "description": "Nefes alan, %100 pamuk, oversize kalıp spor tişört, 4 renk seçeneği.",
    "longDescription": "...",
    "price": 759.0,
    "originalPrice": 899.0,
    "category": "Kıyafet",
    "subcategory": "T-Shirt",
    "image": "https://...",
    "images": ["https://...", "https://..."],
    "stock": 200,
    "sku": "SPO-OVS-001",
    "specifications": [
      { "name": "Material", "value": "%100 Pamuk" },
      { "name": "Fit", "value": "Oversize" },
      { "name": "Neck", "value": "Bisiklet Yaka" }
    ],
    "variants": [
      {
        "id": "var_1",
        "color": "Siyah",
        "size": "M",
        "fit": "Oversize",
        "stock": 50,
        "sku": "SPO-OVS-001-BLK-M"
      }
    ],
    "rating": 5.0,
    "reviewCount": 245,
    "reviews": [
      {
        "id": "rev_1",
        "userName": "Ayşe K.",
        "rating": 5,
        "title": "Çok kaliteli",
        "comment": "Gerçekten çok kaliteli bir ürün...",
        "createdAt": "2024-04-10T15:30:00Z"
      }
    ],
    "badge": "Sale",
    "tags": ["tişört", "casual", "spor", "pamuk"],
    "relatedProducts": [{ "id": "prod_123", "name": "...", "price": 500 }]
  }
}
```

---

#### POST /products/:productId/reviews

Ürün yorumu ekle

**Headers:** `Authorization: Bearer <token>`

**Request:**

```json
{
  "rating": 5,
  "title": "Çok kaliteli ürün",
  "comment": "Gerçekten çok memnunum. Tavsiye ederim.",
  "images": ["https://...", "https://..."]
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Yorum başarıyla eklendi",
  "data": {
    "id": "rev_new",
    "rating": 5,
    "title": "Çok kaliteli ürün",
    "createdAt": "2024-04-20T10:30:00Z"
  }
}
```

---

#### GET /products/:productId/reviews

Ürün yorumlarını getir

**Query Parameters:**

```
GET /products/:productId/reviews?page=1&limit=10&sort=recent
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "reviews": [
      {
        "id": "rev_1",
        "userName": "Ayşe K.",
        "rating": 5,
        "title": "Çok kaliteli",
        "comment": "Gerçekten çok kaliteli...",
        "helpful": 125,
        "createdAt": "2024-04-10T15:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 245
    }
  }
}
```

---

### 🏷️ Category Endpoints

#### GET /categories

Kategori listesini getir

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "cat_1",
      "name": "Kıyafet",
      "slug": "kiyafet",
      "image": "https://...",
      "icon": "👕",
      "productCount": 450,
      "displayOrder": 1,
      "subcategories": [
        {
          "id": "cat_1_1",
          "name": "T-Shirt",
          "slug": "t-shirt",
          "productCount": 150
        }
      ]
    }
  ]
}
```

---

#### GET /categories/:categoryId

Kategori detaylarını ve ürünlerini getir

**Query Parameters:**

```
GET /categories/:categoryId?page=1&limit=20
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "category": {
      "id": "cat_1",
      "name": "Kıyafet",
      "description": "Tüm kıyafet ürünleri",
      "productCount": 450
    },
    "products": [
      {
        "id": "prod_123",
        "name": "...",
        "price": 500
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 450
    }
  }
}
```

---

### 🛒 Cart Endpoints

#### POST /cart/add

Sepete ürün ekle (Sepeti oluştur veya güncelle)

**Headers:** `Authorization: Bearer <token>` (İsteğe bağlı - Guest de mümkün)

**Request:**

```json
{
  "productId": "prod_123",
  "quantity": 2,
  "variant": {
    "color": "Siyah",
    "size": "M"
  }
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Sepete eklendi",
  "data": {
    "cart": {
      "items": [
        {
          "productId": "prod_123",
          "productName": "SPORTİVEA T-Shirt",
          "quantity": 2,
          "price": 759,
          "subtotal": 1518
        }
      ],
      "subtotal": 1518,
      "tax": 242.88,
      "total": 1760.88,
      "itemCount": 2
    }
  }
}
```

---

#### GET /cart

Sepeti getir

**Headers:** `Authorization: Bearer <token>` (Guest users için cookie/token)

**Response (200):**

```json
{
  "success": true,
  "data": {
    "cart": {
      "items": [
        {
          "productId": "prod_123",
          "product": {
            "id": "prod_123",
            "name": "SPORTİVEA T-Shirt",
            "image": "https://...",
            "price": 759
          },
          "quantity": 2,
          "selectedVariant": {
            "color": "Siyah",
            "size": "M"
          },
          "subtotal": 1518
        }
      ],
      "subtotal": 1518,
      "discountAmount": 0,
      "tax": 242.88,
      "shippingCost": 0,
      "total": 1760.88,
      "itemCount": 2
    }
  }
}
```

---

#### PUT /cart/items/:productId

Sepet ürünün miktarını güncelle

**Request:**

```json
{
  "quantity": 3
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Miktar güncellendi",
  "data": {
    "cart": { "itemCount": 3, "total": 2281.32 }
  }
}
```

---

#### DELETE /cart/items/:productId

Sepetten ürün sil

**Response (200):**

```json
{
  "success": true,
  "message": "Ürün sepetten kaldırıldı",
  "data": {
    "cart": { "itemCount": 1, "total": 759 }
  }
}
```

---

#### POST /cart/apply-coupon

Kupon kodu uygula

**Request:**

```json
{
  "couponCode": "SUMMER2024"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Kupon başarıyla uygulandı",
  "data": {
    "discountAmount": 200,
    "discountPercent": 10,
    "newTotal": 1560.88
  }
}
```

---

#### DELETE /cart

Sepeti temizle

**Response (200):**

```json
{
  "success": true,
  "message": "Sepet temizlendi"
}
```

---

### ❤️ Wishlist Endpoints

#### GET /wishlist

İstek listesini getir

**Headers:** `Authorization: Bearer <token>`

**Response (200):**

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "wish_1",
        "productId": "prod_123",
        "product": {
          "id": "prod_123",
          "name": "SPORTİVEA T-Shirt",
          "image": "https://...",
          "price": 759
        },
        "addedAt": "2024-04-15T10:30:00Z"
      }
    ],
    "itemCount": 5
  }
}
```

---

#### POST /wishlist/add

İstek listesine ürün ekle

**Headers:** `Authorization: Bearer <token>`

**Request:**

```json
{
  "productId": "prod_123"
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Favorilere eklendi",
  "data": {
    "id": "wish_1",
    "productId": "prod_123"
  }
}
```

---

#### DELETE /wishlist/:itemId

İstek listesinden ürün sil

**Headers:** `Authorization: Bearer <token>`

**Response (200):**

```json
{
  "success": true,
  "message": "Favorilerden kaldırıldı"
}
```

---

#### POST /wishlist/share

İstek listesini paylaş

**Headers:** `Authorization: Bearer <token>`

**Request:**

```json
{
  "email": "friend@example.com",
  "message": "Şu ürünleri beğendim"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "İstek listesi paylaşıldı"
}
```

---

### 📋 Order Endpoints

#### POST /orders

Sipariş oluştur

**Headers:** `Authorization: Bearer <token>`

**Request:**

```json
{
  "shippingAddressId": "addr_123",
  "shippingMethodId": "ship_1",
  "paymentMethod": {
    "type": "credit_card",
    "cardName": "John Doe",
    "cardNumber": "4111111111111111",
    "expiryDate": "12/25",
    "cvv": "123"
  },
  "notes": "Hızlı gönderilsin lütfen",
  "discountCode": "SUMMER2024"
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Sipariş başarıyla oluşturuldu",
  "data": {
    "order": {
      "id": "ord_abc123",
      "orderNumber": "ORD-202404-001234",
      "status": "pending",
      "total": 1560.88,
      "items": [
        {
          "productName": "SPORTİVEA T-Shirt",
          "quantity": 2,
          "subtotal": 1518
        }
      ],
      "shippingAddress": {
        "address": "Mevlana Cad. No:45",
        "city": "Istanbul"
      },
      "createdAt": "2024-04-20T10:30:00Z"
    }
  }
}
```

---

#### GET /orders

Siparişleri listele

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**

```
GET /orders?page=1&limit=10&status=all&sort=recent
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": "ord_abc123",
        "orderNumber": "ORD-202404-001234",
        "status": "delivered",
        "total": 1560.88,
        "itemCount": 2,
        "createdAt": "2024-04-20T10:30:00Z",
        "deliveredAt": "2024-04-25T14:15:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 23
    }
  }
}
```

---

#### GET /orders/:orderId

Sipariş detaylarını getir

**Headers:** `Authorization: Bearer <token>`

**Response (200):**

```json
{
  "success": true,
  "data": {
    "order": {
      "id": "ord_abc123",
      "orderNumber": "ORD-202404-001234",
      "status": "delivered",
      "items": [
        {
          "id": "item_1",
          "productId": "prod_123",
          "productName": "SPORTİVEA T-Shirt",
          "productImage": "https://...",
          "quantity": 2,
          "price": 759,
          "subtotal": 1518,
          "variant": {
            "color": "Siyah",
            "size": "M"
          }
        }
      ],
      "subtotal": 1518,
      "discountAmount": 200,
      "tax": 242.88,
      "shippingCost": 0,
      "total": 1560.88,
      "shippingAddress": {
        "fullName": "John Doe",
        "address": "Mevlana Cad. No:45",
        "city": "Istanbul",
        "district": "Besiktash",
        "postalCode": "34350",
        "country": "Turkey"
      },
      "shippingMethod": {
        "name": "Standart Kargo",
        "cost": 0,
        "estimatedDays": 3
      },
      "trackingNumber": "TR123456789",
      "paymentMethod": {
        "type": "credit_card",
        "cardLast4": "1111",
        "cardBrand": "Visa"
      },
      "paymentStatus": "completed",
      "timeline": {
        "createdAt": "2024-04-20T10:30:00Z",
        "paidAt": "2024-04-20T10:35:00Z",
        "shippedAt": "2024-04-21T09:00:00Z",
        "deliveredAt": "2024-04-25T14:15:00Z"
      }
    }
  }
}
```

---

#### POST /orders/:orderId/cancel

Siparişi iptal et

**Headers:** `Authorization: Bearer <token>`

**Request:**

```json
{
  "reason": "Yanlış ürün seçtim"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Sipariş başarıyla iptal edildi",
  "data": {
    "order": {
      "id": "ord_abc123",
      "status": "cancelled",
      "refundAmount": 1560.88
    }
  }
}
```

---

#### POST /orders/:orderId/return

Ürün iadesi başlat

**Headers:** `Authorization: Bearer <token>`

**Request:**

```json
{
  "items": [
    {
      "itemId": "item_1",
      "quantity": 1,
      "reason": "Beden uymuyor"
    }
  ],
  "notes": "Temiz ve etiketli"
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "İade talebi oluşturuldu",
  "data": {
    "returnId": "ret_123",
    "status": "pending",
    "refundAmount": 759
  }
}
```

---

### 📧 Contact & Newsletter Endpoints

#### GET /site-settings/{code}

Belirli bir UI instance'ının marka ve iletişim bilgilerini getir (auth gerekmez)

**Path param:** `code` — UI slug (ör. `bizdenal`)

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "01JXXXX",
    "code": "bizdenal",
    "name": "Bizden Al Bizden Sat",
    "siteName": "bizdenalbizdensat.com",
    "domain": "https://bizdenalbizdensat.com",
    "logoUrl": "/uploads/site/logo.png",
    "faviconUrl": "/uploads/site/favicon.ico",
    "address": "Teknoloji Caddesi No: 123, Dijital Şehir İstanbul, 34001",
    "emails": ["info@example.com", "destek@example.com"],
    "phones": ["+90 (555) 123-4567"],
    "workingHours": ["Pazartesi - Cuma: 09:00 - 18:00"],
    "socialLinks": {
      "facebook": "https://facebook.com/...",
      "twitter": "https://x.com/...",
      "instagram": "https://instagram.com/...",
      "youTube": "https://youtube.com/..."
    },
    "isActive": true,
    "isDefault": false
  }
}
```

#### GET /site-settings

Varsayılan (`isDefault=true`) aktif UI ayarlarını getir (auth gerekmez)

---

#### POST /contact

İletişim formu gönder

**Request:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+905551234567",
  "subject": "Ürün sorusu",
  "message": "Ürünün kalitesi hakkında soru..."
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Mesajınız başarıyla alındı. En kısa sürede size dönüş yapacağız.",
  "data": {
    "ticketId": "TKT-20240420-001"
  }
}
```

---

#### POST /newsletter/subscribe

Haber bültenine abone ol

**Request:**

```json
{
  "email": "user@example.com",
  "name": "John Doe"
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Aboneliğiniz başarıyla kaydedildi. Lütfen email adresinizi doğrulayın."
}
```

---

#### POST /newsletter/unsubscribe

Haber bülteninden abone olmaktan çık

**Request:**

```json
{
  "email": "user@example.com"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Aboneliğiniz kaldırıldı"
}
```

---

### 🚚 Shipping Endpoints

#### GET /shipping-methods

Kargo yöntemlerini getir

**Query Parameters:**

```
GET /shipping-methods?postalCode=34350&weight=1000
```

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "ship_1",
      "name": "Standart Kargo",
      "description": "3-5 iş günü içerisinde teslim",
      "cost": 0,
      "estimatedDays": 4,
      "provider": "Aras Kargo"
    },
    {
      "id": "ship_2",
      "name": "Express Kargo",
      "description": "Sonraki gün teslim",
      "cost": 49.99,
      "estimatedDays": 1,
      "provider": "MNG Kargo"
    }
  ]
}
```

---

#### POST /shipping/calculate-cost

Kargo maliyetini hesapla

**Request:**

```json
{
  "shippingMethodId": "ship_1",
  "items": [
    {
      "productId": "prod_123",
      "quantity": 2,
      "weight": 500
    }
  ],
  "postalCode": "34350"
}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "shippingCost": 0,
    "estimatedDelivery": "2024-04-25"
  }
}
```

---

### 💳 Payment Endpoints

#### POST /payments/validate

Ödeme bilgilerini doğrula

**Request:**

```json
{
  "cardNumber": "4111111111111111",
  "cardName": "John Doe",
  "expiryDate": "12/25",
  "cvv": "123"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Ödeme bilgileri doğru"
}
```

---

#### GET /payments/methods

Kayıtlı ödeme yöntemlerini getir

**Headers:** `Authorization: Bearer <token>`

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "pay_1",
      "type": "credit_card",
      "cardName": "John Doe",
      "cardLast4": "1111",
      "cardBrand": "Visa",
      "isDefault": true
    }
  ]
}
```

---

#### POST /payments/process

Ödemeyi işle

**Headers:** `Authorization: Bearer <token>`

**Request:**

```json
{
  "orderId": "ord_abc123",
  "paymentMethod": {
    "type": "credit_card",
    "cardNumber": "4111111111111111",
    "cardName": "John Doe",
    "expiryDate": "12/25",
    "cvv": "123"
  },
  "amount": 1560.88
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Ödeme başarıyla işlendi",
  "data": {
    "transactionId": "TXN-20240420-12345",
    "status": "completed",
    "amount": 1560.88
  }
}
```

---

## Ekran Bazlı API Çağrıları

Bu bölümde her ekranın ihtiyaç duyduğu API çağrılarını detaylı olarak bulacaksınız.

---

### 1. Ana Sayfa (Index)

**API Çağrıları:**

| Sıra | Endpoint                                     | Method | Açıklama                      |
| ---- | -------------------------------------------- | ------ | ----------------------------- |
| 1    | `/categories`                                | GET    | Kategorileri listele          |
| 2    | `/products?limit=8&sort=featured`            | GET    | Öne çıkan ürünleri getir      |
| 3    | `/products?badge=Sale&sort=featured&limit=4` | GET    | İndirimli ürünleri getir      |
| 4    | `/products?isFeatured=true&limit=6`          | GET    | Tam sayfa kampanyası ürünleri |

**Component: ProductsGrid.tsx**

```typescript
useEffect(() => {
  // API çağrısı
  fetch(`${API_BASE_URL}/products?limit=8&sort=featured`)
    .then((res) => res.json())
    .then((data) => setProducts(data.data.products));
}, []);
```

**Component: Categories.tsx**

```typescript
useEffect(() => {
  fetch(`${API_BASE_URL}/categories`)
    .then((res) => res.json())
    .then((data) => setCategories(data.data));
}, []);
```

**Component: NewsletterSection.tsx**

```typescript
const handleSubscribe = async (email: string) => {
  await fetch(`${API_BASE_URL}/newsletter/subscribe`, {
    method: "POST",
    body: JSON.stringify({ email }),
  });
};
```

---

### 2. Ürün Listesi (Shop)

**API Çağrıları:**

| Sıra | Endpoint                               | Method | Açıklama                                                   |
| ---- | -------------------------------------- | ------ | ---------------------------------------------------------- |
| 1    | `/products?page=1&limit=20`            | GET    | Ürünleri pagination ile getir                              |
| 2    | `/products?search=tişört`              | GET    | Arama yapı                                                 |
| 3    | `/products?category=Kıyafet`           | GET    | Kategoriye göre filtrele                                   |
| 4    | `/products?minPrice=500&maxPrice=1000` | GET    | Fiyat aralığına göre filtrele                              |
| 5    | `/products?rating=4`                   | GET    | Derecelendirmeye göre filtrele                             |
| 6    | `/products?sort=featured`              | GET    | Sıralama (featured, price_asc, price_desc, newest, rating) |

**Kombinlenmiş sorgu örneği:**

```
GET /products?page=1&limit=20&search=tişört&category=Kıyafet&minPrice=500&maxPrice=1000&rating=4&color=Siyah&sort=featured
```

**Component: Shop.tsx**

```typescript
const applyFilters = async () => {
  const queryParams = new URLSearchParams({
    page: currentPage,
    limit: 20,
    search: searchQuery,
    category: selectedCategories.join(","),
    minPrice: minPrice,
    maxPrice: maxPrice,
    rating: selectedRatings.join(","),
    color: selectedColors.join(","),
    size: selectedSizes.join(","),
    sort: sortBy,
  });

  const response = await fetch(`${API_BASE_URL}/products?${queryParams}`);
  const data = await response.json();
  setProducts(data.data.products);
};
```

---

### 3. Ürün Detayı (ProductDetail)

**API Çağrıları:**

| Sıra | Endpoint                             | Method | Açıklama                        |
| ---- | ------------------------------------ | ------ | ------------------------------- |
| 1    | `/products/:productId`               | GET    | Ürün detaylarını getir          |
| 2    | `/products/:productId/reviews`       | GET    | Ürün yorumlarını getir          |
| 3    | `/products/:productId/reviews`       | POST   | Yorum ekle (authenticated)      |
| 4    | `/wishlist/add`                      | POST   | Favorilere ekle (authenticated) |
| 5    | `/cart/add`                          | POST   | Sepete ekle (authenticated)     |
| 6    | `/products?category=Kıyafet&limit=4` | GET    | İlgili ürünleri getir           |

**Component: ProductDetail.tsx**

```typescript
useEffect(() => {
  // 1. Ürün detaylarını getir
  fetch(`${API_BASE_URL}/products/${productId}`)
    .then((res) => res.json())
    .then((data) => setProduct(data.data));

  // 2. Yorumları getir
  fetch(`${API_BASE_URL}/products/${productId}/reviews?page=1&limit=10`)
    .then((res) => res.json())
    .then((data) => setReviews(data.data.reviews));
}, [productId]);

// Sepete ekle
const handleAddToCart = async (product, quantity, variant) => {
  const token = getAuthToken();
  await fetch(`${API_BASE_URL}/cart/add`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ productId: product.id, quantity, variant }),
  });
};

// Favorilere ekle
const handleAddToWishlist = async (product) => {
  const token = getAuthToken();
  await fetch(`${API_BASE_URL}/wishlist/add`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ productId: product.id }),
  });
};

// Yorum ekle
const handleSubmitReview = async (rating, title, comment) => {
  const token = getAuthToken();
  await fetch(`${API_BASE_URL}/products/${productId}/reviews`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ rating, title, comment }),
  });
};
```

---

### 4. Kategori Sayfası (CategoryPage)

**API Çağrıları:**

| Sıra | Endpoint                                     | Method | Açıklama                   |
| ---- | -------------------------------------------- | ------ | -------------------------- |
| 1    | `/categories/:categoryId`                    | GET    | Kategori detaylarını getir |
| 2    | `/products?category=Kıyafet&page=1&limit=20` | GET    | Kategori ürünlerini getir  |

**Component: CategoryPage.tsx**

```typescript
useEffect(() => {
  const categoryName = params.categoryName;

  // 1. Kategori bilgilerini getir
  fetch(`${API_BASE_URL}/categories?search=${categoryName}`)
    .then((res) => res.json())
    .then((data) => setCategory(data.data[0]));

  // 2. Kategori ürünlerini getir
  fetch(
    `${API_BASE_URL}/products?category=${categoryName}&page=${page}&limit=20`,
  )
    .then((res) => res.json())
    .then((data) => setProducts(data.data.products));
}, [categoryName, page]);
```

---

### 5. Sepet Sayfası (CartSidebar)

**API Çağrıları:**

| Sıra | Endpoint                 | Method | Açıklama        |
| ---- | ------------------------ | ------ | --------------- |
| 1    | `/cart`                  | GET    | Sepeti getir    |
| 2    | `/cart/items/:productId` | PUT    | Miktar güncelle |
| 3    | `/cart/items/:productId` | DELETE | Ürün sil        |
| 4    | `/cart/apply-coupon`     | POST   | Kupon uygula    |
| 5    | `/cart`                  | DELETE | Sepeti temizle  |

**Component: CartSidebar.tsx**

```typescript
useEffect(() => {
  // Sepeti getir
  const token = getAuthToken();
  fetch(`${API_BASE_URL}/cart`, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => res.json())
    .then((data) => setCart(data.data.cart));
}, []);

// Miktar güncelle
const updateQuantity = async (productId, newQuantity) => {
  const token = getAuthToken();
  await fetch(`${API_BASE_URL}/cart/items/${productId}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ quantity: newQuantity }),
  });
};

// Ürün sil
const removeItem = async (productId) => {
  const token = getAuthToken();
  await fetch(`${API_BASE_URL}/cart/items/${productId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Kupon uygula
const applyCoupon = async (couponCode) => {
  const token = getAuthToken();
  await fetch(`${API_BASE_URL}/cart/apply-coupon`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ couponCode }),
  });
};
```

---

### 6. Ödeme Sayfası (Checkout)

**API Çağrıları:**

| Sıra | Endpoint                             | Method | Açıklama                  |
| ---- | ------------------------------------ | ------ | ------------------------- |
| 1    | `/users/profile`                     | GET    | Kullanıcı profilini getir |
| 2    | `/users/addresses`                   | GET    | Kayıtlı adresleri getir   |
| 3    | `/shipping-methods?postalCode=34350` | GET    | Kargo yöntemlerini getir  |
| 4    | `/payments/validate`                 | POST   | Ödeme bilgilerini doğrula |
| 5    | `/orders`                            | POST   | Sipariş oluştur           |
| 6    | `/payments/process`                  | POST   | Ödemeyi işle              |

**Component: Checkout.tsx**

```typescript
useEffect(() => {
  const token = getAuthToken();

  // 1. Kullanıcı profilini getir
  fetch(`${API_BASE_URL}/users/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => res.json())
    .then((data) => setUserData(data.data));
}, []);

// Kargo yöntemlerini getir
const fetchShippingMethods = async (postalCode) => {
  const response = await fetch(
    `${API_BASE_URL}/shipping-methods?postalCode=${postalCode}`,
  );
  const data = await response.json();
  setShippingMethods(data.data);
};

// Ödemeyi doğrula
const validatePayment = async (paymentData) => {
  const response = await fetch(`${API_BASE_URL}/payments/validate`, {
    method: "POST",
    body: JSON.stringify(paymentData),
  });
  return response.json();
};

// Sipariş oluştur ve ödeme yap
const handleCheckout = async () => {
  const token = getAuthToken();

  // 1. Sipariş oluştur
  const orderResponse = await fetch(`${API_BASE_URL}/orders`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      shippingAddressId: selectedAddressId,
      shippingMethodId: selectedShippingMethodId,
      paymentMethod: paymentData,
      discountCode: appliedCoupon,
    }),
  });

  const order = await orderResponse.json();
  const orderId = order.data.order.id;

  // 2. Ödemeyi işle
  const paymentResponse = await fetch(`${API_BASE_URL}/payments/process`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      orderId,
      paymentMethod: paymentData,
      amount: order.data.order.total,
    }),
  });

  const paymentResult = await paymentResponse.json();

  if (paymentResult.success) {
    navigate(`/order/${orderId}`);
  }
};
```

---

### 7. Giriş Sayfası (Login)

**API Çağrıları:**

| Sıra | Endpoint      | Method | Açıklama         |
| ---- | ------------- | ------ | ---------------- |
| 1    | `/auth/login` | POST   | Kullanıcı girişi |

**Component: Login.tsx**

```typescript
const handleSubmit = async (e) => {
  e.preventDefault();

  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    body: JSON.stringify({
      email: formData.email,
      password: formData.password,
    }),
  });

  const data = await response.json();

  if (data.success) {
    // Token'ı kaydet
    localStorage.setItem("access_token", data.data.tokens.access_token);
    localStorage.setItem("refresh_token", data.data.tokens.refresh_token);
    localStorage.setItem("user", JSON.stringify(data.data.user));

    navigate("/account");
  }
};
```

---

### 8. Kayıt Sayfası (Register)

**API Çağrıları:**

| Sıra | Endpoint         | Method | Açıklama             |
| ---- | ---------------- | ------ | -------------------- |
| 1    | `/auth/register` | POST   | Yeni kullanıcı kaydı |

**Component: Register.tsx**

```typescript
const handleSubmit = async (e) => {
  e.preventDefault();

  if (formData.password !== formData.confirmPassword) {
    toast({ title: "Şifreler eşleşmiyor" });
    return;
  }

  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    body: JSON.stringify({
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
    }),
  });

  const data = await response.json();

  if (data.success) {
    localStorage.setItem("access_token", data.data.tokens.access_token);
    localStorage.setItem("refresh_token", data.data.tokens.refresh_token);
    localStorage.setItem("user", JSON.stringify(data.data.user));

    navigate("/account");
  } else {
    toast({
      title: "Kayıt başarısız",
      description: data.error.message,
    });
  }
};
```

---

### 9. Hesap Sayfası (Account)

**API Çağrıları:**

| Sıra | Endpoint               | Method | Açıklama                  |
| ---- | ---------------------- | ------ | ------------------------- |
| 1    | `/users/profile`       | GET    | Kullanıcı profilini getir |
| 2    | `/users/addresses`     | GET    | Kayıtlı adresleri getir   |
| 3    | `/orders`              | GET    | Siparişleri getir         |
| 4    | `/wishlist`            | GET    | İstek listesini getir     |
| 5    | `/users/profile`       | PUT    | Profili güncelle          |
| 6    | `/users/addresses`     | POST   | Yeni adres ekle           |
| 7    | `/users/addresses/:id` | PUT    | Adresi güncelle           |
| 8    | `/users/addresses/:id` | DELETE | Adresi sil                |

**Component: Account.tsx**

```typescript
useEffect(() => {
  const token = getAuthToken();

  // 1. Profili getir
  fetch(`${API_BASE_URL}/users/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => res.json())
    .then((data) => setUserData(data.data));

  // 2. Siparişleri getir
  fetch(`${API_BASE_URL}/orders?page=1&limit=10`, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => res.json())
    .then((data) => setOrders(data.data.orders));

  // 3. İstek listesini getir
  fetch(`${API_BASE_URL}/wishlist`, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => res.json())
    .then((data) => setWishlistCount(data.data.itemCount));

  // 4. Adresleri getir
  fetch(`${API_BASE_URL}/users/addresses`, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => res.json())
    .then((data) => setAddresses(data.data));
}, []);

// Profili güncelle
const updateProfile = async (updatedData) => {
  const token = getAuthToken();
  await fetch(`${API_BASE_URL}/users/profile`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(updatedData),
  });
};

// Adres ekle
const addAddress = async (addressData) => {
  const token = getAuthToken();
  await fetch(`${API_BASE_URL}/users/addresses`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(addressData),
  });
};
```

---

### 10. İletişim Sayfası (Contact)

**API Çağrıları:**

| Sıra | Endpoint                    | Method | Açıklama                           |
| ---- | --------------------------- | ------ | ---------------------------------- |
| 1    | `/site-settings/{uiCode}`   | GET    | Bu UI'nin iletişim ve marka bilgisi |
| 2    | `/contact`                  | POST   | İletişim formu gönder              |

**Component: Contact.tsx**

```typescript
const UI_CODE = import.meta.env.VITE_UI_CODE;

useEffect(() => {
  fetch(`${API_BASE_URL}/site-settings/${UI_CODE}`)
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        setSiteSettings(data.data);
        document.title = data.data.siteName;
        if (data.data.faviconUrl) {
          const link = document.querySelector("link[rel='icon']") as HTMLLinkElement;
          if (link) link.href = data.data.faviconUrl;
        }
      }
    });
}, []);

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);

  const response = await fetch(`${API_BASE_URL}/contact`, {
    method: "POST",
    body: JSON.stringify({
      name: formState.name,
      email: formState.email,
      subject: formState.subject,
      message: formState.message,
    }),
  });

  const data = await response.json();

  if (data.success) {
    toast({
      title: "Mesaj gönderildi",
      description: "En kısa sürede size dönüş yapacağız.",
    });

    setFormState({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  }

  setIsSubmitting(false);
};
```

---

### 11. İstek Listesi (WishlistSidebar)

**API Çağrıları:**

| Sıra | Endpoint            | Method | Açıklama               |
| ---- | ------------------- | ------ | ---------------------- |
| 1    | `/wishlist`         | GET    | İstek listesini getir  |
| 2    | `/wishlist/:itemId` | DELETE | İstek listesinden sil  |
| 3    | `/wishlist/share`   | POST   | İstek listesini paylaş |

**Component: WishlistSidebar.tsx**

```typescript
useEffect(() => {
  const token = getAuthToken();

  fetch(`${API_BASE_URL}/wishlist`, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => res.json())
    .then((data) => setWishlistItems(data.data.items));
}, []);

const removeFromWishlist = async (itemId) => {
  const token = getAuthToken();
  await fetch(`${API_BASE_URL}/wishlist/${itemId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
};

const shareWishlist = async (email, message) => {
  const token = getAuthToken();
  await fetch(`${API_BASE_URL}/wishlist/share`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ email, message }),
  });
};
```

---

### 12. Hakkında Sayfası (About)

**API Çağrıları:**

Bu sayfa statik içerik içerdiği için API çağrısına ihtiyaç yoktur. Ancak isteğe bağlı olarak:

| Sıra | Endpoint           | Method | Açıklama                                        |
| ---- | ------------------ | ------ | ----------------------------------------------- |
| 1    | `/cms/pages/about` | GET    | Hakkında sayfası içeriğini getir (isteğe bağlı) |
| 2    | `/teams`           | GET    | Takım üyelerini getir (isteğe bağlı)            |

---

## Database Schema Önerileri

### User Tablosu

```sql
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  fullName VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  password_hash VARCHAR(255) NOT NULL,
  avatar VARCHAR(500),
  role ENUM('customer', 'admin', 'vendor') DEFAULT 'customer',
  isActive BOOLEAN DEFAULT true,
  isEmailVerified BOOLEAN DEFAULT false,
  verificationToken VARCHAR(255),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deletedAt TIMESTAMP NULL
);
```

### Products Tablosu

```sql
CREATE TABLE products (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(500) NOT NULL,
  description TEXT,
  longDescription TEXT,
  price DECIMAL(10, 2) NOT NULL,
  originalPrice DECIMAL(10, 2),
  category VARCHAR(255) NOT NULL,
  subcategory VARCHAR(255),
  image VARCHAR(500),
  stock INT DEFAULT 0,
  sku VARCHAR(100) UNIQUE,
  barcode VARCHAR(100),
  rating DECIMAL(3, 2) DEFAULT 0,
  reviewCount INT DEFAULT 0,
  badge VARCHAR(50),
  isActive BOOLEAN DEFAULT true,
  isFeatured BOOLEAN DEFAULT false,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deletedAt TIMESTAMP NULL,
  INDEX idx_category (category),
  INDEX idx_price (price),
  INDEX idx_rating (rating)
);
```

### Orders Tablosu

```sql
CREATE TABLE orders (
  id VARCHAR(36) PRIMARY KEY,
  orderNumber VARCHAR(50) UNIQUE NOT NULL,
  userId VARCHAR(36) NOT NULL,
  status ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned') DEFAULT 'pending',
  subtotal DECIMAL(10, 2) NOT NULL,
  discountAmount DECIMAL(10, 2) DEFAULT 0,
  discountCode VARCHAR(50),
  shippingCost DECIMAL(10, 2) DEFAULT 0,
  tax DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,
  shippingAddressId VARCHAR(36),
  shippingMethodId VARCHAR(36),
  trackingNumber VARCHAR(100),
  paymentMethod VARCHAR(50),
  paymentStatus ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
  transactionId VARCHAR(100),
  notes TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  paidAt TIMESTAMP NULL,
  shippedAt TIMESTAMP NULL,
  deliveredAt TIMESTAMP NULL,
  cancelledAt TIMESTAMP NULL,
  FOREIGN KEY (userId) REFERENCES users(id),
  INDEX idx_userId (userId),
  INDEX idx_status (status),
  INDEX idx_createdAt (createdAt)
);
```

### OrderItems Tablosu

```sql
CREATE TABLE orderItems (
  id VARCHAR(36) PRIMARY KEY,
  orderId VARCHAR(36) NOT NULL,
  productId VARCHAR(36) NOT NULL,
  productName VARCHAR(500) NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  variantColor VARCHAR(50),
  variantSize VARCHAR(50),
  variantFit VARCHAR(50),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (orderId) REFERENCES orders(id),
  FOREIGN KEY (productId) REFERENCES products(id)
);
```

### Reviews Tablosu

```sql
CREATE TABLE reviews (
  id VARCHAR(36) PRIMARY KEY,
  productId VARCHAR(36) NOT NULL,
  userId VARCHAR(36) NOT NULL,
  userName VARCHAR(255),
  rating INT CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  comment TEXT,
  helpful INT DEFAULT 0,
  isVerified BOOLEAN DEFAULT false,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (productId) REFERENCES products(id),
  FOREIGN KEY (userId) REFERENCES users(id),
  INDEX idx_productId (productId),
  INDEX idx_rating (rating)
);
```

---

## Implementation Tavsiyeleri

### 1. Authentication Best Practices

- JWT token'larını localStorage yerine HttpOnly cookie'lerde sakla
- Refresh token için ayrı endpoint kullan
- Token expire sürelerini kısalt (access: 1 saat, refresh: 7 gün)
- CSRF protection uygula

### 2. Error Handling

```typescript
interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}
```

### 3. Pagination

- Default limit 20 olarak ayarla
- Maksimum limit 100 olarak sınırla
- Total count bilgisi döndür
- Cursor-based pagination düşün (large datasets için)

### 4. Rate Limiting

- Anonymous users: 100 req/hour
- Authenticated users: 1000 req/hour
- Admin: 10000 req/hour

### 5. Caching Strategy

- Ürün listesi: 5 dakika
- Ürün detayı: 10 dakika
- Kategori: 1 gün
- Kullanıcı profili: 1 saat

---

## Frontend Integration Örneği

```typescript
// api/client.ts
import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "https://api.purplify.com/v1";

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Request interceptor - token ekle
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor - token yenileme
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");
        const response = await axios.post(
          `${API_BASE_URL}/auth/refresh-token`,
          { refresh_token: refreshToken },
        );

        const { access_token } = response.data.data;
        localStorage.setItem("access_token", access_token);

        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return client(originalRequest);
      } catch (err) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

export default client;
```

---

## Test Senaryoları

### Happy Path Senaryoları

1. Kullanıcı kaydı → Giriş → Ürün tarama → Sepete ekle → Ödeme → Sipariş onayı
2. Kategorilere göre ürün filtrele
3. Ürün ara → Ürün detayı → Yorum yaz
4. Favorilere ekle → Listeleme → Paylaş

### Error Senaryoları

1. Geçersiz giriş bilgileri
2. Stok dışı ürün sepete ekleme
3. Geçersiz ödeme bilgileri
4. Kargo teslimat sorunu
5. Network timeout

---

**Son Güncelleme:** 20 Nisan 2024
**Versiyon:** 1.0.0
