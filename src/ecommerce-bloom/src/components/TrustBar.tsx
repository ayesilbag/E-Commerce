import { useSiteSettings } from "@/contexts/SiteSettingsContext";
import { resolveTrustIcon } from "@/lib/trust-icons";

const TrustBar = () => {
  const { storefrontContent } = useSiteSettings();
  const items = storefrontContent?.trustItems ?? [];

  if (items.length === 0) return null;

  return (
    <section className="bg-card border-y border-border">
      <div className="container-custom px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-border">
          {items.map(({ icon, title, subtitle }) => {
            const Icon = resolveTrustIcon(icon);
            return (
              <div
                key={`${icon}-${title}`}
                className="flex items-center gap-3 py-4 px-3 sm:px-5 hover:bg-accent transition-colors"
              >
                <div className="shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" strokeWidth={1.75} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-semibold text-foreground leading-tight">{title}</p>
                  {subtitle && (
                    <p className="text-[10px] sm:text-xs text-muted-foreground leading-tight mt-0.5 hidden sm:block">
                      {subtitle}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrustBar;
