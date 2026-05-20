import { Button } from '@shared/components/Button'
import { Icon, type IconName } from '@shared/components/Icon'
import { EmptyState } from '@shared/components/EmptyState'
import { usePrefsStore } from '@shared/stores/usePrefsStore'
import { notify } from '@shared/utils/notify'
import { analytics, ANALYTICS_EVENTS } from '@shared/analytics'
import { MaterialRequestForm } from './MaterialRequestForm'
import type { Material, Session } from '@shared/types/domain'

interface Props {
  session: Session
}

const FORMAT_ICON: Record<Material['format'], IconName> = {
  DOCX: 'doc',
  PDF: 'pdf',
  PPTX: 'doc',
  XLSX: 'doc',
  IMG: 'img',
  OTHER: 'doc',
}

function fmtKb(kb: number): string {
  if (kb < 1024) return `${kb} KB`
  return `${(kb / 1024).toFixed(1)} MB`
}

export function SessionMaterialsTab({ session }: Props) {
  const downloaded = usePrefsStore((s) => s.downloadedMaterials)
  const markDownloaded = usePrefsStore((s) => s.markMaterialDownloaded)

  function handleDownload(m: Material) {
    markDownloaded(m.id)
    analytics.track(ANALYTICS_EVENTS.MATERIAL_DOWNLOADED, {
      sessionId: session.id,
      materialId: m.id,
    })
    notify(`Đã tải "${m.name}"`, 'success')
    // In production this would be a presigned URL. For mock, just simulate.
    try {
      window.open(m.url, '_blank')
    } catch {
      // swallow
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>
        Tài liệu chuẩn bị bởi vận hành. Tải xuống trước buổi học.
      </div>

      {session.materials.length === 0 ? (
        <EmptyState
          icon={<Icon name="doc" size={28} className="faint" />}
          title="Chưa có tài liệu"
          description="Vận hành sẽ cập nhật tài liệu sớm."
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {session.materials.map((m) => {
            const isDownloaded = downloaded.includes(m.id)
            return (
              <div key={m.id} className="mat">
                <div className="icon-wrap">
                  <Icon name={FORMAT_ICON[m.format]} size={18} />
                </div>
                <div className="body">
                  <div className="name">{m.name}</div>
                  <div className="meta">
                    {m.format} · {fmtKb(m.sizeKb)}
                    {isDownloaded ? (
                      <span style={{ color: 'var(--green)', marginLeft: 6 }}>
                        · ✓ Đã tải
                      </span>
                    ) : null}
                  </div>
                </div>
                <Button
                  variant={isDownloaded ? 'o' : 'p'}
                  size="sm"
                  icon={<Icon name="download" size={14} />}
                  onClick={() => handleDownload(m)}
                >
                  {isDownloaded ? 'Tải lại' : 'Tải xuống'}
                </Button>
              </div>
            )
          })}
        </div>
      )}

      <div style={{ marginTop: 6 }}>
        <MaterialRequestForm sessionId={session.id} />
      </div>
    </div>
  )
}
