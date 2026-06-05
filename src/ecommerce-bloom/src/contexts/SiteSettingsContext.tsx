import { createContext, useContext, useEffect, type ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getSiteSettings, UI_CODE } from '@/services/site-settings.service';
import { getImageUrl } from '@/lib/product-utils';
import type { SiteSettings, SiteTheme } from '@/types';

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  id: '',
  code: UI_CODE ?? '',
  name: '',
  siteName: '',
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
  seo: { pages: [] },
  storefrontContent: {
    heroSlides: [],
    trustItems: [],
    campaignBanners: [],
    productRows: [],
  },
  isActive: true,
  isDefault: false,
};

const SiteSettingsContext = createContext<SiteSettings>(DEFAULT_SITE_SETTINGS);

function darkenHex(hex: string, amount = 0.15): string {
  const r = Math.max(0, Math.round(parseInt(hex.slice(1, 3), 16) * (1 - amount)));
  const g = Math.max(0, Math.round(parseInt(hex.slice(3, 5), 16) * (1 - amount)));
  const b = Math.max(0, Math.round(parseInt(hex.slice(5, 7), 16) * (1 - amount)));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

function primaryForegroundHsl(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.55 ? '222.2 47.4% 11.2%' : '210 40% 98%';
}

function hexToHsl(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

function applyTheme(theme: SiteTheme | null | undefined) {
  const styleId = 'site-dynamic-theme';
  let styleEl = document.getElementById(styleId) as HTMLStyleElement | null;

  if (!theme?.primaryLight && !theme?.primaryDark && !theme?.fontFamily) {
    styleEl?.remove();
    return;
  }

  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = styleId;
    document.head.appendChild(styleEl);
  }

  const lightHex = theme.primaryLight ?? null;
  const darkHex = theme.primaryDark ?? lightHex;
  const lightHsl = lightHex ? hexToHsl(lightHex) : null;
  const darkHsl = darkHex ? hexToHsl(darkHex) : null;
  const font = theme.fontFamily;

  const lightGradient = lightHex
    ? `--theme-gradient:linear-gradient(135deg, ${lightHex} 0%, ${darkenHex(lightHex)} 100%);`
    : '';
  const darkGradient = darkHex
    ? `--theme-gradient:linear-gradient(135deg, ${darkHex} 0%, ${darkenHex(darkHex)} 100%);`
    : '';

  const rootRules = lightHsl
    ? `--primary:${lightHsl};--ring:${lightHsl};--primary-foreground:${lightHex ? primaryForegroundHsl(lightHex) : '210 40% 98%'};${lightGradient}`
    : '';
  const darkRules = darkHsl
    ? `--primary:${darkHsl};--ring:${darkHsl};--primary-foreground:${darkHex ? primaryForegroundHsl(darkHex) : '222.2 47.4% 11.2%'};${darkGradient}`
    : '';
  const fontRule = font ? `body{font-family:'${font}',sans-serif;}` : '';

  styleEl.textContent = [
    rootRules && `:root{${rootRules}}`,
    darkRules && `.dark{${darkRules}}`,
    fontRule,
  ]
    .filter(Boolean)
    .join('\n');
}

function applyBranding(settings: SiteSettings) {
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

  applyTheme(settings.theme);
}

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const { data } = useQuery({
    queryKey: ['site-settings', UI_CODE],
    queryFn: getSiteSettings,
    staleTime: 60 * 1000,
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
