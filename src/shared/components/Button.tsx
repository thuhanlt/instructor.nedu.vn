import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../utils/cn'

export type ButtonVariant =
  | 'p'
  | 'p2'
  | 'o'
  | 'ops'
  | 'warn'
  | 'confirm'
  | 'ghost'
  | 'ai'

export type ButtonSize = 'sm' | 'md'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  icon?: ReactNode
}

export function Button({
  variant = 'p',
  size = 'md',
  icon,
  className,
  children,
  ...rest
}: Props) {
  return (
    <button
      className={cn('btn', variant, size === 'sm' && 'sm', className)}
      {...rest}
    >
      {icon}
      {children}
    </button>
  )
}
