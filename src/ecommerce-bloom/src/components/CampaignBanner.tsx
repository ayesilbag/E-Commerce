import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const CampaignBanner = () => {
  return (
    <section className="py-6 sm:py-8 bg-gray-50">
      <div className="container-custom px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {/* Banner 1 - Büyük kampanya */}
          <Link
            to="/shop?sort=discounted"
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 to-purple-800 min-h-[140px] sm:min-h-[160px] flex items-end p-5 sm:p-6 hover:shadow-xl transition-all duration-300"
          >
            <img
              src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=600&auto=format"
              alt="Kampanya"
              className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-25 group-hover:scale-105 transition-all duration-500"
            />
            <div className="relative z-10">
              <span className="inline-block bg-white/20 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full mb-2 backdrop-blur-sm">
                Sınırlı Süre
              </span>
              <h3 className="text-white font-bold text-lg sm:text-xl leading-tight mb-1">
                %50'ye Kadar<br />İndirim
              </h3>
              <p className="text-purple-200 text-xs mb-3">Seçili ürünlerde büyük fırsatlar</p>
              <span className="inline-flex items-center gap-1 text-white text-xs font-semibold group-hover:gap-2 transition-all">
                Fırsatları Gör <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>

          {/* Banner 2 ve 3 - Küçük ikili */}
          <div className="grid grid-rows-2 gap-3 sm:gap-4">
            <Link
              to="/shop?sort=newest"
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 min-h-[64px] sm:min-h-[72px] flex items-center px-5 sm:px-6 hover:shadow-lg transition-all duration-300"
            >
              <img
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=600&auto=format"
                alt="Yeni Gelenler"
                className="absolute inset-0 w-full h-full object-cover opacity-15 group-hover:opacity-20 group-hover:scale-105 transition-all duration-500"
              />
              <div className="relative z-10">
                <h3 className="text-white font-bold text-sm sm:text-base">Yeni Gelenler</h3>
                <span className="inline-flex items-center gap-1 text-teal-200 text-xs mt-0.5 group-hover:gap-2 transition-all">
                  Hepsini gör <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>

            <Link
              to="/shop"
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 min-h-[64px] sm:min-h-[72px] flex items-center px-5 sm:px-6 hover:shadow-lg transition-all duration-300"
            >
              <img
                src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=600&auto=format"
                alt="Flash Fırsat"
                className="absolute inset-0 w-full h-full object-cover opacity-15 group-hover:opacity-20 group-hover:scale-105 transition-all duration-500"
              />
              <div className="relative z-10">
                <h3 className="text-white font-bold text-sm sm:text-base">Flash Fırsat</h3>
                <span className="inline-flex items-center gap-1 text-orange-200 text-xs mt-0.5 group-hover:gap-2 transition-all">
                  Hepsini gör <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CampaignBanner;
