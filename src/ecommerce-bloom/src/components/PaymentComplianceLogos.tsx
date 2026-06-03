import { getImageUrl } from '@/lib/product-utils';
import type { PaymentCompliance } from '@/types';

type PaymentComplianceLogosProps = {
  compliance?: PaymentCompliance | null;
  className?: string;
  imgClassName?: string;
};

const PaymentComplianceLogos = ({
  compliance,
  className = 'flex flex-wrap items-center justify-center gap-3 md:gap-4',
  imgClassName = 'h-6 md:h-8 w-auto object-contain opacity-90',
}: PaymentComplianceLogosProps) => {
  const logos = [
    compliance?.visaLogoUrl,
    compliance?.mastercardLogoUrl,
    compliance?.iyzicoPayLogoUrl,
  ].filter(Boolean) as string[];

  if (logos.length === 0) return null;

  return (
    <div className={className} aria-label="Kabul edilen ödeme yöntemleri">
      {logos.map((url) => (
        <img
          key={url}
          src={getImageUrl(url)}
          alt=""
          className={imgClassName}
          loading="lazy"
        />
      ))}
    </div>
  );
};

export default PaymentComplianceLogos;
