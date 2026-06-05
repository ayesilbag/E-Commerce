export function emptyAppPagesJson(): string {
  return '';
}

export function appPagesFromApi(data?: Record<string, unknown> | null): string {
  if (!data) return '';
  return JSON.stringify(data, null, 2);
}

export function appPagesToApi(json: string): Record<string, unknown> | null {
  const trimmed = json.trim();
  if (!trimmed) return null;
  return JSON.parse(trimmed) as Record<string, unknown>;
}

export function validateAppPagesJson(json: string): string | null {
  const trimmed = json.trim();
  if (!trimmed) return null;
  try {
    JSON.parse(trimmed);
    return null;
  } catch (e) {
    return e instanceof Error ? e.message : 'Geçersiz JSON';
  }
}
