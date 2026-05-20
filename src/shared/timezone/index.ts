import { formatInTimeZone } from 'date-fns-tz'

export interface TimezoneOption {
  value: string // IANA tz
  offset: string // e.g. "+07:00"
  label: string // display
  flag: string
}

export const TIMEZONES: TimezoneOption[] = [
  { value: 'Asia/Ho_Chi_Minh', offset: '+07:00', flag: '🇻🇳', label: 'Việt Nam — UTC+7 (TP.HCM, Hà Nội)' },
  { value: 'Asia/Bangkok', offset: '+07:00', flag: '🇹🇭', label: 'Thái Lan — UTC+7 (Bangkok)' },
  { value: 'Asia/Singapore', offset: '+08:00', flag: '🇸🇬', label: 'Singapore — UTC+8' },
  { value: 'Asia/Kuala_Lumpur', offset: '+08:00', flag: '🇲🇾', label: 'Malaysia — UTC+8 (Kuala Lumpur)' },
  { value: 'Asia/Jakarta', offset: '+07:00', flag: '🇮🇩', label: 'Indonesia — UTC+7 (Jakarta)' },
  { value: 'Asia/Manila', offset: '+08:00', flag: '🇵🇭', label: 'Philippines — UTC+8 (Manila)' },
  { value: 'Asia/Tokyo', offset: '+09:00', flag: '🇯🇵', label: 'Nhật Bản — UTC+9 (Tokyo)' },
  { value: 'Asia/Seoul', offset: '+09:00', flag: '🇰🇷', label: 'Hàn Quốc — UTC+9 (Seoul)' },
  { value: 'Asia/Shanghai', offset: '+08:00', flag: '🇨🇳', label: 'Trung Quốc — UTC+8 (Thượng Hải)' },
  { value: 'Asia/Kolkata', offset: '+05:30', flag: '🇮🇳', label: 'Ấn Độ — UTC+5:30 (Mumbai)' },
  { value: 'Europe/London', offset: '+00:00', flag: '🇬🇧', label: 'Anh — UTC+0 (London)' },
  { value: 'Europe/Paris', offset: '+01:00', flag: '🇫🇷', label: 'Pháp — UTC+1 (Paris)' },
  { value: 'Europe/Berlin', offset: '+01:00', flag: '🇩🇪', label: 'Đức — UTC+1 (Berlin)' },
  { value: 'America/New_York', offset: '-05:00', flag: '🇺🇸', label: 'Mỹ Đông — UTC-5 (New York)' },
  { value: 'America/Los_Angeles', offset: '-08:00', flag: '🇺🇸', label: 'Mỹ Tây — UTC-8 (Los Angeles)' },
  { value: 'Australia/Sydney', offset: '+11:00', flag: '🇦🇺', label: 'Úc — UTC+11 (Sydney)' },
]

export function timezoneShortLabel(tz: string): string {
  const o = TIMEZONES.find((t) => t.value === tz)
  if (!o) return tz
  const offsetNum = parseFloat(o.offset.replace(':', '.'))
  if (offsetNum === 0) return 'UTC+0'
  if (Number.isInteger(offsetNum)) {
    return offsetNum > 0 ? `UTC+${offsetNum}` : `UTC${offsetNum}`
  }
  return `UTC${o.offset.replace(/^([+-])0?/, '$1')}`
}

export function formatInTz(date: Date, tz: string, fmt: string): string {
  try {
    return formatInTimeZone(date, tz, fmt)
  } catch {
    return formatInTimeZone(date, 'Asia/Ho_Chi_Minh', fmt)
  }
}
