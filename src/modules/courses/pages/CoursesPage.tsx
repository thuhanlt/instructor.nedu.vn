import { useEffect, useMemo } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { api } from '@shared/config/api-client'
import { Card } from '@shared/components/Card'
import { EmptyState } from '@shared/components/EmptyState'
import { SpinnerOverlay } from '@shared/components/SpinnerOverlay'
import { Icon } from '@shared/components/Icon'
import { CourseHeader } from '../components/CourseHeader'
import { SessionAccordion } from '../components/SessionAccordion'
import { useProgramKlassDetail } from '../hooks/useProgramKlassDetail'
import type { Program } from '@shared/types/domain'

const MOCK_TODAY_STR = '2025-02-10'

export function CoursesPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const programId = params.get('program') ?? undefined
  const klassId = params.get('klass') ?? undefined
  const sessionId = params.get('session') ?? undefined

  const { data: programs = [], isLoading: progLoading } = useQuery({
    queryKey: ['programs', 'list'],
    queryFn: () => api.get<Program[]>('/instructor/programs'),
  })

  const detailQuery = useProgramKlassDetail(programId, klassId)

  // Auto-pick first program+klass if none in URL
  const autoTarget = useMemo(() => {
    if (programId && klassId) return null
    if (programs.length === 0) return null
    const p = programs[0]
    const k = p.klasses[0]
    if (!p || !k) return null
    return { programId: p.id, klassId: k.id }
  }, [programId, klassId, programs])

  useEffect(() => {
    if ((!programId || !klassId) && autoTarget) {
      navigate(
        `/courses?program=${autoTarget.programId}&klass=${autoTarget.klassId}`,
        { replace: true }
      )
    }
  }, [programId, klassId, autoTarget, navigate])

  if (progLoading) {
    return <SpinnerOverlay inline label="Đang tải chương trình..." />
  }

  if (!programId || !klassId) {
    if (autoTarget) {
      return <SpinnerOverlay inline label="Đang chuyển..." />
    }
    return (
      <>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 24, margin: 0 }}>
          Chương trình
        </h1>
        <Card>
          <EmptyState
            icon={<Icon name="doc" size={32} className="faint" />}
            title="Bạn chưa được phân lớp nào"
            description="Vận hành sẽ phân lớp khi sẵn sàng. Khi đó các chương trình sẽ xuất hiện ở thanh bên trái."
          />
        </Card>
      </>
    )
  }

  if (detailQuery.isLoading) {
    return <SpinnerOverlay inline label="Đang tải lớp..." />
  }
  if (detailQuery.isError || !detailQuery.data) {
    return (
      <Card>
        <EmptyState
          title="Không tải được lớp"
          description="Kiểm tra kết nối và thử lại."
          actionLabel="Thử lại"
          onAction={() => detailQuery.refetch()}
        />
      </Card>
    )
  }

  const detail = detailQuery.data

  // Tab switcher cho khoá khác
  const otherKlasses = detail.program.klasses.filter((k) => k.id !== detail.klass.id)

  return (
    <>
      <CourseHeader detail={detail} />

      {otherKlasses.length > 0 ? (
        <div
          style={{
            display: 'flex',
            gap: 6,
            background: '#fff',
            border: '1px solid var(--border)',
            borderRadius: 999,
            padding: 4,
            alignSelf: 'flex-start',
            boxShadow: 'var(--sh)',
          }}
        >
          {detail.program.klasses.map((k) => {
            const on = k.id === detail.klass.id
            return (
              <button
                key={k.id}
                type="button"
                onClick={() =>
                  navigate(`/courses?program=${detail.program.id}&klass=${k.id}`)
                }
                style={{
                  background: on ? detail.program.color : 'transparent',
                  color: on ? '#fff' : 'var(--ink2)',
                  border: 'none',
                  padding: '5px 14px',
                  borderRadius: 999,
                  fontWeight: 600,
                  fontSize: 12.5,
                  cursor: 'pointer',
                }}
              >
                {k.label}
              </button>
            )
          })}
        </div>
      ) : null}

      <div>
        <div
          style={{
            fontSize: 12,
            letterSpacing: 0.5,
            textTransform: 'uppercase',
            color: 'var(--muted)',
            fontWeight: 700,
            marginBottom: 10,
          }}
        >
          Các buổi học
        </div>
        <SessionAccordion
          program={detail.program}
          klassLabel={detail.klass.label}
          sessions={detail.klass.sessions}
          today={MOCK_TODAY_STR}
          initialSessionId={sessionId}
        />
      </div>
    </>
  )
}
