import { Link } from "react-router-dom";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";
import { getImageUrl } from "@/lib/product-utils";
import { PAYMENT_LEGAL_LINKS, resolveLegalPath, resolveLegalTitle } from "@/lib/legal-page-utils";
import SocialLinks from "@/components/SocialLinks";
import PaymentComplianceLogos from "@/components/PaymentComplianceLogos";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const settings = useSiteSettings();
  const legalPages = settings.paymentCompliance?.legalPages;
  const nav = settings.storefrontContent?.footerNav;
  const logoUrl = settings.logoUrl ? getImageUrl(settings.logoUrl) : null;
  const hasSocialLinks = Object.values(settings.socialLinks ?? {}).some(Boolean);
  const quickLinks = nav?.quickLinks ?? [];
  const serviceLinks = nav?.customerServiceLinks ?? [];
  const hasContactData =
    Boolean(settings.address) ||
    settings.phones.length > 0 ||
    settings.emails.length > 0 ||
    settings.workingHours.length > 0;

  const legalBottomLinks = PAYMENT_LEGAL_LINKS.map(({ slug }) => ({
    slug,
    href: resolveLegalPath(slug, legalPages),
    title: resolveLegalTitle(slug, legalPages, settings.paymentCompliance),
  })).filter((link) => link.title);

  return (
    <footer className="border-t border-border bg-muted/40 dark:bg-muted/60 text-foreground">
      <div className="container-custom py-6 md:py-10 lg:py-16 px-2 xs:px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6 lg:gap-12">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center mb-3 md:mb-4 lg:mb-6">
              {logoUrl ? (
                <>
                  <img
                    src={logoUrl}
                    alt={settings.siteName}
                    className="h-10 w-10 object-contain md:hidden"
                  />
                  <img
                    src={logoUrl}
                    alt={settings.siteName}
                    className="hidden md:block h-12 lg:h-14 w-auto"
                  />
                </>
              ) : (
                <span className="text-lg font-semibold">{settings.siteName}</span>
              )}
            </Link>
            {settings.storefrontContent?.footerDescription && (
              <p className="text-muted-foreground mb-3 md:mb-4 lg:mb-6 max-w-xs md:max-w-sm text-xs">
                {settings.storefrontContent.footerDescription}
              </p>
            )}
            {hasSocialLinks && (
              <SocialLinks links={settings.socialLinks} variant="footer" />
            )}
          </div>

          {(nav?.quickLinksTitle || quickLinks.length > 0) && (
            <div>
              {nav?.quickLinksTitle && (
                <h3 className="font-semibold text-xs md:text-sm mb-2 md:mb-3">
                  {nav.quickLinksTitle}
                </h3>
              )}
              {quickLinks.length > 0 && (
                <ul className="space-y-1 md:space-y-1.5 lg:space-y-2">
                  {quickLinks.map((link) => (
                    <li key={`${link.href}-${link.label}`}>
                      <Link
                        to={link.href}
                        className="text-muted-foreground hover:text-primary transition-colors text-xs"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {(nav?.customerServiceTitle || serviceLinks.length > 0) && (
            <div>
              {nav?.customerServiceTitle && (
                <h3 className="font-semibold text-xs md:text-sm mb-2 md:mb-3">
                  {nav.customerServiceTitle}
                </h3>
              )}
              {serviceLinks.length > 0 && (
                <ul className="space-y-1 md:space-y-1.5 lg:space-y-2">
                  {serviceLinks.map((link) => (
                    <li key={`${link.href}-${link.label}`}>
                      <Link
                        to={link.href}
                        className="text-muted-foreground hover:text-primary transition-colors text-xs"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {(nav?.contactSectionTitle || hasContactData) && (
            <div>
              {nav?.contactSectionTitle && (
                <h3 className="font-semibold text-xs md:text-sm mb-2 md:mb-3">
                  {nav.contactSectionTitle}
                </h3>
              )}
              <ul className="space-y-1.5 md:space-y-2 lg:space-y-3 text-muted-foreground text-xs">
                {settings.address && (
                  <li>
                    {nav?.addressLabel && <p className="font-medium">{nav.addressLabel}</p>}
                    <p className="text-xs whitespace-pre-line">{settings.address}</p>
                  </li>
                )}
                {settings.phones.length > 0 && (
                  <li>
                    {nav?.phoneLabel && <p className="font-medium">{nav.phoneLabel}</p>}
                    {settings.phones.map((phone) => (
                      <p key={phone} className="text-xs">
                        <a
                          href={`tel:${phone.replace(/\s/g, "")}`}
                          className="hover:text-primary transition-colors"
                        >
                          {phone}
                        </a>
                      </p>
                    ))}
                  </li>
                )}
                {settings.emails.length > 0 && (
                  <li>
                    {nav?.emailLabel && <p className="font-medium">{nav.emailLabel}</p>}
                    {settings.emails.map((email) => (
                      <p key={email} className="text-xs">
                        <a href={`mailto:${email}`} className="hover:text-primary transition-colors">
                          {email}
                        </a>
                      </p>
                    ))}
                  </li>
                )}
                {settings.workingHours.length > 0 && (
                  <li>
                    {nav?.workingHoursLabel && (
                      <p className="font-medium">{nav.workingHoursLabel}</p>
                    )}
                    {settings.workingHours.map((hours) => (
                      <p key={hours} className="text-xs">
                        {hours}
                      </p>
                    ))}
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        {legalBottomLinks.length > 0 && (
          <>
            <hr className="border-border my-4 md:my-6 lg:my-8" />
            <nav
              className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs md:text-sm text-muted-foreground mb-4 md:mb-6"
              aria-label="Yasal sayfalar"
            >
              {legalBottomLinks.map(({ slug, href, title }) => (
                <Link key={slug} to={href} className="hover:text-primary transition-colors">
                  {title}
                </Link>
              ))}
            </nav>
          </>
        )}

        <PaymentComplianceLogos
          compliance={settings.paymentCompliance}
          className="flex flex-wrap items-center justify-center gap-4 mb-4 md:mb-6"
          imgClassName="h-7 md:h-9 w-auto object-contain opacity-90"
        />

        {nav?.copyrightSuffix && (
          <p className="text-center text-muted-foreground text-xs md:text-sm">
            &copy; {currentYear} {settings.siteName}. {nav.copyrightSuffix}
          </p>
        )}
      </div>
    </footer>
  );
};

export default Footer;
