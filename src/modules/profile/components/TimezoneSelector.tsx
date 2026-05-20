import { useQueryClient } from '@tanstack/react-query'
import { Icon } from '@shared/components/Icon'
import { TIMEZONES, timezoneShortLabel } from '@shared/timezone'
import { TimezoneClock } from '@shared/timezone/TimezoneClock'
import { usePrefsStore } from '@shared/stores/usePrefsStore'
import { notify } from '@shared/utils/notify'
import { analytics, ANALYTICS_EVENTS } from '@shared/analytics'

export function TimezoneSelector() {
  const tz = usePrefsStore((s) => s.timezone)
  const setTimezone = usePrefsStore((s) => s.setTimezone)
  const qc = useQueryClient()

  function handleChange(next: string) {
    setTimezone(next)
    qc.invalidateQueries({ queryKey: ['home', 'dashboard'] })
    qc.invalidateQueries({ queryKey: ['calendar'] })
    analytics.track(ANALYTICS_EVENTS.TIMEZONE_CHANGED, { tz: next })
    notify(`Đã đổi múi giờ sang ${timezoneShortLabel(next)}`, 'success')
  }

  return (
    <div className="card" id="timezone">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14 }}>Múi giờ hiển thị</div>
          <div style={{ color: 'var(--muted)', fontSize: 12.5, marginTop: 4 }}>
            Giờ hiện tại: <TimezoneClock tz={tz} format="HH:mm:ss" /> ({timezoneShortLabel(tz)})
          </div>
        </div>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: 'var(--tint)',
            color: 'var(--blue)',
            padding: '6px 10px',
            borderRadius: 999,
            fontWeight: 700,
            fontSize: 12.5,
          }}
        >
          <Icon name="clock" size={14} />
          {timezoneShortLabel(tz)}
        </div>
      </div>

      <div className="fg">
        <label className="fl">Chọn múi giờ</label>
        <select
          className="fs"
          value={tz}
          onChange={(e) => handleChange(e.target.value)}
        >
          {TIMEZONES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.flag} {t.label}
            </option>
          ))}
        </select>
      </div>

      <div
        style={{
          background: 'var(--tint)',
          border: '1px solid var(--tint-border)',
          borderRadius: 'var(--rs)',
          padding: 10,
          fontSize: 12,
          color: 'var(--blue)',
          marginTop: 14,
        }}
      >
        Toàn bộ giờ trong lịch và chương trình sẽ được hiển thị theo múi giờ này.
      </div>
    </div>
  )
}
