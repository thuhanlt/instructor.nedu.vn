import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@modules/auth/stores/useAuthStore'
import { SpinnerOverlay } from '@shared/components/SpinnerOverlay'

export function ProtectedRoute() {
  const user = useAuthStore((s) => s.user)
  const isLoading = useAuthStore((s) => s.isLoading)
  const initialized = useAuthStore((s) => s.initialized)

  if (!initialized || isLoading) {
    return <SpinnerOverlay label="Đang khởi tạo..." />
  }
  if (!user) {
    return <Navigate to="/login" replace />
  }
  return <Outlet />
}
