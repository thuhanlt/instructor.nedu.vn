// ─────────────────────────────────────────────────────────────────────────────
// TODO[R2-UPLOAD]: AvatarUpload là feature CHỜ R2 upload sẵn sàng. DORMANT cho
// golive 2026-05-30: ProfilePage KHÔNG render component này, BE endpoint
// POST /instructor/profile/avatar chưa build. Code giữ nguyên để revive sau:
//   1. BE build endpoint upload qua OBJECT_STORAGE contract (Phase 1 stub đã có).
//   2. ProfilePage import + render lại <AvatarUpload>.
//   3. Verify R2 signed-URL flow + file size limit (~2MB) trước khi expose.
// ─────────────────────────────────────────────────────────────────────────────
import { useRef } from 'react'
import { Icon } from '@shared/components/Icon'
import { notify } from '@shared/utils/notify'
import { useUploadAvatar } from '../hooks/useProfile'

interface Props {
  name: string
  avatarUrl: string | null
}

export function AvatarUpload({ name, avatarUrl }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const upload = useUploadAvatar()

  const initial = name.slice(0, 1).toUpperCase()

  function handleFile(file: File) {
    if (!file.type.startsWith('image/')) {
      notify('Vui lòng chọn file ảnh', 'warn')
      return
    }
    upload
      .mutateAsync(file)
      .then(() => notify('Đã cập nhật ảnh đại diện', 'success'))
      .catch(() => notify('Tải ảnh thất bại — thử lại', 'error'))
  }

  return (
    <div style={{ position: 'relative', width: 88, height: 88 }}>
      <div
        style={{
          width: 88,
          height: 88,
          borderRadius: '50%',
          background: avatarUrl ? '#fff' : 'var(--blue)',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700,
          fontSize: 32,
          fontFamily: 'var(--font-heading)',
          overflow: 'hidden',
          border: '2px solid #fff',
          boxShadow: 'var(--sh)',
        }}
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="Avatar"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          initial
        )}
      </div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={upload.isPending}
        aria-label="Đổi ảnh đại diện"
        style={{
          position: 'absolute',
          right: -2,
          bottom: -2,
          width: 28,
          height: 28,
          borderRadius: '50%',
          background: 'var(--blue)',
          color: '#fff',
          border: '2px solid #fff',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon name="camera" size={13} />
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) handleFile(f)
          e.target.value = ''
        }}
      />
    </div>
  )
}
