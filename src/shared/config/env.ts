/**
 * Single source of truth for runtime behavior:
 *
 *   VITE_ENABLE_MOCKING=true   → mock layer (MSW worker on), Google login bypassed
 *   VITE_ENABLE_MOCKING=false  → real API (VITE_API_URL + VITE_AUTH_CENTRAL_URL), real Google login
 *
 * Default is MOCK so the same bundle deployed to Vercel/Cloudflare with no env
 * vars still works for non-tech preview. Only an *explicit* "false" (or "0" /
 * "no") flips to LIVE — empty string, missing var, or any other value keeps
 * mock ON. This matches the user expectation that mock is the safe default.
 *
 * No code depends on dev/prod build mode (import.meta.env.DEV/PROD).
 */

function parseMockFlag(raw: unknown): boolean {
  if (raw === false) return false
  if (raw === null || raw === undefined) return true
  const v = String(raw).trim().toLowerCase()
  if (v === '') return true
  // explicit opt-out values
  if (v === 'false' || v === '0' || v === 'no' || v === 'off') return false
  return true
}

export const env = {
  apiUrl: import.meta.env.VITE_API_URL ?? 'http://localhost:8080',
  authCentralUrl: import.meta.env.VITE_AUTH_CENTRAL_URL ?? 'http://localhost:4000',
  enableMocking: parseMockFlag(import.meta.env.VITE_ENABLE_MOCKING),
  ga4Id: import.meta.env.VITE_GA4_ID ?? '',
  clarityId: import.meta.env.VITE_CLARITY_ID ?? '',
} as const
