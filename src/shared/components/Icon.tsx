import type { CSSProperties, ReactNode } from 'react'

export type IconName =
  | 'home'
  | 'cal'
  | 'msg'
  | 'users'
  | 'star'
  | 'profile'
  | 'bell'
  | 'zoom'
  | 'pin'
  | 'send'
  | 'doc'
  | 'pdf'
  | 'img'
  | 'download'
  | 'support'
  | 'check'
  | 'warn'
  | 'clock'
  | 'info'
  | 'bulb'
  | 'plus'
  | 'menu'
  | 'logout'
  | 'chev-down'
  | 'chev-right'
  | 'chev-left'
  | 'close'
  | 'camera'
  | 'google'

interface Props {
  name: IconName
  size?: number
  className?: string
  style?: CSSProperties
}

const PATHS: Record<IconName, ReactNode> = {
  home: (
    <path d="M3 11.5L12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1v-8.5Z" />
  ),
  cal: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 9h18M8 3v4M16 3v4" />
    </>
  ),
  msg: <path d="M3 5h18v12H7l-4 4V5Z" />,
  users: (
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
      <circle cx="17" cy="9" r="2.6" />
      <path d="M15 20c0-2.5 2-4.5 4.5-4.5" />
    </>
  ),
  star: <path d="M12 3l2.7 6.1 6.6.6-5 4.5 1.5 6.6L12 17.6 6.2 20.8l1.5-6.6-5-4.5 6.6-.6L12 3Z" />,
  profile: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
    </>
  ),
  bell: (
    <>
      <path d="M6 17h12l-1.5-2V11a4.5 4.5 0 0 0-9 0v4L6 17Z" />
      <path d="M10 20a2 2 0 0 0 4 0" />
    </>
  ),
  zoom: (
    <>
      <rect x="3" y="7" width="13" height="10" rx="2" />
      <path d="M16 11l5-3v8l-5-3" />
    </>
  ),
  pin: <path d="M12 2l2 5h5l-4 3 1.5 5L12 12l-4.5 3 1.5-5-4-3h5l2-5Z" />,
  send: <path d="M3 11l18-8-8 18-2-7-8-3Z" />,
  doc: (
    <>
      <path d="M6 3h8l4 4v14H6V3Z" />
      <path d="M14 3v4h4M9 12h6M9 16h6" />
    </>
  ),
  pdf: (
    <>
      <path d="M6 3h8l4 4v14H6V3Z" />
      <path d="M14 3v4h4" />
      <text x="9" y="17" fontSize="6" fontWeight="700" fill="currentColor">PDF</text>
    </>
  ),
  img: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="9" cy="10" r="1.6" />
      <path d="M21 17l-5-5-9 9" />
    </>
  ),
  download: (
    <>
      <path d="M12 3v12" />
      <path d="M7 10l5 5 5-5" />
      <path d="M4 21h16" />
    </>
  ),
  support: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9 10a3 3 0 1 1 3 3v2" />
      <circle cx="12" cy="17" r="0.8" fill="currentColor" />
    </>
  ),
  check: <path d="M4 12l5 5L20 6" />,
  warn: (
    <>
      <path d="M12 3l10 18H2L12 3Z" />
      <path d="M12 10v4" />
      <circle cx="12" cy="17" r="0.9" fill="currentColor" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 10v6" />
      <circle cx="12" cy="7" r="0.9" fill="currentColor" />
    </>
  ),
  bulb: (
    <>
      <path d="M9 18h6M10 21h4" />
      <path d="M12 3a6 6 0 0 0-4 10c1 1 1.5 2 1.5 3h5c0-1 .5-2 1.5-3a6 6 0 0 0-4-10Z" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  menu: <path d="M4 6h16M4 12h16M4 18h16" />,
  logout: (
    <>
      <path d="M15 4h4v16h-4" />
      <path d="M10 8l-4 4 4 4" />
      <path d="M6 12h10" />
    </>
  ),
  'chev-down': <path d="M6 9l6 6 6-6" />,
  'chev-right': <path d="M9 6l6 6-6 6" />,
  'chev-left': <path d="M15 6l-6 6 6 6" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  camera: (
    <>
      <path d="M3 8h4l2-3h6l2 3h4v12H3V8Z" />
      <circle cx="12" cy="14" r="4" />
    </>
  ),
  google: (
    <>
      <path
        d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.4c-.2 1.2-.9 2.3-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.3Z"
        fill="#4285F4"
        stroke="none"
      />
      <path
        d="M12 22c2.7 0 5-.9 6.6-2.5l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.7-5.6-4.1H3.1v2.6C4.7 19.7 8.1 22 12 22Z"
        fill="#34A853"
        stroke="none"
      />
      <path
        d="M6.4 13.9c-.2-.6-.3-1.2-.3-1.9 0-.7.1-1.3.3-1.9V7.5H3.1A10 10 0 0 0 2 12c0 1.6.4 3.2 1.1 4.5l3.3-2.6Z"
        fill="#FBBC04"
        stroke="none"
      />
      <path
        d="M12 5.9c1.5 0 2.8.5 3.8 1.5l2.8-2.8C17 3.1 14.7 2.2 12 2.2c-3.9 0-7.3 2.3-8.9 5.5L6.4 10c.8-2.4 3-4.1 5.6-4.1Z"
        fill="#EA4335"
        stroke="none"
      />
    </>
  ),
}

export function Icon({ name, size = 18, className, style }: Props) {
  const inner = PATHS[name]
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden
    >
      {inner}
    </svg>
  )
}
