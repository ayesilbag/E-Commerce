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

const CheckoutLegalConsent = ({
  id = 'contracts',
  checked,
  onCheckedChange,
}: CheckoutLegalConsentProps) => {
  const settings = useSiteSettings();
  const legalPages = settings.paymentCompliance?.legalPages;
  const consent = settings.storefrontContent?.checkoutConsent;
  const links = consent?.links ?? [];

  if (links.length === 0 || !consent?.suffixText) return null;

  return (
    <div
      className={`flex items-start gap-2.5 p-3 rounded-lg border text-xs text-foreground transition-colors ${
        checked ? 'border-primary/40 bg-primary/10' : 'border-border bg-muted/50'
      }`}
    >
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(v) => onCheckedChange(v === true)}
        className="w-4 h-4 mt-0.5 flex-shrink-0"
      />
      <label htmlFor={id} className="cursor-pointer leading-relaxed">
        {links.map((link, index) => (
          <span key={link.slug}>
            {index > 0 && (index === links.length - 1 ? ' ve ' : ', ')}
            <Link
              to={resolveLegalPath(link.slug as LegalSlug, legalPages)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-2 hover:text-primary/80"
              onClick={(e) => e.stopPropagation()}
            >
              {link.label}
            </Link>
          </span>
        ))}{' '}
        {consent.suffixText}
      </label>
    </div>
  );
};

export default CheckoutLegalConsent;
