import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Mail } from "lucide-react";
import { subscribeNewsletter } from "@/services/newsletter.service";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Hata", { description: "Lütfen geçerli bir e-posta adresi girin." });
      return;
    }

    setIsLoading(true);
    try {
      await subscribeNewsletter({ email });
      toast.success("Abone Olundu!", { description: "Bültenimize abone olduğunuz için teşekkür ederiz." });
      setEmail("");
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Abonelik işlemi başarısız oldu.";
      toast.error("Hata", { description: msg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="relative section-padding overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-purple-gradient opacity-5"></div>

      <div className="container-custom relative z-10 px-2 xs:px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block p-2 xs:p-2.5 md:p-3 bg-purple-default/10 rounded-full mb-4 xs:mb-5 md:mb-6">
            <Mail size={18} className="xs:size-[20px] md:size-[24px] text-purple-default" />
          </div>
          <h2 className="text-base font-semibold uppercase tracking-wide mb-2">
            Bültenimize Abone Olun
          </h2>
          <p className="text-gray-600 mb-4 xs:mb-6 md:mb-8 max-w-xl mx-auto text-xs">
            En son ürünlerimiz, özel tekliflerimiz ve teknoloji haberlerimizle güncel kalın, doğrudan posta kutunuza teslim edelim.
          </p>

          <form
            className="flex flex-col xs:flex-row gap-2 xs:gap-3 md:gap-3 max-w-lg mx-auto"
            onSubmit={handleSubmit}
          >
            <input
              type="email"
              placeholder="E-posta adresinizi girin"
              className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-default/50"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              type="submit"
              className="btn-gradient px-4 py-2 text-sm h-9 whitespace-nowrap"
              disabled={isLoading}
            >
              {isLoading ? "Gönderiliyor..." : "Abone Ol"}
            </Button>
          </form>

          <p className="mt-2 xs:mt-3 md:mt-4 text-xs text-gray-500">
            Abone olarak Gizlilik Politikamızı kabul etmiş olursunuz. İstediğiniz zaman aboneliği iptal edebilirsiniz.
          </p>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;