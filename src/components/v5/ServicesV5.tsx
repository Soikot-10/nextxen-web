'use client'
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import Icon, { type IconName } from '@/components/Icon'
import { openService } from '@/components/three/sceneStore'
import { COUNTS, GOLD, PLANS, coreServices, industryNames, serviceNames } from './data'

// Services as a glass dashboard: the selected service as a violet orb with a
// live waveform ring, a staircase of thick glass stat cards (real counts from
// the site's data), a fan of glowing trails from the active card to the items
// it counts, and a frosted detail panel with an "Ask Xen" bar.

type Card = { key: string; icon: IconName; value: number; label: string; items: string[] }

function Waveform({ paused }: { paused: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const cv = ref.current!
    const ctx = cv.getContext('2d')!
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0, t = 0
    const draw = () => {
      const dpr = Math.min(2, Math.max(devicePixelRatio || 1, 1.5))
      const s = cv.clientWidth
      if (cv.width !== Math.round(s * dpr)) { cv.width = cv.height = Math.round(s * dpr) }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, s, s)
      const c = s / 2, base = s * 0.36
      for (const [col, amp, sp, w] of [['rgba(167,139,250,.9)', 0.13, 1, 1.4], ['rgba(127,231,224,.75)', 0.09, -1.3, 1.1], ['rgba(233,199,123,.55)', 0.06, 1.7, 0.9]] as const) {
        ctx.beginPath()
        for (let k = 0; k <= 240; k++) {
          const a = (k / 240) * Math.PI * 2
          const n = Math.sin(a * 9 + t * sp * 2) * 0.5 + Math.sin(a * 23 - t * sp * 3.1) * 0.3 + Math.sin(a * 41 + t * 5) * 0.2
          const r = base * (1 + n * amp)
          const x = c + Math.cos(a) * r, y = c + Math.sin(a) * r
          if (k) ctx.lineTo(x, y); else ctx.moveTo(x, y)
        }
        ctx.strokeStyle = col; ctx.lineWidth = w; ctx.shadowColor = col; ctx.shadowBlur = 8
        ctx.stroke()
      }
      if (!reduce && !paused) { t += 0.016; raf = requestAnimationFrame(draw) }
    }
    draw()
    return () => cancelAnimationFrame(raf)
  }, [paused])
  return <canvas ref={ref} className="wave" aria-hidden="true" />
}

