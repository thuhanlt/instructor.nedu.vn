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

export function ProfileForm({ profile }: Props) {
  const [edit, setEdit] = useState(false)
  const [draft, setDraft] = useState<InstructorProfile>(profile)
  const [errs, setErrs] = useState<{ name?: boolean; email?: boolean }>({})
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
    const nameErr = !draft.name.trim()
    const emailErr = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email)
    if (nameErr || emailErr) {
      setErrs({ name: nameErr, email: emailErr })
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
          <div className="fg">
            <label className="fl">Họ và tên</label>
            <input
              className={`fi ${errs.name ? 'err' : ''}`}
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            />
            {errs.name ? (
              <div style={{ color: 'var(--red)', fontSize: 11 }}>Họ tên là bắt buộc</div>
            ) : null}
          </div>
          <div className="fg">
            <label className="fl">Email</label>
            <input
              type="email"
              className={`fi ${errs.email ? 'err' : ''}`}
              value={draft.email}
              onChange={(e) => setDraft({ ...draft, email: e.target.value })}
            />
            {errs.email ? (
              <div style={{ color: 'var(--red)', fontSize: 11 }}>Email không hợp lệ</div>
            ) : null}
          </div>
          <div className="fg">
            <label className="fl">Điện thoại</label>
            <input
              className="fi"
              value={draft.phone}
              onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
            />
          </div>
          <div className="fg">
            <label className="fl">Kinh nghiệm</label>
            <input
              className="fi"
              value={draft.experience}
              onChange={(e) => setDraft({ ...draft, experience: e.target.value })}
            />
          </div>
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
