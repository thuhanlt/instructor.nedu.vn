import { useState } from 'react'
import { Button } from '@shared/components/Button'
import { Icon } from '@shared/components/Icon'
import { notify } from '@shared/utils/notify'
import { analytics, ANALYTICS_EVENTS } from '@shared/analytics'
import { useUpdateProfile } from '../hooks/useProfile'
import type { InstructorProfile } from '@shared/types/domain'

interface Props {
  profile: InstructorProfile
}

// R3 Nhóm 5 (2026-05-27): identity fields (name/email/role/joinedYear/experience)
// do vanhanh quản → read-only. Instructor chỉ edit phone + bio.
// Tags: editable theo BE/API nhưng UI chưa có editor — defer post-golive.
export function ProfileForm({ profile }: Props) {
  const [edit, setEdit] = useState(false)
  const [draft, setDraft] = useState<InstructorProfile>(profile)
  const [errs, setErrs] = useState<{ phone?: boolean }>({})
  const update = useUpdateProfile()

  function startEdit() {
    setDraft(profile)
    setErrs({})
    setEdit(true)
  }
  function cancel() {
    setEdit(false)
    setDraft(profile)
    setErrs({})
  }
  async function save() {
    // Phone validation: cho phép rỗng; reject text chars (giống BE).
    const phoneErr =
      draft.phone !== '' && !/^[\d\s+\-().]*$/.test(draft.phone)
    if (phoneErr) {
      setErrs({ phone: true })
      return
    }
    try {
      await update.mutateAsync(draft)
      analytics.track(ANALYTICS_EVENTS.PROFILE_SAVED)
      notify('Đã lưu hồ sơ · Vận hành đã được thông báo', 'success')
      setEdit(false)
    } catch {
      notify('Lưu hồ sơ thất bại — thử lại', 'error')
    }
  }

  return (
    <div className="card">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 14,
        }}
      >
        <div style={{ fontWeight: 700, fontSize: 14 }}>Thông tin cá nhân</div>
        {!edit ? (
          <Button variant="o" size="sm" onClick={startEdit}>
            Chỉnh sửa
          </Button>
        ) : null}
      </div>

      {!edit ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            rowGap: 14,
            columnGap: 20,
          }}
        >
          <Field label="Họ và tên" value={profile.name} />
          <Field label="Email" value={profile.email} />
          <Field label="Điện thoại" value={profile.phone} />
          <Field label="Kinh nghiệm" value={profile.experience} />
          <div style={{ gridColumn: '1 / -1' }}>
            <Field label="Giới thiệu bản thân" value={profile.bio} multiline />
          </div>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            rowGap: 12,
            columnGap: 20,
          }}
        >
          {/* Họ và tên — vanhanh quản, read-only */}
          <ReadOnlyField label="Họ và tên" value={profile.name} />
          {/* Email — auth-central identity, read-only */}
          <ReadOnlyField label="Email" value={profile.email} />
          {/* Điện thoại — instructor edit được */}
          <div className="fg">
            <label className="fl">Điện thoại</label>
            <input
              className={`fi ${errs.phone ? 'err' : ''}`}
              value={draft.phone}
              maxLength={30}
              placeholder="Để trống nếu chưa có"
              onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
            />
            {errs.phone ? (
              <div style={{ color: 'var(--red)', fontSize: 11 }}>
                Chỉ được chứa số, dấu cách, +, -, ( ), .
              </div>
            ) : null}
          </div>
          {/* Kinh nghiệm — vanhanh quản, read-only */}
          <ReadOnlyField label="Kinh nghiệm" value={profile.experience} />
          {/* Giới thiệu bản thân — instructor edit được */}
          <div className="fg" style={{ gridColumn: '1 / -1' }}>
            <label className="fl">Giới thiệu bản thân</label>
            <textarea
              className="fta"
              value={draft.bio}
              onChange={(e) => setDraft({ ...draft, bio: e.target.value })}
            />
          </div>
          <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 6 }}>
            <Button variant="o" onClick={cancel} disabled={update.isPending}>
              Huỷ
            </Button>
            <Button
              variant="p"
              onClick={save}
              disabled={update.isPending}
              icon={<Icon name="check" size={14} />}
            >
              {update.isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

function Field({
  label,
  value,
  multiline,
}: {
  label: string
  value: string
  multiline?: boolean
}) {
  return (
    <div>
      <div
        style={{
          fontSize: 11,
          textTransform: 'uppercase',
          letterSpacing: 0.4,
          color: 'var(--faint)',
          fontWeight: 600,
          marginBottom: 4,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 13.5,
          color: 'var(--ink)',
          lineHeight: multiline ? 1.55 : 1.4,
          whiteSpace: multiline ? 'pre-wrap' : 'nowrap',
          overflow: multiline ? 'visible' : 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {value || <span className="faint">—</span>}
      </div>
    </div>
  )
}

// Trong chế độ edit: dùng label cùng style với input nhưng giá trị hiển thị dạng
// "fi disabled" để giữ chiều cao + alignment với các input khác trong grid.
function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div className="fg">
      <label className="fl">{label}</label>
      <div
        style={{
          padding: '8px 10px',
          border: '1px solid var(--border)',
          borderRadius: 'var(--rs)',
          background: 'var(--tint)',
          color: 'var(--muted)',
          fontSize: 13.5,
          minHeight: 36,
          display: 'flex',
          alignItems: 'center',
        }}
        title="Trường này do vận hành quản lý — liên hệ admin để cập nhật"
      >
        {value || <span className="faint">—</span>}
      </div>
    </div>
  )
}
