import { useState, useEffect, useRef, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import {
  ChevronDown,
  ChevronUp,
  Grid3X3,
  GridIcon,
  SlidersHorizontal,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getProducts, ProductsFilterParams } from "@/services/products.service";
import { getCategories } from "@/services/categories.service";
import type { Category, Product } from "@/types";
import { toast } from "sonner";
import { uiLabel, useAppPagesUi } from "@/hooks/useAppPagesUi";
import type { LabeledOption } from "@/types/app-pages-ui";

interface PriceRange {
  min: number;
  max: number | null;
  value: string;
  label: string;
}

function parsePriceRangeValue(value: string): { min: number; max: number | null } {
  const trimmed = value.trim();
  if (trimmed.endsWith('+')) {
    const min = Number(trimmed.slice(0, -1));
    return { min: Number.isFinite(min) ? min : 0, max: null };
  }
  const parts = trimmed.split('-').map(Number);
  if (parts.length >= 2 && Number.isFinite(parts[0])) {
    return { min: parts[0], max: Number.isFinite(parts[1]) ? parts[1] : null };
  }
  return { min: 0, max: null };
}

function buildPriceRanges(options: LabeledOption[] | undefined): PriceRange[] {
  return (options ?? [])
    .filter((o) => o.value && uiLabel(o.label))
    .map((o) => {
      const { min, max } = parsePriceRangeValue(o.value);
      return { min, max, value: o.value, label: o.label };
    });
}

const Shop = () => {
  const shop = useAppPagesUi()?.shop;
  const [searchParams] = useSearchParams();

  const sortOptions = useMemo(
    () => (shop?.sortOptions ?? []).filter((o) => o.value && uiLabel(o.label)),
    [shop?.sortOptions]
  );
  const validSorts = useMemo(() => sortOptions.map((o) => o.value), [sortOptions]);
  const defaultSort = validSorts.includes("featured")
    ? "featured"
    : validSorts[0] ?? "featured";

  const initialSearch = searchParams.get('search') || "";
  const urlSort = searchParams.get('sort') || "";
  const initialSort = validSorts.includes(urlSort) ? urlSort : defaultSort;

  const genderOptions = shop?.genderOptions?.filter((o) => o?.trim()) ?? [];
  const sizeOptions = shop?.sizeOptions?.filter((o) => o?.trim()) ?? [];
  const colorOptions = shop?.colorOptions?.filter((o) => o?.trim()) ?? [];
  const fitOptions = shop?.fitOptions?.filter((o) => o?.trim()) ?? [];
  const sleeveTypeOptions = shop?.sleeveOptions?.filter((o) => o?.trim()) ?? [];
  const neckTypeOptions = shop?.neckOptions?.filter((o) => o?.trim()) ?? [];
  const materialOptions = shop?.materialOptions?.filter((o) => o?.trim()) ?? [];
  const seasonOptions = shop?.seasonOptions?.filter((o) => o?.trim()) ?? [];
  const patternOptions = shop?.patternOptions?.filter((o) => o?.trim()) ?? [];
  const qualityOptions = shop?.qualityOptions?.filter((o) => o?.trim()) ?? [];
  const priceRanges = useMemo(() => buildPriceRanges(shop?.priceRangeOptions), [shop?.priceRangeOptions]);

  const filterCategoryTitle = uiLabel(shop?.filterCategoryTitle);
  const initialExpanded = filterCategoryTitle ? [filterCategoryTitle] : [];

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
  const [expandedSections, setExpandedSections] = useState<string[]>(initialExpanded);
  const [sortBy, setSortBy] = useState(initialSort);
  const [gridView, setGridView] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [apiCategories, setApiCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);

  const pageRef = useRef(1);
  const isFetchingRef = useRef(false);

  const buildParams = (pageNum: number): ProductsFilterParams => ({
    page: pageNum,
    limit: 8,
    search: searchQuery || undefined,
    category: selectedCategories[0] || undefined,
    minPrice: selectedPriceRanges.length > 0
      ? Math.min(...selectedPriceRanges.map((r) => priceRanges.find((p) => p.value === r)?.min ?? 0))
      : undefined,
    maxPrice: selectedPriceRanges.length > 0 && !selectedPriceRanges.some((r) => priceRanges.find((p) => p.value === r)?.max === null)
      ? Math.max(...selectedPriceRanges.map((r) => priceRanges.find((p) => p.value === r)?.max ?? 0))
      : undefined,
    minRating: selectedRatings.length > 0 ? Math.min(...selectedRatings) : undefined,
    color: selectedColors[0] || undefined,
    size: selectedSizes[0] || undefined,
    sort: sortBy,
  });

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
        if (uiLabel(shop?.productsLoadError)) {
          toast.error(shop!.productsLoadError!);
        }
        setAllProducts([]);
        setHasMore(false);
      } finally {
        setIsLoading(false);
        isFetchingRef.current = false;
      }
    };
    load();
  }, [searchQuery, selectedCategories.join(","), selectedPriceRanges.join(","),
      selectedRatings.join(","), selectedColors.join(","), selectedSizes.join(","), sortBy, priceRanges]);

  useEffect(() => {
    const fetchCategoriesData = async () => {
      try {
        const data = await getCategories();
        setApiCategories(data);
      } catch {
        if (uiLabel(shop?.categoriesLoadError)) {
          toast.error(shop!.categoriesLoadError!);
        }
      }
    };
    fetchCategoriesData();
  }, [shop?.categoriesLoadError]);

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
            setAllProducts((prev) => [...prev, ...response.items]);
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
      selectedRatings, selectedColors, selectedSizes, sortBy, priceRanges]);

  const toggleSection = (section: string) => {
    if (expandedSections.includes(section)) {
      setExpandedSections(expandedSections.filter((s) => s !== section));
    } else {
      setExpandedSections([...expandedSections, section]);
    }
  };

  const displayedProducts = allProducts;

  const toggleCategory = (category: string) => {
    setSelectedCategories(
      selectedCategories.includes(category)
        ? selectedCategories.filter((c) => c !== category)
        : [...selectedCategories, category]
    );
  };

  const toggleGender = (gender: string) => {
    setSelectedGenders(
      selectedGenders.includes(gender)
        ? selectedGenders.filter((g) => g !== gender)
        : [...selectedGenders, gender]
    );
  };

  const toggleSize = (size: string) => {
    setSelectedSizes(
      selectedSizes.includes(size)
        ? selectedSizes.filter((s) => s !== size)
        : [...selectedSizes, size]
    );
  };

  const toggleColor = (color: string) => {
    setSelectedColors(
      selectedColors.includes(color)
        ? selectedColors.filter((c) => c !== color)
        : [...selectedColors, color]
    );
  };

  const toggleFit = (fit: string) => {
    setSelectedFits(
      selectedFits.includes(fit)
        ? selectedFits.filter((f) => f !== fit)
        : [...selectedFits, fit]
    );
  };

  const toggleSleeveType = (sleeveType: string) => {
    setSelectedSleeveTypes(
      selectedSleeveTypes.includes(sleeveType)
        ? selectedSleeveTypes.filter((s) => s !== sleeveType)
        : [...selectedSleeveTypes, sleeveType]
    );
  };

  const toggleNeckType = (neckType: string) => {
    setSelectedNeckTypes(
      selectedNeckTypes.includes(neckType)
        ? selectedNeckTypes.filter((n) => n !== neckType)
        : [...selectedNeckTypes, neckType]
    );
  };

  const toggleMaterial = (material: string) => {
    setSelectedMaterials(
      selectedMaterials.includes(material)
        ? selectedMaterials.filter((m) => m !== material)
        : [...selectedMaterials, material]
    );
  };

  const toggleSeason = (season: string) => {
    setSelectedSeasons(
      selectedSeasons.includes(season)
        ? selectedSeasons.filter((s) => s !== season)
        : [...selectedSeasons, season]
    );
  };

  const togglePriceRange = (value: string) => {
    setSelectedPriceRanges(
      selectedPriceRanges.includes(value)
        ? selectedPriceRanges.filter((r) => r !== value)
        : [...selectedPriceRanges, value]
    );
  };

  const toggleRating = (rating: number) => {
    setSelectedRatings(
      selectedRatings.includes(rating)
        ? selectedRatings.filter((r) => r !== rating)
        : [...selectedRatings, rating]
    );
  };

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
    setSortBy(defaultSort);
  };

  const hasActiveFilters =
    selectedCategories.length > 0 || selectedPriceRanges.length > 0 || selectedRatings.length > 0 ||
    selectedGenders.length > 0 || selectedSizes.length > 0 || selectedColors.length > 0 ||
    selectedFits.length > 0 || selectedSleeveTypes.length > 0 || selectedNeckTypes.length > 0 ||
    selectedMaterials.length > 0 || selectedSeasons.length > 0;

  const filtersButtonLabel = uiLabel(shop?.filtersButtonLabel);
  const clearFiltersLabel = uiLabel(shop?.clearFiltersLabel);
  const sortLabel = uiLabel(shop?.sortLabel);
  const resultsLabel = uiLabel(shop?.resultsLabel);
  const filterPriceTitle = uiLabel(shop?.filterPriceTitle);

  const FilterGroup = ({
    title,
    items,
    selected,
    onToggle,
    renderItem = (item: string) => item,
  }: {
    title: string;
    items: string[];
    selected: string[];
    onToggle: (item: string) => void;
    renderItem?: (item: string) => string;
  }) => {
    const isExpanded = expandedSections.includes(title);

    return (
      <div className="border-b border-border pb-4">
        <button
          onClick={() => toggleSection(title)}
          className="w-full flex items-center justify-between py-2 hover:opacity-70"
        >
          <h3 className="font-semibold text-sm text-foreground">{title}</h3>
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
                    ? 'bg-primary/10 border border-primary/30'
                    : 'hover:bg-muted/50 border border-transparent'
                }`}
              >
                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                  selected.includes(item)
                    ? 'bg-primary border-primary'
                    : 'border-border'
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

  const FiltersSection = () => (
    <div className="space-y-2">
      {filterCategoryTitle && apiCategories.length > 0 && (
        <FilterGroup
          title={filterCategoryTitle}
          items={apiCategories.map((cat) => cat.name)}
          selected={selectedCategories}
          onToggle={toggleCategory}
        />
      )}

      {uiLabel(shop?.filterGenderTitle) && genderOptions.length > 0 && (
        <FilterGroup
          title={shop!.filterGenderTitle!}
          items={genderOptions}
          selected={selectedGenders}
          onToggle={toggleGender}
        />
      )}

      {uiLabel(shop?.filterSizeTitle) && sizeOptions.length > 0 && (
        <FilterGroup
          title={shop!.filterSizeTitle!}
          items={sizeOptions}
          selected={selectedSizes}
          onToggle={toggleSize}
        />
      )}

      {uiLabel(shop?.filterColorTitle) && colorOptions.length > 0 && (
        <FilterGroup
          title={shop!.filterColorTitle!}
          items={colorOptions}
          selected={selectedColors}
          onToggle={toggleColor}
        />
      )}

      {filterPriceTitle && priceRanges.length > 0 && (
        <div className="border-b border-border pb-4">
          <button
            onClick={() => toggleSection(filterPriceTitle)}
            className="w-full flex items-center justify-between py-2 hover:opacity-70"
          >
            <h3 className="font-semibold text-sm text-foreground">{filterPriceTitle}</h3>
            {expandedSections.includes(filterPriceTitle) ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          {expandedSections.includes(filterPriceTitle) && (
            <div className="space-y-2 mt-2">
              {priceRanges.map((range) => (
                <button
                  key={range.value}
                  onClick={() => togglePriceRange(range.value)}
                  className={`w-full flex items-center gap-2 py-2 px-3 rounded-lg cursor-pointer transition-all ${
                    selectedPriceRanges.includes(range.value)
                      ? 'bg-primary/10 border border-primary/30'
                      : 'hover:bg-muted/50 border border-transparent'
                  }`}
                >
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                    selectedPriceRanges.includes(range.value)
                      ? 'bg-primary border-primary'
                      : 'border-border'
                  }`}>
                    {selectedPriceRanges.includes(range.value) && (
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
      )}

      {uiLabel(shop?.filterFitTitle) && fitOptions.length > 0 && (
        <FilterGroup
          title={shop!.filterFitTitle!}
          items={fitOptions}
          selected={selectedFits}
          onToggle={toggleFit}
        />
      )}

      {uiLabel(shop?.filterSleeveTitle) && sleeveTypeOptions.length > 0 && (
        <FilterGroup
          title={shop!.filterSleeveTitle!}
          items={sleeveTypeOptions}
          selected={selectedSleeveTypes}
          onToggle={toggleSleeveType}
        />
      )}

      {uiLabel(shop?.filterNeckTitle) && neckTypeOptions.length > 0 && (
        <FilterGroup
          title={shop!.filterNeckTitle!}
          items={neckTypeOptions}
          selected={selectedNeckTypes}
          onToggle={toggleNeckType}
        />
      )}

      {uiLabel(shop?.filterMaterialTitle) && materialOptions.length > 0 && (
        <FilterGroup
          title={shop!.filterMaterialTitle!}
          items={materialOptions}
          selected={selectedMaterials}
          onToggle={toggleMaterial}
        />
      )}

      {uiLabel(shop?.filterSeasonTitle) && seasonOptions.length > 0 && (
        <FilterGroup
          title={shop!.filterSeasonTitle!}
          items={seasonOptions}
          selected={selectedSeasons}
          onToggle={toggleSeason}
        />
      )}

      {uiLabel(shop?.filterPatternTitle) && patternOptions.length > 0 && (
        <FilterGroup
          title={shop!.filterPatternTitle!}
          items={patternOptions}
          selected={[]}
          onToggle={() => {}}
        />
      )}

      {uiLabel(shop?.filterQualityTitle) && qualityOptions.length > 0 && (
        <FilterGroup
          title={shop!.filterQualityTitle!}
          items={qualityOptions}
          selected={[]}
          onToggle={() => {}}
        />
      )}

      {hasActiveFilters && clearFiltersLabel && (
        <Button
          variant="outline"
          className="w-full mt-4 border-primary/30 text-primary hover:bg-primary/10 hover:text-primary/80"
          onClick={clearFilters}
        >
          <X size={16} className="mr-2" />
          {clearFiltersLabel}
        </Button>
      )}
    </div>
  );

  const getPriceRangeLabel = (value: string) =>
    priceRanges.find((r) => r.value === value)?.label ?? value;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="py-4 xs:py-5 sm:py-6 md:py-8 lg:py-12">
          <div className="container-custom px-2 xs:px-4 sm:px-6">
            <div className="grid md:grid-cols-12 gap-2 xs:gap-3 sm:gap-3 md:gap-4 lg:gap-6">
              <div className="hidden md:flex md:col-span-3 lg:col-span-2">
                <div className="w-full">
                  <div className="bg-card rounded-xl border border-border p-2 xs:p-3 sm:p-4 md:p-4 lg:p-5 sticky top-16 md:top-20 lg:top-24 shadow-sm">
                    {(filtersButtonLabel || (hasActiveFilters && clearFiltersLabel)) && (
                      <div className="flex justify-between items-center mb-2 xs:mb-3 sm:mb-3 md:mb-4 lg:mb-5 pb-2 md:pb-3 lg:pb-4 border-b border-border">
                        {filtersButtonLabel && (
                          <h2 className="font-semibold text-sm text-foreground">{filtersButtonLabel}</h2>
                        )}
                        {hasActiveFilters && clearFiltersLabel && (
                          <button
                            onClick={clearFilters}
                            className="text-xs md:text-sm text-primary hover:text-primary/80 font-medium"
                          >
                            {clearFiltersLabel}
                          </button>
                        )}
                      </div>
                    )}
                    <FiltersSection />
                  </div>
                </div>
              </div>

              <div className="md:col-span-9 lg:col-span-10">
                <div className="flex flex-col xs:flex-col sm:flex-row items-start sm:items-center justify-between gap-2 xs:gap-3 sm:gap-3 md:gap-4 mb-4 xs:mb-5 md:mb-6">
                  <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-3 w-full sm:w-auto">
                    {filtersButtonLabel && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="md:hidden text-xs xs:text-sm"
                        onClick={() => setShowFilters(!showFilters)}
                      >
                        <SlidersHorizontal size={12} className="xs:size-[14px] mr-1" />
                        <span className="text-xs xs:text-sm">{filtersButtonLabel}</span>
                      </Button>
                    )}

                    <div className="flex flex-wrap gap-1 xs:gap-1.5 sm:gap-2">
                      {selectedCategories.map((cat) => (
                        <span
                          key={cat}
                          className="inline-flex items-center gap-0.5 xs:gap-1 px-1.5 xs:px-2 sm:px-3 py-0.5 xs:py-1 bg-primary/15 text-primary rounded-full text-xs"
                        >
                          {cat}
                          <button
                            onClick={() => toggleCategory(cat)}
                            className="hover:text-primary/90"
                          >
                            <X size={10} className="xs:size-[12px]" />
                          </button>
                        </span>
                      ))}
                      {selectedPriceRanges.map((range) => (
                        <span
                          key={range}
                          className="inline-flex items-center gap-0.5 xs:gap-1 px-1.5 xs:px-2 sm:px-3 py-0.5 xs:py-1 bg-primary/15 text-primary rounded-full text-xs"
                        >
                          {getPriceRangeLabel(range)}
                          <button
                            onClick={() => togglePriceRange(range)}
                            className="hover:text-primary/90"
                          >
                            <X size={10} className="xs:size-[12px]" />
                          </button>
                        </span>
                      ))}
                      {selectedRatings.map((rating) => (
                        <span
                          key={rating}
                          className="inline-flex items-center gap-0.5 xs:gap-1 px-1.5 xs:px-2 sm:px-3 py-0.5 xs:py-1 bg-primary/15 text-primary rounded-full text-xs"
                        >
                          {rating}+
                          <button
                            onClick={() => toggleRating(rating)}
                            className="hover:text-primary/90"
                          >
                            <X size={10} className="xs:size-[12px]" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 xs:gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    {sortOptions.length > 0 && (
                      <div className="flex items-center gap-1 xs:gap-2">
                        {sortLabel && (
                          <span className="text-xs text-muted-foreground hidden xs:inline">{sortLabel}</span>
                        )}
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          className="px-1.5 xs:px-2 sm:px-3 py-1 xs:py-1.5 md:py-2 border border-border rounded-lg text-xs bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                          {sortOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div className="flex items-center border border-border rounded-lg p-0.5 xs:p-1">
                      <Button
                        variant={gridView ? "default" : "ghost"}
                        size="icon"
                        className={`h-6 w-6 xs:h-7 xs:w-7 md:h-8 md:w-8 text-xs xs:text-sm ${gridView ? 'bg-primary text-white' : 'hover:bg-muted'}`}
                        onClick={() => setGridView(true)}
                      >
                        <Grid3X3 size={12} className="xs:size-[14px]" />
                      </Button>
                      <Button
                        variant={!gridView ? "default" : "ghost"}
                        size="icon"
                        className={`h-6 w-6 xs:h-7 xs:w-7 md:h-8 md:w-8 text-xs xs:text-sm ${!gridView ? 'bg-primary text-white' : 'hover:bg-muted'}`}
                        onClick={() => setGridView(false)}
                      >
                        <GridIcon size={12} className="xs:size-[14px]" />
                      </Button>
                    </div>
                  </div>

                  {resultsLabel && (
                    <div className="text-xs text-muted-foreground sm:hidden">
                      {totalProducts > 0 ? totalProducts : allProducts.length} {resultsLabel}
                    </div>
                  )}
                </div>

                {showFilters && (
                  <div className="md:hidden mb-4 xs:mb-5 md:mb-6 p-3 xs:p-4 sm:p-4 md:p-5 bg-card rounded-xl border border-border shadow-sm">
                    {(filtersButtonLabel || clearFiltersLabel) && (
                      <div className="flex justify-between items-center mb-3 xs:mb-4 sm:mb-4 md:mb-5 pb-2 md:pb-3 lg:pb-4 border-b border-border">
                        {filtersButtonLabel && (
                          <h3 className="font-semibold text-sm text-foreground">{filtersButtonLabel}</h3>
                        )}
                        <button onClick={() => setShowFilters(false)} className="text-muted-foreground hover:text-foreground">
                          <X size={16} className="xs:size-[18px]" />
                        </button>
                      </div>
                    )}
                    <FiltersSection />
                  </div>
                )}

                {isLoading && displayedProducts.length === 0 ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                  </div>
                ) : displayedProducts.length > 0 ? (
                  <div className={`grid gap-3 xs:gap-4 sm:gap-4 md:gap-6 lg:gap-6 ${gridView ? 'grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5' : 'grid-cols-1'}`}>
                    {displayedProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 xs:py-8 sm:py-12 md:py-12">
                    {uiLabel(shop?.emptyDescription) && (
                      <p className="text-muted-foreground text-sm">{shop!.emptyDescription}</p>
                    )}
                    {uiLabel(shop?.emptyTitle) && !uiLabel(shop?.emptyDescription) && (
                      <p className="text-muted-foreground text-sm">{shop!.emptyTitle}</p>
                    )}
                  </div>
                )}

                {hasMore && displayedProducts.length > 0 && (
                  <div ref={observerTarget} className="flex justify-center py-4 xs:py-6 md:py-8">
                    <div className="animate-spin rounded-full h-6 w-6 xs:h-7 xs:w-7 md:h-8 md:w-8 border-b-2 border-primary" />
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
