import { useQuery } from '@tanstack/react-query'
import { api } from '@shared/config/api-client'
import type { Material, MaterialFormat } from '@shared/types/domain'

// Shape thật từ BE GET /instructor/materials?sessionId=
interface MaterialDto {
  material_id: string
  type: string // 'video' | 'document' | 'exercise' | 'link' (content kind, KHÔNG phải định dạng file)
  title: string
  url: string
  file_size_bytes: number | null
  display_order: number
  feedback_to_vanhanh: string | null
  feedback_sent_at: string | null
}

// BE type là loại nội dung, không phải định dạng file → map gần đúng cho icon.
function toFormat(type: string): MaterialFormat {
  switch (type) {
    case 'document':
      return 'PDF'
    case 'exercise':
      return 'DOCX'
    case 'video':
    case 'link':
    default:
      return 'OTHER'
  }
}

function toMaterial(m: MaterialDto): Material {
  return {
    id: m.material_id,
    name: m.title,
    format: toFormat(m.type),
    sizeKb: m.file_size_bytes ? Math.round(m.file_size_bytes / 1024) : 0,
    url: m.url,
  }
}

export function useSessionMaterials(sessionId: string | undefined, enabled = true) {
  return useQuery({
    queryKey: ['sessions', sessionId, 'materials'],
    enabled: Boolean(sessionId) && enabled,
    queryFn: async () => {
      const rows = await api.get<MaterialDto[]>('/instructor/materials', {
        sessionId: sessionId as string,
      })
      return rows.map(toMaterial)
    },
    staleTime: 30 * 1000,
  })
}
