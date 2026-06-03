import apiClient, { handleApiError } from '@/lib/api-client';
import type {
  Cart,
  AddToCartRequest,
  UpdateQuantityRequest,
  ApplyCouponRequest,
} from '@/types';

// Get Cart
export const getCart = async (): Promise<Cart> => {
  try {
    const response = await apiClient.get<any>('/api/cart');
    console.log('Cart API Response:', response.data);
    // Handle API response format: { success: true, data: { cart: {...} } }
    if (response.data?.data?.cart) {
      return response.data.data.cart;
    }
    // Handle API response format: { success: true, data: {...} }
    if (response.data?.data) {
      return response.data.data;
    }
    // Handle direct response
    return response.data || { items: [], total: 0, itemCount: 0 };
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw new Error(handleApiError(error));
  }
};

// Add to Cart
export const addToCart = async (data: AddToCartRequest): Promise<Cart> => {
  try {
    const response = await apiClient.post<any>('/api/cart/add', data);
    console.log('Add to Cart API Response:', response.data);
    // Handle API response format: { success: true, data: { cart: {...} } }
    if (response.data?.data?.cart) {
      return response.data.data.cart;
    }
    // Handle API response format: { success: true, data: {...} }
    if (response.data?.data) {
      return response.data.data;
    }
    // Handle direct response
    return response.data || { items: [], total: 0, itemCount: 0 };
  } catch (error) {
    console.error('Error adding to cart:', error);
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
    console.log('Update Cart Item API Response:', response.data);
    // Handle API response format: { success: true, data: { cart: {...} } }
    if (response.data?.data?.cart) {
      return response.data.data.cart;
    }
    // Handle API response format: { success: true, data: {...} }
    if (response.data?.data) {
      return response.data.data;
    }
    // Handle direct response
    return response.data || { items: [], total: 0, itemCount: 0 };
  } catch (error) {
    console.error('Error updating cart item:', error);
    throw new Error(handleApiError(error));
  }
};

// Remove from Cart
export const removeFromCart = async (productId: string): Promise<Cart> => {
  try {
    const response = await apiClient.delete<any>(`/api/cart/items/${productId}`);
    console.log('Remove from Cart API Response:', response.data);
    // Handle API response format: { success: true, data: { cart: {...} } }
    if (response.data?.data?.cart) {
      return response.data.data.cart;
    }
    // Handle API response format: { success: true, data: {...} }
    if (response.data?.data) {
      return response.data.data;
    }
    // Handle direct response
    return response.data || { items: [], total: 0, itemCount: 0 };
  } catch (error) {
    console.error('Error removing from cart:', error);
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