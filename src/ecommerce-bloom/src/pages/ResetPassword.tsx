import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { CheckCircle2, Lock } from "lucide-react";
import { resetPassword } from "@/services/auth.service";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const email = searchParams.get("email") || "";
  const resetCode = searchParams.get("code") || "";

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!formData.newPassword) e.newPassword = "Yeni şifre zorunludur";
    if (formData.newPassword.length < 6) e.newPassword = "Şifre en az 6 karakter olmalıdır";
    if (formData.newPassword !== formData.confirmPassword) e.confirmPassword = "Şifreler eşleşmiyor";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !resetCode) {
      toast.error("Hata", { description: "Geçersiz şifre sıfırlama bağlantısı" });
      navigate("/forgot-password");
      return;
    }

    if (!validate()) return;

    setIsLoading(true);

    try {
      await resetPassword({ email, resetCode, newPassword: formData.newPassword });
      setIsSuccess(true);
      toast.success("Başarılı", {
        description: "Şifreniz başarıyla değiştirildi",
      });
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
          {/* Reset Password Container */}
          <div className="bg-gray-100 rounded-lg xs:rounded-lg sm:rounded-xl md:rounded-2xl p-4 xs:p-6 md:p-8 shadow-sm border border-gray-200">
            {!isSuccess ? (
              <>
                {/* Header */}
                <div className="text-center mb-4 xs:mb-6 md:mb-8">
                  <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                    <Lock size={32} className="text-purple-600" />
                  </div>
                  <h1 className="text-base font-semibold text-gray-900 mb-1">
                    Şifrenizi Sıfırlayın
                  </h1>
                  <p className="text-xs text-gray-600">
                    Yeni şifrenizi girin
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-3 xs:space-y-4 md:space-y-5">
                  {/* New Password */}
                  <div className="space-y-1 xs:space-y-2 md:space-y-2">
                    <label className="text-xs xs:text-sm font-medium text-gray-700">
                      Yeni Şifre
                    </label>
                    <Input
                      type="password"
                      placeholder="Yeni şifreniz"
                      value={formData.newPassword}
                      onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                      className={`text-sm h-9 ${errors.newPassword ? 'border-red-500' : ''}`}
                    />
                    {errors.newPassword && (
                      <p className="text-xs text-red-500">{errors.newPassword}</p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-1 xs:space-y-2 md:space-y-2">
                    <label className="text-xs xs:text-sm font-medium text-gray-700">
                      Şifre Tekrar
                    </label>
                    <Input
                      type="password"
                      placeholder="Şifrenizi tekrar girin"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className={`text-sm h-9 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                    />
                    {errors.confirmPassword && (
                      <p className="text-xs text-red-500">{errors.confirmPassword}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full bg-purple-gradient hover:opacity-90 text-white font-medium h-9 text-sm"
                    disabled={isLoading}
                  >
                    {isLoading ? "İşleniyor..." : "Şifreyi Değiştir"}
                  </Button>
                </form>
              </>
            ) : (
              <>
                {/* Success State */}
                <div className="text-center">
                  <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 size={40} className="text-green-600" />
                  </div>
                  <h1 className="text-base font-semibold text-gray-900 mb-2">
                    Şifre Değiştirildi!
                  </h1>
                  <p className="text-xs text-gray-600 mb-6">
                    Şifreniz başarıyla değiştirildi. Yeni şifrenizle giriş yapabilirsiniz.
                  </p>
                  <Button
                    onClick={() => navigate("/login")}
                    className="bg-purple-gradient hover:opacity-90 text-white font-medium h-11"
                  >
                    Giriş Yap
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ResetPassword;