import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { uiLabel, useAppPagesUi } from "@/hooks/useAppPagesUi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Mail, Eye, EyeOff } from "lucide-react";
import { register as apiRegister } from "@/services/auth.service";

const Register = () => {
  const auth = useAppPagesUi()?.auth;
  const navigate = useNavigate();
  const kvkkConsentText = uiLabel(auth?.registerKvkkConsentText);
  const requiresKvkk = !!kvkkConsentText;

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

  const showValidationError = (message?: string) => {
    const title = uiLabel(auth?.registerValidationErrorTitle);
    if (title && message) {
      toast.error(title, { description: message });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.email || !formData.password) {
      showValidationError(uiLabel(auth?.registerEmptyFieldsMessage));
      setIsLoading(false);
      return;
    }

    if (requiresKvkk && !kvkkAccepted) {
      showValidationError(uiLabel(auth?.registerKvkkRequiredMessage));
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      showValidationError(uiLabel(auth?.registerPasswordMinMessage));
      setIsLoading(false);
      return;
    }

    try {
      await apiRegister({
        email: formData.email,
        password: formData.password,
      });

      const successTitle = uiLabel(auth?.registerSuccessTitle);
      if (successTitle) {
        toast.success(successTitle, {
          description: uiLabel(auth?.registerSuccessDescription),
        });
      }

      navigate("/login");
    } catch (error) {
      const errorTitle = uiLabel(auth?.registerErrorTitle);
      if (errorTitle) {
        const errorMessage =
          error instanceof Error ? error.message : uiLabel(auth?.registerErrorFallback);
        toast.error(errorTitle, { description: errorMessage });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const registerButtonLabel = isLoading
    ? uiLabel(auth?.registerSubmittingLabel)
    : uiLabel(auth?.registerButtonLabel);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-2 xs:px-4 sm:px-4 md:px-6 py-4 xs:py-6 sm:py-8 md:py-12">
        <div className="w-full max-w-md">
          <div className="bg-muted rounded-lg xs:rounded-lg sm:rounded-xl md:rounded-2xl p-4 xs:p-6 md:p-8 shadow-sm border border-border">
            {(uiLabel(auth?.registerTitle) || uiLabel(auth?.registerSubtitle)) && (
              <div className="text-center mb-4 xs:mb-6 md:mb-8">
                {uiLabel(auth?.registerTitle) && (
                  <h1 className="text-base font-semibold text-foreground mb-1">{auth!.registerTitle}</h1>
                )}
                {uiLabel(auth?.registerSubtitle) && (
                  <p className="text-xs text-muted-foreground">{auth!.registerSubtitle}</p>
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

              {(uiLabel(auth?.passwordLabel) || uiLabel(auth?.passwordPlaceholder)) && (
                <div className="space-y-1 xs:space-y-2 md:space-y-2">
                  {uiLabel(auth?.passwordLabel) && (
                    <label className="text-xs xs:text-sm font-medium text-foreground">{auth!.passwordLabel}</label>
                  )}
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      autoComplete="new-password"
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

              {kvkkConsentText && (
                <div className="flex items-start gap-2">
                  <Checkbox
                    id="kvkk"
                    checked={kvkkAccepted}
                    onCheckedChange={(v) => setKvkkAccepted(v === true)}
                    className="mt-0.5 w-4 h-4 shrink-0"
                  />
                  <label htmlFor="kvkk" className="text-xs text-muted-foreground leading-relaxed cursor-pointer">
                    {kvkkConsentText}
                  </label>
                </div>
              )}

              {registerButtonLabel && (
                <Button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground hover:opacity-90 font-medium h-9 text-sm"
                  disabled={isLoading || (requiresKvkk && !kvkkAccepted)}
                >
                  {registerButtonLabel}
                </Button>
              )}
            </form>

            {(uiLabel(auth?.registerHasAccountText) || uiLabel(auth?.registerLoginLink)) && (
              <div className="text-center mt-4 xs:mt-5 md:mt-6">
                <p className="text-xs xs:text-sm text-muted-foreground">
                  {uiLabel(auth?.registerHasAccountText) && <>{auth!.registerHasAccountText}{" "}</>}
                  {uiLabel(auth?.registerLoginLink) && (
                    <button
                      onClick={() => navigate("/login")}
                      className="text-primary font-semibold hover:underline"
                    >
                      {auth!.registerLoginLink}
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

export default Register;
