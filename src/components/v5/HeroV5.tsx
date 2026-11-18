'use client'
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import Icon from '@/components/Icon'
import { openService } from '@/components/three/sceneStore'
import { CATS, COUNTS, GOLD, STEPS, coreServices } from './data'
import { BOX, C, R, angleOf, live, polar, setLiveActive } from './wheel'

const WheelGL = dynamic(() => import('./WheelGL'), { ssr: false })
const Crystals = dynamic(() => import('./Crystals'), { ssr: false })

const N = coreServices.length
const TICKS = 96

// The hero: a tilted glass "device slab" holding the NEXTXEN growth network,
// a radial wheel of the eight core services with their deliverables. SVG and
// HTML draw every line and label (crisp at any DPR); WebGL draws the gold
// core, the pearl nodes and the refractive crystals in the foreground.
export default function HeroV5() {
  const slab = useRef<HTMLDivElement>(null)
  const spin = useRef<SVGGElement>(null)
  const labels = useRef<HTMLDivElement>(null)
  const pulseRefs = useRef<(SVGCircleElement | null)[]>([])
  const [active, setActive] = useState(-1)
  const [step, setStep] = useState(0)
  const [cfg, setCfg] = useState<{ reduce: boolean; dpr: number; lite: boolean } | null>(null)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    const lite = matchMedia('(max-width: 820px), (pointer: coarse)').matches
    const dpr = lite ? Math.min(devicePixelRatio || 1, 1.5) : Math.min(2, Math.max(devicePixelRatio || 1, 1.5))
    const id = requestAnimationFrame(() => setCfg({ reduce, dpr, lite }))
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting))
    if (slab.current) io.observe(slab.current)
    return () => { cancelAnimationFrame(id); io.disconnect() }
  }, [])

  // process rail: highlight one step at a time
  useEffect(() => {
    if (cfg?.reduce) return
    const id = setInterval(() => setStep(s => (s + 1) % STEPS.length), 3200)
    return () => clearInterval(id)
  }, [cfg?.reduce])

  // ambient loop: wheel sway, gold pulses along the spokes, slab tilt
  useEffect(() => {
    if (!cfg) return
    let raf = 0, mx = 0, my = 0, cx = 0, cy = 0
    const t0 = performance.now()
    const onMove = (e: PointerEvent) => { mx = e.clientX / innerWidth - 0.5; my = e.clientY / innerHeight - 0.5 }
    addEventListener('pointermove', onMove, { passive: true })
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop)
      const t = (now - t0) / 1000
      if (!cfg.reduce) live.rot = Math.sin(t * 0.12) * 4
      spin.current?.setAttribute('transform', `rotate(${live.rot.toFixed(3)} ${C} ${C})`)
      // labels follow the wheel (HTML for crisp text)
      labels.current?.querySelectorAll<HTMLElement>('[data-i]').forEach(el => {
        const i = Number(el.dataset.i), a = angleOf(i, N)
        const p = polar(R.label, a)
        const deg = (a * 180) / Math.PI
        const flip = Math.cos(a) < -0.01
        el.style.left = `${(p.x / BOX) * 100}%`; el.style.top = `${(p.y / BOX) * 100}%`
        el.style.transform = `translate(${flip ? '-100%' : '0'}, -50%) rotate(${flip ? deg + 180 : deg}deg)`
        el.style.transformOrigin = flip ? 'right center' : 'left center'
      })
      // pulses: one leaves the core for each spoke in turn
      pulseRefs.current.forEach((c, i) => {
        if (!c) return
        const u = cfg.reduce ? -1 : (((t - i * 0.45) % (N * 0.45)) + N * 0.45) % (N * 0.45) / 1.4
        if (u < 0 || u > 1) { c.setAttribute('opacity', '0'); return }
        const r = R.ring1 + (R.node - R.ring1) * u
        const a = angleOf(i, N)
        const p = polar(r, a)
        c.setAttribute('cx', p.x.toFixed(1)); c.setAttribute('cy', p.y.toFixed(1))
        c.setAttribute('opacity', (Math.sin(u * Math.PI) * (live.active >= 0 && live.active !== i ? 0.25 : 1)).toFixed(2))
      })
      // slab: tilted at rest, eases flatter with scroll, parallax with the pointer
      if (slab.current) {
        const sp = Math.min(1, Math.max(0, scrollY / (innerHeight * 0.8)))
        cx += (mx - cx) * 0.06; cy += (my - cy) * 0.06
        const k = cfg.reduce ? 0 : 1
        const rx = cfg.lite ? 0 : (10 - sp * 7) + cy * -4 * k
        const ry = cfg.lite ? 0 : (-12 + sp * 9) + cx * 6 * k
        slab.current.style.transform = `rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`
      }
    }
    raf = requestAnimationFrame(loop)
    return () => { cancelAnimationFrame(raf); removeEventListener('pointermove', onMove) }
  }, [cfg])

  const focus = (i: number) => { setLiveActive(i); setActive(i) }
  const blur = () => { setLiveActive(-1); setActive(-1) }

  const tip = active >= 0 ? coreServices[active] : null
  const tipPos = active >= 0 ? polar(R.node, angleOf(active, N)) : null

  return (
    <section className="v5-hero" data-hero>
      <div className="wrap v5-hero-top">
        <h1 className="sr-only">NEXTXEN: AI-powered marketing for New Zealand businesses</h1>
        <p className="eyebrow hero-fade">AI-powered marketing studio · Auckland</p>
        <div className="hero-btns hero-fade" style={{ '--d': '120ms' } as CSSProperties}>
          <Link href="/contact" className="btn" data-magnetic><span className="btn-l">Book a free strategy call</span><span className="btn-ic"><Icon name="arrow" size={15} stroke={2} /></span></Link>
          <Link href="#services" className="btn btn-ghost" data-magnetic><span className="btn-l">Explore services</span></Link>
        </div>
      </div>

      <div className="v5-scene">
        <aside className="v5-rail hero-fade" style={{ '--d': '300ms' } as CSSProperties} aria-label="How we work">
          <svg className="rail-wave" viewBox="0 0 40 600" preserveAspectRatio="none" aria-hidden="true">
            <path d="M20 0 C 34 40, 6 80, 20 120 S 34 200, 20 240 S 6 320, 20 360 S 34 440, 20 480 S 6 560, 20 600" />
          </svg>
          <ol>
            {STEPS.map((s, i) => (
              <li key={s.title} className={i === step ? 'on' : ''}>
                <button onClick={() => setStep(i)}><b>0{i + 1}</b><span>{s.title}</span><small>{s.when}</small></button>
              </li>
            ))}
          </ol>
        </aside>

        <div className="slab-wrap hero-fade" style={{ '--d': '200ms' } as CSSProperties}>
          <div className="slab" ref={slab}>
            <span className="bracket tl" /><span className="bracket tr" /><span className="bracket bl" /><span className="bracket br" />
            <div className="slab-top">
              <span className="slab-title"><span className="slab-dot" />NEXTXEN<span className="slab-sub">Growth network</span></span>
              <div className="slab-pills">
                <Link href="/contact" className="gpill"><Icon name="plus" size={14} stroke={2} />Book a call</Link>
                <Link href="/industries" className="gpill ic" aria-label="Search industries"><Icon name="search" size={15} /></Link>
                <a href="#services" className="gpill ic" aria-label="Jump to services"><Icon name="sliders" size={15} /></a>
              </div>
            </div>

            <div className="wheel" onPointerLeave={blur}>
              <svg className="wheel-svg" viewBox={`0 0 ${BOX} ${BOX}`} aria-hidden="true">
                <defs>
                  <radialGradient id="w-glow"><stop offset="0" stopColor={GOLD} stopOpacity=".55" /><stop offset=".45" stopColor={GOLD} stopOpacity=".12" /><stop offset="1" stopColor={GOLD} stopOpacity="0" /></radialGradient>
                  <linearGradient id="w-cap" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#bff7f1" stopOpacity=".42" /><stop offset=".45" stopColor="#3fb8b0" stopOpacity=".16" /><stop offset="1" stopColor="#0b3836" stopOpacity=".5" />
                  </linearGradient>
                  <linearGradient id="w-cap-on" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#fff3cf" stopOpacity=".9" /><stop offset=".5" stopColor={GOLD} stopOpacity=".5" /><stop offset="1" stopColor="#6a4f17" stopOpacity=".6" />
                  </linearGradient>
                  <filter id="w-blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="4" /></filter>
                </defs>
                <circle cx={C} cy={C} r={250} fill="url(#w-glow)" />
                <g ref={spin}>
                  {/* concentric rings */}
                  <circle className="w-ring" cx={C} cy={C} r={R.ring1} />
                  <circle className="w-ring dash" cx={C} cy={C} r={R.ring2} />
                  <circle className="w-ring faint" cx={C} cy={C} r={R.node} />
                  <circle className="w-ring dash faint" cx={C} cy={C} r={R.node + 70} />
                  {/* sunburst ticks around the core */}
                  {Array.from({ length: TICKS }, (_, k) => {
                    const a = (k / TICKS) * Math.PI * 2
                    const r1 = k % 4 === 0 ? R.tick1 + 6 : R.tick1
                    const p0 = polar(R.tick0, a), p1 = polar(r1, a)
                    return <line key={k} className="w-tick" x1={p0.x} y1={p0.y} x2={p1.x} y2={p1.y} />
                  })}
                  {/* dashed links between the numbered dots on the inner ring */}
                  <polygon className="w-dash" points={coreServices.map((_, i) => { const p = polar(R.dots, angleOf(i, N, 0) + 0.2); return `${p.x},${p.y}` }).join(' ')} />
                  {coreServices.map((s, i) => {
                    const a = angleOf(i, N, 0)
                    const on = active === i, dim = active >= 0 && !on
                    const deg = (a * 180) / Math.PI
                    const len = R.spoke1 - R.spoke0
                    const d = polar(R.dots, a + 0.2)
                    const tgt = polar(R.ring2, a + Math.PI / N)
                    return (
                      <g key={s.id} className={`w-spoke${on ? ' on' : ''}${dim ? ' dim' : ''}`}>
                        {/* glass capsule pointing outward */}
                        <g transform={`rotate(${deg} ${C} ${C})`}>
                          <rect x={C + R.spoke0} y={C - 13} width={len} height={26} rx={13} fill={on ? 'url(#w-cap-on)' : 'url(#w-cap)'} className="w-cap" />
                          <rect x={C + R.spoke0 + 6} y={C - 9} width={len - 12} height={4} rx={2} className="w-cap-hl" />
                          <line x1={C + R.ring1} y1={C} x2={C + R.spoke0} y2={C} className="w-feed" />
                          <line x1={C + R.spoke1} y1={C} x2={C + R.node - 26} y2={C} className="w-feed" />
                        </g>
                        {/* halo ring around the pearl */}
                        {(() => { const p = polar(R.node, a); return <circle cx={p.x} cy={p.y} r={on ? 40 : 33} className="w-halo" style={{ stroke: on ? GOLD : s.color }} /> })()}
                        {/* deliverable satellites */}
                        {[-0.11, 0.11].map(o => { const p = polar(R.node + 34, a + o); return <circle key={o} cx={p.x} cy={p.y} r={4} className="w-sat" style={{ fill: s.color }} /> })}
                        {/* numbered dot: real count of deliverables */}
                        <circle cx={d.x} cy={d.y} r={13} className="w-num" />
                        <text x={d.x} y={d.y + 4.5} className="w-num-t">{s.svc.feats.length}</text>
                        {/* square target tile on the inner ring between spokes */}
                        {i % 2 === 0 && <rect x={tgt.x - 11} y={tgt.y - 11} width={22} height={22} rx={6} className="w-target" />}
                        {/* hit area */}
                        <g transform={`rotate(${deg} ${C} ${C})`}>
                          <rect x={C + R.spoke0 - 10} y={C - 34} width={R.node - R.spoke0 + 60} height={68} fill="transparent" className="w-hit"
                            onPointerEnter={() => focus(i)} onClick={() => focus(i)} />
                        </g>
                      </g>
                    )
                  })}
                </g>
                {/* gold pulses (positioned by the loop) */}
                {coreServices.map((s, i) => <circle key={s.id} ref={el => { pulseRefs.current[i] = el }} r={6} className="w-pulse" opacity={0} />)}
              </svg>

              {cfg && <WheelGL paused={!visible} reduce={cfg.reduce} dpr={cfg.dpr} lite={cfg.lite} />}

              <div className="wheel-labels" ref={labels}>
                {coreServices.map((s, i) => (
                  <span key={s.id} data-i={i} className={`w-label${active === i ? ' on' : ''}${active >= 0 && active !== i ? ' dim' : ''}`}>{s.short}</span>
                ))}
                <span className="w-core-l"><b>NEXTXEN</b><small>growth engine</small></span>
              </div>

              {tip && tipPos && (
                <div className="w-tip" style={{ left: `${(tipPos.x / BOX) * 100}%`, top: `${(tipPos.y / BOX) * 100}%`, '--c': tip.color } as CSSProperties}>
                  <p className="w-tip-k"><i />{tip.catName} · {tip.svc.feats.length} deliverables</p>
                  <b>{tip.svc.title.split(' —')[0]}</b>
                  <p>{tip.svc.shortDesc}</p>
                  <button onClick={() => openService(tip.id)}>What&apos;s included <Icon name="arrow" size={13} /></button>
                </div>
              )}
            </div>

            <div className="legend">
              <p className="legend-h">Services</p>
              <ul>
                {CATS.map(c => {
                  const items = coreServices.filter(s => s.cat === c.key)
                  return (
                    <li key={c.key}>
                      <span className="pearl" style={{ '--c': c.color } as CSSProperties} />
                      <span className="legend-n">{c.name}</span>
                      <span className="legend-s">{items.map(s => s.short).join(' · ')}</span>
                      <b>{items.length}</b>
                    </li>
                  )
                })}
              </ul>
              <p className="legend-t"><span>Core services</span><b>{COUNTS.core}</b></p>
              <p className="legend-t sub"><span>Services in total</span><b>{COUNTS.services}</b></p>
            </div>

            <a href="#xen" className="assist-btn" aria-label="Meet Xen, our AI assistant">
              <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5l1.9 6.1 6.1 1.9-6.1 1.9L12 18.5l-1.9-6.1L4 10.5l6.1-1.9z" fill="currentColor" /><path d="M19 15.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z" fill="currentColor" opacity=".7" /></svg>
            </a>
          </div>
        </div>

        {cfg && !cfg.lite && <Crystals paused={!visible} reduce={cfg.reduce} dpr={cfg.dpr} />}
      </div>
    </section>
  )
}
