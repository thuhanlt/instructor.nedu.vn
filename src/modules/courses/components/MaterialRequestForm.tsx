import { useState } from 'react'
import { Button } from '@shared/components/Button'
import { Icon } from '@shared/components/Icon'
import { UploadZone } from '@shared/components/UploadZone'
import { notify } from '@shared/utils/notify'
import { analytics, ANALYTICS_EVENTS } from '@shared/analytics'
import { useSendMaterialRequest } from '../hooks/useSendMaterialRequest'

interface Props {
  sessionId: string
}

function fmtSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

export function MaterialRequestForm({ sessionId }: Props) {
  const [open, setOpen] = useState(false)
  const [done, setDone] = useState(false)
  const [note, setNote] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [noteErr, setNoteErr] = useState(false)
  const submit = useSendMaterialRequest()

  function reset() {
    setNote('')
    setFiles([])
    setOpen(false)
    setNoteErr(false)
  }

  async function handleSubmit() {
    if (!note.trim()) {
      setNoteErr(true)
      return
    }
    try {
      await submit.mutateAsync({ sessionId, note: note.trim(), files })
      analytics.track(ANALYTICS_EVENTS.MATERIAL_REQUEST_SENT, {
        sessionId,
        fileCount: files.length,
      })
      setDone(true)
      setNote('')
      setFiles([])
      notify('Đã gửi yêu cầu chỉnh sửa tài liệu', 'success')
    } catch {
      notify('Gửi yêu cầu thất bại — vui lòng thử lại', 'error')
    }
  }

  if (done) {
    return (
      <div className="mat-sent-box">
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: '50%',
            background: 'var(--green)',
            color: '#fff',
            margin: '0 auto 10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon name="check" size={20} />
        </div>
        <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--green)' }}>
          Đã gửi yêu cầu thành công
        </div>
        <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 4 }}>
          Vận hành sẽ xử lý trong thời gian sớm nhất
        </div>
        <Button
          variant="o"
          size="sm"
          style={{ marginTop: 10 }}
          onClick={() => setDone(false)}
        >
          Quay lại
        </Button>
      </div>
    )
  }

  if (!open) {
    return (
      <Button
        variant="o"
        size="sm"
        icon={<Icon name="bulb" size={14} />}
        onClick={() => setOpen(true)}
      >
        Gửi yêu cầu chỉnh sửa
      </Button>
    )
  }

  return (
    <div
      style={{
        background: 'var(--bg)',
        borderRadius: 'var(--rs)',
        padding: 14,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      <div className="fg">
        <label className="fl">Ghi chú: phần nào cần chỉnh sửa</label>
        <textarea
          className={`fta ${noteErr ? 'err' : ''}`}
          value={note}
          onChange={(e) => {
            setNote(e.target.value)
            if (e.target.value.trim()) setNoteErr(false)
          }}
          placeholder="Vd: Slide 4 ví dụ chưa phù hợp với học viên doanh nghiệp..."
        />
        {noteErr ? (
          <div style={{ fontSize: 11.5, color: 'var(--red)' }}>
            Bạn chưa điền ghi chú
          </div>
        ) : null}
      </div>

      <UploadZone
        accept="image/*,.pdf,.doc,.docx,.ppt,.pptx"
        onFilesAdded={(arr) => setFiles((prev) => [...prev, ...arr])}
      />

      {files.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {files.map((f, idx) => (
            <div
              key={`${f.name}-${idx}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: '#fff',
                border: '1px solid var(--border)',
                padding: '7px 10px',
                borderRadius: 'var(--rs)',
                fontSize: 12.5,
              }}
            >
              <Icon name="doc" size={14} className="muted" />
              <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {f.name}
              </span>
              <span className="faint">{fmtSize(f.size)}</span>
              <button
                type="button"
                className="icon-btn"
                style={{ color: 'var(--red)' }}
                onClick={() => setFiles((prev) => prev.filter((_, i) => i !== idx))}
                aria-label="Xoá file"
              >
                <Icon name="close" size={12} />
              </button>
            </div>
          ))}
        </div>
      ) : null}

      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <Button variant="o" onClick={reset} disabled={submit.isPending}>
          Huỷ
        </Button>
        <Button
          variant="p"
          onClick={handleSubmit}
          disabled={submit.isPending}
          icon={<Icon name="send" size={14} />}
        >
          {submit.isPending ? 'Đang gửi...' : 'Gửi yêu cầu'}
        </Button>
      </div>
    </div>
  )
}
