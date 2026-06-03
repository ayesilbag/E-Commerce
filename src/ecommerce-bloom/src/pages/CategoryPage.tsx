import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Grid3X3, List } from "lucide-react";
import { getCategories } from "@/services/categories.service";
import { getProducts } from "@/services/products.service";
import { formatCategoryName, sortCategoriesForDisplay } from "@/lib/category-utils";
import CategoryCard from "@/components/CategoryCard";
import type { Category, Product } from "@/types";

const CategoryPage = () => {
  const { categoryName: categorySlug } = useParams<{ categoryName?: string }>();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const category = categorySlug
    ? categories.find(
        (c) =>
          c.slug.toLowerCase() === decodeURIComponent(categorySlug).toLowerCase() ||
          c.name.toLowerCase() === decodeURIComponent(categorySlug).toLowerCase()
      )
    : null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const categoriesData = await getCategories();
        setCategories(sortCategoriesForDisplay(categoriesData.filter((c) => c.isActive)));

        if (categorySlug) {
          const slug = decodeURIComponent(categorySlug);
          const matched = categoriesData.find(
            (c) =>
              c.slug.toLowerCase() === slug.toLowerCase() ||
              c.name.toLowerCase() === slug.toLowerCase()
          );

          if (matched) {
            const response = await getProducts({
              category: matched.name,
              page: 1,
              limit: 50,
            });
            setProducts(response.items);
          } else {
            setProducts([]);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Veriler yüklenemedi");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [categorySlug]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-2 xs:px-4 sm:px-4 md:px-6 py-4 xs:py-6 sm:py-8 md:py-12">
        <div className="w-full max-w-6xl">
          <div className="bg-gray-100 rounded-lg xs:rounded-lg sm:rounded-xl md:rounded-2xl p-4 xs:p-6 md:p-8 shadow-sm border border-gray-200">
            <div className="text-center mb-4 xs:mb-6 md:mb-8">
              <h1 className="text-base font-semibold text-gray-900 mb-1">
                {categorySlug ? formatCategoryName(category?.name || decodeURIComponent(categorySlug)) : "Kategoriler"}
              </h1>
              <p className="text-xs text-gray-600">
                {categorySlug
                  ? `${formatCategoryName(category?.name || decodeURIComponent(categorySlug))} kategorisindeki ürünler`
                  : "Tüm kategorileri keşfedin"}
              </p>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
              </div>
            ) : error ? (
              <div className="text-center py-12 text-red-500">{error}</div>
            ) : !categorySlug ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                {categories.map((cat) => (
                  <CategoryCard key={cat.id} category={cat} variant="compact" />
                ))}
              </div>
            ) : (
              <div>
                <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3 xs:gap-4 md:gap-4 mb-4 xs:mb-6 md:mb-6">
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-900">
                    {formatCategoryName(category?.name || decodeURIComponent(categorySlug))} Ürünleri
                  </h2>
                  <div className="flex items-center gap-1.5 xs:gap-2 md:gap-2">
                    <span className="text-xs xs:text-sm text-gray-500">Görünüm:</span>
                    <Button
                      variant={viewMode === "grid" ? "default" : "outline"}
                      size="icon"
                      className={`h-7 w-7 xs:h-8 xs:w-8 md:h-8 md:w-8 ${viewMode === "grid" ? "bg-purple-gradient hover:opacity-90" : ""}`}
                      onClick={() => setViewMode("grid")}
                    >
                      <Grid3X3 size={14} className="xs:size-[16px] md:size-[18px]" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "outline"}
                      size="icon"
                      className={`h-7 w-7 xs:h-8 xs:w-8 md:h-8 md:w-8 ${viewMode === "list" ? "bg-purple-gradient hover:opacity-90" : ""}`}
                      onClick={() => setViewMode("list")}
                    >
                      <List size={14} className="xs:size-[16px] md:size-[18px]" />
                    </Button>
                  </div>
                </div>

                {products.length > 0 ? (
                  <div
                    className={
                      viewMode === "grid"
                        ? "grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 xs:gap-3 md:gap-4"
                        : "flex flex-col gap-3 xs:gap-4 md:gap-4"
                    }
                  >
                    {products.map((product) => (
                      <div key={product.id} className={viewMode === "list" ? "w-full" : ""}>
                        <ProductCard product={product} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 xs:py-10 md:py-12 bg-white rounded-lg border border-gray-200">
                    <h3 className="text-sm font-medium mb-1 text-gray-900">Ürün bulunamadı</h3>
                    <p className="text-gray-500 mb-4 text-xs">Bu kategoride ürün bulunamadı.</p>
                    <Button className="bg-purple-gradient hover:opacity-90 text-white h-9 text-sm" asChild>
                      <Link to="/shop">Tüm Ürünleri Görüntüle</Link>
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CategoryPage;
