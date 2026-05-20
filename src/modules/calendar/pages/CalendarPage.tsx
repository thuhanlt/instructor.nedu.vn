import { useState } from 'react'
import { CalendarToolbar, type CalView } from '../components/CalendarToolbar'
import { WeekView } from '../components/WeekView'
import { MonthView } from '../components/MonthView'
import { YearView } from '../components/YearView'
import { addDays, weekStart, monthLabel } from '@shared/utils/dates'
import { usePrefsStore } from '@shared/stores/usePrefsStore'

// Mock TODAY (Feb 10, 2025) — when real API is wired the BE will respect tz; for FE
// we just need a consistent "now" while mocking.
const MOCK_TODAY = new Date(2025, 1, 10)

function isoWeekNumber(d: Date): number {
  const target = new Date(d)
  target.setHours(0, 0, 0, 0)
  target.setDate(target.getDate() + 3 - ((target.getDay() + 6) % 7))
  const week1 = new Date(target.getFullYear(), 0, 4)
  return (
    1 +
    Math.round(
      ((target.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7
    )
  )
}

function weekLabel(start: Date): string {
  const end = addDays(start, 6)
  const wn = isoWeekNumber(start)
  const fmt = (d: Date) => `${d.getDate()}/${d.getMonth() + 1}`
  return `Tuần ${wn} (${fmt(start)}–${fmt(end)}/${end.getFullYear()})`
}

export function CalendarPage() {
  const today = MOCK_TODAY
  const lang = usePrefsStore((s) => s.lang)
  const [view, setView] = useState<CalView>('week')
  const [cursor, setCursor] = useState<Date>(today)

  const wStart = weekStart(cursor)

  function onPrev() {
    if (view === 'week') setCursor(addDays(cursor, -7))
    else if (view === 'month')
      setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))
    else setCursor(new Date(cursor.getFullYear() - 1, cursor.getMonth(), 1))
  }
  function onNext() {
    if (view === 'week') setCursor(addDays(cursor, 7))
    else if (view === 'month')
      setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))
    else setCursor(new Date(cursor.getFullYear() + 1, cursor.getMonth(), 1))
  }

  const label =
    view === 'week'
      ? weekLabel(wStart)
      : view === 'month'
      ? monthLabel(cursor, lang)
      : `Năm ${cursor.getFullYear()}`

  return (
    <>
      <div>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 24, margin: 0 }}>
          Lịch dạy
        </h1>
        <div style={{ color: 'var(--muted)', fontSize: 13, marginTop: 4 }}>
          Xem theo Tuần / Tháng / Năm. Bấm "Thay đổi lịch" trên buổi chưa diễn ra để báo
          vận hành.
        </div>
      </div>

      <CalendarToolbar
        view={view}
        onViewChange={setView}
        label={label}
        onPrev={onPrev}
        onNext={onNext}
        onToday={() => setCursor(today)}
      />

      {view === 'week' ? (
        <WeekView weekStart={wStart} today={today} />
      ) : view === 'month' ? (
        <MonthView cursor={cursor} today={today} />
      ) : (
        <YearView
          year={cursor.getFullYear()}
          today={today}
          onMonthClick={(m) => {
            setCursor(new Date(cursor.getFullYear(), m, 1))
            setView('month')
          }}
        />
      )}
    </>
  )
}
