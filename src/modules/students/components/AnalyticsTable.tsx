interface Props {
  title: string
  rows: Array<{ label: string; count: number }>
  total: number
}

export function AnalyticsTable({ title, rows, total }: Props) {
  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid var(--border)',
        borderRadius: 'var(--r)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          background: 'var(--navy)',
          color: '#fff',
          padding: '8px 12px',
          fontWeight: 700,
          fontSize: 12.5,
          letterSpacing: 0.4,
        }}
      >
        {title}
      </div>
      <div style={{ padding: '4px 12px' }}>
        {rows.map((r, idx) => (
          <div
            key={r.label}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '8px 0',
              borderBottom: idx === rows.length - 1 ? 'none' : '1px dashed var(--border)',
              fontSize: 12.5,
            }}
          >
            <span>{r.label}</span>
            <span style={{ fontWeight: 600, color: 'var(--blue)' }}>
              {r.count}
              <span style={{ color: 'var(--faint)', fontWeight: 500 }}>
                {' '}
                ({total === 0 ? 0 : Math.round((r.count / total) * 100)}%)
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
