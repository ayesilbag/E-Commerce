import { Link } from "react-router-dom";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";
import { getImageUrl } from "@/lib/product-utils";
import {
  PAYMENT_LEGAL_LINKS,
  resolveLegalPath,
  resolveLegalTitle,
} from "@/lib/legal-page-utils";
import SocialLinks from "@/components/SocialLinks";
import PaymentComplianceLogos from "@/components/PaymentComplianceLogos";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const settings = useSiteSettings();
  const legalPages = settings.paymentCompliance?.legalPages;
  const logoUrl = settings.logoUrl ? getImageUrl(settings.logoUrl) : null;
  const hasSocialLinks = Object.values(settings.socialLinks ?? {}).some(Boolean);

  const legalPath = (slug: (typeof PAYMENT_LEGAL_LINKS)[number]["slug"]) =>
    resolveLegalPath(slug, legalPages);

  const legalTitle = (
    slug: (typeof PAYMENT_LEGAL_LINKS)[number]["slug"],
    fallback: string
  ) => resolveLegalTitle(slug, legalPages, fallback);

  return (
    <footer className="bg-purple-dark text-white">
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
                <>
                  <img
                    src="/bizden-logo-mobile.png"
                    alt={settings.siteName}
                    className="h-10 w-10 object-contain md:hidden"
                  />
                  <img
                    src="/bizden-logo.png"
                    alt={settings.siteName}
                    className="hidden md:block h-12 lg:h-14 w-auto"
                  />
                </>
              )}
            </Link>
            <p className="text-gray-300 mb-3 md:mb-4 lg:mb-6 max-w-xs md:max-w-sm text-xs">
              {settings.siteName}, en son teknoloji ürünlerini uygun fiyatlarla sunan lider
              e-ticaret platformudur. Müşteri memnuniyeti bizim önceliğimizdir.
            </p>
            {hasSocialLinks && (
              <SocialLinks links={settings.socialLinks} variant="footer" />
            )}
          </div>

          <div>
            <h3 className="font-semibold text-xs md:text-sm mb-2 md:mb-3">
              Hızlı Linkler
            </h3>
            <ul className="space-y-1 md:space-y-1.5 lg:space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-300 hover:text-white transition-colors text-xs"
                >
                  Anasayfa
                </Link>
              </li>
              <li>
                <Link
                  to="/shop"
                  className="text-gray-300 hover:text-white transition-colors text-xs"
                >
                  Mağaza
                </Link>
              </li>
              <li>
                <Link
                  to="/categories"
                  className="text-gray-300 hover:text-white transition-colors text-xs"
                >
                  Kategoriler
                </Link>
              </li>
              <li>
                <Link
                  to={legalPath("hakkimizda")}
                  className="text-gray-300 hover:text-white transition-colors text-xs"
                >
                  {legalTitle("hakkimizda", "Hakkımızda")}
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-300 hover:text-white transition-colors text-xs"
                >
                  İletişim
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-xs md:text-sm mb-2 md:mb-3">
              Müşteri Hizmetleri
            </h3>
            <ul className="space-y-1 md:space-y-1.5 lg:space-y-2">
              <li>
                <Link
                  to="/contact#faq"
                  className="text-gray-300 hover:text-white transition-colors text-xs"
                >
                  Sıkça Sorulan Sorular
                </Link>
              </li>
              <li>
                <Link
                  to={legalPath("teslimat-ve-iade")}
                  className="text-gray-300 hover:text-white transition-colors text-xs"
                >
                  {legalTitle("teslimat-ve-iade", "Kargo ve Teslimat")}
                </Link>
              </li>
              <li>
                <Link
                  to="/orders"
                  className="text-gray-300 hover:text-white transition-colors text-xs"
                >
                  Sipariş Takibi
                </Link>
              </li>
              <li>
                <Link
                  to={legalPath("on-bilgilendirme-formu")}
                  className="text-gray-300 hover:text-white transition-colors text-xs"
                >
                  {legalTitle("on-bilgilendirme-formu", "Ön Bilgilendirme Formu")}
                </Link>
              </li>
              <li>
                <Link
                  to={legalPath("mesafeli-satis")}
                  className="text-gray-300 hover:text-white transition-colors text-xs"
                >
                  {legalTitle("mesafeli-satis", "Mesafeli Satış Sözleşmesi")}
                </Link>
              </li>
              <li>
                <Link
                  to={legalPath("gizlilik")}
                  className="text-gray-300 hover:text-white transition-colors text-xs"
                >
                  {legalTitle("gizlilik", "Gizlilik Politikası")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-xs md:text-sm mb-2 md:mb-3">
              İletişim
            </h3>
            <ul className="space-y-1.5 md:space-y-2 lg:space-y-3 text-gray-300 text-xs">
              {settings.address && (
                <li>
                  <p className="font-medium">Adres:</p>
                  <p className="text-xs">{settings.address}</p>
                </li>
              )}
              {settings.phones.length > 0 && (
                <li>
                  <p className="font-medium">Telefon:</p>
                  {settings.phones.map((phone) => (
                    <p key={phone} className="text-xs">
                      <a
                        href={`tel:${phone.replace(/\s/g, "")}`}
                        className="hover:text-white transition-colors"
                      >
                        {phone}
                      </a>
                    </p>
                  ))}
                </li>
              )}
              {settings.emails.length > 0 && (
                <li>
                  <p className="font-medium">E-posta:</p>
                  {settings.emails.map((email) => (
                    <p key={email} className="text-xs">
                      <a href={`mailto:${email}`} className="hover:text-white transition-colors">
                        {email}
                      </a>
                    </p>
                  ))}
                </li>
              )}
              {settings.workingHours.length > 0 && (
                <li>
                  <p className="font-medium">Çalışma Saatleri:</p>
                  {settings.workingHours.map((hours) => (
                    <p key={hours} className="text-xs">
                      {hours}
                    </p>
                  ))}
                </li>
              )}
            </ul>
          </div>
        </div>

        <hr className="border-white/10 my-4 md:my-6 lg:my-8" />

        <nav
          className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs md:text-sm text-gray-400 mb-4 md:mb-6"
          aria-label="Yasal sayfalar"
        >
          {PAYMENT_LEGAL_LINKS.map(({ slug, defaultTitle }) => (
            <Link
              key={slug}
              to={legalPath(slug)}
              className="hover:text-white transition-colors"
            >
              {legalTitle(slug, defaultTitle)}
            </Link>
          ))}
        </nav>

        <PaymentComplianceLogos
          compliance={settings.paymentCompliance}
          className="flex flex-wrap items-center justify-center gap-4 mb-4 md:mb-6"
          imgClassName="h-7 md:h-9 w-auto object-contain brightness-0 invert opacity-90"
        />

        <p className="text-center text-gray-400 text-xs md:text-sm">
          &copy; {currentYear} {settings.siteName}. Tüm hakları saklıdır.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
