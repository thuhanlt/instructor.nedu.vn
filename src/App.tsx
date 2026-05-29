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
//
// Đọc store qua `usePrefsStore.getState()` thay vì selector hooks: effect là
// on-mount intentional, không cần re-run khi store đổi (tránh toast loop khi
// chính effect setTimezone). Imperative read = fresh values mỗi lần effect
// chạy, không có closure trap, không cần `eslint-disable exhaustive-deps`.
function useTimezoneDetect() {
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

    const { timezone, tzInitialized, setTimezone, setTzInitialized } =
      usePrefsStore.getState()

    if (detected !== timezone) {
      setTimezone(detected)
      if (tzInitialized) {
        notify(
          `Đã chuyển sang múi giờ ${detected}. Lịch dạy hiển thị theo giờ mới.`,
          'info'
        )
      } else {
        setTzInitialized(true)
      }
    } else if (!tzInitialized) {
      setTzInitialized(true)
    }
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
