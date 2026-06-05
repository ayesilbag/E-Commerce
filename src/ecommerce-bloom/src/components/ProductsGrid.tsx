import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { getProducts } from "@/services/products.service";
import type { Product } from "@/types";
import { uiLabel, useAppPagesUi } from "@/hooks/useAppPagesUi";

const ProductsGrid = () => {
  const product = useAppPagesUi()?.product;
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sectionTitle = uiLabel(product?.similarProductsTitle);
  const viewAllLabel = uiLabel(product?.viewAllLink);
  const loadError = uiLabel(useAppPagesUi()?.shop?.productsLoadError);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await getProducts({ page: 1, limit: 10, sort: "featured" });
        setProducts(response.items);
      } catch (err) {
        setError(err instanceof Error ? err.message : loadError || null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [loadError]);

  if (!sectionTitle) return null;

  return (
    <section className="section-padding bg-muted/50">
      <div className="container-custom px-2 xs:px-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3 xs:gap-4 sm:gap-6 mb-6 xs:mb-8 sm:mb-10">
          <div>
            <h2 className="text-base font-semibold uppercase tracking-wide mb-1">{sectionTitle}</h2>
          </div>
          {viewAllLabel && (
          <Link to="/shop" className="flex items-center text-xs text-primary font-medium hover:underline">
            {viewAllLabel} <ChevronRight size={16} className="ml-1" />
          </Link>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">{error}</div>
        ) : products.length === 0 ? null : (
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-3 xs:gap-4 sm:gap-4 md:gap-6 lg:gap-6">
            {products.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductsGrid;
