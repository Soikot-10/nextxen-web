'use client'
import { useEffect, useState, type CSSProperties } from 'react'
import dynamic from 'next/dynamic'
import Icon from '@/components/Icon'
import { Words } from '@/components/ScrollReveal'
import { openService } from '@/components/three/sceneStore'
import { CHANNELS } from '@/components/xen/channels'

const XenScene = dynamic(() => import('@/components/xen/XenScene'), { ssr: false })

// "Meet Xen": the AI growth assistant connected to every channel. Violet glass
// styling is scoped to this section. A pause control stops all motion here,
// and it starts paused for people who prefer reduced motion.
export default function XenSection() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const id = requestAnimationFrame(() => setPaused(true))
      return () => cancelAnimationFrame(id)
    }
  }, [])

  const ch = CHANNELS[active]

  return (
    <section id="xen" className={`sec xen${paused ? ' paused' : ''}`} aria-labelledby="xen-title">
      <div className="xen-amb" aria-hidden="true" />
      <div className="wrap grid12 xen-grid">
        <div className="xen-copy">
          <p className="eyebrow rv rv-up">Meet Xen</p>
          <h2 id="xen-title" className="h2 rv"><Words text="Your AI growth" /> <em><Words text="assistant." delay={140} /></em></h2>
          <p className="lead rv rv-up" style={{ '--d': '160ms' } as CSSProperties}>
            Xen is the AI layer we build into your marketing. It answers enquiries around the clock, follows up every lead and hands ready-to-buy customers to your team.
          </p>

          <div className="xen-chips rv rv-up" role="tablist" aria-label="Channels" style={{ '--d': '240ms' } as CSSProperties}>
            {CHANNELS.map((c, i) => (
              <button key={c.short} role="tab" aria-selected={i === active} className={`xen-chip${i === active ? ' on' : ''}`} onClick={() => setActive(i)}>
                <Icon name={c.icon} size={15} stroke={1.8} />{c.short}
              </button>
            ))}
          </div>

          <div className="xen-panel rv rv-up" role="tabpanel" style={{ '--d': '300ms' } as CSSProperties}>
            <div key={active} className="xen-panel-in">
              <h3 className="xen-h">{ch.name}</h3>
              <p className="xen-d">{ch.desc}</p>
              <div className="xen-demo" aria-label="Example">
                <span className="xen-ex">Example</span>
                {ch.chat?.map((m, k) => (
                  <p key={k} className={`bub ${m.from}`} style={{ '--k': k } as CSSProperties}>{m.text}</p>
                ))}
                <div className="lead-card" style={{ '--k': ch.chat?.length ?? 0 } as CSSProperties}>
                  <span className="lead-ic"><Icon name={ch.card.icon} size={16} stroke={1.8} /></span>
                  <div><b>{ch.card.title}</b><small>{ch.card.sub}</small></div>
                  <span className="lead-live"><i />now</span>
                </div>
              </div>
              <button className="link-arrow" onClick={() => openService('chatbot')}>Explore AI chatbots <Icon name="arrow" size={15} /></button>
            </div>
          </div>
        </div>

        <div className="xen-stage rv rv-depth">
          <div className="xen-stage-glass">
            <XenScene active={active} onPick={setActive} paused={paused} />
            <button className="xen-pause" onClick={() => setPaused(p => !p)} aria-pressed={paused} aria-label={paused ? 'Play animation' : 'Pause animation'}>
              {paused
                ? <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4.5v15l13-7.5z" /></svg>
                : <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="4.5" width="4" height="15" rx="1" /><rect x="14" y="4.5" width="4" height="15" rx="1" /></svg>}
              <span>{paused ? 'Play' : 'Pause'}</span>
            </button>
            <p className="xen-tag"><i />Xen · online 24/7</p>
          </div>
        </div>
      </div>
    </section>
  )
}
