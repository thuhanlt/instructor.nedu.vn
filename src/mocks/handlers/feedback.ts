import { http, HttpResponse, delay } from 'msw'
import { env } from '@shared/config/env'
import { FEEDBACK, KLASSES } from '@mocks/data'

const apiBase = `${env.apiUrl.replace(/\/$/, '')}/api`

export const feedbackHandlers = [
  http.get(`${apiBase}/instructor/feedback`, async ({ request }) => {
    const url = new URL(request.url)
    const program = url.searchParams.get('program') ?? 'all'
    const klass = url.searchParams.get('klass') ?? 'all'

    let items = FEEDBACK.slice()
    if (program !== 'all') items = items.filter((f) => f.programId === program)
    if (klass !== 'all') items = items.filter((f) => f.klassId === klass)
    items.sort((a, b) => b.createdAt.localeCompare(a.createdAt))

    const sessionIds = new Set(items.map((f) => f.sessionId))
    const studentTotal = (() => {
      const klasses = klass === 'all' ? KLASSES : KLASSES.filter((k) => k.id === klass)
      return klasses.reduce((sum, k) => sum + k.studentCount, 0)
    })()
    const avgScore =
      items.length === 0
        ? 0
        : Math.round((items.reduce((s, f) => s + f.stars, 0) / items.length) * 10) / 10

    await delay(160)
    return HttpResponse.json({
      data: {
        stats: {
          sessions: sessionIds.size,
          students: studentTotal,
          avgScore,
          scoreSub:
            avgScore >= 4.5
              ? 'Học viên đánh giá rất tích cực'
              : avgScore >= 3.5
              ? 'Học viên đánh giá tốt'
              : avgScore === 0
              ? 'Chưa có phản hồi'
              : 'Cần cải thiện ở vài điểm',
        },
        items,
      },
    })
  }),
]
