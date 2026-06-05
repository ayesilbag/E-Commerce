import { Award, RefreshCw, ShieldCheck, Truck, type LucideIcon } from 'lucide-react';

const TRUST_ICON_MAP: Record<string, LucideIcon> = {
  truck: Truck,
  'refresh-cw': RefreshCw,
  'shield-check': ShieldCheck,
  award: Award,
};

export function resolveTrustIcon(icon: string): LucideIcon {
  return TRUST_ICON_MAP[icon.toLowerCase()] ?? Truck;
}
