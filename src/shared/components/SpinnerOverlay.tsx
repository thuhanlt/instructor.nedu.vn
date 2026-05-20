interface Props {
  label?: string
  inline?: boolean
}

export function SpinnerOverlay({ label, inline }: Props) {
  if (inline) {
    return (
      <div className="flex items-center justify-center py-10 flex-col gap-2">
        <div className="spinner" />
        {label ? <div className="spinner-label">{label}</div> : null}
      </div>
    )
  }
  return (
    <div className="spinner-overlay">
      <div className="spinner" />
      {label ? <div className="spinner-label">{label}</div> : null}
    </div>
  )
}
