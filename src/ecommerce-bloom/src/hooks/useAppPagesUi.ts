import { useSiteSettings } from '@/contexts/SiteSettingsContext';

export function useAppPagesUi() {
  const { storefrontContent } = useSiteSettings();
  return storefrontContent?.appPagesUi;
}

export function uiLabel(value?: string | null): string | undefined {
  const trimmed = value?.trim();
  return trimmed || undefined;
}

export function findStatusLabel(
  options: Array<{ value: string; label: string }> | undefined,
  status: string
): string | undefined {
  return options?.find((o) => o.value === status)?.label;
}
