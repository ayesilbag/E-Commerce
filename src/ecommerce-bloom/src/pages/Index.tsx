import Navbar from "@/components/Navbar";
import HeroBanner from "@/components/HeroBanner";
import TrustBar from "@/components/TrustBar";
import Categories from "@/components/Categories";
import ProductRow from "@/components/ProductRow";
import CampaignBanner from "@/components/CampaignBanner";
import NewsletterSection from "@/components/NewsletterSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        {/* 1. Hero Slider - Kampanya görselleri */}
        <HeroBanner />

        {/* 2. Güven Bandı - Kargo / İade / Güvence */}
        <TrustBar />

        {/* 3. Kategoriler - Yatay scroll */}
        <Categories />

        {/* 4. Çok Satanlar ürün rafı */}
        <ProductRow
          title="Çok Satanlar"
          subtitle="Müşterilerimizin en çok tercih ettiği ürünler"
          viewAllHref="/shop?sort=featured"
          params={{ sort: "featured" }}
          limit={12}
        />

        {/* 5. Kampanya Bannerları */}
        <CampaignBanner />

        {/* 6. Yeni Gelenler ürün rafı */}
        <ProductRow
          title="Yeni Gelenler"
          subtitle="Mağazamıza yeni eklenen ürünleri keşfet"
          viewAllHref="/shop?sort=newest"
          params={{ sort: "newest" }}
          limit={12}
        />

        {/* 7. İndirimli Ürünler ürün rafı */}
        <ProductRow
          title="Fırsatlar"
          subtitle="Sınırlı stok, sınırsız tasarruf"
          viewAllHref="/shop?sort=discounted"
          params={{ sort: "discounted" }}
          limit={12}
        />

        {/* 8. Bülten */}
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
