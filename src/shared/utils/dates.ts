const VI_DAYS = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy']
const VI_DAYS_SHORT = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']
const EN_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const EN_DAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n)
}

export function toDateStr(d: Date): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
}

export function parseDateStr(s: string): Date {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, (m ?? 1) - 1, d ?? 1)
}

export function formatVNDay(d: Date, lang: 'vi' | 'en' = 'vi'): string {
  const dayWord = lang === 'en' ? EN_DAYS[d.getDay()] : VI_DAYS[d.getDay()]
  if (lang === 'en') {
    return `${dayWord}, ${d.getDate()} ${d.toLocaleString('en', { month: 'long' })}, ${d.getFullYear()}`
  }
  return `${dayWord}, ${d.getDate()} tháng ${d.getMonth() + 1}, ${d.getFullYear()}`
}

export function dayShort(d: Date, lang: 'vi' | 'en' = 'vi'): string {
  return lang === 'en' ? EN_DAYS_SHORT[d.getDay()] : VI_DAYS_SHORT[d.getDay()]
}

export function weekStart(d: Date): Date {
  const out = new Date(d)
  const dow = out.getDay()
  const diff = dow === 0 ? -6 : 1 - dow
  out.setDate(out.getDate() + diff)
  out.setHours(0, 0, 0, 0)
  return out
}

export function addDays(d: Date, n: number): Date {
  const out = new Date(d)
  out.setDate(out.getDate() + n)
  return out
}

export function monthLabel(d: Date, lang: 'vi' | 'en' = 'vi'): string {
  if (lang === 'en') {
    return `${d.toLocaleString('en', { month: 'long' })} ${d.getFullYear()}`
  }
  return `Tháng ${d.getMonth() + 1} · ${d.getFullYear()}`
}
