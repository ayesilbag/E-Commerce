import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";
import { getImageUrl } from "@/lib/product-utils";

const CampaignBanner = () => {
  const { storefrontContent } = useSiteSettings();
  const banners = storefrontContent?.campaignBanners ?? [];

  if (banners.length === 0) return null;

  const primary = banners.find((b) => b.size === "large") ?? banners[0];
  const secondary = banners.filter((b) => b !== primary).filter((b) => b.size === "small");

  const renderBanner = (
    banner: (typeof banners)[number],
    className: string,
    titleClass: string,
    linkClass: string
  ) => {
    const imageUrl = banner.imageUrl ? getImageUrl(banner.imageUrl) : "";
    const gradient = banner.gradientClass?.trim() || "from-primary to-primary/80";

    return (
      <Link
        to={banner.href || "/shop"}
        className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} ${className} hover:shadow-xl transition-all duration-300`}
      >
        {imageUrl && (
          <img
            src={imageUrl}
            alt={banner.title}
            className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-25 group-hover:scale-105 transition-all duration-500"
          />
        )}
        <div className="relative z-10">
          {banner.badge && (
            <span className="inline-block bg-white/20 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full mb-2 backdrop-blur-sm">
              {banner.badge}
            </span>
          )}
          <h3 className={`text-white font-bold leading-tight mb-1 ${titleClass}`}>{banner.title}</h3>
          {banner.subtitle && (
            <p className="text-primary-foreground/70 text-xs mb-3">{banner.subtitle}</p>
          )}
          {banner.linkLabel && (
            <span className={`inline-flex items-center gap-1 text-white text-xs font-semibold group-hover:gap-2 transition-all ${linkClass}`}>
              {banner.linkLabel} <ArrowRight className="w-3.5 h-3.5" />
            </span>
          )}
        </div>
      </Link>
    );
  };

  return (
    <section className="py-6 sm:py-8 bg-muted/50">
      <div className="container-custom px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {renderBanner(
            primary,
            "min-h-[140px] sm:min-h-[160px] flex items-end p-5 sm:p-6",
            "text-lg sm:text-xl",
            ""
          )}
          {secondary.length > 0 && (
            <div className="grid grid-rows-2 gap-3 sm:gap-4">
              {secondary.slice(0, 2).map((banner) =>
                renderBanner(
                  banner,
                  "min-h-[64px] sm:min-h-[72px] flex items-center px-5 sm:px-6 hover:shadow-lg",
                  "text-sm sm:text-base",
                  "mt-0.5"
                )
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CampaignBanner;
