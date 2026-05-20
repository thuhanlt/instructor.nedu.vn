import type { ReactNode } from 'react'
import { cn } from '../utils/cn'

export type TagVariant =
  | 'online'
  | 'offline'
  | 'done'
  | 'ended'
  | 'upcoming'
  | 'pending'
  | 'pinned'
  | 'answered'
  | 'ops'
  | 'closed'
  | 'info'

interface Props {
  variant: TagVariant
  children: ReactNode
  className?: string
}

export function Tag({ variant, children, className }: Props) {
  return <span className={cn('tag', variant, className)}>{children}</span>
}
