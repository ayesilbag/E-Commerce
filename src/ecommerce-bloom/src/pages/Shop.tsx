import { useState, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import usePageTitle from "@/hooks/usePageTitle";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import {
  ChevronDown,
  ChevronUp,
  Filter,
  Grid3X3,
  GridIcon,
  Search,
  SlidersHorizontal,
  Star,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { getProducts, ProductsFilterParams } from "@/services/products.service";
import { getCategories } from "@/services/categories.service";
import type { Category, Product } from "@/types";
import { toast } from "sonner";

// Define price range type
interface PriceRange {
  min: number;
  max: number | null;
  label: string;
}

const VALID_SORTS = ["featured", "price-low", "price-high", "newest", "rating", "discounted"];

const Shop = () => {
  usePageTitle("Mağaza");
  const [searchParams] = useSearchParams();

  // URL parametrelerinden başlangıç değerlerini oku
  const initialSearch = searchParams.get('search') || "";
  const initialSort = VALID_SORTS.includes(searchParams.get('sort') || "")
    ? searchParams.get('sort')!
    : "featured";

  // State management
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedFits, setSelectedFits] = useState<string[]>([]);
  const [selectedSleeveTypes, setSelectedSleeveTypes] = useState<string[]>([]);
  const [selectedNeckTypes, setSelectedNeckTypes] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedSeasons, setSelectedSeasons] = useState<string[]>([]);
  const [expandedSections, setExpandedSections] = useState<string[]>(['Kategori Ara']);
  const [sortBy, setSortBy] = useState(initialSort);
  const [gridView, setGridView] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [apiCategories, setApiCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);

  // Sayfa numarasını ref ile tut — closure tuzağını önler
  const pageRef = useRef(1);
  const isFetchingRef = useRef(false);

  const buildParams = (pageNum: number): ProductsFilterParams => {
    const priceRangesList: PriceRange[] = [
      { min: 0, max: 300, label: "₺300 Altı" },
      { min: 300, max: 600, label: "₺300 - ₺600" },
      { min: 600, max: 1000, label: "₺600 - ₺1000" },
      { min: 1000, max: null, label: "₺1000 Üzeri" },
    ];
    return {
      page: pageNum,
      limit: 8,
      search: searchQuery || undefined,
      category: selectedCategories[0] || undefined,
      minPrice: selectedPriceRanges.length > 0
        ? Math.min(...selectedPriceRanges.map(r => priceRangesList.find(p => p.label === r)?.min ?? 0))
        : undefined,
      maxPrice: selectedPriceRanges.length > 0 && !selectedPriceRanges.some(r => priceRangesList.find(p => p.label === r)?.max === null)
        ? Math.max(...selectedPriceRanges.map(r => priceRangesList.find(p => p.label === r)?.max ?? 0))
        : undefined,
      minRating: selectedRatings.length > 0 ? Math.min(...selectedRatings) : undefined,
      color: selectedColors[0] || undefined,
      size: selectedSizes[0] || undefined,
      sort: sortBy,
    };
  };

  // Filtrelerin herhangi biri değiştiğinde sıfırdan yükle
  useEffect(() => {
    const load = async () => {
      if (isFetchingRef.current) return;
      isFetchingRef.current = true;
      setIsLoading(true);
      pageRef.current = 1;
      try {
        const response = await getProducts(buildParams(1));
        setAllProducts(response.items);
        setTotalProducts(response.total);
        setHasMore(response.items.length >= 8 && 8 < response.total);
        pageRef.current = 1;
      } catch {
        toast.error("Ürünler yüklenirken hata oluştu");
        setAllProducts([]);
        setHasMore(false);
      } finally {
        setIsLoading(false);
        isFetchingRef.current = false;
      }
    };
    load();
  }, [searchQuery, selectedCategories.join(","), selectedPriceRanges.join(","),
      selectedRatings.join(","), selectedColors.join(","), selectedSizes.join(","), sortBy]);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategoriesData = async () => {
      try {
        const data = await getCategories();
        setApiCategories(data);
      } catch {
        toast.error("Kategoriler yüklenirken hata oluştu");
      }
    };
    fetchCategoriesData();
  }, []);

  // Infinite scroll — bir sonraki sayfayı yükle
  useEffect(() => {
    const observer = new IntersectionObserver(
      async (entries) => {
        if (!entries[0].isIntersecting || !hasMore || isLoading || isFetchingRef.current) return;
        isFetchingRef.current = true;
        const nextPage = pageRef.current + 1;
        setIsLoading(true);
        try {
          const response = await getProducts(buildParams(nextPage));
          if (response.items.length > 0) {
            setAllProducts(prev => [...prev, ...response.items]);
            pageRef.current = nextPage;
          }
          setTotalProducts(response.total);
          setHasMore(response.items.length >= 8 && (nextPage * 8) < response.total);
        } catch {
          setHasMore(false);
        } finally {
          setIsLoading(false);
          isFetchingRef.current = false;
        }
      },
      { threshold: 0.1 }
    );

    const target = observerTarget.current;
    if (target) observer.observe(target);
    return () => { if (target) observer.unobserve(target); };
  }, [hasMore, isLoading, searchQuery, selectedCategories, selectedPriceRanges,
      selectedRatings, selectedColors, selectedSizes, sortBy]);

  // Filter options
  const priceRanges: PriceRange[] = [
    { min: 0, max: 300, label: "₺300 Altı" },
    { min: 300, max: 600, label: "₺300 - ₺600" },
    { min: 600, max: 1000, label: "₺600 - ₺1000" },
    { min: 1000, max: null, label: "₺1000 Üzeri" }
  ];

  const genderOptions = ["Kadın", "Erkek", "Unisex", "Çocuk"];
  const sizeOptions = ["XS", "S", "M", "L", "XL", "2XL"];
  const colorOptions = ["Siyah", "Beyaz", "Kırmızı", "Mavi", "Yeşil", "Sarı", "Gri", "Mor"];
  const fitOptions = ["Normal", "Oversize", "Slim Fit", "Relaxed"];
  const sleeveTypeOptions = ["Kısa Kol", "Uzun Kol", "Kolsuz"];
  const neckTypeOptions = ["Bisiklet Yaka", "V Yaka", "Polo", "Turtleneck"];
  const materialOptions = ["Pamuk", "Polyester", "Elastin", "Viskon", "Keten"];
  const seasonOptions = ["Yaz", "Kış", "Bahar", "Sonbahar"];

  const sortOptions = [
    { value: "featured", label: "Öne Çıkanlar" },
    { value: "price-low", label: "Fiyat: Düşükten Yükseğe" },
    { value: "price-high", label: "Fiyat: Yüksekten Düşüğe" },
    { value: "newest", label: "En Yeniler" },
    { value: "rating", label: "En Yüksek Puanlı" },
    { value: "discounted", label: "İndirimli Ürünler" },
  ];

  // Toggle filter section expansion
  const toggleSection = (section: string) => {
    if (expandedSections.includes(section)) {
      setExpandedSections(expandedSections.filter(s => s !== section));
    } else {
      setExpandedSections([...expandedSections, section]);
    }
  };

  const displayedProducts = allProducts;
  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
    setDisplayedCount(8);
  };
  
  // Handle gender toggle
  const toggleGender = (gender: string) => {
    if (selectedGenders.includes(gender)) {
      setSelectedGenders(selectedGenders.filter(g => g !== gender));
    } else {
      setSelectedGenders([...selectedGenders, gender]);
    }
    setDisplayedCount(8);
  };

  // Handle size toggle
  const toggleSize = (size: string) => {
    if (selectedSizes.includes(size)) {
      setSelectedSizes(selectedSizes.filter(s => s !== size));
    } else {
      setSelectedSizes([...selectedSizes, size]);
    }
    setDisplayedCount(8);
  };

  // Handle color toggle
  const toggleColor = (color: string) => {
    if (selectedColors.includes(color)) {
      setSelectedColors(selectedColors.filter(c => c !== color));
    } else {
      setSelectedColors([...selectedColors, color]);
    }
    setDisplayedCount(8);
  };

  // Handle fit toggle
  const toggleFit = (fit: string) => {
    if (selectedFits.includes(fit)) {
      setSelectedFits(selectedFits.filter(f => f !== fit));
    } else {
      setSelectedFits([...selectedFits, fit]);
    }
    setDisplayedCount(8);
  };

  // Handle sleeve type toggle
  const toggleSleeveType = (sleeveType: string) => {
    if (selectedSleeveTypes.includes(sleeveType)) {
      setSelectedSleeveTypes(selectedSleeveTypes.filter(s => s !== sleeveType));
    } else {
      setSelectedSleeveTypes([...selectedSleeveTypes, sleeveType]);
    }
    setDisplayedCount(8);
  };

  // Handle neck type toggle
  const toggleNeckType = (neckType: string) => {
    if (selectedNeckTypes.includes(neckType)) {
      setSelectedNeckTypes(selectedNeckTypes.filter(n => n !== neckType));
    } else {
      setSelectedNeckTypes([...selectedNeckTypes, neckType]);
    }
    setDisplayedCount(8);
  };

  // Handle material toggle
  const toggleMaterial = (material: string) => {
    if (selectedMaterials.includes(material)) {
      setSelectedMaterials(selectedMaterials.filter(m => m !== material));
    } else {
      setSelectedMaterials([...selectedMaterials, material]);
    }
    setDisplayedCount(8);
  };

  // Handle season toggle
  const toggleSeason = (season: string) => {
    if (selectedSeasons.includes(season)) {
      setSelectedSeasons(selectedSeasons.filter(s => s !== season));
    } else {
      setSelectedSeasons([...selectedSeasons, season]);
    }
    setDisplayedCount(8);
  };
  
  // Handle price range toggle
  const togglePriceRange = (range: string) => {
    if (selectedPriceRanges.includes(range)) {
      setSelectedPriceRanges(selectedPriceRanges.filter(r => r !== range));
    } else {
      setSelectedPriceRanges([...selectedPriceRanges, range]);
    }
    setDisplayedCount(8);
  };
  
  // Handle rating toggle
  const toggleRating = (rating: number) => {
    if (selectedRatings.includes(rating)) {
      setSelectedRatings(selectedRatings.filter(r => r !== rating));
    } else {
      setSelectedRatings([...selectedRatings, rating]);
    }
    setDisplayedCount(8);
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
    setSelectedPriceRanges([]);
    setSelectedRatings([]);
    setSelectedGenders([]);
    setSelectedSizes([]);
    setSelectedColors([]);
    setSelectedFits([]);
    setSelectedSleeveTypes([]);
    setSelectedNeckTypes([]);
    setSelectedMaterials([]);
    setSelectedSeasons([]);
    setSortBy("featured");
    setDisplayedCount(8);
  };

  // Filter Group Component
  const FilterGroup = ({ 
    title, 
    items, 
    selected, 
    onToggle,
    renderItem = (item: string) => item
  }: { 
    title: string, 
    items: string[], 
    selected: string[], 
    onToggle: (item: string) => void,
    renderItem?: (item: string) => string
  }) => {
    const isExpanded = expandedSections.includes(title);
    
    return (
      <div className="border-b border-gray-200 pb-4">
        <button
          onClick={() => toggleSection(title)}
          className="w-full flex items-center justify-between py-2 hover:opacity-70"
        >
          <h3 className="font-semibold text-sm text-gray-900">{title}</h3>
          {isExpanded ? <ChevronUp size={14} className="xs:size-[18px]" /> : <ChevronDown size={14} className="xs:size-[18px]" />}
        </button>
        {isExpanded && (
          <div className="space-y-2 mt-2">
            {items.map((item) => (
              <button
                key={item}
                onClick={() => onToggle(item)}
                className={`w-full flex items-center gap-2 py-2 px-2 xs:px-3 rounded-lg cursor-pointer transition-all text-xs xs:text-sm ${
                  selected.includes(item)
                    ? 'bg-purple-50 border border-purple-200'
                    : 'hover:bg-gray-50 border border-transparent'
                }`}
              >
                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                  selected.includes(item)
                    ? 'bg-purple-600 border-purple-600'
                    : 'border-gray-300'
                }`}>
                  {selected.includes(item) && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <span className="text-xs xs:text-sm flex-grow text-left">{renderItem(item)}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Filter section component for mobile and desktop
  const FiltersSection = () => (
    <div className="space-y-2">
      {/* Kategori */}
      <FilterGroup
        title="Kategori Ara"
        items={apiCategories.map(cat => cat.name)}
        selected={selectedCategories}
        onToggle={toggleCategory}
      />

      {/* Cinsiyet */}
      <FilterGroup
        title="Cinsiyet"
        items={genderOptions}
        selected={selectedGenders}
        onToggle={toggleGender}
      />

      {/* Beden */}
      <FilterGroup
        title="Beden"
        items={sizeOptions}
        selected={selectedSizes}
        onToggle={toggleSize}
      />

      {/* Renk */}
      <FilterGroup
        title="Renk"
        items={colorOptions}
        selected={selectedColors}
        onToggle={toggleColor}
      />

      {/* Fiyat */}
      <div className="border-b border-gray-200 pb-4">
        <button
          onClick={() => toggleSection("Fiyat")}
          className="w-full flex items-center justify-between py-2 hover:opacity-70"
        >
          <h3 className="font-semibold text-sm text-gray-900">Fiyat</h3>
          {expandedSections.includes("Fiyat") ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        {expandedSections.includes("Fiyat") && (
          <div className="space-y-2 mt-2">
            {priceRanges.map((range, index) => (
              <button
                key={index}
                onClick={() => togglePriceRange(range.label)}
                className={`w-full flex items-center gap-2 py-2 px-3 rounded-lg cursor-pointer transition-all ${
                  selectedPriceRanges.includes(range.label)
                    ? 'bg-purple-50 border border-purple-200'
                    : 'hover:bg-gray-50 border border-transparent'
                }`}
              >
                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                  selectedPriceRanges.includes(range.label)
                    ? 'bg-purple-600 border-purple-600'
                    : 'border-gray-300'
                }`}>
                  {selectedPriceRanges.includes(range.label) && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <span className="text-sm">{range.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Kalıp */}
      <FilterGroup
        title="Kalıp"
        items={fitOptions}
        selected={selectedFits}
        onToggle={toggleFit}
      />

      {/* Kol Tipi */}
      <FilterGroup
        title="Kol Tipi"
        items={sleeveTypeOptions}
        selected={selectedSleeveTypes}
        onToggle={toggleSleeveType}
      />

      {/* Yaka Tipi */}
      <FilterGroup
        title="Yaka Tipi"
        items={neckTypeOptions}
        selected={selectedNeckTypes}
        onToggle={toggleNeckType}
      />

      {/* Materyal */}
      <FilterGroup
        title="Materyal"
        items={materialOptions}
        selected={selectedMaterials}
        onToggle={toggleMaterial}
      />

      {/* Sezon */}
      <FilterGroup
        title="Sezon"
        items={seasonOptions}
        selected={selectedSeasons}
        onToggle={toggleSeason}
      />

      {/* Desen */}
      <FilterGroup
        title="Desen"
        items={["Düz", "Çizgili", "Kareli", "Desenli"]}
        selected={[]}
        onToggle={() => {}}
      />

      {/* Kalite */}
      <FilterGroup
        title="Kalite"
        items={["Premium %100 Pamuk", "Nefes Alan", "Su İtici", "Çevre Dostu"]}
        selected={[]}
        onToggle={() => {}}
      />

      {/* Clear Filters Button */}
      {(selectedCategories.length > 0 || selectedPriceRanges.length > 0 || selectedRatings.length > 0 || 
        selectedGenders.length > 0 || selectedSizes.length > 0 || selectedColors.length > 0 ||
        selectedFits.length > 0 || selectedSleeveTypes.length > 0 || selectedNeckTypes.length > 0 ||
        selectedMaterials.length > 0 || selectedSeasons.length > 0) && (
        <Button
          variant="outline"
          className="w-full mt-4 border-purple-200 text-purple-600 hover:bg-purple-50 hover:text-purple-700"
          onClick={clearFilters}
        >
          <X size={16} className="mr-2" />
          Filtreleri Temizle
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Filters and Products Section */}
        <section className="py-4 xs:py-5 sm:py-6 md:py-8 lg:py-12">
          <div className="container-custom px-2 xs:px-4 sm:px-6">
            <div className="grid md:grid-cols-12 gap-2 xs:gap-3 sm:gap-3 md:gap-4 lg:gap-6">
              {/* Sidebar Filters - Desktop */}
              <div className="hidden md:flex md:col-span-3 lg:col-span-2">
                <div className="w-full">
                  <div className="bg-white rounded-xl border border-gray-200 p-2 xs:p-3 sm:p-4 md:p-4 lg:p-5 sticky top-16 md:top-20 lg:top-24 shadow-sm">
                    <div className="flex justify-between items-center mb-2 xs:mb-3 sm:mb-3 md:mb-4 lg:mb-5 pb-2 md:pb-3 lg:pb-4 border-b border-gray-100">
                      <h2 className="font-semibold text-sm text-gray-900">Filtreler</h2>
                      {(selectedCategories.length > 0 || selectedPriceRanges.length > 0 || selectedRatings.length > 0) && (
                        <button
                          onClick={clearFilters}
                          className="text-xs md:text-sm text-purple-600 hover:text-purple-700 font-medium"
                        >
                          Temizle
                        </button>
                      )}
                    </div>
                    <FiltersSection />
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="md:col-span-9 lg:col-span-10">
                {/* Top Bar */}
                <div className="flex flex-col xs:flex-col sm:flex-row items-start sm:items-center justify-between gap-2 xs:gap-3 sm:gap-3 md:gap-4 mb-4 xs:mb-5 md:mb-6">
                  <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-3 w-full sm:w-auto">
                    {/* Mobile Filter Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      className="md:hidden text-xs xs:text-sm"
                      onClick={() => setShowFilters(!showFilters)}
                    >
                      <SlidersHorizontal size={12} className="xs:size-[14px] mr-1" />
                      <span className="text-xs xs:text-sm">Filtreler</span>
                    </Button>

                    {/* Active Filters Tags */}
                    <div className="flex flex-wrap gap-1 xs:gap-1.5 sm:gap-2">
                      {selectedCategories.map(cat => (
                        <span
                          key={cat}
                          className="inline-flex items-center gap-0.5 xs:gap-1 px-1.5 xs:px-2 sm:px-3 py-0.5 xs:py-1 bg-purple-100 text-purple-700 rounded-full text-xs"
                        >
                          {cat}
                          <button
                            onClick={() => toggleCategory(cat)}
                            className="hover:text-purple-900"
                          >
                            <X size={10} className="xs:size-[12px]" />
                          </button>
                        </span>
                      ))}
                      {selectedPriceRanges.map(range => (
                        <span
                          key={range}
                          className="inline-flex items-center gap-0.5 xs:gap-1 px-1.5 xs:px-2 sm:px-3 py-0.5 xs:py-1 bg-purple-100 text-purple-700 rounded-full text-xs"
                        >
                          {range}
                          <button
                            onClick={() => togglePriceRange(range)}
                            className="hover:text-purple-900"
                          >
                            <X size={10} className="xs:size-[12px]" />
                          </button>
                        </span>
                      ))}
                      {selectedRatings.map(rating => (
                        <span
                          key={rating}
                          className="inline-flex items-center gap-0.5 xs:gap-1 px-1.5 xs:px-2 sm:px-3 py-0.5 xs:py-1 bg-purple-100 text-purple-700 rounded-full text-xs"
                        >
                          {rating}+ Yıldız
                          <button
                            onClick={() => toggleRating(rating)}
                            className="hover:text-purple-900"
                          >
                            <X size={10} className="xs:size-[12px]" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 xs:gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    {/* Sort Dropdown */}
                    <div className="flex items-center gap-1 xs:gap-2">
                      <span className="text-xs text-gray-600 hidden xs:inline">Sırala:</span>
                      <select
                        value={sortBy}
                        onChange={(e) => {
                          setSortBy(e.target.value);
                          setDisplayedCount(8);
                        }}
                        className="px-1.5 xs:px-2 sm:px-3 py-1 xs:py-1.5 md:py-2 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        {sortOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Grid View Toggle */}
                    <div className="flex items-center border border-gray-200 rounded-lg p-0.5 xs:p-1">
                      <Button
                        variant={gridView ? "default" : "ghost"}
                        size="icon"
                        className={`h-6 w-6 xs:h-7 xs:w-7 md:h-8 md:w-8 text-xs xs:text-sm ${gridView ? 'bg-purple-600 text-white' : 'hover:bg-gray-100'}`}
                        onClick={() => setGridView(true)}
                      >
                        <Grid3X3 size={12} className="xs:size-[14px]" />
                      </Button>
                      <Button
                        variant={!gridView ? "default" : "ghost"}
                        size="icon"
                        className={`h-6 w-6 xs:h-7 xs:w-7 md:h-8 md:w-8 text-xs xs:text-sm ${!gridView ? 'bg-purple-600 text-white' : 'hover:bg-gray-100'}`}
                        onClick={() => setGridView(false)}
                      >
                        <GridIcon size={12} className="xs:size-[14px]" />
                      </Button>
                    </div>
                  </div>

                  {/* Results Count */}
                  <div className="text-xs text-gray-600 sm:hidden">
                    {totalProducts > 0 ? totalProducts : allProducts.length} ürün
                  </div>
                </div>

                {/* Mobile Filters - Drawer */}
                {showFilters && (
                  <div className="md:hidden mb-4 xs:mb-5 md:mb-6 p-3 xs:p-4 sm:p-4 md:p-5 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-center mb-3 xs:mb-4 sm:mb-4 md:mb-5 pb-2 md:pb-3 lg:pb-4 border-b border-gray-100">
                      <h3 className="font-semibold text-sm text-gray-900">Filtreler</h3>
                      <button onClick={() => setShowFilters(false)} className="text-gray-500 hover:text-gray-700">
                        <X size={16} className="xs:size-[18px]" />
                      </button>
                    </div>
                    <FiltersSection />
                  </div>
                )}

                {/* Products Grid */}
                {isLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                  </div>
                ) : displayedProducts.length > 0 ? (
                  <div className={`grid gap-3 xs:gap-4 sm:gap-4 md:gap-6 lg:gap-6 ${gridView ? 'grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5' : 'grid-cols-1'}`}>
                    {displayedProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 xs:py-8 sm:py-12 md:py-12">
                    <p className="text-gray-500 text-sm">Filtrelerinize uygun ürün bulunamadı.</p>
                  </div>
                )}

                {/* Infinite scroll trigger */}
                {hasMore && displayedProducts.length > 0 && (
                  <div ref={observerTarget} className="flex justify-center py-4 xs:py-6 md:py-8">
                    <div className="animate-spin rounded-full h-6 w-6 xs:h-7 xs:w-7 md:h-8 md:w-8 border-b-2 border-purple-600"></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Shop;