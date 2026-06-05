import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import usePageTitle from "@/hooks/usePageTitle";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Mail, Eye, EyeOff } from "lucide-react";
import { register as apiRegister } from "@/services/auth.service";

const Register = () => {
  usePageTitle("Kayıt Ol");
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [kvkkAccepted, setKvkkAccepted] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.email || !formData.password) {
      toast.error("Hata", { description: "Email ve şifre boş bırakılamaz." });
      setIsLoading(false);
      return;
    }

    if (!kvkkAccepted) {
      toast.error("Hata", { description: "Devam etmek için KVKK metnini ve gizlilik politikasını kabul etmelisiniz." });
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Hata", { description: "Şifre en az 6 karakter olmalıdır." });
      setIsLoading(false);
      return;
    }

    try {
      await apiRegister({
        email: formData.email,
        password: formData.password,
      });

      toast.success("Hesap başarıyla oluşturuldu!", {
        description: "Hesabınız oluşturuldu. Bizdenalbizdensat'a hoş geldiniz!",
      });

      navigate("/login");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Hesap oluşturma başarısız";
      toast.error("Kayıt başarısız", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-2 xs:px-4 sm:px-4 md:px-6 py-4 xs:py-6 sm:py-8 md:py-12">
        <div className="w-full max-w-md">
          {/* Register Container */}
          <div className="bg-gray-100 rounded-lg xs:rounded-lg sm:rounded-xl md:rounded-2xl p-4 xs:p-6 md:p-8 shadow-sm border border-gray-200">
            {/* Header */}
            <div className="text-center mb-4 xs:mb-6 md:mb-8">
              <h1 className="text-base font-semibold text-gray-900 mb-1">Hesap Oluştur</h1>
              <p className="text-xs text-gray-600">Email ve şifre ile kaydolun</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3 xs:space-y-4 md:space-y-5">
              {/* Email Field */}
              <div className="space-y-1 xs:space-y-2 md:space-y-2">
                <label className="text-xs xs:text-sm font-medium text-gray-700">E-Posta</label>
                <div className="relative">
                  <Input
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder="E-posta adresiniz"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="pr-10 text-sm h-9"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Mail size={14} className="xs:size-[16px] md:size-[18px]" />
                  </div>
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1 xs:space-y-2 md:space-y-2">
                <label className="text-xs xs:text-sm font-medium text-gray-700">Şifre</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    autoComplete="new-password"
                    placeholder="Şifreniz"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="pr-10 text-sm h-9"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={14} className="xs:size-[16px] md:size-[18px]" /> : <Eye size={14} className="xs:size-[16px] md:size-[18px]" />}
                  </button>
                </div>
              </div>

              {/* KVKK Onayı */}
              <div className="flex items-start gap-2">
                <Checkbox
                  id="kvkk"
                  checked={kvkkAccepted}
                  onCheckedChange={(v) => setKvkkAccepted(v === true)}
                  className="mt-0.5 w-4 h-4 shrink-0"
                />
                <label htmlFor="kvkk" className="text-xs text-gray-600 leading-relaxed cursor-pointer">
                  <Link to="/privacy" className="text-purple-600 hover:underline font-medium">Kişisel Verilerin Korunması (KVKK)</Link> metnini
                  ve{" "}
                  <Link to="/distance-selling" className="text-purple-600 hover:underline font-medium">Mesafeli Satış Sözleşmesi</Link>'ni
                  {" "}okudum ve kabul ediyorum.
                </label>
              </div>

              {/* Register Button */}
              <Button
                type="submit"
                className="w-full bg-purple-gradient hover:opacity-90 text-white font-medium h-9 text-sm"
                disabled={isLoading || !kvkkAccepted}
              >
                {isLoading ? "Hesap oluşturuluyor..." : "Kayıt Ol"}
              </Button>
            </form>

            {/* Login Link */}
            <div className="text-center mt-4 xs:mt-5 md:mt-6">
              <p className="text-xs xs:text-sm text-gray-600">
                Zaten bir hesabınız var mı?{" "}
                <button
                  onClick={() => navigate("/login")}
                  className="text-purple-default font-semibold hover:underline"
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

export default Register;
