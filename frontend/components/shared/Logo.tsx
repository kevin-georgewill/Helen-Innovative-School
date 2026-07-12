import Link from 'next/link'

// Shared brand logo — the graduation-cap mark + "Helen Innovative School" wordmark.
// This is the single source of truth for the brand icon used across the whole site
// (navbar, footer, auth pages, dashboards, etc.). The mark matches app/icon.svg.
//
// variant: 'light' for dark backgrounds (white text), 'dark' for light backgrounds (navy text).
// href:    wraps the logo in a link when set (default '/'); pass null for a non-linked mark.

type LogoVariant = 'light' | 'dark'

interface LogoProps {
  variant?: LogoVariant
  href?: string | null
  showWordmark?: boolean
  className?: string
}

const badgeClass: Record<LogoVariant, string> = {
  light: 'bg-white/10 border border-white/20',
  dark: 'bg-his-navy border border-his-navy',
}

const wordmarkClass: Record<LogoVariant, string> = {
  light: 'text-white',
  dark: 'text-his-navy',
}

export function LogoMark({
  variant = 'light',
  className = '',
}: {
  variant?: LogoVariant
  className?: string
}) {
  return (
    <span
      className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${badgeClass[variant]} ${className}`}
    >
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="white" strokeWidth={2} aria-hidden="true">
        <path d="M22 10v6M2 10l10-5 10 5-10 5-10-5z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" strokeLinecap="round" />
      </svg>
    </span>
  )
}

export default function Logo({
  variant = 'light',
  href = '/',
  showWordmark = true,
  className = '',
}: LogoProps) {
  const content = (
    <>
      <LogoMark variant={variant} />
      {showWordmark && (
        <span className={`font-bold text-sm md:text-base leading-tight ${wordmarkClass[variant]}`}>
          Helen Innovative School
        </span>
      )}
    </>
  )

  const base = `inline-flex items-center gap-2.5 shrink-0 ${className}`

  if (href === null) return <span className={base}>{content}</span>
  return (
    <Link href={href} className={base}>
      {content}
    </Link>
  )
}
