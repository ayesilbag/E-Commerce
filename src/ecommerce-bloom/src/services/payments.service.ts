import apiClient, { handleApiError } from '@/lib/api-client';
import { createOrder, type CreateOrderRequest, type CreateOrderResponse } from '@/services/orders.service';
import type {
  ApiResponse,
  IyzicoClient,
  IyzicoInitializeData,
  IyzicoInitializeRequest,
  PaymentOptionsData,
} from '@/types/iyzico';
import type { PaymentMethodDetails, ProcessPaymentRequest, ValidatePaymentRequest } from '@/types';

export interface BankAccount {
  id: string;
  bankName: string;
  accountHolder: string;
  iban: string;
  branchName: string;
  currency: string;
  instructions: string;
  sortOrder: number;
  isActive: boolean;
}

export interface PaymentInstructions {
  type: string;
  orderNumber: string;
  message: string;
  accounts: BankAccount[];
}

export interface SavedPaymentMethod {
  id: string;
  type: string;
  cardName?: string;
  cardLast4?: string;
  cardBrand?: string;
  isDefault?: boolean;
}

export interface ProcessPaymentResult {
  transactionId?: string;
  status: string;
  amount: number;
}

export const getPaymentOptions = async (): Promise<PaymentOptionsData> => {
  try {
    const response = await apiClient.get<ApiResponse<PaymentOptionsData>>('/api/payments/options');
    return response.data.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const getIyzicoClients = async (): Promise<IyzicoClient[]> => {
  try {
    const response = await apiClient.get<ApiResponse<IyzicoClient[]>>('/api/payments/iyzico/clients');
    return response.data.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const initializeIyzicoPayment = async (
  data: IyzicoInitializeRequest
): Promise<IyzicoInitializeData> => {
  try {
    const response = await apiClient.post<ApiResponse<IyzicoInitializeData>>(
      '/api/payments/iyzico/initialize',
      data
    );
    return response.data.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export interface PayWithIyzicoCheckoutParams {
  shippingAddressId: string;
  shippingMethod: CreateOrderRequest['shippingMethod'];
  paymentClientCode?: string;
  notes?: string;
}

export const payWithIyzicoCheckout = async (
  params: PayWithIyzicoCheckoutParams
): Promise<{ order: CreateOrderResponse['data']['order']; paymentPageUrl: string }> => {
  const orderResponse = await createOrder({
    shippingAddressId: params.shippingAddressId,
    shippingMethod: params.shippingMethod,
    paymentMethod: { type: 'iyzico' },
    notes: params.notes,
  });

  const order = orderResponse.data?.order;
  if (!order?.id) {
    throw new Error(orderResponse.message || 'Sipariş oluşturulamadı');
  }

  const initData = await initializeIyzicoPayment({
    orderId: order.id,
    paymentClientCode: params.paymentClientCode,
  });

  if (!initData.paymentPageUrl) {
    throw new Error('Ödeme sayfası URL alınamadı');
  }

  return { order, paymentPageUrl: initData.paymentPageUrl };
};

export const redirectToIyzicoPayment = (paymentPageUrl: string): void => {
  window.location.assign(paymentPageUrl);
};

export const getBankAccounts = async (): Promise<{
  success: boolean;
  message: string;
  data: BankAccount[];
}> => {
  try {
    const response = await apiClient.get('/api/payments/bank-accounts');
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const getPaymentMethods = async (): Promise<SavedPaymentMethod[]> => {
  try {
    const response = await apiClient.get('/api/payments/methods');
    return response.data.data ?? response.data ?? [];
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const validatePayment = async (data: ValidatePaymentRequest): Promise<{ success: boolean; message?: string }> => {
  try {
    const response = await apiClient.post('/api/payments/validate', data);
    return {
      success: Boolean(response.data.success ?? true),
      message: response.data.message,
    };
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const processPayment = async (data: ProcessPaymentRequest): Promise<ProcessPaymentResult> => {
  try {
    const response = await apiClient.post('/api/payments/process', data);
    const result = response.data.data ?? response.data;
    return {
      transactionId: result.transactionId,
      status: result.status ?? 'completed',
      amount: Number(result.amount ?? data.amount),
    };
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export default {
  getPaymentOptions,
  getIyzicoClients,
  initializeIyzicoPayment,
  payWithIyzicoCheckout,
  redirectToIyzicoPayment,
  getBankAccounts,
  getPaymentMethods,
  validatePayment,
  processPayment,
};
