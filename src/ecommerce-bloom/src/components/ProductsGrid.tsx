import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { getProducts } from "@/services/products.service";
import type { Product } from "@/types";

const ProductsGrid = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await getProducts({ page: 1, limit: 10, sort: "featured" });
        setProducts(response.items);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Ürünler yüklenemedi");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom px-2 xs:px-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3 xs:gap-4 sm:gap-6 mb-6 xs:mb-8 sm:mb-10">
          <div>
            <h2 className="text-base font-semibold uppercase tracking-wide mb-1">En Çok Satan Ürünler</h2>
            <p className="text-xs text-gray-500">Müşteriler tarafından en çok sevilen ürünlerimizi keşfedin</p>
          </div>
          <Link to="/shop" className="flex items-center text-xs text-purple-default font-medium hover:underline">
            Tüm Ürünleri Gör <ChevronRight size={16} className="ml-1" />
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">{error}</div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 text-gray-500">Henüz ürün bulunmuyor.</div>
        ) : (
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-3 xs:gap-4 sm:gap-4 md:gap-6 lg:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductsGrid;
