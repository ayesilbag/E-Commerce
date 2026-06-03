import { createContext, useContext, useEffect, type ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getSiteSettings, UI_CODE } from '@/services/site-settings.service';
import { getImageUrl } from '@/lib/product-utils';
import type { SiteSettings } from '@/types';

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  id: '',
  code: UI_CODE ?? 'bizdenalbizdensat',
  name: 'Bizdenalbizdensat',
  siteName: 'Bizdenalbizdensat',
  domain: null,
  logoUrl: null,
  faviconUrl: null,
  address: null,
  emails: [],
  phones: [],
  workingHours: [],
  socialLinks: {},
  paymentCompliance: { legalPages: [] },
  paymentComplianceStatus: { completed: 0, total: 6, items: [] },
  isActive: true,
  isDefault: false,
};

const SiteSettingsContext = createContext<SiteSettings>(DEFAULT_SITE_SETTINGS);

function applyBranding(settings: SiteSettings) {
  if (settings.siteName) {
    document.title = settings.siteName;
  }

  if (settings.faviconUrl) {
    const href = getImageUrl(settings.faviconUrl);
    let link = document.querySelector<HTMLLinkElement>("link[rel='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = href;
  }

  if (settings.domain) {
    const canonical = document.querySelector<HTMLLinkElement>("link[rel='canonical']");
    if (canonical) {
      canonical.href = settings.domain.endsWith('/') ? settings.domain : `${settings.domain}/`;
    }
  }
}

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const { data } = useQuery({
    queryKey: ['site-settings', UI_CODE],
    queryFn: getSiteSettings,
    staleTime: 10 * 60 * 1000,
    retry: 1,
    enabled: Boolean(UI_CODE),
  });

  const settings = data ?? DEFAULT_SITE_SETTINGS;

  useEffect(() => {
    if (data) {
      applyBranding(data);
    }
  }, [data]);

  return (
    <SiteSettingsContext.Provider value={settings}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}
