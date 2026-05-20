import { http, HttpResponse, delay } from 'msw'
import { env } from '@shared/config/env'
import { QUESTIONS, PROGRAMS, KLASSES, TODAY } from '@mocks/data'
import type { Question } from '@shared/types/domain'

const apiBase = `${env.apiUrl.replace(/\/$/, '')}/api`

function toDateStr(d: Date): string {
  const pad = (n: number) => (n < 10 ? `0${n}` : String(n))
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

function nextSessionTitle(klassId: string): string | null {
  const klass = KLASSES.find((k) => k.id === klassId)
  if (!klass) return null
  const todayStr = toDateStr(TODAY)
  const next = klass.sessions.find((s) => s.date >= todayStr)
  return next?.title ?? null
}

function nextSessionId(klassId: string): string | null {
  const klass = KLASSES.find((k) => k.id === klassId)
  if (!klass) return null
  const todayStr = toDateStr(TODAY)
  const next = klass.sessions.find((s) => s.date >= todayStr)
  return next?.id ?? null
}

function daysToNextSession(klassId: string): number {
  const klass = KLASSES.find((k) => k.id === klassId)
  if (!klass) return 999
  const todayStr = toDateStr(TODAY)
  const next = klass.sessions.find((s) => s.date >= todayStr)
  if (!next) return 999
  const d = new Date(next.date)
  return Math.round((d.getTime() - TODAY.getTime()) / (1000 * 60 * 60 * 24))
}

function enrich(q: Question) {
  const program = PROGRAMS.find((p) => p.id === q.programId)
  const klass = KLASSES.find((k) => k.id === q.klassId)
  const session = klass?.sessions.find((s) => s.id === q.sessionId)
  return {
    ...q,
    programName: program?.name ?? '',
    klassLabel: klass?.label ?? '',
    sessionTitle: session?.title ?? '',
    nextSessionTitle: nextSessionTitle(q.klassId),
    daysToNextSession: daysToNextSession(q.klassId),
  }
}

function buildAISuggest(q: Question): string {
  const text = q.text.toLowerCase()
  if (/(stuck|rối|không hiểu|kẹt|lo lắng|chới với)/.test(text)) {
    return 'Cảm ơn bạn đã chia sẻ. Cảm giác stuck sau một buổi học sâu là bình thường — não bộ đang xử lý ý mới và sắp xếp lại những niềm tin cũ. Bạn thử làm một việc rất nhỏ ngày mai: viết 3 dòng về cảm giác đó vào sổ tay buổi sáng, không phán xét. Sau 3 ngày đọc lại, bạn sẽ thấy bản thân đã di chuyển hơn mình tưởng. Buổi sau mình sẽ dành 5 phút đầu để cùng bạn xem chỗ này nhé.'
  }
  if (/(áp dụng|thực hành|làm sao|cách|practice)/.test(text)) {
    return 'Câu hỏi này hay — vì lý thuyết chỉ có giá trị khi đi vào việc thật. Bạn thử chọn 1 tình huống cụ thể trong tuần này (vd: một cuộc trò chuyện với đồng nghiệp, một quyết định mua sắm) rồi áp dụng đúng 1 nguyên tắc mình vừa học — không cần ôm hết. Sau đó ghi lại bạn thấy gì khác. Nhỏ thôi nhưng cần đều. Lần sau gặp nhau bạn kể mình nghe nha.'
  }
  if (/(ý nghĩa|là gì|định nghĩa|nghĩa|hiểu thế nào)/.test(text)) {
    return 'Câu hỏi đúng chỗ. Khái niệm này trong khung mình đang học là hành trình bạn tự thiết kế cuộc đời theo giá trị cốt lõi của riêng mình — không phải bản sao của ai. Có nhiều người định nghĩa khác, nhưng ở đây mình nhấn mạnh tính chủ động và sự nhất quán giữa hành động hằng ngày với điều bạn coi là quan trọng. Buổi sau mình sẽ làm bài tập map giá trị, bạn để ý nhé.'
  }
  return 'Cảm ơn bạn đã đặt câu hỏi. Đây là một góc nhìn tốt để cả lớp cùng suy ngẫm. Buổi sau mình sẽ dành thời gian đầu giờ để trả lời chi tiết hơn, vì câu này đáng để đi sâu chứ không chỉ trả lời nhanh trong vài dòng. Bạn có thể ghi thêm điều mình thắc mắc cụ thể không — để mình chuẩn bị ví dụ phù hợp với hoàn cảnh của bạn.'
}

export const qaHandlers = [
  http.get(`${apiBase}/instructor/questions`, async ({ request }) => {
    const url = new URL(request.url)
    const program = url.searchParams.get('program') ?? 'all'
    const klass = url.searchParams.get('klass') ?? 'all'
    const state = url.searchParams.get('state') ?? 'all'
    let out = QUESTIONS.slice()
    if (program !== 'all') out = out.filter((q) => q.programId === program)
    if (klass !== 'all') out = out.filter((q) => q.klassId === klass)
    if (state !== 'all') out = out.filter((q) => q.state === state)
    out.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    await delay(160)
    return HttpResponse.json({ data: out.map(enrich) })
  }),

  http.post(`${apiBase}/instructor/questions/:id/reply`, async ({ params, request }) => {
    const { id } = params as { id: string }
    const body = (await request.json()) as { reply: string }
    const q = QUESTIONS.find((q) => q.id === id)
    if (!q) {
      return HttpResponse.json(
        { statusCode: 404, message: 'Not Found', error: 'Not Found' },
        { status: 404 }
      )
    }
    q.reply = body.reply
    q.state = 'answered'
    q.pinnedForSessionId = undefined
    await delay(220)
    return HttpResponse.json({ data: enrich(q) })
  }),

  http.post(`${apiBase}/instructor/questions/:id/pin`, async ({ params }) => {
    const { id } = params as { id: string }
    const q = QUESTIONS.find((q) => q.id === id)
    if (!q) {
      return HttpResponse.json(
        { statusCode: 404, message: 'Not Found', error: 'Not Found' },
        { status: 404 }
      )
    }
    const nextId = nextSessionId(q.klassId)
    q.state = 'pinned'
    q.pinnedForSessionId = nextId ?? undefined
    await delay(180)
    return HttpResponse.json({ data: enrich(q) })
  }),

  http.post(`${apiBase}/instructor/questions/:id/pass-to-ops`, async ({ params }) => {
    const { id } = params as { id: string }
    const q = QUESTIONS.find((q) => q.id === id)
    if (!q) {
      return HttpResponse.json(
        { statusCode: 404, message: 'Not Found', error: 'Not Found' },
        { status: 404 }
      )
    }
    q.state = 'passed_to_ops'
    q.pinnedForSessionId = undefined
    await delay(180)
    return HttpResponse.json({ data: enrich(q) })
  }),

  http.post(
    `${apiBase}/instructor/questions/:id/suggest-reply`,
    async ({ params }) => {
      const { id } = params as { id: string }
      const q = QUESTIONS.find((q) => q.id === id)
      if (!q) {
        return HttpResponse.json(
          { statusCode: 404, message: 'Not Found', error: 'Not Found' },
          { status: 404 }
        )
      }
      await delay(900) // simulate AI latency
      return HttpResponse.json({ data: { reply: buildAISuggest(q) } })
    }
  ),
]
