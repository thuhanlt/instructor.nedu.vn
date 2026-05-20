import { Icon } from '@shared/components/Icon'
import type { IncidentTimeSlot } from '@shared/types/domain'

interface Props {
  index: number
  value: IncidentTimeSlot
  onChange: (next: IncidentTimeSlot) => void
  onRemove?: () => void
}

export function TimeSlotInput({ index, value, onChange, onRemove }: Props) {
  return (
    <div className="fg">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <label className="fl">Ngày dạy bù (đề xuất {index + 1})</label>
        {onRemove ? (
          <button
            type="button"
            className="icon-btn"
            style={{ color: 'var(--red)' }}
            onClick={onRemove}
            aria-label="Xoá khung giờ"
          >
            <Icon name="close" size={14} />
          </button>
        ) : (
          <div style={{ width: 32 }} />
        )}
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.4fr 1fr 1fr',
          gap: 8,
        }}
      >
        <input
          type="date"
          className="fi"
          value={value.date}
          onChange={(e) => onChange({ ...value, date: e.target.value })}
        />
        <input
          type="time"
          className="fi"
          value={value.startTime}
          onChange={(e) => onChange({ ...value, startTime: e.target.value })}
        />
        <input
          type="time"
          className="fi"
          value={value.endTime}
          onChange={(e) => onChange({ ...value, endTime: e.target.value })}
        />
      </div>
    </div>
  )
}
