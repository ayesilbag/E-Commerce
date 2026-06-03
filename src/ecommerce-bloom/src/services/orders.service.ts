import apiClient, { handleApiError } from '@/lib/api-client';
import type { IyzicoPaymentHint } from '@/types/iyzico';

export type OrderStatus = 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
export type PaymentStatus = 'Pending' | 'Completed' | 'Failed' | 'Refunded';

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  subtotal: number;
  discountAmount: number;
  shippingCost: number;
  tax: number;
  total: number;
  created: string;
  createdAt?: string;
  updatedAt?: string;
  items: OrderItem[];
  shippingAddress?: unknown;
  shippingMethod?: unknown;
  paymentMethod?: { type?: string };
}

export type OrderPaymentMethodType =
  | 'iyzico'
  | 'credit_card_iyzico'
  | 'Iyzico'
  | 'bank_transfer'
  | 'BankTransfer';

export interface CreateOrderRequest {
  shippingAddressId: string;
  shippingMethod: {
    id?: string;
    name: string;
    description?: string;
    cost: number;
    estimatedDays: number;
    provider?: string;
  };
  paymentMethod: {
    type: OrderPaymentMethodType;
    cardName?: string;
    cardLast4?: string;
    cardBrand?: string;
  };
  notes?: string | null;
}

export interface CreateOrderResponse {
  success: boolean;
  message: string;
  data: {
    order: Order;
    paymentInstructions?: {
      type: string;
      orderNumber: string;
      message: string;
      accounts: unknown[];
    } | null;
    iyzicoPayment?: IyzicoPaymentHint | null;
  };
}

const normalizeStatus = <T extends string>(value: unknown, fallback: T): T => {
  if (typeof value !== 'string' || !value) return fallback;
  return (value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()) as T;
};

const normalizeOrderItem = (item: Record<string, unknown>): OrderItem => ({
  id: String(item.id ?? item.productId ?? ''),
  productId: String(item.productId ?? ''),
  productName: String(item.productName ?? ''),
  productImage: String(item.productImage ?? ''),
  quantity: Number(item.quantity ?? 0),
  price: Number(item.price ?? 0),
  subtotal: Number(item.subtotal ?? 0),
});

export const normalizeOrder = (raw: Record<string, unknown>): Order => {
  const items = Array.isArray(raw.items) ? raw.items.map((item) => normalizeOrderItem(item as Record<string, unknown>)) : [];
  const created = String(raw.created ?? raw.createdAt ?? '');

  return {
    id: String(raw.id ?? ''),
    orderNumber: String(raw.orderNumber ?? ''),
    status: normalizeStatus<OrderStatus>(raw.status, 'Pending'),
    paymentStatus: normalizeStatus<PaymentStatus>(raw.paymentStatus, 'Pending'),
    subtotal: Number(raw.subtotal ?? 0),
    discountAmount: Number(raw.discountAmount ?? 0),
    shippingCost: Number(raw.shippingCost ?? 0),
    tax: Number(raw.tax ?? 0),
    total: Number(raw.total ?? 0),
    created,
    createdAt: raw.createdAt as string | undefined,
    updatedAt: raw.updatedAt as string | undefined,
    items,
    shippingAddress: raw.shippingAddress,
    shippingMethod: raw.shippingMethod,
    paymentMethod: raw.paymentMethod as Order['paymentMethod'],
  };
};

export const getOrders = async (params?: {
  page?: number;
  limit?: number;
  status?: string;
}): Promise<{
  items: Order[];
  page: number;
  limit: number;
  total: number;
  pages: number;
}> => {
  try {
    const response = await apiClient.get('/api/orders', { params });
    const payload = response.data.data ?? response.data;
    const orders = payload.orders ?? payload.items ?? [];
    const pagination = payload.pagination ?? response.data.pagination ?? {};

    return {
      items: orders.map((order: Record<string, unknown>) => normalizeOrder(order)),
      page: pagination.page ?? params?.page ?? 1,
      limit: pagination.limit ?? params?.limit ?? 10,
      total: pagination.total ?? orders.length,
      pages: pagination.pages ?? Math.ceil((pagination.total ?? orders.length) / (params?.limit ?? 10)),
    };
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const getOrder = async (orderId: string): Promise<Order> => {
  try {
    const response = await apiClient.get(`/api/orders/${orderId}`);
    const raw = response.data.data?.order ?? response.data.data ?? response.data.order ?? response.data;
    return normalizeOrder(raw);
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const createOrder = async (data: CreateOrderRequest): Promise<CreateOrderResponse> => {
  try {
    const response = await apiClient.post('/api/orders', data);
    const body = response.data;
    const orderRaw = body.data?.order ?? body.order;

    return {
      success: Boolean(body.success ?? true),
      message: body.message ?? 'Sipariş oluşturuldu',
      data: {
        order: normalizeOrder(orderRaw ?? {}),
        paymentInstructions: body.data?.paymentInstructions ?? null,
        iyzicoPayment: body.data?.iyzicoPayment ?? null,
      },
    };
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const cancelOrder = async (orderId: string, data: { reason: string }): Promise<Order> => {
  try {
    const response = await apiClient.post(`/api/orders/${orderId}/cancel`, data);
    const raw = response.data.data?.order ?? response.data.order ?? response.data.data ?? response.data;
    return normalizeOrder(raw);
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const returnOrder = async (
  orderId: string,
  data: { items: { itemId: string; quantity: number; reason: string }[]; notes?: string }
): Promise<Order> => {
  try {
    const response = await apiClient.post(`/api/orders/${orderId}/return`, data);
    const raw = response.data.data?.order ?? response.data.order ?? response.data.data ?? response.data;
    return normalizeOrder(raw);
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export default {
  getOrders,
  getOrder,
  createOrder,
  cancelOrder,
  returnOrder,
};
