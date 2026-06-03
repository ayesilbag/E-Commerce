import apiClient, { handleApiError } from '@/lib/api-client';

export interface ShippingMethod {
  id?: string;
  name: string;
  description?: string;
  cost: number;
  estimatedDays: number;
  provider?: string;
}

export const getShippingMethods = async (params?: {
  postalCode?: string;
  weight?: number;
}): Promise<ShippingMethod[]> => {
  try {
    const response = await apiClient.get('/api/shipping/methods', { params });
    return response.data.data || response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};
