import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@modules/auth/stores/useAuthStore'
import { SpinnerOverlay } from '@shared/components/SpinnerOverlay'
import { NoAccessPage } from '@modules/auth/pages/NoAccessPage'

// Role bắt buộc để vào cổng instructor — khớp BE @TrustMatrix('instructor').
const REQUIRED_ROLE = 'instructor'

export function ProtectedRoute() {
  const user = useAuthStore((s) => s.user)
  const isLoading = useAuthStore((s) => s.isLoading)
  const initialized = useAuthStore((s) => s.initialized)

  if (!initialized || isLoading) {
    return <SpinnerOverlay label="Đang khởi tạo..." />
  }
  // Chưa đăng nhập (hoặc /auth/me fail) → về login.
  if (!user) {
    return <Navigate to="/login" replace />
  }
  // Đã đăng nhập nhưng thiếu role 'instructor' → trang "không có quyền" (render
  // thẳng, không redirect → tránh loop, giữ nguyên URL). BE vẫn là chốt bảo mật.
  if (!user.roles?.includes(REQUIRED_ROLE)) {
    return <NoAccessPage />
  }
  return <Outlet />
}
