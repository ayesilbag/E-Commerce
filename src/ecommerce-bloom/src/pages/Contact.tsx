import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SocialLinks from "@/components/SocialLinks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";
import { sendContactMessage } from "@/services/contact.service";
import {
  AtSign,
  Clock,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  User
} from "lucide-react";

const Contact = () => {
  const location = useLocation();
  const { toast } = useToast();
  const settings = useSiteSettings();
  const ui = settings.storefrontContent?.contactPageUi;

  useEffect(() => {
    if (location.hash === "#faq") {
      const el = document.getElementById("faq");
      if (el) {
        requestAnimationFrame(() => {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      }
    }
  }, [location.hash]);

  const hasSocialLinks = Object.values(settings.socialLinks ?? {}).some(Boolean);
  const hasContactInfo =
    Boolean(ui?.infoSectionTitle) &&
    (settings.address ||
      settings.emails.length > 0 ||
      settings.phones.length > 0 ||
      settings.workingHours.length > 0);
  const hasForm = Boolean(ui?.formSectionTitle && ui?.submitButtonLabel);
  const hasMainSection = hasContactInfo || hasForm || (hasSocialLinks && ui?.socialSectionTitle);

  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await sendContactMessage(formState);
      if (ui?.submitSuccessTitle) {
        toast({
          title: ui.submitSuccessTitle,
          description: ui.submitSuccessDescription || result.message || undefined,
        });
      }
      setFormState({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
    } catch (error) {
      if (ui?.submitErrorTitle) {
        toast({
          title: ui.submitErrorTitle,
          description:
            error instanceof Error
              ? error.message
              : ui.submitErrorFallback || undefined,
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {hasMainSection && (
        <section className="py-8 xs:py-12 sm:py-12 md:py-16 lg:py-16">
          <div className="container-custom px-2 xs:px-4 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 xs:gap-8 sm:gap-8 md:gap-10">
              {hasContactInfo && (
              <div className="md:col-span-5 lg:col-span-4">
                {ui?.infoSectionTitle && (
                  <h2 className="text-sm font-semibold uppercase tracking-wide mb-4 xs:mb-6 md:mb-6">
                    {ui.infoSectionTitle}
                  </h2>
                )}

                <div className="bg-card rounded-lg xs:rounded-lg sm:rounded-xl md:rounded-xl shadow-sm p-4 xs:p-5 md:p-6 mb-6 xs:mb-8 md:mb-8">
                  <div className="space-y-4 xs:space-y-5 md:space-y-6">
                    {settings.address && ui?.locationLabel && (
                      <div className="flex items-start gap-2 xs:gap-3 md:gap-4">
                        <div className="bg-primary/15 p-2.5 xs:p-3 md:p-3 rounded-full flex-shrink-0">
                          <MapPin className="text-primary xs:size-[18px] md:size-[20px]" size={16} />
                        </div>
                        <div>
                          <h3 className="font-medium text-sm">{ui.locationLabel}</h3>
                          <p className="text-muted-foreground text-xs whitespace-pre-line">
                            {settings.address}
                          </p>
                        </div>
                      </div>
                    )}

                    {settings.emails.length > 0 && ui?.emailLabel && (
                      <div className="flex items-start gap-2 xs:gap-3 md:gap-4">
                        <div className="bg-primary/15 p-2.5 xs:p-3 md:p-3 rounded-full flex-shrink-0">
                          <Mail className="text-primary xs:size-[18px] md:size-[20px]" size={16} />
                        </div>
                        <div>
                          <h3 className="font-medium text-sm">{ui.emailLabel}</h3>
                          <div className="text-muted-foreground">
                            {settings.emails.map((email) => (
                              <p key={email}>
                                <a href={`mailto:${email}`} className="hover:text-primary transition-colors">
                                  {email}
                                </a>
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {settings.phones.length > 0 && ui?.phoneLabel && (
                      <div className="flex items-start gap-4">
                        <div className="bg-primary/15 p-3 rounded-full">
                          <Phone className="text-primary" size={20} />
                        </div>
                        <div>
                          <h3 className="font-medium text-sm">{ui.phoneLabel}</h3>
                          <div className="text-muted-foreground">
                            {settings.phones.map((phone) => (
                              <p key={phone}>
                                <a href={`tel:${phone.replace(/\s/g, "")}`} className="hover:text-primary transition-colors">
                                  {phone}
                                </a>
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {settings.workingHours.length > 0 && ui?.hoursLabel && (
                      <div className="flex items-start gap-4">
                        <div className="bg-primary/15 p-3 rounded-full">
                          <Clock className="text-primary" size={20} />
                        </div>
                        <div>
                          <h3 className="font-medium text-sm">{ui.hoursLabel}</h3>
                          <div className="text-muted-foreground">
                            {settings.workingHours.map((hours) => (
                              <p key={hours}>{hours}</p>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {hasSocialLinks && ui?.socialSectionTitle && (
                  <div>
                    <h2 className="text-sm font-semibold uppercase tracking-wide mb-4">
                      {ui.socialSectionTitle}
                    </h2>
                    <SocialLinks links={settings.socialLinks} variant="contact" />
                  </div>
                )}
              </div>
              )}

              {hasForm && (
              <div className={`md:col-span-7 lg:col-span-8 ${!hasContactInfo ? 'md:col-span-12' : ''}`}>
                <div className="bg-card rounded-xl shadow-sm p-6 md:p-8">
                  {ui?.formSectionTitle && (
                    <h2 className="text-sm font-semibold uppercase tracking-wide mb-6">
                      {ui.formSectionTitle}
                    </h2>
                  )}
                  {ui?.formIntro && (
                    <p className="text-muted-foreground mb-8">{ui.formIntro}</p>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      {ui?.nameLabel && (
                      <div className="relative">
                        <label htmlFor="name" className="block text-sm font-medium mb-2">
                          {ui.nameLabel}
                        </label>
                        <div className="relative">
                          <Input
                            id="name"
                            name="name"
                            type="text"
                            placeholder={ui.namePlaceholder || undefined}
                            required
                            value={formState.name}
                            onChange={handleChange}
                            className="pl-10"
                          />
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                        </div>
                      </div>
                      )}

                      {ui?.emailFieldLabel && (
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-2">
                          {ui.emailFieldLabel}
                        </label>
                        <div className="relative">
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder={ui.emailPlaceholder || undefined}
                            required
                            value={formState.email}
                            onChange={handleChange}
                            className="pl-10"
                          />
                          <AtSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                        </div>
                      </div>
                      )}
                    </div>

                    {ui?.subjectLabel && (
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium mb-2">
                        {ui.subjectLabel}
                      </label>
                      <div className="relative">
                        <Input
                          id="subject"
                          name="subject"
                          type="text"
                          placeholder={ui.subjectPlaceholder || undefined}
                          required
                          value={formState.subject}
                          onChange={handleChange}
                          className="pl-10"
                        />
                        <MessageSquare className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                      </div>
                    </div>
                    )}

                    {ui?.messageLabel && (
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-2">
                        {ui.messageLabel}
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder={ui.messagePlaceholder || undefined}
                        rows={6}
                        required
                        value={formState.message}
                        onChange={handleChange}
                        className="resize-none"
                      />
                    </div>
                    )}

                    {ui?.submitButtonLabel && (
                    <div>
                      <Button
                        type="submit"
                        className="btn-gradient w-full md:w-auto"
                        disabled={isSubmitting}
                      >
                        {isSubmitting && ui.submittingLabel ? (
                          <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {ui.submittingLabel}
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <Send size={18} className="mr-2" />
                            {ui.submitButtonLabel}
                          </span>
                        )}
                      </Button>
                    </div>
                    )}
                  </form>
                </div>
              </div>
              )}
            </div>
          </div>
        </section>
        )}

        {settings.storefrontContent?.contactMap?.title && (
        <section className="py-12 bg-muted/50">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-base font-semibold uppercase tracking-wide mb-4">
                {settings.storefrontContent.contactMap.title}
              </h2>
              {(settings.storefrontContent.contactMap.description || settings.address) && (
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  {settings.storefrontContent.contactMap.description || settings.address}
                </p>
              )}
            </div>

            <div className="h-96 rounded-xl overflow-hidden border border-border bg-card">
              {settings.storefrontContent.contactMap.embedUrl ? (
                <iframe
                  title={settings.storefrontContent.contactMap.title}
                  src={settings.storefrontContent.contactMap.embedUrl}
                  className="w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center p-4">
                  <div className="text-center">
                    <MapPin size={48} className="mx-auto mb-4 text-primary" />
                    {settings.storefrontContent.contactMap.emptyMessage && (
                      <p className="text-sm text-muted-foreground">{settings.storefrontContent.contactMap.emptyMessage}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
        )}

        {settings.storefrontContent?.faq && (settings.storefrontContent.faq.title || settings.storefrontContent.faq.items.length > 0) && (
        <section id="faq" className="py-16 bg-background scroll-mt-24">
          <div className="container-custom">
            <div className="text-center mb-12">
              {settings.storefrontContent.faq.title && (
                <h2 className="text-base font-semibold uppercase tracking-wide mb-4">
                  {settings.storefrontContent.faq.title}
                </h2>
              )}
              {settings.storefrontContent.faq.description && (
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  {settings.storefrontContent.faq.description}
                </p>
              )}
            </div>

            {settings.storefrontContent.faq.items.length > 0 && (
              <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {settings.storefrontContent.faq.items.map((item) => (
                  <div key={item.question} className="bg-muted/50 p-6 rounded-xl">
                    <h3 className="text-sm font-semibold mb-3">{item.question}</h3>
                    <p className="text-muted-foreground">{item.answer}</p>
                  </div>
                ))}
              </div>
            )}

            {(settings.storefrontContent.faq.footerText || settings.storefrontContent.faq.footerButtonLabel) && (
              <div className="text-center mt-12">
                {settings.storefrontContent.faq.footerText && (
                  <p className="text-muted-foreground mb-4">{settings.storefrontContent.faq.footerText}</p>
                )}
                {settings.storefrontContent.faq.footerButtonLabel && settings.storefrontContent.faq.footerButtonHref && (
                  <Link to={settings.storefrontContent.faq.footerButtonHref}>
                    <Button className="btn-gradient">
                      {settings.storefrontContent.faq.footerButtonLabel}
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </div>
        </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
