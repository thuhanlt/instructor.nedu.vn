export const env = {
  apiUrl: import.meta.env.VITE_API_URL ?? 'http://localhost:8080',
  authCentralUrl: import.meta.env.VITE_AUTH_CENTRAL_URL ?? 'http://localhost:4000',
  enableMocking:
    (import.meta.env.VITE_ENABLE_MOCKING ?? 'true').toString().toLowerCase() === 'true',
  ga4Id: import.meta.env.VITE_GA4_ID ?? '',
  clarityId: import.meta.env.VITE_CLARITY_ID ?? '',
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
} as const
