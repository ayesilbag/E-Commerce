const TOKEN_KEY = 'admin_access_token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export async function login(email: string, password: string) {
  const res = await fetch('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.title || err.detail || 'Giriş başarısız');
  }

  const data = await res.json();
  setToken(data.accessToken);
  return data;
}

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  const token = getToken();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  if (options.body && !(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const res = await fetch(path, { ...options, headers });

  if (res.status === 401) {
    clearToken();
    window.location.href = '/admin/login';
    throw new Error('Oturum sonlandı');
  }

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json.message || json.error?.message || 'İstek başarısız');
  }

  return json as T;
}

export async function uploadImage(file: File, folder: string, productId?: string) {
  const form = new FormData();
  form.append('file', file);
  const params = new URLSearchParams({ folder });
  if (productId) params.set('productId', productId);

  const token = getToken();
  const res = await fetch(`/api/admin/media/upload?${params}`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form,
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error?.message || 'Yükleme başarısız');
  }

  return json.data as { url: string; fileName: string; fileSize: number };
}

export async function downloadProductTemplate() {
  const token = getToken();
  const res = await fetch('/api/admin/products/import/template', {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error('Şablon indirilemedi');
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'urun-import-sablonu.xlsx';
  a.click();
  URL.revokeObjectURL(url);
}

export async function importProductsExcel(file: File) {
  const form = new FormData();
  form.append('file', file);
  const token = getToken();
  const res = await fetch('/api/admin/products/import', {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'İçe aktarma başarısız');
  return json as { success: boolean; message: string; data: { imported: number; failed: number; errors: string[] } };
}
