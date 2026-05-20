import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../utils/cn'

interface Props extends HTMLAttributes<HTMLDivElement> {
  tight?: boolean
  flat?: boolean
  children: ReactNode
}

export function Card({ tight, flat, className, children, ...rest }: Props) {
  return (
    <div className={cn('card', tight && 'tight', flat && 'flat', className)} {...rest}>
      {children}
    </div>
  )
}
