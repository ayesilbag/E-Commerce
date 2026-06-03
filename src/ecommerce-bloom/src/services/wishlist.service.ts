import apiClient, { handleApiError } from '@/lib/api-client';
import type { Wishlist, AddToWishlistRequest, ShareWishlistRequest } from '@/types';

// Get Wishlist
export const getWishlist = async (): Promise<Wishlist> => {
  try {
    const response = await apiClient.get<any>('/api/wishlist');
    console.log('Wishlist API Response:', response.data);
    // Handle API response format: { success: true, data: { wishlist: {...} } }
    if (response.data?.data?.wishlist) {
      return response.data.data.wishlist;
    }
    // Handle API response format: { success: true, data: {...} }
    if (response.data?.data) {
      return response.data.data;
    }
    // Handle direct response
    return response.data || { items: [], itemCount: 0 };
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    throw new Error(handleApiError(error));
  }
};

// Add to Wishlist
export const addToWishlist = async (data: AddToWishlistRequest): Promise<{ id: string }> => {
  try {
    const response = await apiClient.post<any>('/api/wishlist/add', data);
    console.log('Add to Wishlist API Response:', response.data);
    // Handle API response format: { success: true, data: {...} }
    if (response.data?.data) {
      return response.data.data;
    }
    // Handle direct response
    return response.data || { id: '' };
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    throw new Error(handleApiError(error));
  }
};

// Remove from Wishlist
export const removeFromWishlist = async (itemId: string): Promise<void> => {
  try {
    await apiClient.delete(`/api/wishlist/${itemId}`);
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// Share Wishlist
export const shareWishlist = async (data: ShareWishlistRequest): Promise<void> => {
  try {
    await apiClient.post('/api/wishlist/share', data);
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export default {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  shareWishlist,
};