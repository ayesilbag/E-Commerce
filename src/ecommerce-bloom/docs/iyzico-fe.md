# Iyzico Checkout Form — Storefront

Akış: `GET /api/payments/options` → `POST /api/orders` (`paymentMethod.type: iyzico`) → `POST /api/payments/iyzico/initialize` → redirect `paymentPageUrl` → dönüş `/payment/result?orderId=...` → `GET /api/orders/{id}` ile doğrulama.

## Ortam

- `VITE_API_BASE_URL` — production backend (ör. `https://test-bayi.digitalep.net`)
- Dev: boş bırakılırsa Vite `/api` proxy kullanır

## Route'lar

| Path | Açıklama |
|------|----------|
| `/order` | Adres |
| `/order/payment` | Ödeme |
| `/payment/result` | Iyzico dönüş + durum |
| `/iyzico/return` | Eski URL → `/payment/result` (query korunur) |
| `/checkout` | `/order` yönlendirmesi |

Backend redirect URL: `{storefront}/payment/result?orderId={orderId}`