export default function ServicesV5() {
  const [svcIdx, setSvcIdx] = useState(0)
  const [cardIdx, setCardIdx] = useState(0)
  const [visible, setVisible] = useState(false)
  const body = useRef<HTMLDivElement>(null)
  const orb = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([])
  const itemRefs = useRef<(HTMLLIElement | null)[]>([])
  const [paths, setPaths] = useState<{ links: string[]; fan: string[] }>({ links: [], fan: [] })
  const [ask, setAsk] = useState('')

  const s = coreServices[svcIdx]
  const cards: Card[] = [
    { key: 'deliv', icon: 'checkCircle', value: s.svc.feats.length, label: `Deliverables in ${s.short}`, items: s.svc.feats },
    { key: 'ind', icon: 'building', value: COUNTS.industries, label: 'Industries we serve', items: industryNames },
    { key: 'svc', icon: 'sparkle', value: COUNTS.services, label: 'Services in total', items: serviceNames },
    { key: 'plans', icon: 'card', value: COUNTS.plans, label: 'Pricing plans', items: PLANS.map(p => `${p.name} · ${p.price === 'Custom' ? 'Custom' : `${p.price}/mo`}`) },
  ]
  const card = cards[cardIdx]

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: '100px' })
    if (body.current) io.observe(body.current)
    return () => io.disconnect()
  }, [])

  // measure DOM positions and build the curved connection paths
  const measure = useCallback(() => {
    const b = body.current, o = orb.current
    if (!b || !o) return
    const br = b.getBoundingClientRect()
    if (br.width < 900) { setPaths({ links: [], fan: [] }); return }
    const rel = (r: DOMRect, fx: number, fy: number) => ({ x: r.left - br.left + r.width * fx, y: r.top - br.top + r.height * fy })
    const or = o.getBoundingClientRect()
    const from = rel(or, 0.92, 0.5)
    const links = cardRefs.current.map(el => {
      if (!el) return ''
      const to = rel(el.getBoundingClientRect(), 0, 0.5)
      const mx = (from.x + to.x) / 2
      return `M${from.x},${from.y} C${mx},${from.y} ${mx},${to.y} ${to.x},${to.y}`
    })
    const ac = cardRefs.current[cardIdx]
    const fan = ac ? itemRefs.current.slice(0, card.items.length).map(el => {
      if (!el) return ''
      const a = rel(ac.getBoundingClientRect(), 1, 0.5)
      const t = rel(el.getBoundingClientRect(), 0, 0.5)
      const dx = t.x - a.x
      return `M${a.x},${a.y} C${a.x + dx * 0.45},${a.y} ${t.x - dx * 0.45},${t.y} ${t.x - 6},${t.y}`
    }) : []
    setPaths({ links, fan })
  }, [cardIdx, card.items.length])

  useLayoutEffect(() => {
    const first = requestAnimationFrame(measure)
    const ro = new ResizeObserver(measure)
    if (body.current) ro.observe(body.current)
    const id = setTimeout(measure, 450) // after the staggered entrance settles
    return () => { ro.disconnect(); clearTimeout(id); cancelAnimationFrame(first) }
  }, [measure, svcIdx])

  const send = (e: React.FormEvent) => {
    e.preventDefault()
    const q = ask.trim()
    const subject = encodeURIComponent(`Question about ${s.svc.title.split(' —')[0]}`)
    window.location.href = `mailto:hello@nextxen.co.nz?subject=${subject}${q ? `&body=${encodeURIComponent(q)}` : ''}`
  }

  return (
    <section id="services" className="sec v5-svc">
      <div className="wrap">
        <div className="v5-head rv rv-up">
          <p className="eyebrow">Services</p>
          <h2 className="v5-h2">Everything you need to grow, <span>in one connected system.</span></h2>
        </div>

        <div className="slab slab-flat svc-slab rv rv-depth">
          <span className="bracket tl" /><span className="bracket tr" /><span className="bracket bl" /><span className="bracket br" />
          <div className="slab-top">
            <span className="slab-title"><span className="slab-dot" />Service explorer<span className="slab-sub">{COUNTS.core} core · {COUNTS.services} total</span></span>
            <div className="svc-tabs" role="tablist" aria-label="Core services">
              {coreServices.map((c, i) => (
                <button key={c.id} role="tab" aria-selected={i === svcIdx} className={`tabp${i === svcIdx ? ' on' : ''}`} style={{ '--c': c.color } as CSSProperties}
                  onClick={() => { setSvcIdx(i); setCardIdx(0) }}>
                  <i />{c.short}
                </button>
              ))}
            </div>
          </div>

          <div className="svc-body" ref={body}>
            <svg className="svc-lines" aria-hidden="true">
              <defs>
                <linearGradient id="fan-g" x1="0" x2="1"><stop offset="0" stopColor={GOLD} stopOpacity=".9" /><stop offset="1" stopColor="#7fe7e0" stopOpacity=".35" /></linearGradient>
              </defs>
              {paths.links.map((d, i) => <path key={`l${i}`} d={d} className={`svc-link${i === cardIdx ? ' on' : ''}`} />)}
              {paths.fan.map((d, i) => (
                <g key={`f${cardIdx}-${svcIdx}-${i}`} style={{ '--k': i } as CSSProperties}>
                  <path d={d} className="fan" />
                  <path d={d} className="fan-comet" pathLength={100} />
                </g>
              ))}
            </svg>

            <div className="svc-orb" ref={orb}>
              <Waveform paused={!visible} />
              <span className="vorb"><span className="vorb-face"><Icon name={s.icon} size={34} stroke={1.5} /></span></span>
              <div className="svc-orb-l">
                <b key={s.id}>{s.svc.title.split(' —')[0]}</b>
                <small><i style={{ background: s.color }} />{s.catName} · {s.svc.tag}</small>
              </div>
              <div className="svc-step">
                <button aria-label="Previous service" onClick={() => { setSvcIdx(i => (i + coreServices.length - 1) % coreServices.length); setCardIdx(0) }}><Icon name="arrow" size={14} /></button>
                <span>{String(svcIdx + 1).padStart(2, '0')} / {String(coreServices.length).padStart(2, '0')}</span>
                <button aria-label="Next service" onClick={() => { setSvcIdx(i => (i + 1) % coreServices.length); setCardIdx(0) }}><Icon name="arrow" size={14} /></button>
              </div>
            </div>

            <div className="stat-stack">
              {cards.map((c, i) => (
                <button key={c.key} ref={el => { cardRefs.current[i] = el }} className={`tcard${i === cardIdx ? ' on' : ''}`} style={{ '--k': i } as CSSProperties}
                  onClick={() => setCardIdx(i)} aria-pressed={i === cardIdx}>
                  <span className="tcard-tab" />
                  <span className="tcard-ic"><Icon name={c.icon} size={18} /></span>
                  <span className="tcard-n">{c.value}</span>
                  <span className="tcard-l">{c.label}</span>
                </button>
              ))}
            </div>

            <ul className="fan-list" key={`${svcIdx}-${cardIdx}`}>
              {card.items.slice(0, 18).map((it, i) => (
                <li key={it} ref={el => { itemRefs.current[i] = el }} style={{ '--k': i, '--n': Math.min(card.items.length, 18) } as CSSProperties}><i />{it}</li>
              ))}
            </ul>

            <aside className="detail">
              <div className="detail-top">
                <span className="detail-ic" style={{ '--c': s.color } as CSSProperties}><Icon name={s.icon} size={20} /></span>
                <span className="badge-active"><i />Active</span>
              </div>
              <h3>{s.svc.title.split(' —')[0]}</h3>
              <p>{s.svc.shortDesc}</p>
              <div className="detail-tiles">
                <div><small>Plans from</small><b>$399<em>/mo</em></b></div>
                <div><small>Included</small><b>{s.svc.feats.length}<em> deliverables</em></b></div>
                <div><small>Category</small><b className="sm">{s.catName}</b></div>
                <div><small>Onboarding</small><b className="sm">5–7 days</b></div>
              </div>
              <button className="detail-more" onClick={() => openService(s.id)}>See everything included <Icon name="arrow" size={14} /></button>
              <form className="ask" onSubmit={send}>
                <span className="ask-spark" aria-hidden="true">✦</span>
                <input value={ask} onChange={e => setAsk(e.target.value)} placeholder={`Ask Xen about ${s.short}…`} aria-label={`Ask a question about ${s.short}`} />
                <button type="submit" aria-label="Send question by email"><Icon name="arrowUpRight" size={15} stroke={2} /></button>
              </form>
              <p className="ask-note">Your question goes straight to our team by email.</p>
            </aside>
          </div>
        </div>
      </div>
    </section>
  )
}
