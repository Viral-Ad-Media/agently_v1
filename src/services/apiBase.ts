const KNOWN_PLACEHOLDER_HOSTS = new Set([
  'your-backend-url.com',
  'example.com',
]);

const firstEnvValue = (value: unknown) =>
  String(value || '')
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)[0] || '';

export const getApiBaseUrl = () => {
  const raw = firstEnvValue(import.meta.env.VITE_API_BASE_URL);
  if (!raw) return '';

  try {
    const parsed = new URL(raw);
    if (KNOWN_PLACEHOLDER_HOSTS.has(parsed.hostname)) return '';
    parsed.pathname = parsed.pathname.replace(/\/+$/, '');
    parsed.search = '';
    parsed.hash = '';
    return parsed.toString().replace(/\/+$/, '');
  } catch {
    return raw.replace(/\/+$/, '');
  }
};

export const buildApiUrl = (path: string) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${getApiBaseUrl()}${normalizedPath}`;
};
