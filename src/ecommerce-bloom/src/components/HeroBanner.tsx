import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";
import { getImageUrl } from "@/lib/product-utils";

const HeroBanner = () => {
  const { storefrontContent } = useSiteSettings();
  const slides = storefrontContent?.heroSlides ?? [];
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const goTo = useCallback(
    (index: number) => {
      if (isAnimating || slides.length === 0) return;
      setIsAnimating(true);
      setCurrent((index + slides.length) % slides.length);
      setTimeout(() => setIsAnimating(false), 400);
    },
    [isAnimating, slides.length]
  );

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, slides.length]);

  useEffect(() => {
    if (current >= slides.length) setCurrent(0);
  }, [current, slides.length]);

  if (slides.length === 0) return null;

  const slide = slides[current];
  const bgClass = slide.backgroundClass?.trim() || "from-primary/10 to-primary/20";
  const imageUrl = slide.imageUrl ? getImageUrl(slide.imageUrl) : "";

  return (
    <section className={`relative bg-gradient-to-br ${bgClass} overflow-hidden transition-all duration-500`}>
      <div className="container-custom grid md:grid-cols-2 gap-4 md:gap-8 py-8 md:py-12 lg:py-16 xl:py-20 px-4 sm:px-6">
        <div className="flex flex-col justify-center space-y-4 lg:space-y-6 order-2 md:order-1">
          {slide.badge && (
            <span className="inline-block w-fit px-3 py-1 bg-background/80 backdrop-blur-sm text-primary rounded-full text-xs font-semibold border border-primary/30">
              {slide.badge}
            </span>
          )}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
            {slide.title}{" "}
            {slide.highlight && (
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
                {slide.highlight}
              </span>
            )}
          </h1>
          {slide.subtitle && (
            <p className="text-sm md:text-base text-muted-foreground max-w-md leading-relaxed">
              {slide.subtitle}
            </p>
          )}
          <div className="flex flex-wrap gap-3 pt-2">
            {slide.ctaLabel && slide.ctaHref && (
              <Link to={slide.ctaHref}>
                <Button className="btn-gradient text-sm px-5 py-2.5 h-auto">
                  {slide.ctaLabel}
                </Button>
              </Link>
            )}
            {slide.ctaSecondaryLabel && slide.ctaSecondaryHref && (
              <Link to={slide.ctaSecondaryHref}>
                <Button variant="outline" className="text-sm px-5 py-2.5 h-auto bg-background/80">
                  {slide.ctaSecondaryLabel}
                </Button>
              </Link>
            )}
          </div>
        </div>

        {imageUrl && (
          <div className="relative flex items-center justify-center order-1 md:order-2 min-h-[200px] sm:min-h-[260px] md:min-h-[320px]">
            <div className="absolute inset-0 bg-primary/10 rounded-3xl blur-2xl" />
            <img
              key={current}
              src={imageUrl}
              alt={slide.title}
              className="relative z-10 w-full h-[200px] sm:h-[260px] md:h-[320px] lg:h-[380px] object-cover rounded-2xl shadow-2xl"
              style={{ opacity: isAnimating ? 0 : 1, transition: "opacity 0.4s ease" }}
            />
          </div>
        )}
      </div>

      {slides.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-background/90 hover:bg-background rounded-full shadow-md border border-border transition-all"
            aria-label="Önceki slayt"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
          </button>
          <button
            onClick={next}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-background/90 hover:bg-background rounded-full shadow-md border border-border transition-all"
            aria-label="Sonraki slayt"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`transition-all duration-300 rounded-full ${
                  i === current ? "w-6 h-2 bg-primary" : "w-2 h-2 bg-muted-foreground/40 hover:bg-muted-foreground/60"
                }`}
                aria-label={`Slayt ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default HeroBanner;
