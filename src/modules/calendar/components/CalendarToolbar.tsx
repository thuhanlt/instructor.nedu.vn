import { Icon } from '@shared/components/Icon'
import { cn } from '@shared/utils/cn'

export type CalView = 'week' | 'month' | 'year'

interface Props {
  view: CalView
  onViewChange: (v: CalView) => void
  label: string
  onPrev: () => void
  onNext: () => void
  onToday: () => void
}

export function CalendarToolbar({
  view,
  onViewChange,
  label,
  onPrev,
  onNext,
  onToday,
}: Props) {
  return (
    <div
      style={{
        display: 'flex',
        gap: 12,
        alignItems: 'center',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
      }}
    >
      <div
        style={{
          display: 'inline-flex',
          background: '#fff',
          border: '1px solid var(--border)',
          borderRadius: 999,
          padding: 3,
          boxShadow: 'var(--sh)',
        }}
      >
        {(['week', 'month', 'year'] as CalView[]).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => onViewChange(v)}
            className={cn('btn ghost sm')}
            style={{
              padding: '5px 14px',
              borderRadius: 999,
              background: view === v ? 'var(--blue-btn)' : 'transparent',
              color: view === v ? '#fff' : 'var(--ink2)',
            }}
          >
            {v === 'week' ? 'Tuần' : v === 'month' ? 'Tháng' : 'Năm'}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <button className="icon-btn" type="button" onClick={onPrev} aria-label="Trước"
          style={{ background: '#fff', border: '1px solid var(--border)', color: 'var(--ink2)' }}
        >
          <Icon name="chev-left" size={16} />
        </button>
        <div
          style={{
            minWidth: 220,
            textAlign: 'center',
            fontWeight: 600,
            fontSize: 14,
          }}
        >
          {label}
        </div>
        <button className="icon-btn" type="button" onClick={onNext} aria-label="Sau"
          style={{ background: '#fff', border: '1px solid var(--border)', color: 'var(--ink2)' }}
        >
          <Icon name="chev-right" size={16} />
        </button>
        <button
          type="button"
          onClick={onToday}
          className="btn o sm"
          style={{ marginLeft: 6 }}
        >
          Hôm nay
        </button>
      </div>
    </div>
  )
}
