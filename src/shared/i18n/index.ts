import { usePrefsStore } from '../stores/usePrefsStore'
import { VI, type DictKey } from './vi'
import { EN } from './en'

const DICTS = { vi: VI, en: EN } as const

export function useT() {
  const lang = usePrefsStore((s) => s.lang)
  return (key: DictKey): string => {
    const dict = DICTS[lang]
    return dict[key] ?? VI[key] ?? key
  }
}

export function t(lang: 'vi' | 'en', key: DictKey): string {
  return DICTS[lang][key] ?? VI[key] ?? key
}

export type { DictKey }
