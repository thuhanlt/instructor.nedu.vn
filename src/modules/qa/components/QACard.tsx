import { useState, useEffect } from 'react'
import { Button } from '@shared/components/Button'
import { Tag } from '@shared/components/Tag'
import { Icon } from '@shared/components/Icon'
import { notify } from '@shared/utils/notify'
import { analytics, ANALYTICS_EVENTS } from '@shared/analytics'
import { cn } from '@shared/utils/cn'
import {
  useReplyQuestion,
  usePinQuestion,
  usePassToOps,
  type EnrichedQuestion,
} from '../hooks/useQA'

interface Props {
  question: EnrichedQuestion
}

function timeAgo(iso: string): string {
  const then = new Date(iso).getTime()
  const now = Date.now()
  const diffMin = Math.round((now - then) / 60000)
  if (diffMin < 1) return 'vừa xong'
  if (diffMin < 60) return `${diffMin} phút trước`
  const h = Math.round(diffMin / 60)
  if (h < 24) return `${h} giờ trước`
  const d = Math.round(h / 24)
  return `${d} ngày trước`
}

export function QACard({ question }: Props) {
  const [replyOpen, setReplyOpen] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [replyErr, setReplyErr] = useState(false)

  const reply = useReplyQuestion()
  const pin = usePinQuestion()
  const pass = usePassToOps()

  useEffect(() => {
    if (!replyOpen) {
      setReplyText('')
      setReplyErr(false)
    }
  }, [replyOpen])

  const isPending = question.state === 'pending'
  const isPinned = question.state === 'pinned'
  const isAnswered = question.state === 'answered'
  const isOps = question.state === 'passed_to_ops'

  const deadlineHint =
    (isPending || isPinned) && question.nextSessionTitle
      ? question.daysToNextSession <= 2
        ? {
            text: `Cần xử lý trước đầu giờ ${question.nextSessionTitle}`,
            warn: true,
          }
        : {
            text: `Còn ${question.daysToNextSession} ngày trước buổi tiếp theo`,
            warn: false,
          }
      : null

  async function handleReply() {
    if (!replyText.trim()) {
      setReplyErr(true)
      return
    }
    try {
      await reply.mutateAsync({ id: question.id, reply: replyText.trim() })
      analytics.track(ANALYTICS_EVENTS.QA_REPLIED, { id: question.id })
      notify('Đã gửi cho học viên!', 'success')
      setReplyOpen(false)
    } catch {
      notify('Gửi không thành công', 'error')
    }
  }

  async function handlePin() {
    try {
      await pin.mutateAsync({ id: question.id })
      analytics.track(ANALYTICS_EVENTS.QA_PINNED, { id: question.id })
      notify(`Đã ghim cho buổi tiếp theo`, 'success')
    } catch {
      notify('Thao tác không thành công', 'error')
    }
  }

  async function handlePass() {
    try {
      await pass.mutateAsync({ id: question.id })
      analytics.track(ANALYTICS_EVENTS.QA_PASSED_TO_OPS, { id: question.id })
      notify('Đã chuyển cho bộ phận hỗ trợ', 'success')
    } catch {
      notify('Thao tác không thành công', 'error')
    }
  }

  return (
    <div
      className={cn(
        'qa-card',
        isPinned && 'pinned',
        isAnswered && 'answered',
        isOps && 'ops'
      )}
    >
      <div className="q">"{question.text}"</div>

      <div
        style={{
          display: 'flex',
          gap: 6,
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        <Tag variant="closed">
          {question.programName} {question.klassLabel} · {question.sessionTitle}
        </Tag>
        {isPending ? <Tag variant="pending">Chờ xử lý</Tag> : null}
        {isPinned ? <Tag variant="pinned">Ghim đầu giờ</Tag> : null}
        {isAnswered ? <Tag variant="answered">Đã trả lời</Tag> : null}
        {isOps ? <Tag variant="ops">Bộ phận hỗ trợ</Tag> : null}
        <span style={{ flex: 1 }} />
        <span style={{ fontSize: 11.5, color: 'var(--faint)' }}>
          {question.studentName} · {timeAgo(question.createdAt)}
        </span>
      </div>

      {deadlineHint ? (
        <div
          style={{
            background: deadlineHint.warn ? 'var(--amber-bg)' : 'var(--green-bg)',
            color: deadlineHint.warn ? 'var(--amber)' : 'var(--green)',
            border: `1px solid ${
              deadlineHint.warn ? 'var(--amber-l)' : 'var(--green-l)'
            }`,
            padding: '6px 12px',
            borderRadius: 'var(--rs)',
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          {deadlineHint.text}
        </div>
      ) : null}

      {isAnswered && question.reply ? (
        <div
          style={{
            background: 'var(--green-bg)',
            border: '1px solid var(--green-l)',
            borderRadius: 'var(--rs)',
            padding: 12,
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: 'var(--green)',
              letterSpacing: 0.4,
              textTransform: 'uppercase',
              marginBottom: 4,
            }}
          >
            ✓ Đã hiển thị trên learn.ni.sg
          </div>
          <div style={{ fontSize: 13, lineHeight: 1.55 }}>{question.reply}</div>
        </div>
      ) : null}

      {isPinned ? (
        <div
          style={{
            background: 'rgba(255,255,255,.6)',
            border: '1px solid var(--amber-l)',
            borderRadius: 'var(--rs)',
            padding: 12,
            fontSize: 12.5,
            color: 'var(--ink2)',
          }}
        >
          Đang ghim đầu giờ <strong>{question.nextSessionTitle ?? 'buổi tiếp theo'}</strong>.
          Sẽ tự chuyển bộ phận hỗ trợ nếu không xử lý sau buổi học.
          <div style={{ marginTop: 8 }}>
            <Button variant="ops" size="sm" onClick={handlePass}>
              Chuyển ngay cho bộ phận hỗ trợ
            </Button>
          </div>
        </div>
      ) : null}

      {isOps ? (
        <div
          style={{
            background: 'rgba(255,255,255,.5)',
            padding: 10,
            borderRadius: 'var(--rs)',
            fontSize: 12.5,
            color: 'var(--orange)',
            fontWeight: 600,
          }}
        >
          → Đã chuyển cho bộ phận hỗ trợ — họ sẽ trả lời học viên.
        </div>
      ) : null}

      {isPending ? (
        <>
          {!replyOpen ? (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <Button
                variant="p"
                size="sm"
                icon={<Icon name="send" size={14} />}
                onClick={() => setReplyOpen(true)}
              >
                Trả lời trực tiếp
              </Button>
              <Button
                variant="warn"
                size="sm"
                icon={<Icon name="pin" size={14} />}
                onClick={handlePin}
                disabled={pin.isPending}
              >
                Ghim đầu giờ {question.nextSessionTitle ?? 'buổi sau'}
              </Button>
              <Button
                variant="ops"
                size="sm"
                icon={<Icon name="support" size={14} />}
                onClick={handlePass}
                disabled={pass.isPending}
              >
                Chuyển cho bộ phận hỗ trợ
              </Button>
            </div>
          ) : (
            <div
              style={{
                background: 'var(--bg)',
                borderRadius: 'var(--rs)',
                padding: 12,
              }}
            >
              <label className="fl" style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 6 }}>
                <Icon name="send" size={12} />
                Câu trả lời gửi cho học viên
              </label>
              <textarea
                className={`fta ${replyErr ? 'err' : ''}`}
                value={replyText}
                onChange={(e) => {
                  setReplyText(e.target.value)
                  if (e.target.value.trim()) setReplyErr(false)
                }}
                placeholder="Viết câu trả lời rõ ràng, dễ hiểu cho học viên..."
              />
              {replyErr ? (
                <div style={{ fontSize: 11.5, color: 'var(--red)', marginTop: 4 }}>
                  Bạn chưa điền câu trả lời
                </div>
              ) : null}
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 10 }}>
                <Button
                  variant="o"
                  size="sm"
                  onClick={() => setReplyOpen(false)}
                  disabled={reply.isPending}
                >
                  Huỷ
                </Button>
                <Button
                  variant="p"
                  size="sm"
                  onClick={handleReply}
                  disabled={reply.isPending}
                >
                  {reply.isPending ? 'Đang gửi...' : 'Gửi câu trả lời'}
                </Button>
              </div>
            </div>
          )}
        </>
      ) : null}
    </div>
  )
}
