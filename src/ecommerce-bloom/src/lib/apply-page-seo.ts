import { getImageUrl } from '@/lib/product-utils';
import type { SiteSettings } from '@/types';

const PAGE_PATHS: Record<string, string> = {
  home: '/',
  shop: '/shop',
  contact: '/contact',
  about: '/about',
  'pre-information': '/pre-information',
  'delivery-returns': '/delivery-returns',
  privacy: '/privacy',
  'distance-selling': '/distance-selling',
  login: '/login',
  register: '/register',
  checkout: '/checkout',
  wishlist: '/wishlist',
};

function upsertMeta(name: string, content: string, attr: 'name' | 'property' = 'name') {
  if (!content) return;
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.content = content;
}

function upsertLink(rel: string, href: string) {
  if (!href) return;
  let el = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
}

function upsertJsonLd(id: string, data: object) {
  let el = document.getElementById(id) as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement('script');
    el.type = 'application/ld+json';
    el.id = id;
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

function resolvePageKey(pathname: string): string | null {
  const path = pathname.split('?')[0].split('#')[0] || '/';
  const normalized = path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path;
  const entry = Object.entries(PAGE_PATHS).find(([, p]) => p === normalized);
  if (entry) return entry[0];
  if (normalized.startsWith('/product/')) return null;
  if (normalized.startsWith('/category/')) return null;
  return null;
}

function resolvePageSeo(settings: SiteSettings, pathname: string): {
  title: string;
  description: string;
  keywords: string;
  ogImage: string;
  canonical: string;
  path: string;
} {
  const seo = settings.seo;
  const path = pathname.split('?')[0].split('#')[0] || '/';
  const normalizedPath = path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path;
  const pageKey = resolvePageKey(normalizedPath);
  const page = pageKey ? seo?.pages?.find((p) => p.pageKey === pageKey) : undefined;

  const siteName = settings.siteName || settings.name || '';
  const pageLabel = page?.label || siteName;

  let title: string;
  if (page?.title?.trim()) {
    title = page.title.trim();
  } else if (pageKey === 'home') {
    title = seo?.defaultTitle?.trim() || siteName;
  } else if (pageKey) {
    title = `${pageLabel} | ${siteName}`;
  } else {
    title = siteName;
  }

  const description =
    page?.description?.trim() ||
    seo?.defaultDescription?.trim() ||
    '';

  const keywords = page?.keywords?.trim() || seo?.defaultKeywords?.trim() || '';
  const ogImageRaw = page?.ogImageUrl?.trim() || seo?.ogImageUrl?.trim() || settings.logoUrl || '';
  const ogImage = ogImageRaw ? getImageUrl(ogImageRaw) : '';

  const domain = settings.domain?.replace(/\/$/, '') || '';
  const canonical = domain ? `${domain}${normalizedPath === '/' ? '/' : normalizedPath}` : '';

  return { title, description, keywords, ogImage, canonical, path: normalizedPath };
}

export function applyPageSeo(settings: SiteSettings, pathname: string) {
  const resolved = resolvePageSeo(settings, pathname);
  return writePageSeo(settings, resolved);
}

export function applyDynamicPageSeo(
  settings: SiteSettings,
  pathname: string,
  overrides: { title: string; description?: string; ogImage?: string }
) {
  const base = resolvePageSeo(settings, pathname);
  const ogImageRaw = overrides.ogImage?.trim() || base.ogImage;
  return writePageSeo(settings, {
    ...base,
    title: overrides.title.trim(),
    description: overrides.description?.trim() || base.description,
    ogImage: ogImageRaw ? (ogImageRaw.startsWith('http') ? ogImageRaw : getImageUrl(ogImageRaw)) : base.ogImage,
  });
}

function writePageSeo(
  settings: SiteSettings,
  resolved: {
    title: string;
    description: string;
    keywords: string;
    ogImage: string;
    canonical: string;
    path: string;
  }
) {
  const { title, description, keywords, ogImage, canonical, path } = resolved;
  upsertMeta('description', description);
  if (keywords) upsertMeta('keywords', keywords);

  upsertMeta('og:type', 'website', 'property');
  upsertMeta('og:title', title, 'property');
  upsertMeta('og:description', description, 'property');
  upsertMeta('og:locale', 'tr_TR', 'property');
  upsertMeta('og:site_name', settings.siteName || settings.name || '', 'property');
  if (canonical) {
    upsertMeta('og:url', canonical, 'property');
    upsertLink('canonical', canonical);
  }
  if (ogImage) {
    upsertMeta('og:image', ogImage, 'property');
    upsertMeta('twitter:image', ogImage);
  }

  upsertMeta('twitter:card', 'summary_large_image');
  upsertMeta('twitter:title', title);
  upsertMeta('twitter:description', description);
  if (settings.seo?.twitterHandle) {
    upsertMeta('twitter:site', settings.seo.twitterHandle);
  }

  const domain = settings.domain?.replace(/\/$/, '') || '';
  const logo = settings.logoUrl ? getImageUrl(settings.logoUrl) : '';
  const phone = settings.phones[0]?.replace(/\s/g, '') || '';

  if (domain) {
    upsertJsonLd('site-org-jsonld', {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: settings.siteName || settings.name,
      url: domain,
      ...(logo ? { logo } : {}),
      ...(phone
        ? {
            contactPoint: {
              '@type': 'ContactPoint',
              telephone: phone,
              contactType: 'customer service',
            },
          }
        : {}),
    });

    upsertJsonLd('site-website-jsonld', {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: settings.siteName || settings.name,
      url: domain,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${domain}/shop?search={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    });
  }

  if (settings.theme?.primaryLight) {
    upsertMeta('theme-color', settings.theme.primaryLight);
  }

  return { title, path };
}
