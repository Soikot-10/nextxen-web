import { Fragment, type CSSProperties, type ReactNode } from 'react'

// Server-rendered reveal wrapper. The shared Interactions layer adds `.in`
// when it scrolls into view; `variant` picks the entrance.
export default function ScrollReveal({
  children, delay = 0, className = '', variant = 'up', as: Tag = 'div',
}: {
  children: ReactNode; delay?: number; className?: string
  variant?: 'up' | 'scale' | 'left' | 'right' | 'fade'; as?: 'div' | 'section' | 'li' | 'figure'
}) {
  return (
    <Tag className={`rv rv-${variant} ${className}`} style={{ '--d': `${delay}ms` } as CSSProperties}>
      {children}
    </Tag>
  )
}

// Splits a line into words that rise out of a mask one after another.
export function Words({ text, delay = 0, className = '' }: { text: string; delay?: number; className?: string }) {
  return (
    <span className={`words ${className}`} aria-label={text}>
      {text.split(' ').map((w, i, all) => (
        <Fragment key={i}>
          <span className="wd" aria-hidden="true">
            <span style={{ '--i': i, '--d': `${delay}ms` } as CSSProperties}>{w}</span>
          </span>
          {i < all.length - 1 && ' '}
        </Fragment>
      ))}
    </span>
  )
}

// Paragraph whose words light up as it scrolls through the viewport.
export function ScrubText({ text, className = '' }: { text: string; className?: string }) {
  return (
    <p className={`scrub ${className}`} aria-label={text}>
      {text.split(' ').map((w, i) => <span key={i} className="sw" aria-hidden="true">{w} </span>)}
    </p>
  )
}
