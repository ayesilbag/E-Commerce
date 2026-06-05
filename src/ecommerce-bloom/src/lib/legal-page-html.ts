export type LegalTocItem = {
  id: string;
  title: string;
};

export function enhanceLegalHtml(html: string): { html: string; toc: LegalTocItem[] } {
  if (typeof DOMParser === 'undefined') {
    return { html, toc: [] };
  }

  const doc = new DOMParser().parseFromString(html, 'text/html');
  const toc: LegalTocItem[] = [];

  doc.querySelectorAll('h2').forEach((heading, index) => {
    const title = heading.textContent?.trim();
    if (!title) return;

    const id = heading.id || `bolum-${index + 1}`;
    heading.id = id;
    toc.push({ id, title });
  });

  return { html: doc.body.innerHTML, toc };
}

export function scrollToLegalSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
