import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { uiLabel, useAppPagesUi } from "@/hooks/useAppPagesUi";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Mail, Eye, EyeOff } from "lucide-react";

const REMEMBER_KEY = "bizdenalbizdensat_remember_email";

const Login = () => {
  const auth = useAppPagesUi()?.auth;
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
    } catch (error) {
      const errorTitle = uiLabel(auth?.loginErrorTitle);
      if (errorTitle) {
        const errorMessage =
          error instanceof Error ? error.message : uiLabel(auth?.loginErrorFallback);
        toast.error(errorTitle, { description: errorMessage });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loginButtonLabel = isLoading
    ? uiLabel(auth?.loginSubmittingLabel)
    : uiLabel(auth?.loginButtonLabel);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-2 xs:px-4 sm:px-4 md:px-6 py-4 xs:py-6 sm:py-8 md:py-12">
        <div className="w-full max-w-md">
          <div className="bg-muted rounded-lg xs:rounded-lg sm:rounded-xl md:rounded-2xl p-4 xs:p-6 md:p-8 shadow-sm border border-border">
            {(uiLabel(auth?.loginTitle) || uiLabel(auth?.loginSubtitle)) && (
              <div className="text-center mb-4 xs:mb-6 md:mb-8">
                {uiLabel(auth?.loginTitle) && (
                  <h1 className="text-base font-semibold text-foreground mb-1">{auth!.loginTitle}</h1>
                )}
                {uiLabel(auth?.loginSubtitle) && (
                  <p className="text-xs text-muted-foreground">{auth!.loginSubtitle}</p>
                )}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3 xs:space-y-4 md:space-y-5">
              {(uiLabel(auth?.emailLabel) || uiLabel(auth?.emailPlaceholder)) && (
                <div className="space-y-1 xs:space-y-2 md:space-y-2">
                  {uiLabel(auth?.emailLabel) && (
                    <label className="text-xs xs:text-sm font-medium text-foreground">{auth!.emailLabel}</label>
                  )}
                  <div className="relative">
                    <Input
                      type="email"
                      name="email"
                      autoComplete="email"
                      placeholder={uiLabel(auth?.emailPlaceholder)}
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="pr-10 text-sm h-9"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <Mail size={14} className="xs:size-[16px] md:size-[18px]" />
                    </div>
                  </div>
                </div>
              )}

              {(uiLabel(auth?.passwordLabel) || uiLabel(auth?.passwordPlaceholder) || uiLabel(auth?.forgotPasswordLink)) && (
                <div className="space-y-1 xs:space-y-2 md:space-y-2">
                  <div className="flex items-center justify-between">
                    {uiLabel(auth?.passwordLabel) && (
                      <label className="text-xs xs:text-sm font-medium text-foreground">{auth!.passwordLabel}</label>
                    )}
                    {uiLabel(auth?.forgotPasswordLink) && (
                      <button
                        type="button"
                        onClick={() => navigate("/forgot-password")}
                        className="text-xs xs:text-sm text-primary hover:underline"
                      >
                        {auth!.forgotPasswordLink}
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      autoComplete="current-password"
                      placeholder={uiLabel(auth?.passwordPlaceholder)}
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="pr-10 text-sm h-9"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-muted-foreground"
                    >
                      {showPassword ? <EyeOff size={14} className="xs:size-[16px] md:size-[18px]" /> : <Eye size={14} className="xs:size-[16px] md:size-[18px]" />}
                    </button>
                  </div>
                </div>
              )}

              {uiLabel(auth?.rememberMeLabel) && (
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(v) => setRememberMe(v === true)}
                    className="w-4 h-4"
                  />
                  <label
                    htmlFor="remember"
                    className="text-xs xs:text-sm text-muted-foreground cursor-pointer select-none"
                  >
                    {auth!.rememberMeLabel}
                  </label>
                </div>
              )}

              {loginButtonLabel && (
                <Button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground hover:opacity-90 font-medium h-9 text-sm"
                  disabled={isLoading || authLoading}
                >
                  {loginButtonLabel}
                </Button>
              )}
            </form>

            {(uiLabel(auth?.loginNoAccountText) || uiLabel(auth?.loginRegisterLink)) && (
              <div className="text-center mt-6">
                <p className="text-sm text-muted-foreground">
                  {uiLabel(auth?.loginNoAccountText) && <>{auth!.loginNoAccountText}{" "}</>}
                  {uiLabel(auth?.loginRegisterLink) && (
                    <button
                      onClick={() => navigate("/register")}
                      className="text-primary font-semibold hover:underline"
                    >
                      {auth!.loginRegisterLink}
                    </button>
                  )}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
