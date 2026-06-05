import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';
import { applyPageSeo } from '@/lib/apply-page-seo';

/** Updates document title and meta tags from admin SEO settings on each route change. */
export default function PageSeoManager() {
  const location = useLocation();
  const settings = useSiteSettings();

  useEffect(() => {
    const { title } = applyPageSeo(settings, location.pathname);
    if (title) {
      document.title = title;
    }
  }, [settings, location.pathname]);

  return null;
}
