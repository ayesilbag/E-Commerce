import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { getCategories } from "@/services/categories.service";
import { sortCategoriesForDisplay } from "@/lib/category-utils";
import CategoryCard from "@/components/CategoryCard";
import type { Category } from "@/types";

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        const sorted = sortCategoriesForDisplay(data.filter((c) => c.isActive)).slice(0, 8);
        setCategories(sorted);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <section className="section-padding bg-white">
      <div className="container-custom px-2 xs:px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 sm:mb-10">
          <div className="max-w-lg">
            <h2 className="text-base font-semibold uppercase tracking-wide text-gray-900">
              Kategoriler
            </h2>
            <p className="mt-1 text-xs text-gray-500">
              Aradığınız ürünü kategoriye göre hızlıca bulun.
            </p>
          </div>
          <Link
            to="/categories"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-purple-700 transition-colors shrink-0"
          >
            Tümünü gör
            <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-gray-100 overflow-hidden animate-pulse">
                <div className="h-28 sm:h-32 bg-gray-100" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-100 rounded w-3/4" />
                  <div className="h-3 bg-gray-50 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-12 text-gray-500 text-sm">Kategori bulunamadı.</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Categories;
