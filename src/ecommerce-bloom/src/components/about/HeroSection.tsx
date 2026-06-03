import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="bg-purple-dark text-white py-8 xs:py-12 sm:py-16 md:py-20 lg:py-24">
      <div className="container-custom px-2 xs:px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xs:gap-6 md:gap-8 lg:gap-10 items-center">
          <div className="order-2 md:order-1">
            <h1 className="text-base md:text-lg font-semibold mb-3">Alışveriş Deneyiminizi Yeniden Tanımlamak İçin Buradayız</h1>
            <p className="text-gray-200 mb-4 text-xs md:text-sm">
              2015 yılında kurulan Bizdenalbizdensat, küçük bir girişimden elektronik endüstrisinde güvenilir bir isme dönüştü. Kalite, inovasyon ve müşteri memnuniyetine olan bağlılığımız her şeyi yönlendiriyor.
            </p>
            <div className="flex flex-col xs:flex-row flex-wrap gap-2 xs:gap-3 md:gap-4">
              <Link to="/shop">
                <Button className="btn-gradient w-full xs:w-auto h-9 text-sm">
                  Ürünlerimizi Görün
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" className="bg-white text-purple-dark border-white hover:bg-white/90 w-full xs:w-auto h-9 text-sm">
                  İletişime Geçin
                </Button>
              </Link>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <img
              src="https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?q=80&w=1974&auto=format"
              alt="Ekip birlikte çalışıyor"
              className="rounded-lg xs:rounded-lg sm:rounded-xl md:rounded-xl shadow-lg w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;