const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

type QueryValue = string | number | boolean | undefined | null;
type QueryParams = Record<string, QueryValue>;

function buildUrl(path: string, query?: QueryParams): string {
  const url = `${API_BASE_URL}${path}`;
  if (!query) return url;
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === '') continue;
    params.append(key, String(value));
  }
  const qs = params.toString();
  return qs ? `${url}?${qs}` : url;
}

function authHeaders(token?: string): Record<string, string> {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(
  method: string,
  path: string,
  options: { body?: unknown; query?: QueryParams; token?: string } = {},
): Promise<T> {
  const hasBody = options.body !== undefined;
  const res = await fetch(buildUrl(path, options.query), {
    method,
    headers: {
      ...(hasBody ? { 'Content-Type': 'application/json' } : {}),
      ...authHeaders(options.token),
    },
    body: hasBody ? JSON.stringify(options.body) : undefined,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message ?? 'Request failed');
  }

  if (res.status === 204) return undefined as T;
  return res.json().catch(() => {
    throw new Error('Сервер вернул некорректный ответ');
  });
}

export const apiClient = {
  get: <T>(path: string, options?: { query?: QueryParams; token?: string }) =>
    request<T>('GET', path, options),
  post: <T>(path: string, body: unknown, options?: { token?: string }) =>
    request<T>('POST', path, { body, token: options?.token }),
  patch: <T>(path: string, body: unknown, options?: { token?: string }) =>
    request<T>('PATCH', path, { body, token: options?.token }),
  delete: <T>(path: string, options?: { token?: string }) =>
    request<T>('DELETE', path, { token: options?.token }),
};
