import type { PageSeoFormRow } from '../constants/storefront-pages';

type Props = {
  pages: PageSeoFormRow[];
  pageKeys: string[];
  onUpdate: (pageKey: string, patch: Partial<PageSeoFormRow>) => void;
  title?: string;
};

export default function PageSeoFields({ pages, pageKeys, onUpdate, title = 'Sayfa SEO' }: Props) {
  const filtered = pages.filter((p) => pageKeys.includes(p.pageKey));
  if (filtered.length === 0) return null;

  return (
    <>
      <h4 className="site-settings-subtitle">{title}</h4>
      {filtered.map((page) => (
        <details key={page.pageKey} className="card site-settings-details">
          <summary>
            {page.label} <code>{page.path}</code>
          </summary>
          <div className="site-settings-details-body">
            <div className="field">
              <label htmlFor={`seo-title-${page.pageKey}`}>Sayfa başlığı (title)</label>
              <input
                id={`seo-title-${page.pageKey}`}
                value={page.title}
                onChange={(e) => onUpdate(page.pageKey, { title: e.target.value })}
                placeholder={`Boş bırakılırsa: ${page.label} | site adı`}
              />
            </div>
            <div className="field">
              <label htmlFor={`seo-desc-${page.pageKey}`}>Meta açıklama</label>
              <textarea
                id={`seo-desc-${page.pageKey}`}
                rows={2}
                value={page.description}
                onChange={(e) => onUpdate(page.pageKey, { description: e.target.value })}
              />
            </div>
            <div className="field">
              <label htmlFor={`seo-kw-${page.pageKey}`}>Anahtar kelimeler</label>
              <input
                id={`seo-kw-${page.pageKey}`}
                value={page.keywords}
                onChange={(e) => onUpdate(page.pageKey, { keywords: e.target.value })}
              />
            </div>
            <div className="field">
              <label htmlFor={`seo-og-${page.pageKey}`}>OG görsel URL (isteğe bağlı)</label>
              <input
                id={`seo-og-${page.pageKey}`}
                value={page.ogImageUrl}
                onChange={(e) => onUpdate(page.pageKey, { ogImageUrl: e.target.value })}
                placeholder="Boş bırakılırsa varsayılan OG görseli"
              />
            </div>
          </div>
        </details>
      ))}
    </>
  );
}
