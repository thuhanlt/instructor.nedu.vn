import { http, HttpResponse, delay } from 'msw'
import { env } from '@shared/config/env'
import type { IncidentReport } from '@shared/types/domain'

const apiBase = `${env.apiUrl.replace(/\/$/, '')}/api`

const STORE: IncidentReport[] = []
let seq = 1

export const incidentHandlers = [
  http.post(`${apiBase}/instructor/incidents`, async ({ request }) => {
    const body = (await request.json()) as IncidentReport
    const saved: IncidentReport = {
      ...body,
      id: `inc-${seq++}`,
      createdAt: new Date().toISOString(),
    }
    STORE.push(saved)
    await delay(280)
    return HttpResponse.json({ data: { id: saved.id, status: 'received' } })
  }),
]
