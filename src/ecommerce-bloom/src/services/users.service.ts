import apiClient, { handleApiError } from '@/lib/api-client';
import type {
  User,
  Address,
  CreateAddressRequest,
  UpdateAddressRequest,
  UpdateProfileRequest,
  UpdatePreferencesRequest,
  PaginationResponse,
} from '@/types';

// Get User Profile
export const getUserProfile = async (): Promise<User> => {
  try {
    const response = await apiClient.get<any>('/api/users/profile');
    // API shape: { success: true, data: { id, email, addresses: [...], ... } }
    const raw = response.data.data || response.data.user || response.data;
    if (Array.isArray(raw.addresses)) {
      raw.addresses = raw.addresses.map(normalizeAddress);
    }
    return raw as User;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// Get User Addresses
export const getUserAddresses = async (): Promise<PaginationResponse<Address>> => {
  try {
    const response = await apiClient.get<any>('/api/users/addresses');
    return {
      items: response.data.data?.addresses || response.data.addresses || response.data.items || [],
      page: 1,
      limit: 10,
      total: 0,
      pages: 1,
    };
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// Update User Profile
export const updateUserProfile = async (data: UpdateProfileRequest): Promise<User> => {
  try {
    const response = await apiClient.put<any>('/api/users/profile', data);
    return response.data.data?.user || response.data.user || response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

const normalizeAddress = (a: any): Address => ({
  id: a.id,
  userId: a.userId,
  fullName: a.fullName,
  phone: a.phone,
  address: a.addressLine || a.address || '',
  city: a.city,
  district: a.district,
  postalCode: a.postalCode,
  country: a.country,
  isDefault: a.isDefault,
  type: ((a.type as string)?.toLowerCase() ?? 'home') as Address['type'],
  createdAt: a.createdAt,
});

// Create Address
export const createAddress = async (data: CreateAddressRequest): Promise<Address> => {
  try {
    const response = await apiClient.post<any>('/api/users/addresses', data);
    const payload = response.data;
    const raw =
      payload?.data?.address ??
      payload?.data ??
      payload?.address ??
      payload;
    const normalized = normalizeAddress(raw);
    if (!normalized.id) {
      throw new Error('Sunucu yanıtında adres kimliği bulunamadı');
    }
    return normalized;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// Update Address
export const updateAddress = async (
  addressId: string,
  data: UpdateAddressRequest
): Promise<Address> => {
  try {
    const response = await apiClient.put<any>(`/api/users/addresses/${addressId}`, data);
    const raw = response.data.data || response.data.address || response.data;
    return normalizeAddress(raw);
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// Delete Address
export const deleteAddress = async (addressId: string): Promise<void> => {
  try {
    await apiClient.delete(`/api/users/addresses/${addressId}`);
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// Update User Preferences
export const updateUserPreferences = async (
  data: UpdatePreferencesRequest
): Promise<{
  newsletter: boolean;
  notifications: boolean;
  language: string;
  currency: string;
}> => {
  try {
    const response = await apiClient.put<any>('/api/users/preferences', data);
    return response.data.data || response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export default {
  getUserProfile,
  getUserAddresses,
  updateUserProfile,
  createAddress,
  updateAddress,
  deleteAddress,
  updateUserPreferences,
};