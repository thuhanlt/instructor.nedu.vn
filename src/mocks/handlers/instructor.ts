import { http, HttpResponse, delay } from 'msw'
import { env } from '@shared/config/env'
import { MOCK_INSTRUCTOR, MOCK_INSTRUCTOR_PROFILE_DTO } from '@mocks/data/instructor'
import {
  KLASSES,
  PROGRAMS,
  QUESTIONS,
  FEEDBACK,
  TODAY,
} from '@mocks/data'
import type {
  DashboardData,
  DashboardActiveProgram,
  DashboardSession,
  DashboardTodo,
  DashboardUpcomingSession,
} from '@shared/types/domain'

const apiBase = `${env.apiUrl.replace(/\/$/, '')}/api`

function toDateStr(d: Date): string {
  const pad = (n: number) => (n < 10 ? `0${n}` : String(n))
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

function compareSessionTime(a: { date: string; startTime: string }, b: { date: string; startTime: string }) {
  return `${a.date}T${a.startTime}`.localeCompare(`${b.date}T${b.startTime}`)
}

function buildDashboard(): DashboardData {
  const todayStr = toDateStr(TODAY)
  const programByKlass = new Map(PROGRAMS.flatMap((p) => p.klasses.map((k) => [k.id, p])))

  // Today session
  let todaySession: DashboardSession | null = null
  for (const k of KLASSES) {
    const s = k.sessions.find((ss) => ss.date === todayStr)
    if (s) {
      const p = programByKlass.get(k.id)!
      const pinned = QUESTIONS.find(
        (q) => q.state === 'pinned' && q.pinnedForSessionId === s.id
      )
      todaySession = {
        ...s,
        programName: p.name,
        klassLabel: k.label,
        studentCount: k.studentCount,
        pinnedQuestion: pinned
          ? { text: pinned.text, studentName: pinned.studentName }
          : undefined,
      }
      break
    }
  }

  // Active programs: those that have sessions in past (done > 0) or upcoming starting <30 days
  const activePrograms: DashboardActiveProgram[] = []
  for (const k of KLASSES) {
    const p = programByKlass.get(k.id)!
    const total = k.sessions.length
    if (total === 0) continue
    const done = k.sessions.filter((s) => s.date < todayStr).length
    const upcoming = done === 0
    const firstType = k.sessions[0]?.type ?? 'online'
    activePrograms.push({
      programId: p.id,
      programName: p.name,
      color: p.color,
      klassId: k.id,
      klassLabel: k.label,
      type: firstType,
      upcoming,
      sessionsDone: done,
      sessionsTotal: total,
    })
  }

  // Upcoming sessions (next 3 future)
  const upcomingSessions: DashboardUpcomingSession[] = []
  for (const k of KLASSES) {
    const p = programByKlass.get(k.id)!
    for (const s of k.sessions) {
      if (s.date > todayStr) {
        upcomingSessions.push({
          ...s,
          programName: p.name,
          klassLabel: k.label,
        })
      }
    }
  }
  upcomingSessions.sort(compareSessionTime)
  const nextThree = upcomingSessions.slice(0, 3)

  // Todo list
  const todoList: DashboardTodo[] = []
  const pendingCount = QUESTIONS.filter((q) => q.state === 'pending').length
  if (pendingCount > 0) {
    todoList.push({
      type: 'pending_qa',
      title: 'Trả lời câu hỏi học viên',
      subtitle: `${pendingCount} câu hỏi đang chờ phản hồi`,
      badge: { text: String(pendingCount), color: 'red' },
    })
  }
  if (todaySession && todaySession.materials.length > 0) {
    todoList.push({
      type: 'materials_to_download',
      title: 'Tải tài liệu buổi học hôm nay',
      subtitle: `${todaySession.materials.length} tài liệu cho ${todaySession.title}`,
      badge: { text: 'Chưa tải', color: 'amber' },
      targetSessionId: todaySession.id,
    })
  }
  const pinnedCount = QUESTIONS.filter((q) => q.state === 'pinned').length
  if (pinnedCount > 0) {
    todoList.push({
      type: 'pinned_qa',
      title: 'Câu hỏi ghim đầu giờ',
      subtitle: 'Trả lời trực tiếp đầu buổi tiếp theo',
      badge: { text: `${pinnedCount} câu`, color: 'amber' },
    })
  }
  if (todaySession) {
    todoList.push({
      type: 'report_incident',
      title: 'Có việc đột xuất?',
      subtitle: 'Báo cho vận hành để sắp lịch lại',
      targetSessionId: todaySession.id,
    })
  }

  // Stats
  const activeProgramCount = new Set(activePrograms.map((a) => a.programId)).size
  const avgScore =
    FEEDBACK.length === 0
      ? 0
      : Math.round((FEEDBACK.reduce((s, f) => s + f.stars, 0) / FEEDBACK.length) * 10) /
        10

  return {
    greeting: { name: MOCK_INSTRUCTOR.name, date: todayStr },
    stats: {
      activeProgramCount,
      pendingQuestionCount: pendingCount,
      avgFeedbackScore: avgScore,
    },
    todaySession,
    todoList,
    activePrograms,
    upcomingSessions: nextThree,
  }
}

export const instructorHandlers = [
  http.get(`${apiBase}/instructor/profile`, async () => {
    await delay(150)
    return HttpResponse.json({ data: MOCK_INSTRUCTOR_PROFILE_DTO })
  }),

  // PATCH chỉ accept 3 field instructor edit được (phone / bio / expertise_tags).
  // BE strip field khác qua DTO whitelist; mock đây làm tương tự — chỉ update 3 key
  // đã khai báo, các field vanhanh-managed (name/email/role/joined/experience) ignore.
  http.patch(`${apiBase}/instructor/profile`, async ({ request }) => {
    const body = (await request.json()) as Partial<{
      phone: string | null
      bio: string | null
      expertise_tags: string[]
    }>
    if (body.phone !== undefined) MOCK_INSTRUCTOR_PROFILE_DTO.phone = body.phone
    if (body.bio !== undefined) MOCK_INSTRUCTOR_PROFILE_DTO.bio = body.bio
    if (body.expertise_tags !== undefined) MOCK_INSTRUCTOR_PROFILE_DTO.expertise_tags = body.expertise_tags
    MOCK_INSTRUCTOR_PROFILE_DTO.updated_at = new Date().toISOString()
    await delay(220)
    return HttpResponse.json({ data: MOCK_INSTRUCTOR_PROFILE_DTO })
  }),

  http.get(`${apiBase}/instructor/dashboard`, async () => {
    await delay(250)
    return HttpResponse.json({ data: buildDashboard() })
  }),
]
