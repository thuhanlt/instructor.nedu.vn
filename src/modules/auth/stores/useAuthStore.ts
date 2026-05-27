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

// BE /auth/me trả snake_case { id, email, full_name, avatar_url, roles }.
// Mock trả FE-shape { id, email, name, roles }. Transform về AuthUser, dùng `??`
// để chạy cả hai (tiện thể fix `name` lệch `full_name` → Topbar/Sidebar hết "—").
interface RawMe {
  id: string
  email: string
  name?: string
  full_name?: string
  avatarUrl?: string
  avatar_url?: string
  roles?: string[]
}

async function fetchMe(): Promise<AuthUser | null> {
  try {
    const raw = await api.get<RawMe>('/auth/me')
    return {
      id: raw.id,
      email: raw.email,
      name: raw.name ?? raw.full_name ?? '',
      avatarUrl: raw.avatarUrl ?? raw.avatar_url ?? undefined,
      // Chuẩn hoá tại NGUỒN: dù API trả null/thiếu/sai kiểu → luôn là string[].
      // Đảm bảo invariant AuthUser.roles: string[] đúng ở runtime, downstream
      // không cần `?.` và không silent-misfire.
      roles: Array.isArray(raw.roles) ? raw.roles : [],
    }
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

    // Mock mode: always bypass Google login, force-fetch the mock user.
    if (env.enableMocking) {
      tokenStorage.set('mock-access-token', 'mock-refresh-token')
      const user = await fetchMe()
      set({ user, isLoading: false, initialized: true })
      return
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
    // Mock mode: immediately re-login the mock user so the app never lands on /login.
    if (env.enableMocking) {
      tokenStorage.set('mock-access-token', 'mock-refresh-token')
      const user = await fetchMe()
      set({ user })
    }
  },
}))
