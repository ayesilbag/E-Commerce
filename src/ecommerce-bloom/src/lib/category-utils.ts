import type { LucideIcon } from 'lucide-react';
import {
  Shirt,
  Smartphone,
  Flower2,
  Sparkles,
  Package,
  Car,
  Heart,
  Home,
  Zap,
  BookOpen,
  ShoppingBag,
  Palette,
  Laptop,
  Wrench,
} from 'lucide-react';

import { getImageUrl } from '@/lib/product-utils';
import type { Category } from '@/types';

const CATEGORY_ICONS: { keywords: string[]; icon: LucideIcon }[] = [
  { keywords: ['giyim', 'tekstil', 'moda'], icon: Shirt },
  { keywords: ['elektronik', 'bilgisayar', 'cep', 'telefon'], icon: Smartphone },
  { keywords: ['bahçe', 'bahce'], icon: Flower2 },
  { keywords: ['kozmetik', 'bakim', 'bakım', 'kişisel'], icon: Sparkles },
  { keywords: ['otomotiv'], icon: Car },
  { keywords: ['ev', 'yaşam', 'yasam'], icon: Home },
  { keywords: ['elektrik', 'hırdavat', 'hirdavat'], icon: Zap },
  { keywords: ['kirtasiye', 'kırtasiye', 'kitap'], icon: BookOpen },
  { keywords: ['hobi', 'sanat'], icon: Palette },
  { keywords: ['endüstriyel', 'endustriyel', 'tedarik', 'ambalaj', 'temizlik'], icon: Package },
  { keywords: ['sağlık', 'saglik'], icon: Heart },
  { keywords: ['bilgisayar'], icon: Laptop },
  { keywords: ['işçilik', 'iscilik'], icon: Wrench },
];

export const formatCategoryName = (name: string): string =>
  name
    .replace(/_/g, ' ')
    .trim()
    .toLocaleLowerCase('tr-TR')
    .split(/\s+/)
    .map((word) => word.charAt(0).toLocaleUpperCase('tr-TR') + word.slice(1))
    .join(' ');

export const hasValidCategoryImage = (image?: string | null): boolean =>
  Boolean(image && image.trim().length > 0);

/** API'den gelen image veya icon alanından görsel URL'si üretir */
export const resolveCategoryImageUrl = (
  category: Pick<Category, 'image' | 'icon'>
): string | null => {
  if (hasValidCategoryImage(category.image)) return getImageUrl(category.image);
  if (hasValidCategoryImage(category.icon)) return getImageUrl(category.icon);
  return null;
};

export const normalizeCategory = (category: Category): Category => ({
  ...category,
  image: hasValidCategoryImage(category.image) ? getImageUrl(category.image!) : '',
  icon: hasValidCategoryImage(category.icon) ? getImageUrl(category.icon!) : undefined,
});

export const normalizeCategories = (categories: Category[]): Category[] =>
  categories.map(normalizeCategory);

export const getCategoryIcon = (name: string): LucideIcon => {
  const lower = name.toLocaleLowerCase('tr-TR');
  const match = CATEGORY_ICONS.find(({ keywords }) =>
    keywords.some((keyword) => lower.includes(keyword))
  );
  return match?.icon ?? ShoppingBag;
};

export const sortCategoriesForDisplay = <T extends { name: string; productCount: number; image?: string }>(
  categories: T[]
): T[] =>
  [...categories]
    .filter((c) => c.name.toLocaleLowerCase('tr-TR') !== 'kategori')
    .sort((a, b) => {
      const aHasImage = hasValidCategoryImage(a.image) ? 1 : 0;
      const bHasImage = hasValidCategoryImage(b.image) ? 1 : 0;
      if (bHasImage !== aHasImage) return bHasImage - aHasImage;
      if (b.productCount !== a.productCount) return b.productCount - a.productCount;
      return a.name.localeCompare(b.name, 'tr-TR');
    });

export const getCategoryProductLabel = (count: number): string => {
  if (count <= 0) return 'Koleksiyonu gör';
  if (count === 1) return '1 ürün';
  return `${count} ürün`;
};
