export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
  
  // Extraer token de las cookies (si existe) en el entorno del cliente
  let token = '';
  if (typeof document !== 'undefined') {
    const match = document.cookie.match(/(^| )auth_token=([^;]+)/);
    if (match) token = match[2];
  }

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${baseUrl}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    if (response.status === 401 && typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    throw new Error(data?.error || response.statusText);
  }

  return data;
}
