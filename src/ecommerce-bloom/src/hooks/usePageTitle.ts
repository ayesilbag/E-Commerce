import { useEffect } from "react";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";

/**
 * Sayfa başlığını dinamik olarak ayarlar.
 * Biçim: "{pageTitle} | {siteName}"
 * pageTitle boşsa sadece siteName kullanılır.
 */
const usePageTitle = (pageTitle?: string) => {
  const { siteName } = useSiteSettings();

  useEffect(() => {
    const base = siteName || "Bizdenalbizdensat";
    document.title = pageTitle ? `${pageTitle} | ${base}` : base;

    return () => {
      document.title = base;
    };
  }, [pageTitle, siteName]);
};

export default usePageTitle;
