import { useEffect } from "react";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";

/**
 * Sayfa başlığını dinamik olarak ayarlar.
 * Biçim: "{pageTitle} | {siteName}"
 * pageTitle boşsa sadece siteName kullanılır.
 */
const usePageTitle = (pageTitle?: string) => {
  const { siteName, name } = useSiteSettings();

  useEffect(() => {
    const base = siteName || name || '';
    document.title = pageTitle ? `${pageTitle} | ${base}` : base;

    return () => {
      document.title = base;
    };
  }, [pageTitle, siteName, name]);
};

export default usePageTitle;
