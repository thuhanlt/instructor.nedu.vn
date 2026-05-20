import { useQuery } from '@tanstack/react-query'
import { api } from '@shared/config/api-client'
import type { Program, QuestionState } from '@shared/types/domain'

interface Props {
  filter: {
    program: string
    klass: string
    state: 'all' | QuestionState
  }
  onChange: (next: Props['filter']) => void
}

const STATE_OPTIONS: { value: 'all' | QuestionState; label: string }[] = [
  { value: 'all', label: 'Tất cả' },
  { value: 'pending', label: 'Chờ xử lý' },
  { value: 'pinned', label: 'Đã ghim' },
  { value: 'answered', label: 'Đã gửi' },
  { value: 'passed_to_ops', label: 'Đã chuyển bộ phận hỗ trợ' },
]

export function QAFilterRow({ filter, onChange }: Props) {
  const { data: programs = [] } = useQuery({
    queryKey: ['programs', 'list'],
    queryFn: () => api.get<Program[]>('/instructor/programs'),
    staleTime: 5 * 60 * 1000,
  })

  const klassesForFilter =
    filter.program === 'all'
      ? programs.flatMap((p) => p.klasses)
      : programs.find((p) => p.id === filter.program)?.klasses ?? []

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: 10,
      }}
    >
      <div className="fg">
        <label className="fl">Chương trình</label>
        <select
          className="fs"
          value={filter.program}
          onChange={(e) =>
            onChange({ ...filter, program: e.target.value, klass: 'all' })
          }
        >
          <option value="all">Tất cả</option>
          {programs.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>
      <div className="fg">
        <label className="fl">Khoá</label>
        <select
          className="fs"
          value={filter.klass}
          onChange={(e) => onChange({ ...filter, klass: e.target.value })}
        >
          <option value="all">Tất cả</option>
          {klassesForFilter.map((k) => (
            <option key={k.id} value={k.id}>
              {k.label}
            </option>
          ))}
        </select>
      </div>
      <div className="fg">
        <label className="fl">Trạng thái</label>
        <select
          className="fs"
          value={filter.state}
          onChange={(e) =>
            onChange({ ...filter, state: e.target.value as 'all' | QuestionState })
          }
        >
          {STATE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
