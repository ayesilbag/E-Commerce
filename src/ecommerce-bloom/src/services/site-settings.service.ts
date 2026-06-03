import apiClient, { handleApiError } from '@/lib/api-client';
import type { ApiResponse, LegalPageData, SiteSettings } from '@/types';
import type { LegalSlug } from '@/constants/legal-pages';

export const UI_CODE = import.meta.env.VITE_UI_CODE;

if (!UI_CODE) {
  console.warn('VITE_UI_CODE tanımlı değil — site ayarları alınamaz');
}

export const getSiteSettings = async (): Promise<SiteSettings> => {
  if (!UI_CODE) {
    throw new Error('VITE_UI_CODE ortam değişkeni zorunludur');
  }

  try {
    const response = await apiClient.get<ApiResponse<SiteSettings>>(
      `/api/site-settings/${UI_CODE}`
    );

    if (!response.data.success || !response.data.data) {
      throw new Error('Geçersiz site ayarları yanıtı');
    }

    return response.data.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const getLegalPage = async (slug: LegalSlug): Promise<LegalPageData> => {
  if (!UI_CODE) {
    throw new Error('VITE_UI_CODE ortam değişkeni zorunludur');
  }

  try {
    const response = await apiClient.get<ApiResponse<LegalPageData>>(
      `/api/site-settings/${UI_CODE}/legal-pages/${slug}`
    );

    if (!response.data.success || !response.data.data) {
      throw new Error('Yasal sayfa bulunamadı');
    }

    return response.data.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export default {
  getSiteSettings,
  getLegalPage,
};
