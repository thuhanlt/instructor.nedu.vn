import { http, HttpResponse, delay } from 'msw'
import { env } from '@shared/config/env'
import { KLASSES, PROGRAMS, ANALYTICS } from '@mocks/data'

const apiBase = `${env.apiUrl.replace(/\/$/, '')}/api`

export const studentHandlers = [
  http.get(`${apiBase}/instructor/klasses`, async () => {
    const progByKlass = new Map(PROGRAMS.flatMap((p) => p.klasses.map((k) => [k.id, p])))
    const data = KLASSES.map((k) => {
      const p = progByKlass.get(k.id)!
      const firstType = k.sessions[0]?.type ?? 'online'
      return {
        programId: p.id,
        programName: p.name,
        klassId: k.id,
        klassLabel: k.label,
        type: firstType,
        studentCount: k.studentCount,
        color: p.color,
      }
    })
    await delay(120)
    return HttpResponse.json({ data })
  }),

  http.get(`${apiBase}/instructor/klasses/:klassId/analytics`, async ({ params }) => {
    const { klassId } = params as { klassId: string }
    const data = ANALYTICS[klassId]
    if (!data) {
      return HttpResponse.json(
        { statusCode: 404, message: 'Not Found', error: 'Not Found' },
        { status: 404 }
      )
    }
    await delay(220)
    return HttpResponse.json({ data })
  }),
]
