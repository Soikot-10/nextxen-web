'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import ScrollReveal from '@/components/ScrollReveal'
import Icon from '@/components/Icon'

import { services, type Service } from '@/data/services'

export default function ServicesSection() {
  const [active, setActive] = useState<Service | null>(null)

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') setActive(null) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    document.body.style.overflow = active ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [active])

  return (
    <>
      <div className="sgrid">
        {services.map((s, i) => (
          <ScrollReveal key={s.id} delay={i * 40}>
            <div className="sc2" onClick={() => setActive(s)} role="button" tabIndex={0} onKeyDown={e => e.key === 'Enter' && setActive(s)}>
              <span className="si"><Icon emoji={s.icon} /></span>
              <h3>{s.title}</h3>
              <p>{s.shortDesc}</p>
              <span className="stag">{s.cardTag}</span>
            </div>
          </ScrollReveal>
        ))}
      </div>

      {/* Modal */}
      <div
        className={`smodal-overlay${active ? ' open' : ''}`}
        onClick={e => { if (e.target === e.currentTarget) setActive(null) }}
      >
        {active && (
          <div className="smodal" role="dialog" aria-modal="true" aria-label={active.title}>
            <button className="smodal-close" onClick={() => setActive(null)} aria-label="Close"><Icon name="x" size={18} /></button>
            <div className="smodal-icon"><Icon emoji={active.icon} size={24} /></div>
            <span className="smodal-tag">{active.tag}</span>
            <h2>{active.title}</h2>
            <p>{active.desc1}</p>
            <p>{active.desc2}</p>
            <p>{active.desc3}</p>
            <h3>What&apos;s included</h3>
            <ul className="smodal-feats">
              {active.feats.map(f => <li key={f}>{f}</li>)}
            </ul>
            <Link href="/contact" className="btn1" onClick={() => setActive(null)} style={{ width: '100%' }}>
              Talk to us about {active.title.split(' —')[0]} <Icon name="arrow" size={16} />
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
