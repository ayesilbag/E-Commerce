import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Slide {
  id: number;
  badge: string;
  title: string;
  highlight: string;
  subtitle: string;
  cta: { label: string; href: string };
  ctaSecondary: { label: string; href: string };
  image: string;
  bg: string;
}

const SLIDES: Slide[] = [
  {
    id: 1,
    badge: "Yeni Koleksiyon",
    title: "En Yeni Ürünleri",
    highlight: "Keşfet",
    subtitle: "Sezon'un en yeni ürünleri sizin için seçildi. Hızlı teslimat ve güvenli alışveriş garantisiyle.",
    cta: { label: "Alışverişe Başla", href: "/shop" },
    ctaSecondary: { label: "Kategorileri Gör", href: "/categories" },
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=1170&auto=format",
    bg: "from-purple-50 to-indigo-100",
  },
  {
    id: 2,
    badge: "Süper Fırsat",
    title: "İndirimli Ürünlerde",
    highlight: "%50'ye Kadar",
    subtitle: "Sınırlı stok, sınırsız fırsat. Kampanyalı ürünleri kaçırmadan sepetine ekle.",
    cta: { label: "Fırsatları Gör", href: "/shop?sort=discounted" },
    ctaSecondary: { label: "Tüm Ürünler", href: "/shop" },
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1170&auto=format",
    bg: "from-orange-50 to-red-100",
  },
  {
    id: 3,
    badge: "Hızlı Teslimat",
    title: "Aynı Gün Kargo",
    highlight: "Garanti",
    subtitle: "Saat 14:00'e kadar verilen siparişler aynı gün kargoya verilir. Hızlı ve güvenli.",
    cta: { label: "Hemen Sipariş Ver", href: "/shop" },
    ctaSecondary: { label: "Daha Fazla Bilgi", href: "/delivery-returns" },
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1170&auto=format",
    bg: "from-green-50 to-teal-100",
  },
];

const HeroBanner = () => {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const goTo = useCallback(
    (index: number) => {
      if (isAnimating) return;
      setIsAnimating(true);
      setCurrent((index + SLIDES.length) % SLIDES.length);
      setTimeout(() => setIsAnimating(false), 400);
    },
    [isAnimating]
  );

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = SLIDES[current];

  return (
    <section className={`relative bg-gradient-to-br ${slide.bg} overflow-hidden transition-all duration-500`}>
      <div className="container-custom grid md:grid-cols-2 gap-4 md:gap-8 py-8 md:py-12 lg:py-16 xl:py-20 px-4 sm:px-6">
        {/* Text Content */}
        <div className="flex flex-col justify-center space-y-4 lg:space-y-6 order-2 md:order-1">
          <span className="inline-block w-fit px-3 py-1 bg-white/70 backdrop-blur-sm text-purple-700 rounded-full text-xs font-semibold border border-purple-200">
            {slide.badge}
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
            {slide.title}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-purple-400">
              {slide.highlight}
            </span>
          </h1>
          <p className="text-sm md:text-base text-gray-600 max-w-md leading-relaxed">
            {slide.subtitle}
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link to={slide.cta.href}>
              <Button className="btn-gradient text-sm px-5 py-2.5 h-auto">
                {slide.cta.label}
              </Button>
            </Link>
            <Link to={slide.ctaSecondary.href}>
              <Button variant="outline" className="text-sm px-5 py-2.5 h-auto bg-white/70">
                {slide.ctaSecondary.label}
              </Button>
            </Link>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative flex items-center justify-center order-1 md:order-2 min-h-[200px] sm:min-h-[260px] md:min-h-[320px]">
          <div className="absolute inset-0 bg-white/20 rounded-3xl blur-2xl" />
          <img
            key={slide.id}
            src={slide.image}
            alt={slide.title}
            className="relative z-10 w-full h-[200px] sm:h-[260px] md:h-[320px] lg:h-[380px] object-cover rounded-2xl shadow-2xl"
            style={{ opacity: isAnimating ? 0 : 1, transition: "opacity 0.4s ease" }}
          />
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prev}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-white/80 hover:bg-white rounded-full shadow-md transition-all"
        aria-label="Önceki slayt"
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
      </button>
      <button
        onClick={next}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-white/80 hover:bg-white rounded-full shadow-md transition-all"
        aria-label="Sonraki slayt"
      >
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`transition-all duration-300 rounded-full ${
              i === current ? "w-6 h-2 bg-purple-600" : "w-2 h-2 bg-gray-300 hover:bg-gray-400"
            }`}
            aria-label={`Slayt ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroBanner;
