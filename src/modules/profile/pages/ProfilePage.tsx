import { Card } from '@shared/components/Card'
import { SpinnerOverlay } from '@shared/components/SpinnerOverlay'
import { EmptyState } from '@shared/components/EmptyState'
import { Tag } from '@shared/components/Tag'
import { ProfileForm } from '../components/ProfileForm'
import { useProfile } from '../hooks/useProfile'

// R3 Nhóm 5 (2026-05-27):
// - AvatarUpload ẩn (R2 upload defer, xem TODO[R2-UPLOAD] trong useProfile.ts).
// - TimezoneSelector ẩn (timezone auto-detect từ OS, xem App.tsx + usePrefsStore).
// - role + joinedYear hiện "—" nếu vanhanh chưa fill.
export function ProfilePage() {
  const { data: profile, isLoading, isError, refetch } = useProfile()

  if (isLoading) return <SpinnerOverlay inline label="Đang tải hồ sơ..." />
  if (isError || !profile)
    return (
      <Card>
        <EmptyState
          title="Không tải được hồ sơ"
          actionLabel="Thử lại"
          onAction={() => refetch()}
        />
      </Card>
    )

  const hasRole = profile.role !== ''
  const hasJoinedYear = profile.joinedYear > 0

  return (
    <>
      <div>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 24, margin: 0 }}>
          Hồ sơ của tôi
        </h1>
        <div style={{ color: 'var(--muted)', fontSize: 13, marginTop: 4 }}>
          Vận hành sẽ nhận thông báo khi bạn cập nhật hồ sơ.
        </div>
      </div>

      <Card>
        <div
          style={{
            display: 'flex',
            gap: 18,
            alignItems: 'center',
            marginBottom: 18,
            flexWrap: 'wrap',
          }}
        >
          <div style={{ flex: 1, minWidth: 200 }}>
            <div
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 22,
                fontWeight: 600,
                lineHeight: 1.2,
              }}
            >
              {profile.name}
            </div>
            <div style={{ color: 'var(--muted)', fontSize: 13, marginTop: 4 }}>
              {hasRole && hasJoinedYear
                ? `${profile.role} · Tham gia từ ${profile.joinedYear}`
                : hasRole
                  ? profile.role
                  : hasJoinedYear
                    ? `Tham gia từ ${profile.joinedYear}`
                    : '—'}
            </div>
            {profile.tags.length > 0 ? (
              <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                {profile.tags.map((t) => (
                  <Tag key={t} variant="closed">
                    {t}
                  </Tag>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </Card>

      <ProfileForm profile={profile} />
    </>
  )
}
