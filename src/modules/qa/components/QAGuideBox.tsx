import { Icon } from '@shared/components/Icon'
import { Button } from '@shared/components/Button'
import { usePrefsStore } from '@shared/stores/usePrefsStore'

export function QAGuideBox() {
  const hidden = usePrefsStore((s) => s.qaGuideHidden)
  const setHidden = usePrefsStore((s) => s.setQaGuideHidden)

  if (hidden) {
    return (
      <button
        type="button"
        onClick={() => setHidden(false)}
        style={{
          alignSelf: 'flex-start',
          background: 'var(--tint)',
          color: 'var(--blue)',
          border: '1px solid var(--tint-border)',
          padding: '6px 14px',
          borderRadius: 999,
          fontSize: 12.5,
          fontWeight: 600,
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
        }}
      >
        <Icon name="info" size={14} />
        Xem lại hướng dẫn
      </button>
    )
  }

  return (
    <div
      style={{
        background: 'var(--tint)',
        border: '1px solid var(--tint-border)',
        borderRadius: 'var(--r)',
        padding: 16,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 10,
          fontWeight: 700,
          color: 'var(--blue)',
        }}
      >
        <Icon name="info" size={16} />
        Hướng dẫn xử lý câu hỏi
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Row icon="msg" color="var(--blue)" title="Trả lời trực tiếp">
          Câu trả lời hiển thị ngay cho học viên trên learn.ni.sg
        </Row>
        <Row icon="pin" color="var(--amber)" title="Ghim đầu giờ buổi sau">
          Trả lời trực tiếp trong buổi học tiếp theo. Nếu bỏ qua sau buổi học, tự động chuyển về bộ phận hỗ trợ
        </Row>
        <Row icon="support" color="var(--orange)" title="Chuyển cho bộ phận hỗ trợ">
          Câu hỏi phù hợp để bộ phận hỗ trợ xử lý thay bạn
        </Row>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
        <Button variant="ghost" size="sm" onClick={() => setHidden(true)}>
          Đã hiểu, ẩn hướng dẫn
        </Button>
      </div>
    </div>
  )
}

function Row({
  icon,
  color,
  title,
  children,
}: {
  icon: 'msg' | 'pin' | 'support'
  color: string
  title: string
  children: React.ReactNode
}) {
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
      <span
        style={{
          width: 26,
          height: 26,
          borderRadius: 7,
          background: '#fff',
          color,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Icon name={icon} size={14} />
      </span>
      <div style={{ fontSize: 12.5, lineHeight: 1.55 }}>
        <strong>{title}</strong> — <span style={{ color: 'var(--ink2)' }}>{children}</span>
      </div>
    </div>
  )
}
