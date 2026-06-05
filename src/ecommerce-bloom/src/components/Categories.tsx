import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";
import { getCategories } from "@/services/categories.service";
import {
  sortCategoriesForDisplay,
  formatCategoryName,
  getCategoryIcon,
  resolveCategoryImageUrl,
} from "@/lib/category-utils";
import type { Category } from "@/types";

const CategoryPill = ({ category }: { category: Category }) => {
  const Icon = getCategoryIcon(category.name);
  const displayName = formatCategoryName(category.name);
  const imageUrl = resolveCategoryImageUrl(category);
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = Boolean(imageUrl) && !imageFailed;

  return (
    <Link
      to={`/category/${encodeURIComponent(category.slug)}`}
      className="group flex flex-col items-center gap-2 shrink-0 w-20 sm:w-24"
    >
      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-gray-100 group-hover:border-purple-400 overflow-hidden bg-gray-50 transition-all duration-200 group-hover:shadow-md">
        {showImage ? (
          <img
            src={imageUrl!}
            alt={displayName}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-purple-50">
            <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-purple-400" strokeWidth={1.5} />
          </div>
        )}
        <div className="absolute inset-0 bg-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-full" />
      </div>
      <span className="text-[10px] sm:text-xs font-medium text-gray-700 text-center leading-tight line-clamp-2 group-hover:text-purple-700 transition-colors">
        {displayName}
      </span>
    </Link>
  );
};

const CategorySkeleton = () => (
  <div className="flex flex-col items-center gap-2 shrink-0 w-20 sm:w-24 animate-pulse">
    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-100" />
    <div className="h-3 bg-gray-100 rounded w-14" />
  </div>
);

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        const sorted = sortCategoriesForDisplay(data.filter((c) => c.isActive));
        setCategories(sorted);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [categories]);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -240 : 240, behavior: "smooth" });
  };

  return (
    <section className="py-6 sm:py-8 bg-white border-b border-gray-100">
      <div className="container-custom px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-5">
          <h2 className="text-sm sm:text-base font-semibold text-gray-900 uppercase tracking-wide">
            Kategoriler
          </h2>
          <Link
            to="/categories"
            className="text-xs font-medium text-purple-600 hover:text-purple-800 hover:underline transition-colors"
          >
            Tümünü Gör →
          </Link>
        </div>

        {/* Scroll Container */}
        <div className="relative">
          {/* Left Arrow */}
          {canScrollLeft && (
            <button
              onClick={() => scroll("left")}
              className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-md border border-gray-100 hover:bg-gray-50 transition-all"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
          )}

          {/* Right Arrow */}
          {canScrollRight && (
            <button
              onClick={() => scroll("right")}
              className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-md border border-gray-100 hover:bg-gray-50 transition-all"
            >
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          )}

          <div
            ref={scrollRef}
            className="flex gap-4 sm:gap-5 overflow-x-auto pb-1"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {isLoading
              ? Array.from({ length: 10 }).map((_, i) => <CategorySkeleton key={i} />)
              : categories.map((category) => (
                  <CategoryPill key={category.id} category={category} />
                ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Categories;
