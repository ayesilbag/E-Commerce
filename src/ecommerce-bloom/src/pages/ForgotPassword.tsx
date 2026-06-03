import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { forgotPassword } from "@/services/auth.service";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Hata", { description: "Lütfen e-posta adresinizi girin" });
      return;
    }

    setIsLoading(true);

    try {
      await forgotPassword(email);
      setIsSuccess(true);
      toast.success("Başarılı", {
        description: "Şifre sıfırlama bağlantısı e-posta adresinize gönderildi",
      });

      // TEST İÇİN: Email yerine konsola reset linki yazdırıyoruz
      // Backend'de email servisi çalışmadığı için test için kullanabilirsiniz
      const mockResetCode = Math.random().toString(36).substring(2, 10).toUpperCase();
      console.log("=== ŞİFRE SIFIRLAMA TEST BAĞLANTISI ===");
      console.log(`Email: ${email}`);
      console.log(`Reset Code: ${mockResetCode}`);
      console.log(`Reset URL: ${window.location.origin}/reset-password?email=${encodeURIComponent(email)}&code=${mockResetCode}`);
      console.log("===================================");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "İşlem başarısız";
      toast.error("Hata", { description: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-2 xs:px-4 sm:px-4 md:px-6 py-4 xs:py-6 sm:py-8 md:py-12">
        <div className="w-full max-w-md">
          {/* Forgot Password Container */}
          <div className="bg-gray-100 rounded-lg xs:rounded-lg sm:rounded-xl md:rounded-2xl p-4 xs:p-6 md:p-8 shadow-sm border border-gray-200">
            {/* Back Button */}
            <button
              onClick={() => navigate("/login")}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm mb-4 xs:mb-6 md:mb-6"
            >
              <ArrowLeft size={16} />
              Girişe Dön
            </button>

            {/* Header */}
            <div className="text-center mb-4 xs:mb-6 md:mb-8">
              {isSuccess ? (
                <>
                  <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 size={32} className="text-green-600" />
                  </div>
                  <h1 className="text-base font-semibold text-gray-900 mb-1">
                    Bağlantı Gönderildi
                  </h1>
                  <p className="text-xs text-gray-600">
                    Şifre sıfırlama bağlantısı e-posta adresinize gönderildi
                  </p>
                </>
              ) : (
                <>
                  <h1 className="text-base font-semibold text-gray-900 mb-1">
                    Şifrenizi mi Unuttunuz?
                  </h1>
                  <p className="text-xs text-gray-600">
                    E-posta adresinizi girin, şifre sıfırlama bağlantısı size gönderilecek
                  </p>
                </>
              )}
            </div>

            {/* Form */}
            {!isSuccess && (
              <form onSubmit={handleSubmit} className="space-y-3 xs:space-y-4 md:space-y-5">
                {/* Email Field */}
                <div className="space-y-1 xs:space-y-2 md:space-y-2">
                  <label className="text-xs xs:text-sm font-medium text-gray-700">E-Posta</label>
                  <div className="relative">
                    <Input
                      type="email"
                      placeholder="E-posta adresiniz"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pr-10 text-sm h-9"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <Mail size={14} className="xs:size-[16px] md:size-[18px]" />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-purple-gradient hover:opacity-90 text-white font-medium h-9 text-sm"
                  disabled={isLoading}
                >
                  {isLoading ? "Gönderiliyor..." : "Bağlantı Gönder"}
                </Button>
              </form>
            )}

            {/* Resend Link */}
            {isSuccess && (
              <div className="text-center mt-6 space-y-3">
                <Button
                  type="button"
                  variant="outline"
                  className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                  onClick={() => {
                    setIsSuccess(false);
                    setEmail("");
                  }}
                >
                  Bağla Yeniden Gönder
                </Button>

                {/* TEST ONLY: Direct reset link button */}
                <Button
                  type="button"
                  variant="ghost"
                  className="text-xs text-gray-400 hover:text-gray-600"
                  onClick={() => {
                    const mockResetCode = Math.random().toString(36).substring(2, 10).toUpperCase();
                    navigate(`/reset-password?email=${encodeURIComponent(email)}&code=${mockResetCode}`);
                  }}
                >
                  (Test) Şifre Sıfırlama Sayfasına Git
                </Button>
              </div>
            )}

            {/* Login Link */}
            <div className="text-center mt-6">
              <p className="text-sm text-gray-600">
                E-posta adresinize ulaştıysa{" "}
                <button
                  onClick={() => navigate("/login")}
                  className="text-purple-600 font-semibold hover:underline"
                >
                  Giriş Yap
                </button>
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ForgotPassword;