# iyzico Ödeme — Storefront Client Dokümantasyonu

Mağaza uygulamasının (web/mobil) iyzico **Checkout Form** ile ödeme almak için kullanacağı API ve akış.

**Base URL:** `https://test-bayi.digitalep.net`

**Auth:** Korumalı endpoint’lerde `Authorization: Bearer {access_token}`

**Content-Type:** `application/json`

---

## Akış özeti

```
1. GET  /api/payments/options          → Ödeme yöntemleri listesi
2. POST /api/orders                    → Sipariş oluştur (type: iyzico)
3. POST /api/payments/iyzico/initialize → Ödeme sayfası URL al
4. Redirect → paymentPageUrl           → Kullanıcı iyzico’da öder
5. Sunucu callback (siz çağırmazsınız) → Sipariş güncellenir, redirect
6. GET  /api/orders/{orderId}          → Sonuç ekranında durum kontrolü
```

Kart bilgisi **istemciye gelmez**. Ödeme iyzico hosted sayfasında yapılır.

---

## 1. Ödeme yöntemlerini listele

### `GET /api/payments/options`

Auth gerekmez.

**Response 200**

```json
{
  "success": true,
  "data": {
    "iyzico": [
      {
        "code": "main-store",
        "name": "Ana Mağaza",
        "isSandbox": true,
        "isDefault": true
      }
    ],
    "bankTransfer": true
  }
}
```

### `GET /api/payments/iyzico/clients`

Auth gerekmez. Para birimi dahil detay liste.

**Response 200**

```json
{
  "success": true,
  "data": [
    {
      "code": "main-store",
      "name": "Ana Mağaza",
      "isSandbox": true,
      "currency": "TRY"
    }
  ]
}
```

| Alan | Açıklama |
|------|----------|
| `code` | Initialize isteğinde `paymentClientCode` olarak gönderilir (opsiyonel) |
| `currency` | Bu mağaza için ödeme para birimi |

Birden fazla kayıt varsa kullanıcıya seçim gösterin; tek kayıt varsa `paymentClientCode` göndermeyebilirsiniz.

---

## 2. Sipariş oluştur

### `POST /api/orders`

**Auth:** Gerekli

**Request**

```json
{
  "shippingAddressId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "shippingMethod": {
    "id": "ship_standard",
    "name": "Standart Kargo",
    "cost": 29.99,
    "estimatedDays": 4
  },
  "paymentMethod": {
    "type": "iyzico"
  },
  "notes": null
}
```

**`paymentMethod.type` kabul edilen değerler**

- `iyzico` (önerilen)
- `credit_card_iyzico`
- `Iyzico`

**Response 201**

```json
{
  "success": true,
  "message": "Sipariş başarıyla oluşturuldu",
  "data": {
    "order": {
      "id": "order-id",
      "orderNumber": "ORD-20260529-1234",
      "status": "Pending",
      "paymentStatus": "Pending",
      "subtotal": 500,
      "shippingCost": 29.99,
      "tax": 90,
      "total": 619.99,
      "created": "2026-05-29T10:00:00Z"
    },
    "paymentInstructions": null,
    "iyzicoPayment": {
      "type": "iyzico",
      "orderId": "order-id",
      "message": "Sipariş oluşturuldu. Ödeme için POST /api/payments/iyzico/initialize çağrısı yapın."
    }
  }
}
```

Sonraki adım için `data.order.id` saklanmalıdır.

> Sipariş oluşturulunca sepet temizlenir.

---

## 3. Ödeme formunu başlat

### `POST /api/payments/iyzico/initialize`

**Auth:** Gerekli

**Request**

```json
{
  "orderId": "order-id",
  "paymentClientCode": "main-store"
}
```

| Alan | Zorunlu | Açıklama |
|------|---------|----------|
| `orderId` | Evet | Sipariş oluşturma yanıtındaki `order.id` |
| `paymentClientCode` | Hayır | Belirtilmezse varsayılan/tenant eşleşen istemci seçilir |

**Response 200**

```json
{
  "success": true,
  "data": {
    "token": "a5b67652-c24a-4347-b61e-6c957bf30f1b",
    "paymentPageUrl": "https://sandbox-cpp.iyzipay.com?token=...",
    "checkoutFormContent": "<script type=\"text/javascript\">...</script>",
    "paymentClientCode": "main-store",
    "conversationId": "order-id"
  }
}
```

| Alan | Kullanım |
|------|----------|
| `paymentPageUrl` | Kullanıcıyı buraya yönlendirin (**redirect**, önerilen) |
| `checkoutFormContent` | İsteğe bağlı: sayfaya gömülü form (iframe/popup) |
| `token` | Sunucu tarafında saklanır; client’ın tekrar göndermesi gerekmez |

**Client aksiyonu**

```javascript
window.location.href = response.data.paymentPageUrl;
```

---

## 4. Ödeme sonrası dönüş

Ödeme bitince iyzico, backend’e `token` ile callback atar; backend siparişi günceller ve kullanıcıyı yapılandırılmış adrese yönlendirir.

Storefront’un yapması gerekenler:

