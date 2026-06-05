import Navbar from "@/components/Navbar";
import HeroBanner from "@/components/HeroBanner";
import TrustBar from "@/components/TrustBar";
import Categories from "@/components/Categories";
import ProductRow from "@/components/ProductRow";
import CampaignBanner from "@/components/CampaignBanner";
import NewsletterSection from "@/components/NewsletterSection";
import Footer from "@/components/Footer";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";

const Index = () => {
  const { storefrontContent } = useSiteSettings();
  const productRows = storefrontContent?.productRows ?? [];
  const banners = storefrontContent?.campaignBanners ?? [];
  const showCampaignAfterFirstRow = banners.length > 0 && productRows.length > 0;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <HeroBanner />
        <TrustBar />
        <Categories />

        {productRows.map((row, index) => (
          <div key={`${row.title}-${index}`}>
            <ProductRow
              title={row.title}
              subtitle={row.subtitle ?? undefined}
              viewAllHref={row.viewAllHref}
              params={{ sort: row.sort }}
              limit={row.limit}
            />
            {showCampaignAfterFirstRow && index === 0 && <CampaignBanner />}
          </div>
        ))}

        {productRows.length === 0 && banners.length > 0 && <CampaignBanner />}

        <NewsletterSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
