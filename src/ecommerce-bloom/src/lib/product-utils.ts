import type { Product } from '@/types';

export const getApiBaseUrl = () =>
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? '' : 'https://test-bayi.digitalep.net');

export const getApiOrigin = () =>
  import.meta.env.VITE_API_ORIGIN ||
  getApiBaseUrl().replace(/\/api\/?$/, '') ||
  (import.meta.env.DEV ? '' : 'https://test-bayi.digitalep.net');

export const getImageUrl = (path: string | undefined): string => {
  if (!path) return '/placeholder.svg';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  if (path.startsWith('/')) {
    const base = getApiOrigin() || 'https://test-bayi.digitalep.net';
    return `${base}${path}`;
  }
  return path;
};

export const normalizeProduct = (product: Record<string, unknown>): Product => {
  let images: string[] = [];
  if (Array.isArray(product.images)) {
    images = product.images as string[];
  } else if (typeof product.images === 'string') {
    images = [product.images];
  } else if (product.image) {
    images = [product.image as string];
  }

  if (images.length === 0) {
    images = ['/placeholder.svg'];
  }

  const normalizedImages = images.map((img) => getImageUrl(img));

  return {
    id: String(product.id),
    name: String(product.name ?? ''),
    description: String(product.description ?? ''),
    longDescription: product.longDescription as string | undefined,
    price: Number(product.price ?? 0),
    originalPrice: product.originalPrice != null ? Number(product.originalPrice) : undefined,
    category: String(product.category ?? ''),
    subcategory: product.subcategory as string | undefined,
    image: normalizedImages[0],
    images: normalizedImages,
    stock: Number(product.stock ?? 0),
    sku: product.sku as string | undefined,
    barcode: product.barcode as string | undefined,
    specifications: Array.isArray(product.specifications) ? product.specifications : [],
    variants: Array.isArray(product.variants) ? product.variants : [],
    rating: Number(product.rating ?? 0),
    reviewCount: Number(product.reviewCount ?? 0),
    badge: product.badge as string | undefined,
    isActive: product.isActive !== false,
    isFeatured: Boolean(product.isFeatured),
    tags: Array.isArray(product.tags) ? product.tags : [],
    createdAt: String(product.createdAt ?? ''),
    updatedAt: String(product.updatedAt ?? ''),
    deletedAt: product.deletedAt as string | undefined,
  };
};

export const getCategoryImageUrl = (image: string | undefined): string => {
  if (!image) return '/placeholder.svg';
  return getImageUrl(image);
};
