import apiClient, { handleApiError } from '@/lib/api-client';
import type {
  Cart,
  AddToCartRequest,
  UpdateQuantityRequest,
  ApplyCouponRequest,
} from '@/types';

const parseCartResponse = (data: any): Cart => {
  if (data?.data?.cart) return data.data.cart;
  if (data?.data) return data.data;
  return data || { items: [], total: 0, itemCount: 0 };
};

// Get Cart
export const getCart = async (): Promise<Cart> => {
  try {
    const response = await apiClient.get<any>('/api/cart');
    return parseCartResponse(response.data);
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// Add to Cart
export const addToCart = async (data: AddToCartRequest): Promise<Cart> => {
  try {
    const response = await apiClient.post<any>('/api/cart/add', data);
    return parseCartResponse(response.data);
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// Update Cart Item Quantity
export const updateCartItem = async (
  productId: string,
  data: UpdateQuantityRequest
): Promise<Cart> => {
  try {
    const response = await apiClient.put<any>(`/api/cart/items/${productId}`, data);
    return parseCartResponse(response.data);
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// Remove from Cart
export const removeFromCart = async (productId: string): Promise<Cart> => {
  try {
    const response = await apiClient.delete<any>(`/api/cart/items/${productId}`);
    return parseCartResponse(response.data);
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// Clear Cart
export const clearCart = async (): Promise<void> => {
  try {
    await apiClient.delete('/api/cart');
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// Apply Coupon
export const applyCoupon = async (data: ApplyCouponRequest): Promise<{
  discountAmount: number;
  discountPercent: number;
  newTotal: number;
}> => {
  try {
    const response = await apiClient.post<any>('/api/cart/apply-coupon', data);
    return response.data.data || response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export default {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  applyCoupon,
};