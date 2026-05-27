import { useState } from 'react'
import { useAuthStore } from '../stores/useAuthStore'

// Hiển thị khi user đã đăng nhập nhưng KHÔNG có role 'instructor'.
// Bảo mật thật nằm ở BE (TrustMatrixGuard); trang này chỉ là UX — thay vì màn
// trắng/lỗi 403 khi gọi API instructor. KHÔNG đá về /login (user vẫn đăng nhập),
// chỉ cho đăng xuất + hướng dẫn liên hệ admin.
export function NoAccessPage() {
  const logout = useAuthStore((s) => s.logout)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  // await rõ ràng để lệnh revoke token chạy trọn vẹn; disable nút chống
  // double-click cắt ngang. Thành công → store set user=null → ProtectedRoute
  // redirect /login (component unmount, không setState nữa). Lỗi (mạng lag /
  // revoke fail) → mở lại nút cho user thử lại.
  async function handleLogout() {
    if (isLoggingOut) return
    setIsLoggingOut(true)
    try {
      await logout()
    } catch {
      setIsLoggingOut(false)
    }
  }

  return (
    <div className="login-shell">
      <div className="login-card">
        <div className="logo">N·Education</div>
        <h1>Bạn không có quyền truy cập</h1>
        <p className="sub">
          Tài khoản của bạn chưa được cấp quyền giảng viên. Vui lòng liên hệ
          quản trị viên để được cấp quyền truy cập cổng instructor.
        </p>
        <button
          type="button"
          className="btn p"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? 'Đang đăng xuất...' : 'Đăng xuất'}
        </button>
      </div>
    </div>
  )
}
