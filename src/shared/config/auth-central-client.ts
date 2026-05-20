import { env } from './env'
import { tokenStorage } from './token-storage'
import type { TokenPair } from '../types/domain'

export const authCentral = {
  loginUrl(returnTo: string): string {
    const u = new URL('/auth/oauth/google', env.authCentralUrl)
    u.searchParams.set('return_to', returnTo)
    return u.toString()
  },

  async refresh(): Promise<TokenPair | null> {
    const refresh = tokenStorage.getRefresh()
    if (!refresh) return null
    try {
      const res = await fetch(`${env.authCentralUrl}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refresh }),
      })
      if (!res.ok) return null
      const json = (await res.json()) as TokenPair
      tokenStorage.set(json.access_token, json.refresh_token)
      return json
    } catch {
      return null
    }
  },

  async logout(): Promise<void> {
    const refresh = tokenStorage.getRefresh()
    if (refresh) {
      try {
        await fetch(`${env.authCentralUrl}/auth/logout`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh_token: refresh }),
        })
      } catch {
        // ignore network errors during logout
      }
    }
    tokenStorage.clear()
  },
}
