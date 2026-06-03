const StorySection = () => {
  return (
    <section className="py-8 xs:py-12 sm:py-16 md:py-20 lg:py-24 bg-white">
      <div className="container-custom px-2 xs:px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center mb-8 xs:mb-12 md:mb-16">
          <h2 className="text-base font-semibold uppercase tracking-wide mb-3">Hikayemiz</h2>
          <p className="text-gray-600 text-xs">
            Bizdenalbizdensat'ın bugünlere gelmesine yolculayan yolculuk - tutku, azim ve mükemmelliğe
            bağlılık hikayesi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 xs:gap-8 md:gap-12 lg:gap-16 items-center">
          <div>
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format"
              alt="Ekip birlikte çalışıyor"
              className="rounded-lg xs:rounded-lg sm:rounded-xl md:rounded-xl shadow-lg"
            />
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-2 text-purple-dark">Garajdan Global'e</h3>
            <p className="text-gray-600 mb-3 text-xs">
              Bizdenalbizdensat, 2015 yılında küçük bir garajda sadece üç kişi ve insanların yaşamını gerçekten
              iyileştirecek elektronik ürünler yaratma vizyonuyla başladı. Kurucularımız, hepsi mühendislik
              geçmişine sahip teknoloji tutkunları, sadece teknolojik olarak gelişmiş değil aynı zamanda
              erişilebilir ve kullanıcı dostu ürünler inşa etmek istediler.
            </p>
            <p className="text-gray-600 mb-3 text-xs">
              Beş yıl içinde, mütevazı başlangıçlarımızdan üç kıtada 200'den fazla tutkulu bireyden oluşan
              bir ekibe genişledik. Bugün, ilk günden itibaren bizi yönlendiren aynı tutku ve müşteri odaklı
              yaklaşımı sürdürmekten gurur duyuyoruz.
            </p>
            <div className="flex gap-4 xs:gap-6 md:gap-8 mt-4 xs:mt-6 md:mt-8">
              <div>
                <p className="text-base font-semibold text-purple-default mb-0.5">200+</p>
                <p className="text-gray-500 text-xs">Ekip Üyesi</p>
              </div>
              <div>
                <p className="text-base font-semibold text-purple-default mb-0.5">50+</p>
                <p className="text-gray-500 text-xs">Ülke</p>
              </div>
              <div>
                <p className="text-base font-semibold text-purple-default mb-0.5">1M+</p>
                <p className="text-gray-500 text-xs">Mutlu Müşteri</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StorySection;