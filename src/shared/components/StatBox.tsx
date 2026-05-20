import { cn } from '../utils/cn'

interface Props {
  color: 'blue' | 'green' | 'amber'
  label: string
  value: string | number
  caption?: string
  onClick?: () => void
  className?: string
}

const COLOR_CLASS = {
  blue: 'sbox-b',
  green: 'sbox-g',
  amber: 'sbox-a',
} as const

export function StatBox({ color, label, value, caption, onClick, className }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn('sbox', COLOR_CLASS[color], className)}
      style={!onClick ? { cursor: 'default' } : undefined}
    >
      <span className="lbl">{label}</span>
      <span className="val">{value}</span>
      {caption ? <span className="cap">{caption}</span> : null}
    </button>
  )
}
