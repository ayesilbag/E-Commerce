import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { CheckCircle2, Lock } from "lucide-react";
import { resetPassword } from "@/services/auth.service";
import { uiLabel, useAppPagesUi } from "@/hooks/useAppPagesUi";

const ResetPassword = () => {
  const navigate = useNavigate();
  const auth = useAppPagesUi()?.auth;
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
    if (!formData.newPassword && uiLabel(auth?.resetPasswordRequiredMessage)) {
      e.newPassword = auth!.resetPasswordRequiredMessage!;
    }
    if (formData.newPassword.length < 6 && uiLabel(auth?.resetPasswordMinLengthMessage)) {
      e.newPassword = auth!.resetPasswordMinLengthMessage!;
    }
    if (formData.newPassword !== formData.confirmPassword && uiLabel(auth?.resetPasswordMismatchMessage)) {
      e.confirmPassword = auth!.resetPasswordMismatchMessage!;
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !resetCode) {
      if (uiLabel(auth?.resetPasswordErrorTitle)) {
        toast.error(auth!.resetPasswordErrorTitle!, {
          description: uiLabel(auth?.resetPasswordInvalidLinkDescription)
            ? auth!.resetPasswordInvalidLinkDescription!
            : undefined,
        });
      }
      navigate("/forgot-password");
      return;
    }

    if (!validate()) return;

    setIsLoading(true);

    try {
      await resetPassword({ email, resetCode, newPassword: formData.newPassword });
      setIsSuccess(true);
      if (uiLabel(auth?.resetPasswordSuccessToastTitle)) {
        toast.success(auth!.resetPasswordSuccessToastTitle!, {
          description: uiLabel(auth?.resetPasswordSuccessToastDescription)
            ? auth!.resetPasswordSuccessToastDescription!
            : undefined,
        });
      }
    } catch (error) {
      if (uiLabel(auth?.resetPasswordErrorTitle)) {
        toast.error(auth!.resetPasswordErrorTitle!, {
          description: error instanceof Error ? error.message : auth?.resetPasswordErrorFallback || undefined,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const hasForm =
    uiLabel(auth?.resetPasswordTitle) ||
    uiLabel(auth?.resetPasswordNewLabel) ||
    uiLabel(auth?.resetPasswordSubmitLabel);
  const hasSuccess =
    uiLabel(auth?.resetPasswordChangedTitle) || uiLabel(auth?.resetPasswordLoginButton);

  if (!hasForm && !hasSuccess) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-2 xs:px-4 sm:px-4 md:px-6 py-4 xs:py-6 sm:py-8 md:py-12">
        <div className="w-full max-w-md">
          <div className="bg-muted rounded-lg xs:rounded-lg sm:rounded-xl md:rounded-2xl p-4 xs:p-6 md:p-8 shadow-sm border border-border">
            {!isSuccess ? (
              hasForm && (
              <>
                <div className="text-center mb-4 xs:mb-6 md:mb-8">
                  <div className="mx-auto w-16 h-16 bg-primary/15 rounded-full flex items-center justify-center mb-4">
                    <Lock size={32} className="text-primary" />
                  </div>
                  {uiLabel(auth?.resetPasswordTitle) && (
                    <h1 className="text-base font-semibold text-foreground mb-1">
                      {auth!.resetPasswordTitle}
                    </h1>
                  )}
                  {uiLabel(auth?.resetPasswordSuccessDescription) && (
                    <p className="text-xs text-muted-foreground">
                      {auth!.resetPasswordSuccessDescription}
                    </p>
                  )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-3 xs:space-y-4 md:space-y-5">
                  {uiLabel(auth?.resetPasswordNewLabel) && (
                  <div className="space-y-1 xs:space-y-2 md:space-y-2">
                    <label className="text-xs xs:text-sm font-medium text-foreground">
                      {auth!.resetPasswordNewLabel}
                    </label>
                    <Input
                      type="password"
                      placeholder={uiLabel(auth?.passwordPlaceholder) ? auth!.passwordPlaceholder! : undefined}
                      value={formData.newPassword}
                      onChange={(ev) => setFormData((prev) => ({ ...prev, newPassword: ev.target.value }))}
                      className={`text-sm h-9 ${errors.newPassword ? "border-red-500" : ""}`}
                    />
                    {errors.newPassword && (
                      <p className="text-xs text-red-500">{errors.newPassword}</p>
                    )}
                  </div>
                  )}

                  {uiLabel(auth?.resetPasswordConfirmLabel) && (
                  <div className="space-y-1 xs:space-y-2 md:space-y-2">
                    <label className="text-xs xs:text-sm font-medium text-foreground">
                      {auth!.resetPasswordConfirmLabel}
                    </label>
                    <Input
                      type="password"
                      placeholder={
                        uiLabel(auth?.resetPasswordConfirmPlaceholder)
                          ? auth!.resetPasswordConfirmPlaceholder!
                          : undefined
                      }
                      value={formData.confirmPassword}
                      onChange={(ev) => setFormData((prev) => ({ ...prev, confirmPassword: ev.target.value }))}
                      className={`text-sm h-9 ${errors.confirmPassword ? "border-red-500" : ""}`}
                    />
                    {errors.confirmPassword && (
                      <p className="text-xs text-red-500">{errors.confirmPassword}</p>
                    )}
                  </div>
                  )}

                  {uiLabel(auth?.resetPasswordSubmitLabel) && (
                  <Button
                    type="submit"
                    className="w-full bg-primary text-primary-foreground hover:opacity-90 font-medium h-9 text-sm"
                    disabled={isLoading}
                  >
                    {isLoading && uiLabel(auth?.resetPasswordSubmittingLabel)
                      ? auth!.resetPasswordSubmittingLabel
                      : auth!.resetPasswordSubmitLabel}
                  </Button>
                  )}
                </form>
              </>
              )
            ) : (
              hasSuccess && (
              <div className="text-center">
                <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 size={40} className="text-green-600" />
                </div>
                {uiLabel(auth?.resetPasswordChangedTitle) && (
                  <h1 className="text-base font-semibold text-foreground mb-2">
                    {auth!.resetPasswordChangedTitle}
                  </h1>
                )}
                {uiLabel(auth?.resetPasswordChangedDescription) && (
                  <p className="text-xs text-muted-foreground mb-6">
                    {auth!.resetPasswordChangedDescription}
                  </p>
                )}
                {uiLabel(auth?.resetPasswordLoginButton) && (
                  <Button
                    onClick={() => navigate("/login")}
                    className="bg-primary text-primary-foreground hover:opacity-90 font-medium h-11"
                  >
                    {auth!.resetPasswordLoginButton}
                  </Button>
                )}
              </div>
              )
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ResetPassword;
