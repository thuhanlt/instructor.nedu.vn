import { useEffect, useState } from 'react'
import { formatInTz } from './index'

interface Props {
  tz: string
  format?: 'HH:mm' | 'HH:mm:ss'
  className?: string
}

export function TimezoneClock({ tz, format = 'HH:mm', className }: Props) {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(id)
  }, [])

  return <span className={className}>{formatInTz(now, tz, format)}</span>
}
