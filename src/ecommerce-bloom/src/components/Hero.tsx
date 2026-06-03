import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-purple-50 to-purple-100 overflow-hidden">
      <div className="container-custom grid md:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8 py-6 md:py-8 lg:py-12 xl:py-20 px-2 xs:px-4 sm:px-6">
        {/* Text Content */}
        <div className="flex flex-col justify-center space-y-3 md:space-y-4 lg:space-y-6 animate-fade-in order-2 md:order-1">
          <div>
            <span className="px-2 xs:px-3 md:px-4 py-1 bg-purple-default/10 text-purple-default rounded-full text-xs md:text-sm font-medium">
              2025 Yeni Koleksiyon
            </span>
          </div>
          <h1 className="text-base md:text-lg lg:text-xl font-bold leading-snug">
            Yaşam Tarzınız İçin <span className="text-transparent bg-clip-text bg-purple-gradient">Mükemmel</span> Teknoloji Ürünlerini Keşfedin
          </h1>
          <p className="text-xs md:text-sm text-gray-600 max-w-md lg:max-w-lg">
            Modern yaşam için tasarlanmış premium teknoloji ürünlerimizle günlük deneyimlerinizi yükseltin.
          </p>
          <div className="flex flex-wrap gap-2 md:gap-3 pt-2 md:pt-3">
            <Link to="/shop">
              <Button className="btn-gradient text-xs md:text-sm px-3 md:px-4 py-2">
                Alışverişe Başla
              </Button>
            </Link>
            <Link to="/categories">
              <Button variant="outline" className="text-xs md:text-sm px-3 md:px-4 py-2 flex items-center gap-2">
                Koleksiyonları Gör
                <ChevronRight size={14} />
              </Button>
            </Link>
          </div>
          <div className="flex items-center gap-3 md:gap-4 pt-2 md:pt-3 flex-wrap">
            <div className="flex flex-col">
              <span className="font-bold text-sm md:text-base text-purple-dark">15B+</span>
              <span className="text-xs text-gray-500">Mutlu Müşteri</span>
            </div>
            <div className="w-px h-6 md:h-8 bg-gray-200"></div>
            <div className="flex flex-col">
              <span className="font-bold text-sm md:text-base text-purple-dark">150+</span>
              <span className="text-xs text-gray-500">Global Marka</span>
            </div>
            <div className="w-px h-6 md:h-8 bg-gray-200"></div>
            <div className="flex flex-col">
              <span className="font-bold text-sm md:text-base text-purple-dark">%90</span>
              <span className="text-xs text-gray-500">Olumlu Yorum</span>
            </div>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative flex items-center justify-center order-1 md:order-2 min-h-[150px] xs:min-h-[180px] md:min-h-[200px] lg:min-h-auto">
          <div className="w-[150px] h-[150px] xs:w-[180px] xs:h-[180px] md:w-[200px] md:h-[200px] lg:w-[320px] lg:h-[320px] xl:w-[420px] xl:h-[420px] bg-purple-gradient rounded-full opacity-20 blur-3xl absolute"></div>
          <img
            src="https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?q=80&w=1170&auto=format"
            alt="Öne Çıkan Ürün"
            className="object-contain relative z-10 max-w-full w-full h-auto drop-shadow-2xl animate-fade-in"
          />
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute -bottom-6 md:-bottom-8 lg:-bottom-16 -left-6 md:-left-8 lg:-left-16 w-24 md:w-32 lg:w-64 h-24 md:h-32 lg:h-64 bg-purple-light/20 rounded-full blur-3xl"></div>
      <div className="absolute top-8 md:top-10 lg:top-20 -right-8 md:-right-10 lg:-right-20 w-28 md:w-36 lg:w-72 h-28 md:h-36 lg:h-72 bg-purple-vivid/20 rounded-full blur-3xl"></div>
    </section>
  );
};

export default Hero;