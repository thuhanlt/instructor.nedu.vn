import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Lang = 'vi' | 'en'

interface PrefsState {
  timezone: string
  lang: Lang
  sidebarOpen: boolean
  qaGuideHidden: boolean
  downloadedMaterials: string[]
  setTimezone: (tz: string) => void
  setLang: (lang: Lang) => void
  toggleSidebar: () => void
  setSidebar: (open: boolean) => void
  setQaGuideHidden: (hidden: boolean) => void
  markMaterialDownloaded: (id: string) => void
}

export const usePrefsStore = create<PrefsState>()(
  persist(
    (set) => ({
      timezone: 'Asia/Ho_Chi_Minh',
      lang: 'vi',
      sidebarOpen: typeof window !== 'undefined' ? window.innerWidth > 900 : true,
      qaGuideHidden: false,
      downloadedMaterials: [],
      setTimezone: (timezone) => set({ timezone }),
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
        lang: s.lang,
        sidebarOpen: s.sidebarOpen,
        qaGuideHidden: s.qaGuideHidden,
        downloadedMaterials: s.downloadedMaterials,
      }),
    }
  )
)
