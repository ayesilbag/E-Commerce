import apiClient, { handleApiError } from '@/lib/api-client';
import type { SubscribeRequest, UnsubscribeRequest } from '@/types';

// Subscribe to Newsletter
export const subscribeNewsletter = async (data: SubscribeRequest): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    const response = await apiClient.post<any>('/api/newsletter/subscribe', data);
    return response.data.data || response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// Unsubscribe from Newsletter
export const unsubscribeNewsletter = async (data: UnsubscribeRequest): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    const response = await apiClient.post<any>('/api/newsletter/unsubscribe', data);
    return response.data.data || response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export default {
  subscribeNewsletter,
  unsubscribeNewsletter,
};