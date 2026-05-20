import { useState, useEffect } from 'react'
import { Modal } from '@shared/components/Modal'
import { Button } from '@shared/components/Button'
import { Icon } from '@shared/components/Icon'
import { notify } from '@shared/utils/notify'
import { analytics, ANALYTICS_EVENTS } from '@shared/analytics'
import { useIncidentStore } from '../stores/useIncidentStore'
import { useSubmitIncident } from '../hooks/useSubmitIncident'
import { TimeSlotInput } from './TimeSlotInput'
import type {
  IncidentAction,
  IncidentReason,
  IncidentTimeSlot,
} from '@shared/types/domain'

const REASONS: { value: IncidentReason; label: string }[] = [
  { value: 'urgent_task', label: 'Có việc đột xuất không thể dạy' },
  { value: 'sick', label: 'Bị ốm / sức khoẻ' },
  { value: 'family', label: 'Lý do gia đình' },
  { value: 'other', label: 'Lý do khác' },
]

const ACTIONS: { value: IncidentAction; label: string }[] = [
  { value: 'reschedule', label: 'Đề xuất lịch dạy bù' },
  { value: 'cancel', label: 'Huỷ hẳn buổi học này' },
]

const emptySlot = (): IncidentTimeSlot => ({ date: '', startTime: '', endTime: '' })

export function IncidentModal() {
  const open = useIncidentStore((s) => s.open)
  const target = useIncidentStore((s) => s.target)
  const closeModal = useIncidentStore((s) => s.closeModal)
  const submit = useSubmitIncident()

  const [reason, setReason] = useState<IncidentReason>('urgent_task')
  const [action, setAction] = useState<IncidentAction>('reschedule')
  const [slots, setSlots] = useState<IncidentTimeSlot[]>([emptySlot()])
  const [note, setNote] = useState('')

  useEffect(() => {
    if (open) {
      setReason('urgent_task')
      setAction('reschedule')
      setSlots([emptySlot()])
      setNote('')
    }
  }, [open])

  if (!target) return null

  function updateSlot(idx: number, next: IncidentTimeSlot) {
    setSlots((prev) => prev.map((s, i) => (i === idx ? next : s)))
  }
  function removeSlot(idx: number) {
    setSlots((prev) => prev.filter((_, i) => i !== idx))
  }
  function addSlot() {
    setSlots((prev) => [...prev, emptySlot()])
  }

  async function handleSubmit() {
    if (!target) return
    if (action === 'reschedule') {
      const valid = slots.every((s) => s.date && s.startTime && s.endTime)
      if (!valid) {
        notify('Vui lòng điền đầy đủ khung giờ đề xuất', 'warn')
        return
      }
    }
    try {
      await submit.mutateAsync({
        sessionId: target.sessionId,
        reason,
        action,
        proposedSlots: action === 'reschedule' ? slots : [],
        note,
      })
      analytics.track(ANALYTICS_EVENTS.INCIDENT_REPORTED, {
        sessionId: target.sessionId,
        action,
        reason,
      })
      notify('Đã gửi thông báo thay đổi lịch tới vận hành!', 'success')
      closeModal()
    } catch {
      notify('Gửi không thành công — vui lòng thử lại', 'error')
    }
  }

  return (
    <Modal
      open={open}
      onClose={closeModal}
      size="sm"
      title="Thay đổi lịch dạy"
      footer={
        <>
          <Button variant="o" onClick={closeModal} disabled={submit.isPending}>
            Đóng
          </Button>
          <Button variant="p" onClick={handleSubmit} disabled={submit.isPending}>
            {submit.isPending ? 'Đang gửi...' : 'Gửi thông báo'}
          </Button>
        </>
      }
    >
      <div
        style={{
          background: 'var(--red-l)',
          color: 'var(--red)',
          padding: '10px 12px',
          borderRadius: 'var(--rs)',
          fontWeight: 700,
          fontSize: 13.5,
        }}
      >
        {target.sessionLabel}
      </div>

      <div className="fg">
        <label className="fl">Lý do thay đổi</label>
        <select
          className="fs"
          value={reason}
          onChange={(e) => setReason(e.target.value as IncidentReason)}
        >
          {REASONS.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
      </div>

      <div className="fg">
        <label className="fl">Xử lý lịch dạy này</label>
        <select
          className="fs"
          value={action}
          onChange={(e) => setAction(e.target.value as IncidentAction)}
        >
          {ACTIONS.map((a) => (
            <option key={a.value} value={a.value}>
              {a.label}
            </option>
          ))}
        </select>
      </div>

      {action === 'reschedule' ? (
        <div className="fg">
          <label className="fl">Đề xuất khung lịch dạy bù</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {slots.map((slot, idx) => (
              <TimeSlotInput
                key={idx}
                index={idx}
                value={slot}
                onChange={(next) => updateSlot(idx, next)}
                onRemove={idx === 0 ? undefined : () => removeSlot(idx)}
              />
            ))}
          </div>
          <Button
            variant="o"
            size="sm"
            icon={<Icon name="plus" size={14} />}
            onClick={addSlot}
            style={{ alignSelf: 'flex-start', marginTop: 4 }}
          >
            Thêm khung giờ khác
          </Button>
          <div style={{ fontSize: 11.5, color: 'var(--faint)', marginTop: 4 }}>
            Vận hành sẽ xác nhận và sắp xếp lịch mới cho bạn
          </div>
        </div>
      ) : null}

      <div className="fg">
        <label className="fl">Ghi chú thêm (không bắt buộc)</label>
        <textarea
          className="fta"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Vd: Tôi đã trao đổi với phụ huynh rồi..."
        />
      </div>
    </Modal>
  )
}
