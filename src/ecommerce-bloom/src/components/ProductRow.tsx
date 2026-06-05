import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getProducts } from "@/services/products.service";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/types";
import type { ProductsFilterParams } from "@/types";

interface ProductRowProps {
  title: string;
  subtitle?: string;
  viewAllHref?: string;
  params?: ProductsFilterParams;
  badgeColor?: string;
  limit?: number;
}

const ProductCardSkeleton = () => (
  <div className="shrink-0 w-40 xs:w-44 sm:w-48 md:w-52 animate-pulse">
    <div className="aspect-square bg-gray-100 rounded-xl mb-3" />
    <div className="space-y-2 px-1">
      <div className="h-3 bg-gray-100 rounded w-3/4" />
      <div className="h-3 bg-gray-100 rounded w-1/2" />
      <div className="h-4 bg-gray-100 rounded w-1/3" />
    </div>
  </div>
);

const ProductRow = ({
  title,
  subtitle,
  viewAllHref = "/shop",
  params = {},
  limit = 10,
}: ProductRowProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await getProducts({ page: 1, limit, ...params });
        setProducts(response.items);
      } catch (err) {
        console.error("ProductRow fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
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
  }, [products]);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -300 : 300, behavior: "smooth" });
  };

  if (!isLoading && products.length === 0) return null;

  return (
    <section className="py-6 sm:py-8 bg-white border-b border-gray-100">
      <div className="container-custom px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-end justify-between mb-4 sm:mb-5">
          <div>
            <h2 className="text-sm sm:text-base font-semibold text-gray-900 uppercase tracking-wide">
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
            )}
          </div>
          <Link
            to={viewAllHref}
            className="text-xs font-medium text-purple-600 hover:text-purple-800 hover:underline transition-colors shrink-0"
          >
            Tümünü Gör →
          </Link>
        </div>

        {/* Horizontal scroll row */}
        <div className="relative">
          {canScrollLeft && (
            <button
              onClick={() => scroll("left")}
              className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-md border border-gray-100 hover:bg-gray-50 transition-all"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
          )}
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
            className="flex gap-3 sm:gap-4 overflow-x-auto pb-2"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)
              : products.map((product) => (
                  <div
                    key={product.id}
                    className="shrink-0 w-40 xs:w-44 sm:w-48 md:w-52"
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductRow;
