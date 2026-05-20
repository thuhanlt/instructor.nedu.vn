/**
 * Single source of truth for runtime behavior:
 *
 *   VITE_ENABLE_MOCKING=true   → mock layer (MSW worker on), Google login bypassed
 *   VITE_ENABLE_MOCKING=false  → real API (VITE_API_URL + VITE_AUTH_CENTRAL_URL), real Google login
 *
 * No code depends on dev/prod build mode (import.meta.env.DEV/PROD). The toggle
 * is purely env-driven so the same bundle deployed to Vercel/Cloudflare behaves
 * predictably regardless of build target.
 */
export const env = {
  apiUrl: import.meta.env.VITE_API_URL ?? 'http://localhost:8080',
  authCentralUrl: import.meta.env.VITE_AUTH_CENTRAL_URL ?? 'http://localhost:4000',
  enableMocking:
    (import.meta.env.VITE_ENABLE_MOCKING ?? 'true').toString().toLowerCase() === 'true',
  ga4Id: import.meta.env.VITE_GA4_ID ?? '',
  clarityId: import.meta.env.VITE_CLARITY_ID ?? '',
} as const
