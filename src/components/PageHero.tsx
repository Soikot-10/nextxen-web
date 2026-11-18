import type { CSSProperties, ReactNode } from 'react'
import { Words } from '@/components/ScrollReveal'

// Inner-page hero. Quiet type on the soft ambient light; the persistent 3D
// core floats small and dimmed behind it (data-scene="phero").
export default function PageHero({
  eyebrow, title, accent, sub, children, top,
}: { eyebrow: string; title: string; accent?: string; sub?: string; children?: ReactNode; top?: ReactNode }) {
  return (
    <section className="phero" data-scene="phero">
      <div className="wrap phero-in">
        {top}
        <p className="eyebrow hero-fade" style={{ '--d': '80ms' } as CSSProperties}>{eyebrow}</p>
        <h1 className="h1 md">
          <Words text={title} delay={120} />
          {accent && <> <em><Words text={accent} delay={300} /></em></>}
        </h1>
        {sub && <p className="lead hero-fade" style={{ '--d': '520ms' } as CSSProperties}>{sub}</p>}
        {children && <div className="hero-fade phero-extra" style={{ '--d': '640ms' } as CSSProperties}>{children}</div>}
      </div>
    </section>
  )
}
