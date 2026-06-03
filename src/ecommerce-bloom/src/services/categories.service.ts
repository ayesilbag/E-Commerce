import apiClient, { handleApiError } from '@/lib/api-client';
import { normalizeCategories, normalizeCategory } from '@/lib/category-utils';
import type { Category } from '@/types';

export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await apiClient.get<any>('/api/categories');
    const raw: Category[] = response.data.data || response.data || [];
    return normalizeCategories(raw);
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const getCategory = async (
  categoryId: string,
  params?: { page?: number; limit?: number }
): Promise<{ category: Category; products: any[]; pagination: any }> => {
  try {
    const response = await apiClient.get<any>(`/api/categories/${categoryId}`, { params });
    const data = response.data.data || response.data;
    return {
      ...data,
      category: data.category ? normalizeCategory(data.category) : data.category,
    };
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export default {
  getCategories,
  getCategory,
};
