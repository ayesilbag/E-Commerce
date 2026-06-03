import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SocialLinks from "@/components/SocialLinks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";
import { sendContactMessage } from "@/services/contact.service";
import {
  AtSign,
  Clock,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  User
} from "lucide-react";

const Contact = () => {
  const location = useLocation();
  const { toast } = useToast();
  const settings = useSiteSettings();

  useEffect(() => {
    if (location.hash === "#faq") {
      const el = document.getElementById("faq");
      if (el) {
        requestAnimationFrame(() => {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      }
    }
  }, [location.hash]);
  const hasSocialLinks = Object.values(settings.socialLinks ?? {}).some(Boolean);
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await sendContactMessage(formState);
      toast({
        title: "Mesaj gönderildi",
        description: result.message,
      });
      setFormState({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
    } catch (error) {
      toast({
        title: "Mesaj gönderilemedi",
        description: error instanceof Error ? error.message : "Bir hata oluştu",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Contact Information and Form */}
        <section className="py-8 xs:py-12 sm:py-12 md:py-16 lg:py-16">
          <div className="container-custom px-2 xs:px-4 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 xs:gap-8 sm:gap-8 md:gap-10">
              {/* Contact Information */}
              <div className="md:col-span-5 lg:col-span-4">
                <h2 className="text-sm font-semibold uppercase tracking-wide mb-4 xs:mb-6 md:mb-6">İletişim Bilgileri</h2>

                <div className="bg-white rounded-lg xs:rounded-lg sm:rounded-xl md:rounded-xl shadow-sm p-4 xs:p-5 md:p-6 mb-6 xs:mb-8 md:mb-8">
                  <div className="space-y-4 xs:space-y-5 md:space-y-6">
                    {settings.address && (
                      <div className="flex items-start gap-2 xs:gap-3 md:gap-4">
                        <div className="bg-purple-light/20 p-2.5 xs:p-3 md:p-3 rounded-full flex-shrink-0">
                          <MapPin className="text-purple-default xs:size-[18px] md:size-[20px]" size={16} />
                        </div>
                        <div>
                          <h3 className="font-medium text-sm">Konumumuz</h3>
                          <p className="text-gray-500 text-xs whitespace-pre-line">
                            {settings.address}
                          </p>
                        </div>
                      </div>
                    )}

                    {settings.emails.length > 0 && (
                      <div className="flex items-start gap-2 xs:gap-3 md:gap-4">
                        <div className="bg-purple-light/20 p-2.5 xs:p-3 md:p-3 rounded-full flex-shrink-0">
                          <Mail className="text-purple-default xs:size-[18px] md:size-[20px]" size={16} />
                        </div>
                        <div>
                          <h3 className="font-medium text-sm">E-posta Adresi</h3>
                          <div className="text-gray-500">
                            {settings.emails.map((email) => (
                              <p key={email}>
                                <a href={`mailto:${email}`} className="hover:text-purple-default transition-colors">
                                  {email}
                                </a>
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {settings.phones.length > 0 && (
                      <div className="flex items-start gap-4">
                        <div className="bg-purple-light/20 p-3 rounded-full">
                          <Phone className="text-purple-default" size={20} />
                        </div>
                        <div>
                          <h3 className="font-medium text-sm">Telefon Numarası</h3>
                          <div className="text-gray-500">
                            {settings.phones.map((phone) => (
                              <p key={phone}>
                                <a href={`tel:${phone.replace(/\s/g, "")}`} className="hover:text-purple-default transition-colors">
                                  {phone}
                                </a>
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {settings.workingHours.length > 0 && (
                      <div className="flex items-start gap-4">
                        <div className="bg-purple-light/20 p-3 rounded-full">
                          <Clock className="text-purple-default" size={20} />
                        </div>
                        <div>
                          <h3 className="font-medium text-sm">Çalışma Saatleri</h3>
                          <div className="text-gray-500">
                            {settings.workingHours.map((hours) => (
                              <p key={hours}>{hours}</p>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {hasSocialLinks && (
                  <div>
                    <h2 className="text-sm font-semibold uppercase tracking-wide mb-4">Bizi Takip Edin</h2>
                    <SocialLinks links={settings.socialLinks} variant="contact" />
                  </div>
                )}
              </div>

              {/* Contact Form */}
              <div className="md:col-span-7 lg:col-span-8">
                <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
                  <h2 className="text-sm font-semibold uppercase tracking-wide mb-6">Bize Mesaj Gönderin</h2>
                  <p className="text-gray-500 mb-8">
                    Aşağıdaki formu doldurun, ekibimiz en kısa sürede size dönüş yapacaktır.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="relative">
                        <label htmlFor="name" className="block text-sm font-medium mb-2">
                          Adınız Soyadınız
                        </label>
                        <div className="relative">
                          <Input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Ahmet Yılmaz"
                            required
                            value={formState.name}
                            onChange={handleChange}
                            className="pl-10"
                          />
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-2">
                          E-posta Adresiniz
                        </label>
                        <div className="relative">
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="ahmet@example.com"
                            required
                            value={formState.email}
                            onChange={handleChange}
                            className="pl-10"
                          />
                          <AtSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium mb-2">
                        Konu
                      </label>
                      <div className="relative">
                        <Input
                          id="subject"
                          name="subject"
                          type="text"
                          placeholder="Bu hakkında ne?"
                          required
                          value={formState.subject}
                          onChange={handleChange}
                          className="pl-10"
                        />
                        <MessageSquare className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-2">
                        Mesajınız
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Mesajınızı buraya yazın..."
                        rows={6}
                        required
                        value={formState.message}
                        onChange={handleChange}
                        className="resize-none"
                      />
                    </div>

                    <div>
                      <Button
                        type="submit"
                        className="btn-gradient w-full md:w-auto"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Gönderiliyor...
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <Send size={18} className="mr-2" />
                            Mesaj Gönder
                          </span>
                        )}
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-12 bg-gray-50">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-base font-semibold uppercase tracking-wide mb-4">Haritada Bizi Bulun</h2>
              <p className="text-gray-500 max-w-2xl mx-auto">
                {settings.address
                  ? settings.address
                  : "Ofisimiz teknoloji bölgesinin kalbinde uygun bir konumda bulunmaktadır. Çalışma saatleri boyunca bize uğramaktan çekinmeyin."}
              </p>
            </div>

            {/* Map placeholder */}
            <div className="h-96 rounded-xl overflow-hidden border border-gray-200 bg-white p-4">
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                  <MapPin size={48} className="mx-auto mb-4 text-purple-default" />
                  <p className="font-medium">Harita Yer Tutucusu</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Üretim ortamında, buraya interaktif bir harita görüntülenecektir.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-16 bg-white scroll-mt-24">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-base font-semibold uppercase tracking-wide mb-4">Sıkça Sorulan Sorular</h2>
              <p className="text-gray-500 max-w-2xl mx-auto">
                Ürünlerimiz, hizmetlerimiz ve politikalarımız hakkında yaygın sorulara yanıt bulun.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-sm font-semibold mb-3">Kargo seçenekleriniz nelerdir?</h3>
                <p className="text-gray-600">
                  Çoğu konum için standart kargo (3-5 iş günü), express kargo (1-2 iş günü) ve
                  ertesi gün teslimat seçenekleri sunuyoruz. Kargo maliyetleri ve teslimat süreleri
                  konumunuza göre değişebilir.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-sm font-semibold mb-3">İade politikanız nedir?</h3>
                <p className="text-gray-600">
                  Çoğu ürün için 30 günlük iade politikası sunuyoruz. Ürünler orijinal
                  paketlerinde ve kullanılmamış durumda olmalıdır. Bazı ürünlerde özel iade
                  kısıtlamaları olabilir, açıklamalarında belirtilecektir.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-sm font-semibold mb-3">Uluslararası kargo sunuyor musunuz?</h3>
                <p className="text-gray-600">
                  Evet, dünyadaki çoğu ülkeye kargoluyoruz. Uluslararası kargo maliyetleri ve teslimat
                  süreleri konuma göre değişir. İthal vergileri ve gümrük ücretleri uygulanabilir ve
                  müşterinin sorumluluğundadır.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-sm font-semibold mb-3">Siparişimi nasıl takip edebilirim?</h3>
                <p className="text-gray-600">
                  Siparişiniz kargolandığında, takip bilgileri içeren bir doğrulama e-postası alacaksınız.
                  Ayrıca web sitemizdeki hesabınıza giriş yaparak sipariş durumunuzu ve
                  takip detaylarınızı her zaman görüntüleyebilirsiniz.
                </p>
              </div>
            </div>

            <div className="text-center mt-12">
              <p className="text-gray-500 mb-4">Hala sorularınız var mı?</p>
              <Button className="btn-gradient">
                Tüm SSS'leri Görüntüle
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
