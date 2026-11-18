import Link from 'next/link'
import type { CSSProperties } from 'react'
import Icon from '@/components/Icon'
import { Words } from '@/components/ScrollReveal'

export default function CtaBlock({ eyebrow = 'Free 30-minute strategy session', title, accent, text, button = 'Book a free strategy session' }: {
  eyebrow?: string; title: string; accent: string; text: string; button?: string
}) {
  return (
    <section className="sec cta" data-scene="cta">
      <div className="wrap cta-in">
        <p className="eyebrow rv rv-up">{eyebrow}</p>
        <h2 className="h1 sm rv"><Words text={title} /> <em><Words text={accent} delay={160} /></em></h2>
        <p className="lead rv rv-up" style={{ '--d': '200ms' } as CSSProperties}>{text}</p>
        <div className="hero-btns center rv rv-up" style={{ '--d': '300ms' } as CSSProperties}>
          <Link href="/contact" className="btn" data-magnetic><span className="btn-l">{button}</span><span className="btn-ic"><Icon name="arrow" size={15} stroke={2} /></span></Link>
        </div>
      </div>
    </section>
  )
}
