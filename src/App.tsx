import { useEffect } from 'react'
import { AppRouter } from './routes'
import { useAuthStore } from '@modules/auth/stores/useAuthStore'
import { usePrefsStore } from '@shared/stores/usePrefsStore'
import { notify } from '@shared/utils/notify'

// R3 Nhóm 5 (2026-05-27): timezone auto-detect.
// Mỗi lần app mount: detect OS timezone, so sánh với tz đã lưu.
//   - Khác + đã initialized trước đó → toast info (instructor đã di chuyển).
//   - Khác + lần đầu → silent (welcome flow, không spam).
//   - Giống → no-op.
// Update tz đã lưu + flag để lần sau biết "đây là lần thứ 2+".
function useTimezoneDetect() {
  const tz = usePrefsStore((s) => s.timezone)
  const initialized = usePrefsStore((s) => s.tzInitialized)
  const setTimezone = usePrefsStore((s) => s.setTimezone)
  const setTzInitialized = usePrefsStore((s) => s.setTzInitialized)

  useEffect(() => {
    let detected: string | null = null
    try {
      if (typeof Intl !== 'undefined') {
        detected = Intl.DateTimeFormat().resolvedOptions().timeZone || null
      }
    } catch {
      detected = null
    }
    if (!detected) return

    if (detected !== tz) {
      setTimezone(detected)
      if (initialized) {
        notify(
          `Đã chuyển sang múi giờ ${detected}. Lịch dạy hiển thị theo giờ mới.`,
          'info'
        )
      } else {
        setTzInitialized(true)
      }
    } else if (!initialized) {
      setTzInitialized(true)
    }
    // Chỉ chạy 1 lần mỗi mount; bỏ deps để không trigger lại khi tz tự update.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}

export function App() {
  const initialize = useAuthStore((s) => s.initialize)
  useEffect(() => {
    initialize()
  }, [initialize])
  useTimezoneDetect()
  return <AppRouter />
}
