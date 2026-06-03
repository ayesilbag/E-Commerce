export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface IyzicoPaymentOption {
  code: string;
  name: string;
  isSandbox: boolean;
  isDefault?: boolean;
}

export interface PaymentOptionsData {
  iyzico: IyzicoPaymentOption[];
  bankTransfer: boolean;
}

export interface IyzicoClient {
  code: string;
  name: string;
  isSandbox: boolean;
  currency: string;
}

export interface IyzicoInitializeRequest {
  orderId: string;
  paymentClientCode?: string;
}

export interface IyzicoInitializeData {
  token: string;
  paymentPageUrl: string;
  checkoutFormContent?: string;
  paymentClientCode: string;
  conversationId: string;
}

export interface IyzicoPaymentHint {
  type: string;
  orderId: string;
  message: string;
}
