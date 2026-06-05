import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getProducts } from "@/services/products.service";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/types";
import type { ProductsFilterParams } from "@/types";
import { uiLabel, useAppPagesUi } from "@/hooks/useAppPagesUi";

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
    <div className="aspect-square bg-muted rounded-xl mb-3" />
    <div className="space-y-2 px-1">
      <div className="h-3 bg-muted rounded w-3/4" />
      <div className="h-3 bg-muted rounded w-1/2" />
      <div className="h-4 bg-muted rounded w-1/3" />
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
  const viewAllLink = uiLabel(useAppPagesUi()?.category?.viewAllLink);

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
    <section className="py-6 sm:py-8 bg-card border-b border-border">
      <div className="container-custom px-4 sm:px-6">
        <div className="flex items-end justify-between mb-4 sm:mb-5">
          <div>
            <h2 className="text-sm sm:text-base font-semibold text-foreground uppercase tracking-wide">
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
            )}
          </div>
          {viewAllLink && (
          <Link
            to={viewAllHref}
            className="text-xs font-medium text-primary hover:text-primary/80 hover:underline transition-colors shrink-0"
          >
            {viewAllLink}
          </Link>
          )}
        </div>

        <div className="relative">
          {canScrollLeft && (
            <button
              onClick={() => scroll("left")}
              className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-card rounded-full shadow-md border border-border hover:bg-muted/50 transition-all"
            >
              <ChevronLeft className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
          {canScrollRight && (
            <button
              onClick={() => scroll("right")}
              className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-card rounded-full shadow-md border border-border hover:bg-muted/50 transition-all"
            >
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
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
