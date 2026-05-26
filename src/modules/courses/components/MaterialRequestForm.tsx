import { useState } from 'react'
import { Button } from '@shared/components/Button'
import { Icon } from '@shared/components/Icon'
import { notify } from '@shared/utils/notify'
import { analytics, ANALYTICS_EVENTS } from '@shared/analytics'
import { useSendMaterialRequest } from '../hooks/useSendMaterialRequest'
import type { Material } from '@shared/types/domain'

interface Props {
  sessionId: string
  materials: Material[]
}

export function MaterialRequestForm({ sessionId, materials }: Props) {
  const [open, setOpen] = useState(false)
  const [done, setDone] = useState(false)
  const [materialId, setMaterialId] = useState(materials[0]?.id ?? '')
  const [note, setNote] = useState('')
  const [noteErr, setNoteErr] = useState(false)
  const submit = useSendMaterialRequest()

  // Yêu cầu chỉnh sửa gắn với MỘT tài liệu cụ thể — không có tài liệu thì ẩn.
  if (materials.length === 0) return null

  function reset() {
    setNote('')
    setMaterialId(materials[0]?.id ?? '')
    setOpen(false)
    setNoteErr(false)
  }

  async function handleSubmit() {
    if (!note.trim()) {
      setNoteErr(true)
      return
    }
    const chosen = materialId || materials[0]?.id
    if (!chosen) return
    try {
      await submit.mutateAsync({ sessionId, materialId: chosen, note: note.trim() })
      analytics.track(ANALYTICS_EVENTS.MATERIAL_REQUEST_SENT, { sessionId, materialId: chosen })
      setDone(true)
      setNote('')
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
        <Button variant="o" size="sm" style={{ marginTop: 10 }} onClick={() => setDone(false)}>
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
        <label className="fl">Tài liệu cần chỉnh sửa</label>
        <select
          className="fin"
          value={materialId}
          onChange={(e) => setMaterialId(e.target.value)}
        >
          {materials.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
      </div>

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
          <div style={{ fontSize: 11.5, color: 'var(--red)' }}>Bạn chưa điền ghi chú</div>
        ) : null}
      </div>

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
