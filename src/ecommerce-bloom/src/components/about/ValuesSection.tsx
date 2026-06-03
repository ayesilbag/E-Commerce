import { Award, Heart, CheckCircle } from "lucide-react";

const ValuesSection = () => {
  return (
    <section className="py-8 xs:py-12 sm:py-16 md:py-20 lg:py-24 bg-gray-50">
      <div className="container-custom px-2 xs:px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center mb-8 xs:mb-12 md:mb-16">
          <h2 className="text-base font-semibold uppercase tracking-wide mb-3">Temel Değerlerimiz</h2>
          <p className="text-gray-600 text-xs">
            Bu ilkeler kararlarımızı yönlendirir, kültürümüzü şekillendirir ve bize olağanüstü
            ürünler ve deneyimler sunmamıza yardımcı olur.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 xs:gap-6 md:gap-8">
          {/* Value 1 */}
          <div className="bg-white p-4 xs:p-5 md:p-8 rounded-lg xs:rounded-lg md:rounded-xl shadow-sm transition-all duration-300 hover:shadow-md">
            <div className="bg-purple-light/20 p-2.5 xs:p-3 md:p-4 rounded-full inline-block mb-3 xs:mb-4 md:mb-6">
              <Award className="text-purple-default w-6 xs:w-7 md:w-8 h-6 xs:h-7 md:h-8" />
            </div>
            <h3 className="text-sm font-semibold mb-2 text-purple-dark">Kalite Mükemmelliği</h3>
            <p className="text-gray-600 text-xs">
              Performans, dayanıklılık ve kullanıcı deneyiminde beklentileri aşan ürünler sunmaya
              bağlıyız. Her ürün müşterilerimize ulaşmadan önce titiz testlerden geçer.
            </p>
          </div>

          {/* Value 2 */}
          <div className="bg-white p-4 xs:p-5 md:p-8 rounded-lg xs:rounded-lg md:rounded-xl shadow-sm transition-all duration-300 hover:shadow-md">
            <div className="bg-purple-light/20 p-2.5 xs:p-3 md:p-4 rounded-full inline-block mb-3 xs:mb-4 md:mb-6">
              <Heart className="text-purple-default w-6 xs:w-7 md:w-8 h-6 xs:h-7 md:h-8" />
            </div>
            <h3 className="text-sm font-semibold mb-2 text-purple-dark">Müşteri Öncelikli</h3>
            <p className="text-gray-600 text-xs">
              Müşterilerimiz yaptığımız her şeyin kalbinde yer alır. Geri bildirimleri dinler, ihtiyaçları
              öngörür ve taramadan satış sonrası desteğe kadar müşteri yolculuğunu sürekli iyileştirmeye çalışırız.
            </p>
          </div>

          {/* Value 3 */}
          <div className="bg-white p-4 xs:p-5 md:p-8 rounded-lg xs:rounded-lg md:rounded-xl shadow-sm transition-all duration-300 hover:shadow-md">
            <div className="bg-purple-light/20 p-2.5 xs:p-3 md:p-4 rounded-full inline-block mb-3 xs:mb-4 md:mb-6">
              <CheckCircle className="text-purple-default w-6 xs:w-7 md:w-8 h-6 xs:h-7 md:h-8" />
            </div>
            <h3 className="text-sm font-semibold mb-2 text-purple-dark">İnovasyon</h3>
            <p className="text-gray-600 text-xs">
              Yaratıcılık ve ileriye dönük düşünce kültürü foster ediyoruz. Sektör trendlerinin önünde kalarak
              yeni teknolojileri benimseyerek, hem yenilikçi hem de ilgili ürünler geliştiriyoruz.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValuesSection;