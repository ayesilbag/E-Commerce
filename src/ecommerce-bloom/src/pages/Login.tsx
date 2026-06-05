import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import usePageTitle from "@/hooks/usePageTitle";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Mail, Eye, EyeOff } from "lucide-react";

const REMEMBER_KEY = "bizdenalbizdensat_remember_email";

const Login = () => {
  usePageTitle("Giriş Yap");
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(() => !!localStorage.getItem(REMEMBER_KEY));
  const [formData, setFormData] = useState({
    email: localStorage.getItem(REMEMBER_KEY) ?? "",
    password: ""
  });

  // Login olduktan sonra önceki sayfaya ya da /account'a yönlendir
  useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as any)?.from || "/account";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location.state]);

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

    try {
      await login(formData.email, formData.password);

      if (rememberMe) {
        localStorage.setItem(REMEMBER_KEY, formData.email);
      } else {
        localStorage.removeItem(REMEMBER_KEY);
      }
      // Yönlendirme isAuthenticated useEffect tarafından yapılır
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Giriş başarısız";
      toast.error("Giriş başarısız", {
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
          {/* Login Container */}
          <div className="bg-gray-100 rounded-lg xs:rounded-lg sm:rounded-xl md:rounded-2xl p-4 xs:p-6 md:p-8 shadow-sm border border-gray-200">
            {/* Header */}
            <div className="text-center mb-4 xs:mb-6 md:mb-8">
              <h1 className="text-base font-semibold text-gray-900 mb-1">Hesabınıza Giriş Yapın</h1>
              <p className="text-xs text-gray-600">Alışverişe devam etmek için bilgilerinizi girin</p>
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
                <div className="flex items-center justify-between">
                  <label className="text-xs xs:text-sm font-medium text-gray-700">Şifre</label>
                  <button
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                    className="text-xs xs:text-sm text-purple-default hover:underline"
                  >
                    Şifrenizi mi unuttunuz?
                  </button>
                </div>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    autoComplete="current-password"
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

              {/* Remember Me */}
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(v) => setRememberMe(v === true)}
                  className="w-4 h-4"
                />
                <label
                  htmlFor="remember"
                  className="text-xs xs:text-sm text-gray-600 cursor-pointer select-none"
                >
                  Beni hatırla
                </label>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                className="w-full bg-purple-gradient hover:opacity-90 text-white font-medium h-9 text-sm"
                disabled={isLoading}
              >
                {isLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
              </Button>
            </form>

            {/* Register Link */}
            <div className="text-center mt-6">
              <p className="text-sm text-gray-600">
                Hesabınız yok mu?{" "}
                <button
                  onClick={() => navigate("/register")}
                  className="text-purple-default font-semibold hover:underline"
                >
                  Kayıt Ol
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

export default Login;
