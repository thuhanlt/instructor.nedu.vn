import { http, HttpResponse, delay } from 'msw'
import { env } from '@shared/config/env'
import { KLASSES, PROGRAMS } from '@mocks/data'
import type { Session } from '@shared/types/domain'

const apiBase = `${env.apiUrl.replace(/\/$/, '')}/api`

interface RangeSession extends Session {
  programName: string
  klassLabel: string
}

function flattenInRange(from?: string, to?: string): RangeSession[] {
  const out: RangeSession[] = []
  const progByKlass = new Map(PROGRAMS.flatMap((p) => p.klasses.map((k) => [k.id, p])))
  for (const k of KLASSES) {
    const p = progByKlass.get(k.id)
    if (!p) continue
    for (const s of k.sessions) {
      if (from && s.date < from) continue
      if (to && s.date > to) continue
      out.push({ ...s, programName: p.name, klassLabel: k.label })
    }
  }
  out.sort((a, b) => `${a.date}T${a.startTime}`.localeCompare(`${b.date}T${b.startTime}`))
  return out
}

export const sessionHandlers = [
  http.get(`${apiBase}/instructor/sessions`, async ({ request }) => {
    const url = new URL(request.url)
    const from = url.searchParams.get('from') ?? undefined
    const to = url.searchParams.get('to') ?? undefined
    await delay(180)
    return HttpResponse.json({ data: flattenInRange(from, to) })
  }),
]
