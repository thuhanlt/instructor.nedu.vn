import { useQuery } from '@tanstack/react-query'
import { api } from '@shared/config/api-client'
import type { Klass, Program, Session, SessionType } from '@shared/types/domain'

export interface ProgramKlassDetail {
  program: Program
  klass: Klass
  stats: {
    studentCount: number
    sessionsDone: number
    sessionsTotal: number
    avgFeedback: number
  }
}

// Shape thật từ BE GET /instructor/klasses/:courseRunId/detail
interface CourseSessionDetailDto {
  session_id: string
  session_number: number
  title: string
  date?: string
  start_time?: string
  end_time?: string
  scheduled_at: string
  duration_minutes: number
  delivery_mode: string
  meeting_url: string | null
  meeting_platform: string | null
  status: string
  is_assigned: boolean
  has_materials: boolean
}

interface KlassDetailDto {
  program: {
    id: string
    name: string
    color: string
    klasses: Array<{ id: string; label: string }>
  }
  klass: {
    id: string
    label: string
    student_count: number
    sessions: CourseSessionDetailDto[]
  }
  stats: {
    student_count: number
    sessions_done: number
    sessions_total: number
    avg_feedback: number
  }
}

function toSession(programId: string, klassId: string, s: CourseSessionDetailDto): Session {
  return {
    id: s.session_id,
    programId,
    klassId,
    date: s.date ?? '',
    startTime: s.start_time ?? '',
    endTime: s.end_time ?? '',
    title: s.title,
    type: (s.delivery_mode === 'offline' ? 'offline' : 'online') as SessionType,
    // BE không trả zoom credential / materials ở detail — materials load lazy
    // qua useSessionMaterials trong tab Tài liệu.
    zoom: { roomId: '', password: '', url: s.meeting_url ?? '' },
    materials: [],
  }
}

function toDetail(d: KlassDetailDto): ProgramKlassDetail {
  const programId = d.program.id
  const klassId = d.klass.id
  return {
    program: {
      id: programId,
      name: d.program.name,
      color: d.program.color,
      klasses: d.program.klasses.map((k) => ({
        id: k.id,
        programId,
        label: k.label,
        studentCount: 0,
        endDate: '',
        sessions: [],
      })),
    },
    klass: {
      id: klassId,
      programId,
      label: d.klass.label,
      studentCount: d.klass.student_count,
      endDate: '',
      sessions: d.klass.sessions.map((s) => toSession(programId, klassId, s)),
    },
    stats: {
      studentCount: d.stats.student_count,
      sessionsDone: d.stats.sessions_done,
      sessionsTotal: d.stats.sessions_total,
      avgFeedback: d.stats.avg_feedback,
    },
  }
}

export function useProgramKlassDetail(programId?: string, klassId?: string) {
  return useQuery({
    queryKey: ['programs', programId, 'klasses', klassId],
    enabled: Boolean(programId && klassId),
    // BE key theo courseRunId = klassId; programId không nằm trong path.
    queryFn: async () => {
      const d = await api.get<KlassDetailDto>(`/instructor/klasses/${klassId}/detail`)
      return toDetail(d)
    },
  })
}
