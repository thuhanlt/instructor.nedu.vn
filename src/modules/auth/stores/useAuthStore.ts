import { create } from 'zustand'
import { api } from '@shared/config/api-client'
import { tokenStorage } from '@shared/config/token-storage'
import { authCentral } from '@shared/config/auth-central-client'
import { env } from '@shared/config/env'
import { analytics, ANALYTICS_EVENTS } from '@shared/analytics'
import type { AuthUser, TokenPair } from '@shared/types/domain'

interface AuthState {
  user: AuthUser | null
  isLoading: boolean
  initialized: boolean
  initialize: () => Promise<void>
  loginWithGoogle: (returnTo?: string) => void
  acceptTokens: (pair: TokenPair) => Promise<AuthUser | null>
  logout: () => Promise<void>
}

async function fetchMe(): Promise<AuthUser | null> {
  try {
    const user = await api.get<AuthUser>('/auth/me')
    return user
  } catch {
    return null
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  initialized: false,

  async initialize() {
    set({ isLoading: true })

    // Mock mode auto-login if there's no token: provide a synthetic token
    if (env.enableMocking) {
      if (!tokenStorage.getAccess()) {
        tokenStorage.set('mock-access-token', 'mock-refresh-token')
      }
    }

    const access = tokenStorage.getAccess()
    if (!access) {
      set({ user: null, isLoading: false, initialized: true })
      return
    }
    const user = await fetchMe()
    set({ user, isLoading: false, initialized: true })
  },

  loginWithGoogle(returnTo) {
    const target = returnTo ?? `${window.location.origin}/auth-callback`
    if (env.enableMocking) {
      // Bypass real OAuth in mock mode — fabricate tokens + go straight to callback
      const fakePair: TokenPair = {
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token',
      }
      const cb = new URL(target)
      cb.hash = `access_token=${fakePair.access_token}&refresh_token=${fakePair.refresh_token}`
      window.location.href = cb.toString()
      return
    }
    window.location.href = authCentral.loginUrl(target)
  },

  async acceptTokens(pair) {
    tokenStorage.set(pair.access_token, pair.refresh_token)
    const user = await fetchMe()
    set({ user })
    if (user) analytics.track(ANALYTICS_EVENTS.LOGIN_SUCCESS)
    return user
  },

  async logout() {
    analytics.track(ANALYTICS_EVENTS.LOGOUT)
    await authCentral.logout()
    set({ user: null })
  },
}))
