import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Mail } from "lucide-react";
import { subscribeNewsletter } from "@/services/newsletter.service";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";

const NewsletterSection = () => {
  const { storefrontContent } = useSiteSettings();
  const newsletter = storefrontContent?.newsletter;
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!newsletter?.title) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      if (newsletter.errorTitle && newsletter.emptyEmailMessage) {
        toast.error(newsletter.errorTitle, { description: newsletter.emptyEmailMessage });
      }
      return;
    }

    setIsLoading(true);
    try {
      await subscribeNewsletter({ email });
      if (newsletter.successTitle) {
        toast.success(newsletter.successTitle, {
          description: newsletter.successDescription || undefined,
        });
      }
      setEmail("");
    } catch (error) {
      const msg = error instanceof Error ? error.message : newsletter.errorTitle;
      if (newsletter.errorTitle) {
        toast.error(newsletter.errorTitle, { description: msg || undefined });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="relative section-padding overflow-hidden">
      <div className="absolute inset-0 bg-primary/5"></div>

      <div className="container-custom relative z-10 px-2 xs:px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block p-2 xs:p-2.5 md:p-3 bg-primary/10 rounded-full mb-4 xs:mb-5 md:mb-6">
            <Mail size={18} className="xs:size-[20px] md:size-[24px] text-primary" />
          </div>
          <h2 className="text-base font-semibold uppercase tracking-wide mb-2">
            {newsletter.title}
          </h2>
          {newsletter.description && (
            <p className="text-muted-foreground mb-4 xs:mb-6 md:mb-8 max-w-xl mx-auto text-xs">
              {newsletter.description}
            </p>
          )}

          <form
            className="flex flex-col xs:flex-row gap-2 xs:gap-3 md:gap-3 max-w-lg mx-auto"
            onSubmit={handleSubmit}
          >
            <input
              type="email"
              placeholder={newsletter.placeholder || undefined}
              className="flex-1 rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {newsletter.buttonLabel && (
            <Button
              type="submit"
              className="btn-gradient px-4 py-2 text-sm h-9 whitespace-nowrap"
              disabled={isLoading}
            >
              {isLoading && newsletter.submittingLabel
                ? newsletter.submittingLabel
                : newsletter.buttonLabel}
            </Button>
            )}
          </form>

          {newsletter.disclaimer && (
            <p className="mt-2 xs:mt-3 md:mt-4 text-xs text-muted-foreground">
              {newsletter.disclaimer}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
