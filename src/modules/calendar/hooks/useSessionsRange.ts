import { useQuery } from '@tanstack/react-query'
import { api } from '@shared/config/api-client'
import type { Session } from '@shared/types/domain'

export interface RangeSession extends Session {
  programName: string
  klassLabel: string
}

// Shape thật từ BE GET /instructor/sessions/range (xem openapi.yaml → CalendarSession)
interface CalendarSessionDto {
  session_id: string
  session_number: number
  title: string
  course_name: string
  course_run_label: string | null
  course_run_id: string
  course_id: string
  date: string
  start_time: string
  end_time: string
  scheduled_at: string
  duration_minutes: number
  delivery_mode: string
  meeting_url: string | null
  meeting_platform: string | null
  status: string
}

function toRangeSession(d: CalendarSessionDto): RangeSession {
  return {
    id: d.session_id,
    programId: d.course_id,
    klassId: d.course_run_id,
    date: d.date,
    startTime: d.start_time,
    endTime: d.end_time,
    title: d.title,
    type: d.delivery_mode === 'offline' ? 'offline' : 'online',
    // BE calendar không trả zoom credential / materials — SessionRow không dùng,
    // giữ default an toàn để khớp type Session.
    zoom: { roomId: '', password: '', url: d.meeting_url ?? '' },
    materials: [],
    programName: d.course_name,
    klassLabel: d.course_run_label ?? '',
  }
}

export function useSessionsRange(from: string, to: string) {
  return useQuery({
    queryKey: ['calendar', 'sessions', { from, to }],
    queryFn: async () => {
      const rows = await api.get<CalendarSessionDto[]>('/instructor/sessions/range', {
        from,
        to,
      })
      return rows.map(toRangeSession)
    },
    staleTime: 30 * 1000,
  })
}
