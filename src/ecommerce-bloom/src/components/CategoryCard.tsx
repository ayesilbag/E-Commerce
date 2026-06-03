import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ImageIcon } from 'lucide-react';
import {
  formatCategoryName,
  getCategoryIcon,
  getCategoryProductLabel,
  resolveCategoryImageUrl,
} from '@/lib/category-utils';
import type { Category } from '@/types';

interface CategoryCardProps {
  category: Category;
  variant?: 'grid' | 'compact';
}

const CategoryCard = ({ category, variant = 'grid' }: CategoryCardProps) => {
  const Icon = getCategoryIcon(category.name);
  const displayName = formatCategoryName(category.name);
  const imageUrl = resolveCategoryImageUrl(category);
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = Boolean(imageUrl) && !imageFailed;
  const isCompact = variant === 'compact';

  return (
    <Link
      to={`/category/${encodeURIComponent(category.slug)}`}
      className={`group flex flex-col bg-white rounded-xl border border-gray-200/80 overflow-hidden transition-all duration-200 hover:border-gray-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] ${
        isCompact ? 'min-h-[140px]' : 'min-h-[180px] sm:min-h-[200px]'
      }`}
    >
      {/* Kategori görseli alanı — admin panelden image yüklendiğinde burada gösterilir */}
      <div
        className={`relative w-full overflow-hidden bg-gray-100 ${
          isCompact ? 'h-24' : 'h-28 sm:h-32'
        }`}
      >
        {showImage ? (
          <img
            src={imageUrl!}
            alt={displayName}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-gray-50 text-gray-300">
            <ImageIcon className="w-5 h-5" strokeWidth={1.5} />
            <Icon className="w-4 h-4 opacity-60" strokeWidth={1.75} />
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
      </div>

      <div className="flex flex-1 flex-col justify-between p-3.5 sm:p-4">
        <h3 className="font-medium text-xs text-gray-900 leading-snug line-clamp-2 tracking-tight">
          {displayName}
        </h3>
        <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t border-gray-100">
          <span className="text-xs text-gray-500">
            {getCategoryProductLabel(category.productCount)}
          </span>
          <ChevronRight
            className="w-4 h-4 text-gray-300 transition-all duration-200 group-hover:text-purple-600 group-hover:translate-x-0.5"
            strokeWidth={1.75}
          />
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
