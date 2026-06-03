import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';
import { getLegalPage, UI_CODE } from '@/services/site-settings.service';
import { resolveLegalPageContent } from '@/lib/legal-page-utils';
import type { LegalSlug } from '@/constants/legal-pages';

type LegalPageProps = {
  slug: LegalSlug;
};

const LegalPage = ({ slug }: LegalPageProps) => {
  const settings = useSiteSettings();
  const compliance = settings.paymentCompliance;
  const legalPages = compliance?.legalPages;

  const { data: apiData, isLoading, isError } = useQuery({
    queryKey: ['legal-page', UI_CODE, slug],
    queryFn: () => getLegalPage(slug),
    staleTime: 10 * 60 * 1000,
    retry: 1,
    enabled: Boolean(UI_CODE),
  });

  const fallback = resolveLegalPageContent(slug, compliance, legalPages);
  const title = apiData?.title ?? fallback.title;
  const content = apiData?.content?.trim() || fallback.content;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 container-custom px-4 sm:px-6 py-8 md:py-12">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-purple-dark mb-6"
        >
          <ChevronLeft className="w-4 h-4" />
          Anasayfa
        </Link>

        {isLoading && !content && (
          <div className="flex items-center justify-center py-24 text-gray-500">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          </div>
        )}

        {!isLoading && !content && (isError || !apiData?.content) && (
          <div className="max-w-2xl mx-auto text-center py-16">
            <h1 className="text-base font-semibold text-gray-800 mb-2">Sayfa bulunamadı</h1>
            <p className="text-gray-600 mb-6">
              Bu yasal sayfa henüz yayınlanmamış veya geçici olarak kullanılamıyor.
            </p>
            <Link to="/" className="text-purple-default hover:underline font-medium">
              Anasayfaya dön
            </Link>
          </div>
        )}

        {content && (
          <article className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-6 md:p-10">
            <h1 className="text-base font-semibold text-gray-900 mb-6 md:mb-8 border-b pb-4">
              {title}
            </h1>
            <div
              className="prose prose-sm md:prose-base max-w-none text-gray-700 legal-content"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </article>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default LegalPage;
