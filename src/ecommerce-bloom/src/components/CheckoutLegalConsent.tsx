import { Link } from 'react-router-dom';
import { Checkbox } from '@/components/ui/checkbox';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';
import { resolveLegalPath } from '@/lib/legal-page-utils';
import type { LegalSlug } from '@/constants/legal-pages';

type CheckoutLegalConsentProps = {
  id?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
};

const CONSENT_LINKS: { slug: LegalSlug; label: string }[] = [
  { slug: 'on-bilgilendirme-formu', label: 'Ön Bilgilendirme Formunu' },
  { slug: 'mesafeli-satis', label: 'Mesafeli Satış Sözleşmesini' },
  { slug: 'gizlilik', label: 'Aydınlatma metnini' },
];

const CheckoutLegalConsent = ({
  id = 'contracts',
  checked,
  onCheckedChange,
}: CheckoutLegalConsentProps) => {
  const settings = useSiteSettings();
  const legalPages = settings.paymentCompliance?.legalPages;

  return (
    <div
      className={`flex items-start gap-2.5 p-3 rounded-lg border text-xs text-gray-700 transition-colors ${
        checked ? 'border-purple-300 bg-purple-50' : 'border-gray-200 bg-gray-50'
      }`}
    >
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(v) => onCheckedChange(v === true)}
        className="w-4 h-4 mt-0.5 flex-shrink-0"
      />
      <label htmlFor={id} className="cursor-pointer leading-relaxed">
        {CONSENT_LINKS.map((link, index) => (
          <span key={link.slug}>
            {index > 0 && (index === CONSENT_LINKS.length - 1 ? ' ve ' : ', ')}
            <Link
              to={resolveLegalPath(link.slug, legalPages)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600 underline underline-offset-2 hover:text-purple-800"
              onClick={(e) => e.stopPropagation()}
            >
              {link.label}
            </Link>
          </span>
        ))}
        {' '}
        okudum, onaylıyorum.
      </label>
    </div>
  );
};

export default CheckoutLegalConsent;