1. Başarı / hata landing route’larını tanımlayın (ör. `/payment/result`).
2. Query parametrelerinden `orderId` alın (redirect URL’de `{orderId}` kullanılıyorsa).
3. Sipariş durumunu API’den doğrulayın — callback’e güvenmeyin, her zaman API ile teyit edin.

### `GET /api/orders/{orderId}`

**Auth:** Gerekli

**Response 200 (özet)**

```json
{
  "success": true,
  "data": {
    "order": {
      "id": "order-id",
      "orderNumber": "ORD-20260529-1234",
      "status": "Confirmed",
      "paymentStatus": "Completed",
      "total": 619.99
    }
  }
}
```

| `paymentStatus` | Anlam | UI |
|-----------------|-------|-----|
| `Pending` | Ödeme bekleniyor | Tekrar ödeme / iptal |
| `Completed` | Ödeme alındı | Teşekkür sayfası |
| `Failed` | Ödeme başarısız | Hata + tekrar dene |
| `Refunded` | İade | Bilgi mesajı |

Bekleyen sipariş iptali:

### `POST /api/orders/{orderId}/cancel`

**Auth:** Gerekli

```json
{
  "reason": "Kullanıcı iptal etti"
}
```

Sadece `status: Pending` siparişler iptal edilebilir.

---

## Tam örnek (fetch)

```typescript
const API = 'https://test-bayi.digitalep.net';

async function payWithIyzico(
  accessToken: string,
  shippingAddressId: string,
  shippingMethod: { name: string; cost: number; estimatedDays?: number },
  paymentClientCode?: string
) {
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  };

  const orderRes = await fetch(`${API}/api/orders`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      shippingAddressId,
      shippingMethod,
      paymentMethod: { type: 'iyzico' },
    }),
  });
  const orderBody = await orderRes.json();
  if (!orderBody.success) throw new Error(orderBody.message);

  const orderId = orderBody.data.order.id;

  const initRes = await fetch(`${API}/api/payments/iyzico/initialize`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ orderId, paymentClientCode }),
  });
  const initBody = await initRes.json();
  if (!initBody.success) throw new Error(initBody.message);

  window.location.href = initBody.data.paymentPageUrl;
}
```

**Sonuç sayfası**

```typescript
async function showPaymentResult(accessToken: string, orderId: string) {
  const res = await fetch(`${API}/api/orders/${orderId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const body = await res.json();
  if (!body.success) throw new Error(body.message);

  const { paymentStatus, orderNumber, total } = body.data.order;
  // paymentStatus === 'Completed' → başarı UI
}
```

---

## TypeScript tipleri

```typescript
interface PaymentOptionsData {
  iyzico: Array<{
    code: string;
    name: string;
    isSandbox: boolean;
    isDefault?: boolean;
  }>;
  bankTransfer: boolean;
}

interface IyzicoClient {
  code: string;
  name: string;
  isSandbox: boolean;
  currency: string;
}

interface CreateOrderRequest {
  shippingAddressId: string;
  shippingMethod: {
    id?: string;
    name: string;
    cost: number;
    estimatedDays?: number;
  };
  paymentMethod: { type: 'iyzico' };
  notes?: string | null;
}

interface IyzicoInitializeRequest {
  orderId: string;
  paymentClientCode?: string;
}

interface IyzicoInitializeData {
  token: string;
  paymentPageUrl: string;
  checkoutFormContent?: string;
  paymentClientCode: string;
  conversationId: string;
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}
```

---

## Hata yanıtları

Tüm hatalarda genelde:

```json
{
  "success": false,
  "message": "Hata açıklaması"
}
```

| HTTP | `message` (örnek) | Ne yapmalı |
|------|-------------------|------------|
| 401 | — | Login |
| 400 | Aktif iyzico ödeme yapılandırması bulunamadı | Ödeme geçici kapalı mesajı |
| 404 | Sipariş bulunamadı | Sepete dön |
| 400 | Sipariş zaten ödendi | Sipariş detayı |
| 400 | İptal edilmiş sipariş için ödeme başlatılamaz | Yeni sipariş |
| 400 | iyzico ödeme formu başlatılamadı | Tekrar dene |

---

## Kullanılmayan endpoint’ler

iyzico akışında **çağırmayın**:

| Endpoint | Neden |
|----------|--------|
| `POST /api/payments/validate` | Mock kart validasyonu |
| `POST /api/payments/process` | Mock ödeme; iyzico ile uyumsuz |

---

## Sandbox test

- `GET /api/payments/iyzico/clients` → `isSandbox: true` ise test ortamı.
- Ödeme `paymentPageUrl` sandbox domain içerir (`sandbox-cpp.iyzipay.com`).
- Test kartları: [iyzico CF örnek entegrasyon](https://docs.iyzico.com/odeme-metotlari/odeme-formu/cf-entegrasyonu/cf-ornek-entegrasyon)

---

## Endpoint özeti

| Method | Path | Auth |
|--------|------|------|
| GET | `/api/payments/options` | Hayır |
| GET | `/api/payments/iyzico/clients` | Hayır |
| POST | `/api/orders` | Evet |
| POST | `/api/payments/iyzico/initialize` | Evet |
| GET | `/api/orders/{orderId}` | Evet |
| POST | `/api/orders/{orderId}/cancel` | Evet |
