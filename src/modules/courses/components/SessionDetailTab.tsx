import { Button } from '@shared/components/Button'
import { Icon } from '@shared/components/Icon'
import { Tag } from '@shared/components/Tag'
import type { Session } from '@shared/types/domain'

interface Props {
  session: Session
}

export function SessionDetailTab({ session }: Props) {
  return (
    <div
      style={{
        background: 'var(--navy)',
        color: '#fff',
        borderRadius: 'var(--r)',
        padding: 18,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 0.6,
            textTransform: 'uppercase',
            color: 'var(--accent)',
          }}
        >
          Phòng Zoom
        </span>
        <Tag variant="info">Chỉ xem</Tag>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '120px 1fr',
          rowGap: 8,
          columnGap: 14,
          fontSize: 13,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        <div style={{ color: 'rgba(255,255,255,.65)' }}>Mã phòng</div>
        <div>{session.zoom.roomId}</div>
        <div style={{ color: 'rgba(255,255,255,.65)' }}>Mật khẩu</div>
        <div>{session.zoom.password}</div>
        <div style={{ color: 'rgba(255,255,255,.65)' }}>Thời lượng</div>
        <div>
          {session.startTime}–{session.endTime} ({session.type === 'online' ? 'Online' : 'Offline'})
        </div>
      </div>

      <div>
        <Button
          variant="p2"
          icon={<Icon name="zoom" size={16} />}
          onClick={() => window.open(session.zoom.url, '_blank')}
        >
          Vào phòng Zoom ngay
        </Button>
      </div>

      <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,.6)' }}>
        Phòng Zoom do vận hành tạo. Không thể chỉnh sửa từ portal này.
      </div>
    </div>
  )
}
