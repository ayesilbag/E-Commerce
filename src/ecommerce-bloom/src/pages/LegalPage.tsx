import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { Mail, Phone } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';
import { getLegalPage, UI_CODE } from '@/services/site-settings.service';
import { resolveLegalPageContent } from '@/lib/legal-page-utils';
import { enhanceLegalHtml, scrollToLegalSection } from '@/lib/legal-page-html';
import type { LegalSlug } from '@/constants/legal-pages';

type LegalPageProps = {
  slug: LegalSlug;
};

const LegalPage = ({ slug }: LegalPageProps) => {
  const settings = useSiteSettings();
  const compliance = settings.paymentCompliance;
  const legalPages = compliance?.legalPages;
  const ui = settings.storefrontContent?.legalPageUi;

  const { data: apiData, isLoading, isError } = useQuery({
    queryKey: ['legal-page', UI_CODE, slug],
    queryFn: () => getLegalPage(slug),
    staleTime: 10 * 60 * 1000,
    retry: 1,
    enabled: Boolean(UI_CODE),
  });

  const fallback = resolveLegalPageContent(slug, compliance, legalPages);
  const title = apiData?.title?.trim() || fallback.title;
  const rawContent = apiData?.content?.trim() || fallback.content;

  const { html: content, toc } = useMemo(
    () => (rawContent ? enhanceLegalHtml(rawContent) : { html: '', toc: [] }),
    [rawContent],
  );

  const primaryEmail = settings.emails[0];
  const primaryPhone = settings.phones[0];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 container-custom px-4 sm:px-6 py-8 md:py-12">
        {isLoading && !content && (
          <div className="max-w-4xl mx-auto space-y-4 animate-pulse">
            <div className="h-12 bg-muted rounded-lg w-1/3" />
            <div className="h-96 bg-muted rounded-xl" />
          </div>
        )}

        {!isLoading && !content && (isError || !rawContent) && ui?.emptyStateTitle && (
          <div className="max-w-lg mx-auto text-center py-16 px-6 bg-card rounded-xl border border-border">
            <h1 className="text-base font-semibold text-foreground mb-2">{ui.emptyStateTitle}</h1>
            {ui.emptyStateDescription && (
              <p className="text-sm text-muted-foreground">{ui.emptyStateDescription}</p>
            )}
          </div>
        )}

        {content && (
          <div className="max-w-4xl mx-auto space-y-6">
            {toc.length > 1 && ui?.tocTitle && (
              <nav
                aria-label={ui.tocTitle}
                className="bg-card rounded-xl border border-border p-5 md:p-6"
              >
                <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                  {ui.tocTitle}
                </h2>
                <ol className="grid sm:grid-cols-2 gap-2">
                  {toc.map((item, index) => (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => scrollToLegalSection(item.id)}
                        className="w-full text-left text-base text-muted-foreground hover:text-primary transition-colors flex items-start gap-2 py-1"
                      >
                        <span className="text-primary font-medium shrink-0">
                          {String(index + 1).padStart(2, '0')}.
                        </span>
                        <span>{item.title}</span>
                      </button>
                    </li>
                  ))}
                </ol>
              </nav>
            )}

            <article className="bg-card rounded-xl border border-border shadow-sm p-6 md:p-8 lg:p-10">
              {title && (
                <h1 className="text-2xl md:text-3xl font-semibold text-foreground mb-6 md:mb-8 pb-4 border-b border-border">
                  {title}
                </h1>
              )}
              <div
                className="legal-content prose prose-base md:prose-lg max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </article>

            {(primaryEmail || primaryPhone) && ui?.contactBlockTitle && (
              <section className="bg-card rounded-xl border border-border p-6 md:p-8">
                <h2 className="text-lg font-semibold text-foreground mb-2">
                  {ui.contactBlockTitle}
                </h2>
                {ui.contactBlockDescription && (
                  <p className="text-base text-muted-foreground mb-6">
                    {ui.contactBlockDescription}
                  </p>
                )}

                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  {primaryEmail && ui.emailLabel && (
                    <a
                      href={`mailto:${primaryEmail}`}
                      className="flex items-start gap-3 rounded-lg border border-border p-4 hover:border-primary transition-colors"
                    >
                      <div className="bg-primary/15 p-3 rounded-full shrink-0">
                        <Mail className="text-primary w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground">{ui.emailLabel}</p>
                        <p className="text-base text-muted-foreground break-all">{primaryEmail}</p>
                      </div>
                    </a>
                  )}
                  {primaryPhone && ui.phoneLabel && (
                    <a
                      href={`tel:${primaryPhone.replace(/\s/g, '')}`}
                      className="flex items-start gap-3 rounded-lg border border-border p-4 hover:border-primary transition-colors"
                    >
                      <div className="bg-primary/15 p-3 rounded-full shrink-0">
                        <Phone className="text-primary w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground">{ui.phoneLabel}</p>
                        <p className="text-base text-muted-foreground">{primaryPhone}</p>
                      </div>
                    </a>
                  )}
                </div>

                {ui.contactFormButtonLabel && ui.contactFormHref && (
                  <Link to={ui.contactFormHref}>
                    <Button className="btn-gradient w-full sm:w-auto">
                      {ui.contactFormButtonLabel}
                    </Button>
                  </Link>
                )}
              </section>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default LegalPage;
