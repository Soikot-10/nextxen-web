'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Icon from '@/components/Icon'
import { services, type Service } from '@/data/services'

// One glass detail panel for the whole site. Opened by openService(id) from
// the 3D pearls, the pinned services list or any service chip.
export default function ServicePanel() {
  const [active, setActive] = useState<Service | null>(null)

  useEffect(() => {
    const open = (e: Event) => setActive(services.find(s => s.id === (e as CustomEvent<string>).detail) ?? null)
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') setActive(null) }
    addEventListener('nx:service', open); addEventListener('keydown', key)
    return () => { removeEventListener('nx:service', open); removeEventListener('keydown', key) }
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('lock', !!active)
  }, [active])

  return (
    <div className={`sheet-overlay${active ? ' open' : ''}`} onClick={e => { if (e.target === e.currentTarget) setActive(null) }} aria-hidden={!active}>
      <div className="sheet" role="dialog" aria-modal="true" aria-label={active?.title ?? 'Service details'} data-lenis-prevent>
        {active && (
          <>
            <button className="sheet-close" onClick={() => setActive(null)} aria-label="Close"><Icon name="x" size={18} /></button>
            <span className="glass-icon lg sheet-icon"><Icon emoji={active.icon} size={28} /></span>
            <p className="eyebrow">{active.tag}</p>
            <h2 className="sheet-t">{active.title}</h2>
            <p className="sheet-lede">{active.desc1}</p>
            <p>{active.desc2}</p>
            <p>{active.desc3}</p>
            <p className="eyebrow mt">What&apos;s included</p>
            <ul className="ticks two">
              {active.feats.map(f => <li key={f}><Icon name="check" size={14} stroke={2} />{f}</li>)}
            </ul>
            <Link href="/contact" className="btn btn-block" onClick={() => setActive(null)}>
              <span className="btn-l">Talk to us about {active.title.split(' —')[0]}</span>
              <span className="btn-ic"><Icon name="arrow" size={15} stroke={2} /></span>
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
