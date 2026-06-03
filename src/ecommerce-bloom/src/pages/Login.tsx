import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Mail, Eye, EyeOff } from "lucide-react";

const REMEMBER_KEY = "bizdenalbizdensat_remember_email";

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(() => !!localStorage.getItem(REMEMBER_KEY));
  const [formData, setFormData] = useState({
    email: localStorage.getItem(REMEMBER_KEY) ?? "",
    password: ""
  });

  // Navigate to /account when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/account");
    }
  }, [isAuthenticated, navigate]);

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

      toast.success("Giriş başarılı!", {
        description: "Başarıyla giriş yaptınız.",
      });

      // Navigation handled by useEffect watching isAuthenticated
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

            {/* Divider */}
            <div className="flex items-center my-4 xs:my-5 md:my-6">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-2 xs:px-3 md:px-4 text-xs xs:text-sm text-gray-500">Veya</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {/* Alternative Login */}
            <Button
              type="button"
              variant="outline"
              className="w-full flex items-center justify-center gap-2 h-9 text-sm border-gray-300 hover:bg-gray-100"
            >
              <svg className="w-4 xs:w-5 md:w-5 h-4 xs:h-5 md:h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="text-gray-700 font-medium">Google ile devam et</span>
            </Button>

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
