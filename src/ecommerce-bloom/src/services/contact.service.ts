import apiClient, { handleApiError } from '@/lib/api-client';
import type { ContactMessageRequest } from '@/types';

// Send Contact Message
export const sendContactMessage = async (data: ContactMessageRequest): Promise<{
  success: boolean;
  message: string;
  ticketId?: string;
}> => {
  try {
    const response = await apiClient.post<{
      success: boolean;
      message?: string;
      data?: { ticketId?: string };
    }>('/api/contact', data);

    const body = response.data;
    if (!body.success) {
      throw new Error(body.message ?? 'Mesaj gönderilemedi');
    }

    return {
      success: body.success,
      message: body.message ?? 'Mesajınız başarıyla alındı.',
      ticketId: body.data?.ticketId,
    };
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export default {
  sendContactMessage,
};