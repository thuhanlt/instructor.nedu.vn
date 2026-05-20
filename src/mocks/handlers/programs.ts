import { http, HttpResponse, delay } from 'msw'
import { env } from '@shared/config/env'
import {
  KLASSES,
  PROGRAMS,
  FEEDBACK,
  TODAY,
  getProgramById,
  getKlassById,
} from '@mocks/data'

const apiBase = `${env.apiUrl.replace(/\/$/, '')}/api`

function toDateStr(d: Date): string {
  const pad = (n: number) => (n < 10 ? `0${n}` : String(n))
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export const programHandlers = [
  http.get(`${apiBase}/instructor/programs`, async () => {
    await delay(150)
    return HttpResponse.json({ data: PROGRAMS })
  }),

  http.get(
    `${apiBase}/instructor/programs/:programId/klasses/:klassId`,
    async ({ params }) => {
      const { programId, klassId } = params as { programId: string; klassId: string }
      const program = getProgramById(programId)
      const klass = getKlassById(klassId)
      if (!program || !klass || klass.programId !== programId) {
        return HttpResponse.json(
          { statusCode: 404, message: 'Not Found', error: 'Not Found' },
          { status: 404 }
        )
      }
      const todayStr = toDateStr(TODAY)
      const sessionsDone = klass.sessions.filter((s) => s.date < todayStr).length
      const sessionsTotal = klass.sessions.length
      const feedbackForKlass = FEEDBACK.filter((f) => f.klassId === klassId)
      const avgFeedback =
        feedbackForKlass.length === 0
          ? 0
          : Math.round(
              (feedbackForKlass.reduce((s, f) => s + f.stars, 0) / feedbackForKlass.length) *
                10
            ) / 10
      await delay(160)
      return HttpResponse.json({
        data: {
          program,
          klass,
          stats: {
            studentCount: klass.studentCount,
            sessionsDone,
            sessionsTotal,
            avgFeedback,
          },
        },
      })
    }
  ),

  http.get(
    `${apiBase}/instructor/sessions/:sessionId/feedback`,
    async ({ params }) => {
      const { sessionId } = params as { sessionId: string }
      const items = FEEDBACK.filter((f) => f.sessionId === sessionId)
      const avgScore =
        items.length === 0
          ? 0
          : Math.round((items.reduce((s, f) => s + f.stars, 0) / items.length) * 10) / 10
      await delay(160)
      return HttpResponse.json({
        data: { avgScore, count: items.length, items },
      })
    }
  ),

  http.post(
    `${apiBase}/instructor/sessions/:sessionId/material-requests`,
    async () => {
      // We don't inspect FormData fields in mock — just accept and respond.
      await delay(380)
      return HttpResponse.json({
        data: { id: `mr-${Date.now()}`, status: 'received' },
      })
    }
  ),
]

export { KLASSES }
