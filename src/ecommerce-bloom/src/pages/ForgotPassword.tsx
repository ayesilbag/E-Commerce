import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { uiLabel, useAppPagesUi } from "@/hooks/useAppPagesUi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { forgotPassword } from "@/services/auth.service";

const ForgotPassword = () => {
  const auth = useAppPagesUi()?.auth;
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      const errorTitle = uiLabel(auth?.forgotErrorTitle);
      const emptyMessage = uiLabel(auth?.forgotEmptyEmailMessage);
      if (errorTitle && emptyMessage) {
        toast.error(errorTitle, { description: emptyMessage });
      }
      return;
    }

    setIsLoading(true);

    try {
      await forgotPassword(email);
      setIsSuccess(true);
      const successTitle = uiLabel(auth?.forgotSuccessToastTitle);
      if (successTitle) {
        toast.success(successTitle, {
          description: uiLabel(auth?.forgotSuccessToastDescription),
        });
      }
    } catch (error) {
      const errorTitle = uiLabel(auth?.forgotErrorTitle);
      if (errorTitle) {
        const errorMessage =
          error instanceof Error ? error.message : uiLabel(auth?.forgotErrorFallback);
        toast.error(errorTitle, { description: errorMessage });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const submitButtonLabel = isLoading
    ? uiLabel(auth?.forgotSubmittingLabel)
    : uiLabel(auth?.forgotSubmitLabel);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-2 xs:px-4 sm:px-4 md:px-6 py-4 xs:py-6 sm:py-8 md:py-12">
        <div className="w-full max-w-md">
          <div className="bg-muted rounded-lg xs:rounded-lg sm:rounded-xl md:rounded-2xl p-4 xs:p-6 md:p-8 shadow-sm border border-border">
            {uiLabel(auth?.forgotBackToLogin) && (
              <button
                onClick={() => navigate("/login")}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm mb-4 xs:mb-6 md:mb-6"
              >
                <ArrowLeft size={16} />
                {auth!.forgotBackToLogin}
              </button>
            )}

            <div className="text-center mb-4 xs:mb-6 md:mb-8">
              {isSuccess ? (
                <>
                  <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 size={32} className="text-green-600" />
                  </div>
                  {uiLabel(auth?.forgotSuccessTitle) && (
                    <h1 className="text-base font-semibold text-foreground mb-1">
                      {auth!.forgotSuccessTitle}
                    </h1>
                  )}
                  {uiLabel(auth?.forgotSuccessSubtitle) && (
                    <p className="text-xs text-muted-foreground">
                      {auth!.forgotSuccessSubtitle}
                    </p>
                  )}
                </>
              ) : (
                <>
                  {uiLabel(auth?.forgotTitle) && (
                    <h1 className="text-base font-semibold text-foreground mb-1">
                      {auth!.forgotTitle}
                    </h1>
                  )}
                  {uiLabel(auth?.forgotSubtitle) && (
                    <p className="text-xs text-muted-foreground">
                      {auth!.forgotSubtitle}
                    </p>
                  )}
                </>
              )}
            </div>

            {!isSuccess && (
              <form onSubmit={handleSubmit} className="space-y-3 xs:space-y-4 md:space-y-5">
                {(uiLabel(auth?.emailLabel) || uiLabel(auth?.emailPlaceholder)) && (
                  <div className="space-y-1 xs:space-y-2 md:space-y-2">
                    {uiLabel(auth?.emailLabel) && (
                      <label className="text-xs xs:text-sm font-medium text-foreground">{auth!.emailLabel}</label>
                    )}
                    <div className="relative">
                      <Input
                        type="email"
                        placeholder={uiLabel(auth?.emailPlaceholder)}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="pr-10 text-sm h-9"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        <Mail size={14} className="xs:size-[16px] md:size-[18px]" />
                      </div>
                    </div>
                  </div>
                )}

                {submitButtonLabel && (
                  <Button
                    type="submit"
                    className="w-full bg-primary text-primary-foreground hover:opacity-90 font-medium h-9 text-sm"
                    disabled={isLoading}
                  >
                    {submitButtonLabel}
                  </Button>
                )}
              </form>
            )}

            {isSuccess && uiLabel(auth?.forgotResendLabel) && (
              <div className="text-center mt-6">
                <Button
                  type="button"
                  variant="outline"
                  className="text-primary hover:text-primary/80 hover:bg-primary/10"
                  onClick={() => {
                    setIsSuccess(false);
                    setEmail("");
                  }}
                >
                  {auth!.forgotResendLabel}
                </Button>
              </div>
            )}

            {(uiLabel(auth?.forgotLoginPrompt) || uiLabel(auth?.forgotLoginLink)) && (
              <div className="text-center mt-6">
                <p className="text-sm text-muted-foreground">
                  {uiLabel(auth?.forgotLoginPrompt) && <>{auth!.forgotLoginPrompt}{" "}</>}
                  {uiLabel(auth?.forgotLoginLink) && (
                    <button
                      onClick={() => navigate("/login")}
                      className="text-primary font-semibold hover:underline"
                    >
                      {auth!.forgotLoginLink}
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

export default ForgotPassword;
