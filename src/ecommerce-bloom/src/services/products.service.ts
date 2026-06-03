import apiClient, { handleApiError } from '@/lib/api-client';
import { normalizeProduct } from '@/lib/product-utils';
import type {
  Product,
  Review,
  ProductsFilterParams,
  CreateReviewRequest,
  PaginationResponse,
} from '@/types';

export const getProducts = async (params?: ProductsFilterParams): Promise<PaginationResponse<Product>> => {
  try {
    const response = await apiClient.get<any>('/api/products', { params });
    const products = response.data.data?.products || response.data.products || [];

    return {
      items: products.map((product: Record<string, unknown>) => normalizeProduct(product)),
      page: response.data.data?.pagination?.page || response.data.pagination?.page || params?.page || 1,
      limit: response.data.data?.pagination?.limit || response.data.pagination?.limit || params?.limit || 20,
      total: response.data.data?.pagination?.total || response.data.pagination?.total || 0,
      pages: response.data.data?.pagination?.pages || response.data.pagination?.pages || 0,
    };
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const getProduct = async (productId: string): Promise<Product> => {
  try {
    const response = await apiClient.get<any>(`/api/products/${productId}`);
    const productData = response.data.data || response.data;
    return normalizeProduct(productData);
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const getProductReviews = async (
  productId: string,
  params?: { page?: number; limit?: number; sort?: string }
): Promise<PaginationResponse<Review>> => {
  try {
    const response = await apiClient.get<any>(`/api/products/${productId}/reviews`, { params });
    return {
      items: response.data.data?.reviews || response.data.reviews || [],
      page: response.data.data?.pagination?.page || response.data.pagination?.page || params?.page || 1,
      limit: response.data.data?.pagination?.limit || response.data.pagination?.limit || params?.limit || 10,
      total: response.data.data?.pagination?.total || response.data.pagination?.total || 0,
      pages: Math.ceil(
        (response.data.data?.pagination?.total || response.data.pagination?.total || 0) /
          (params?.limit || 10)
      ),
    };
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const createReview = async (
  productId: string,
  data: CreateReviewRequest
): Promise<Review> => {
  try {
    const response = await apiClient.post<any>(`/api/products/${productId}/reviews`, data);
    return response.data.data || response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const markReviewHelpful = async (
  productId: string,
  reviewId: string
): Promise<void> => {
  try {
    await apiClient.post(`/api/products/${productId}/reviews/${reviewId}/helpful`);
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export default {
  getProducts,
  getProduct,
  getProductReviews,
  createReview,
  markReviewHelpful,
};
