import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Lang = 'vi' | 'en'

interface PrefsState {
  timezone: string
  tzInitialized: boolean // R3 Nhóm 5: phân biệt lần đầu vs lần sau cho toast
  lang: Lang
  sidebarOpen: boolean
  qaGuideHidden: boolean
  downloadedMaterials: string[]
  setTimezone: (tz: string) => void
  setTzInitialized: (v: boolean) => void
  setLang: (lang: Lang) => void
  toggleSidebar: () => void
  setSidebar: (open: boolean) => void
  setQaGuideHidden: (hidden: boolean) => void
  markMaterialDownloaded: (id: string) => void
}

// R3 Nhóm 5 (2026-05-27): timezone auto-detect từ OS qua Intl.DateTimeFormat.
// Fallback Asia/Ho_Chi_Minh cho SSR / browser cổ thiếu Intl. Cập nhật mỗi lần
// app mount qua effect ở App.tsx (so sánh + notify nếu khác).
function detectTimezone(): string {
  try {
    if (typeof Intl !== 'undefined') {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
      if (tz) return tz
    }
  } catch {
    // Browser too old, fallthrough.
  }
  return 'Asia/Ho_Chi_Minh'
}

export const usePrefsStore = create<PrefsState>()(
  persist(
    (set) => ({
      timezone: detectTimezone(),
      tzInitialized: false,
      lang: 'vi',
      sidebarOpen: typeof window !== 'undefined' ? window.innerWidth > 900 : true,
      qaGuideHidden: false,
      downloadedMaterials: [],
      setTimezone: (timezone) => set({ timezone }),
      setTzInitialized: (tzInitialized) => set({ tzInitialized }),
      setLang: (lang) => set({ lang }),
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      setSidebar: (open) => set({ sidebarOpen: open }),
      setQaGuideHidden: (qaGuideHidden) => set({ qaGuideHidden }),
      markMaterialDownloaded: (id) =>
        set((s) =>
          s.downloadedMaterials.includes(id)
            ? s
            : { downloadedMaterials: [...s.downloadedMaterials, id] }
        ),
    }),
    {
      name: 'nedu_prefs_v1',
      partialize: (s) => ({
        timezone: s.timezone,
        tzInitialized: s.tzInitialized,
        lang: s.lang,
        sidebarOpen: s.sidebarOpen,
        qaGuideHidden: s.qaGuideHidden,
        downloadedMaterials: s.downloadedMaterials,
      }),
    }
  )
)
