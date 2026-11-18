'use client'
import { useEffect, useRef, useState, type CSSProperties, type FormEvent, type ReactNode } from 'react'
import Link from 'next/link'
import Icon, { type IconName } from '@/components/Icon'
import { openService } from '@/components/three/sceneStore'
import { COUNTS, PLANS, STEPS, coreServices, industryNames, serviceNames } from '@/components/v5/data'

// Homepage sections 1–3, matched to the owner's 2026-11-18 references
// (wood-and-gold hero, neon "Why NEXTXEN" cards, black-and-gold service explorer,
// all sitting on one night-sky background with mountain ridges between them).
// Each artwork is the visual skin. Anything that moves or changes (the orbiting
// service bubbles, the engine's rings, tabs, counts, lists, light trails) is
// live code drawn on the exact spot it occupies in the artwork.
// Coordinates are artwork pixels (1672 × 941); everything scales with the stage.

const W = 1672, H = 941
const box = (x: number, y: number, w?: number, h?: number): CSSProperties => ({
  left: `${(x / W) * 100}%`, top: `${(y / H) * 100}%`,
  ...(w !== undefined ? { width: `${(w / W) * 100}%` } : {}),
  ...(h !== undefined ? { height: `${(h / H) * 100}%` } : {}),
})
const fs = (px: number): CSSProperties => ({ fontSize: `calc(var(--u) * ${px})` })

function useOnScreen<T extends Element>(margin = '160px') {
  const ref = useRef<T>(null)
  const [on, setOn] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting), { rootMargin: margin })
    io.observe(el)
    return () => io.disconnect()
  }, [margin])
  return [ref, on] as const
}
const reduced = () => typeof window !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches

function Skin({ name, priority = false }: { name: string; priority?: boolean }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img className="nt-skin" src={`/home2/${name}.webp`} alt="" width={W} height={H} loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'} draggable={false} />
  )
}

/* ═════════════════════════════ 1 · HERO ═════════════════════════════ */
const C = { x: 1117, y: 427 }             // growth-engine centre
const ORB = { rx: 292, ry: 212 }          // the bubbles' orbit
const NODES = [
  { id: 'website', label: 'Websites', x: 1112, y: 210, c: '#4dff8f' },
  { id: 'seo', label: 'SEO', x: 1322, y: 267, c: '#4dff8f' },
  { id: 'google', label: 'Google Ads', x: 1407, y: 415, c: '#c77dff' },
  { id: 'facebook', label: 'Meta Ads', x: 1339, y: 552, c: '#4f9dff', img: 'meta' },
  { id: 'social', label: 'Social', x: 1117, y: 632, c: '#b678ff' },
  { id: 'content', label: 'Content', x: 910, y: 557, c: '#d36bff' },
  { id: 'chatbot', label: 'AI Chatbots', x: 847, y: 415, c: '#3ff3ff' },
  { id: 'automation', label: 'AI Automation', x: 902, y: 270, c: '#5b8cff' },
].map(n => ({ ...n, a0: Math.atan2((n.y - C.y) / ORB.ry, (n.x - C.x) / ORB.rx) }))
const TURN = 80 // seconds per orbit

function Hero() {
  const [ref, on] = useOnScreen<HTMLElement>('60px')
  const nodeEls = useRef<(HTMLButtonElement | null)[]>([])
  const rods = useRef<(SVGGElement | null)[]>([])
  const packets = useRef<(SVGCircleElement | null)[]>([])
  const hover = useRef(-1)
  const [hot, setHot] = useState(-1)
  const state = useRef({ ang: 0, speed: 1, last: 0 })

  useEffect(() => {
    const still = reduced()
    let raf = 0
    const place = (t: number) => {
      const s = state.current
      const dt = s.last ? Math.min(0.05, (t - s.last) / 1000) : 0
      s.last = t
      // ease the orbit to a stop while a bubble is hovered
      const goal = hover.current >= 0 ? 0 : 1
      s.speed += (goal - s.speed) * Math.min(1, dt * (goal ? 3 : 12))
      if (!goal && s.speed < 0.02) s.speed = 0
      if (!still) s.ang += dt * s.speed * (Math.PI * 2 / TURN)
      NODES.forEach((n, i) => {
        const a = n.a0 + s.ang
        const depth = Math.sin(a)                         // +1 front (bottom), −1 back (top)
        const bob = still ? 0 : Math.sin(t / 900 + i * 1.7) * 4
        const x = C.x + ORB.rx * Math.cos(a), y = C.y + ORB.ry * Math.sin(a) + bob
        const sc = (1 + depth * 0.07) * (hover.current === i ? 1.08 : 1)
        const el = nodeEls.current[i]
        if (el) {
          el.style.left = `${((x - 90) / W) * 100}%`
          el.style.top = `${((y - 75) / H) * 100}%`
          el.style.transform = `scale(${sc.toFixed(3)}) rotateY(${(Math.cos(a) * -10).toFixed(1)}deg)`
          el.style.zIndex = String(10 + Math.round(depth * 5))
          el.style.filter = `brightness(${(0.9 + depth * 0.1 + (hover.current === i ? 0.18 : 0)).toFixed(3)})`
        }
        // the gold rod from the engine to the bubble's pedestal
        const ex = x, ey = y + 22
        const dx = ex - C.x, dy = ey - C.y, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L
        const sx = C.x + ux * 128, sy = C.y + uy * 128, tx = ex - ux * 62, ty = ey - uy * 52
        const g = rods.current[i]
        if (g) g.querySelectorAll('line').forEach(l => { l.setAttribute('x1', sx.toFixed(1)); l.setAttribute('y1', sy.toFixed(1)); l.setAttribute('x2', tx.toFixed(1)); l.setAttribute('y2', ty.toFixed(1)) })
        const p = packets.current[i]
        if (p) {
          const k = still ? 0.5 : ((t / 1000) * 0.55 + i / NODES.length) % 1
          p.setAttribute('cx', (sx + (tx - sx) * k).toFixed(1))
          p.setAttribute('cy', (sy + (ty - sy) * k).toFixed(1))
          p.setAttribute('opacity', (Math.sin(k * Math.PI) * (hover.current === i ? 1 : 0.85)).toFixed(2))
        }
      })
      if (on && !still) raf = requestAnimationFrame(place)
    }
    state.current.last = 0
    raf = requestAnimationFrame(place)
    return () => cancelAnimationFrame(raf)
  }, [on])

  const setHover = (i: number) => { hover.current = i; setHot(i) }

  return (
    <section className={`nt-stage nt-hero${on ? ' on' : ''}`} ref={ref} aria-labelledby="nt-h1">
      <Skin name="hero" priority />
      <div className="nt-in">
        <h1 className="sr-only" id="nt-h1">The marketing engine for real business growth.</h1>
        <p className="sr-only">AI-powered marketing studio, Auckland. Strategy, creative, media and AI automation — all in one connected system, built to win in New Zealand.</p>

        {/* the wooden panel's frame and the services card: running light */}
        <svg className="nt-frame" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
          <defs>
            <linearGradient id="ntRun" x1="0" x2="1"><stop offset="0" stopColor="#fff3c4" stopOpacity="0" /><stop offset=".5" stopColor="#fff1c0" /><stop offset="1" stopColor="#ffb648" stopOpacity="0" /></linearGradient>
            <filter id="ntSoft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="4" /></filter>
          </defs>
          <path className="run a" pathLength={1} d="M600 108 Q 586 104 580 124 L 520 610 Q 514 680 560 690 L 1490 708 Q 1528 708 1534 676 L 1606 136 Q 1610 98 1574 96 Z" />
          <path className="run b" pathLength={1} filter="url(#ntSoft)" d="M600 108 Q 586 104 580 124 L 520 610 Q 514 680 560 690 L 1490 708 Q 1528 708 1534 676 L 1606 136 Q 1610 98 1574 96 Z" />
          <rect className="run c" pathLength={1} x="527" y="396" width="242" height="252" rx="18" />
          <rect className="run d" pathLength={1} x="80" y="142" width="400" height="34" rx="17" />
        </svg>

        {/* growth engine: orbit tracks, rods, packets */}
        <svg className="nt-net" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
          <defs>
            <radialGradient id="ntPk"><stop offset="0" stopColor="#fff" /><stop offset=".35" stopColor="#ffe7a8" /><stop offset=".7" stopColor="#ffb547" stopOpacity=".5" /><stop offset="1" stopColor="#ffb547" stopOpacity="0" /></radialGradient>
            <linearGradient id="ntRod" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffe3a0" /><stop offset=".5" stopColor="#c8892f" /><stop offset="1" stopColor="#6b4314" /></linearGradient>
            <mask id="ntBehind"><rect width={W} height={H} fill="#fff" /><path d={`M${C.x - 123.4} ${C.y + 12} A124 124 0 0 1 ${C.x + 123.4} ${C.y + 12} Z`} fill="#000" /></mask>
          </defs>
          <ellipse className="track" cx={C.x} cy={C.y + 22} rx={ORB.rx} ry={ORB.ry} />
          <ellipse className="track t2" cx={C.x} cy={C.y + 22} rx={ORB.rx + 26} ry={ORB.ry + 20} />
          {NODES.map((n, i) => (
            <g key={n.id} ref={el => { rods.current[i] = el }} className={`rod${hot === i ? ' on' : ''}`} style={{ '--c': n.c } as CSSProperties}>
              <line className="rod-s" /><line className="rod-g" /><line className="rod-h" /><line className="rod-hot" />
            </g>
          ))}
          {NODES.map((n, i) => <circle key={n.id} ref={el => { packets.current[i] = el }} r="9" fill="url(#ntPk)" opacity="0" />)}
          {/* the engine's orbital rings: back halves are hidden behind the sphere */}
          <g className="eng-rings">
            <g className="er er1"><ellipse className="er-back" cx={C.x} cy={C.y + 12} rx="176" ry="50" mask="url(#ntBehind)" /><path className="er-front" d={`M${C.x - 176} ${C.y + 12} A176 50 0 0 0 ${C.x + 176} ${C.y + 12}`} /></g>
            <g className="er er2"><ellipse className="er-back" cx={C.x} cy={C.y + 12} rx="206" ry="44" transform={`rotate(24 ${C.x} ${C.y + 12})`} /></g>
            <ellipse className="er-run" cx={C.x} cy={C.y + 12} rx="176" ry="50" pathLength={1} mask="url(#ntBehind)" />
          </g>
        </svg>
        <i className="nt-sphere" style={box(C.x - 124, C.y - 124, 248, 248)} aria-hidden="true"><b /></i>

        {/* the eight orbiting service bubbles */}
        <div className="nt-nodes">
          {NODES.map((n, i) => (
            <button key={n.id} type="button" ref={el => { nodeEls.current[i] = el }} className={`nt-node${hot === i ? ' on' : ''}`}
              style={{ ...box(n.x - 90, n.y - 75, 180, 155), '--c': n.c } as CSSProperties}
              aria-label={`${n.label}: see what's included`}
              onPointerEnter={() => setHover(i)} onPointerLeave={() => setHover(-1)} onFocus={() => setHover(i)} onBlur={() => setHover(-1)}
              onClick={() => openService(n.id)}>
              <svg className="nt-label" viewBox="0 0 180 155" aria-hidden="true">
                <path id={`ntArc${i}`} d="M18 52 A78 66 0 0 1 162 52" fill="none" />
                <text><textPath href={`#ntArc${i}`} startOffset="50%" textAnchor="middle">{n.label.toUpperCase()}</textPath></text>
              </svg>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/home2/node-${n.img ?? n.id}.webp`} alt="" draggable={false} />
              <i className="nt-node-glow" />
            </button>
          ))}
        </div>

        {/* site navigation and calls to action, on top of the artwork */}
        <nav className="nt-nav" aria-label="Main">
          <Link href="/" className="nt-hit nt-logo" style={box(92, 16, 222, 66)} aria-label="NEXTXEN home" />
          {([['/#services', 'Services', 782, 72], ['/industries', 'Industries', 901, 84], ['/#work', 'Results', 1030, 64], ['/#pricing', 'Pricing', 1142, 62], ['/blog', 'Journal', 1248, 64]] as [string, string, number, number][]).map(([href, l, x, w]) => (
            <Link key={l} href={href} className="nt-hit nt-link" style={box(x, 26, w, 32)}><span className="sr-only">{l}</span></Link>
          ))}
          <Link href="/contact" className="nt-hit nt-pill gold" style={box(1405, 19, 178, 48)}><span className="sr-only">Book a call</span><i className="nt-sweep" /></Link>
        </nav>
        <Link href="/contact" className="nt-hit nt-pill gold" style={box(59, 552, 229, 46)}><span className="sr-only">Book a free strategy call</span><i className="nt-sweep" /></Link>
        <a href="#nt-services" className="nt-hit nt-pill ghost" style={box(306, 553, 163, 41)}><span className="sr-only">Explore services</span></a>
        <Link href="/contact" className="nt-hit nt-pill ghost" style={box(1262, 125, 150, 41)}><span className="sr-only">Book a call</span></Link>
        <Link href="/blog" className="nt-hit nt-pill ghost round" style={box(1429, 120, 46, 46)}><span className="sr-only">Search the Journal</span></Link>
        <a href="#nt-services" className="nt-hit nt-pill ghost round" style={box(1494, 120, 46, 46)}><span className="sr-only">Browse all services</span></a>

        {/* process steps: a signal runs 01 → 04 */}
        <ol className="sr-only">{STEPS.map((s, i) => <li key={s.title}>{`0${i + 1} ${s.title}, ${s.when}`}</li>)}</ol>
        {[91, 205, 320, 436].map((x, i) => <i key={x} className="nt-step" style={{ ...box(x - 29, 616, 58, 58), '--i': i } as CSSProperties} aria-hidden="true" />)}
        <i className="nt-flame" style={box(340, 800, 70, 90)} aria-hidden="true" />
        <i className="nt-ped" style={box(470, 708, 1130, 150)} aria-hidden="true" />
      </div>
    </section>
  )
}

/* ═════════════════════════════ 2 · WHY ═════════════════════════════ */
const WHY = [
  { x: 180, w: 422, c: '#7dff6a', c2: '#20e3b2', k: 'Intelligence', t: 'AI-first, human-led', d: 'We use AI to automate the busywork, personalise every touchpoint and move faster than traditional agencies, with senior people making the calls.', a: 'Always on', ad: 'AI assistants answer enquiries at 3am, campaigns optimise overnight and content publishes on schedule.' },
  { x: 617, w: 430, c: '#3aa2ff', c2: '#38e6ff', k: 'Local', t: 'Built for New Zealand', d: 'From Auckland to Invercargill, we know your customers, your competitors and what it takes to win in a small, word-of-mouth market.', a: 'Precision targeting', ad: 'Your message reaches the right people at the right moment, so budget goes to buyers rather than browsers.' },
  { x: 1062, w: 435, c: '#e05bff', c2: '#8f5bff', k: 'Accountable', t: 'Measured to the dollar', d: 'Every click, call and conversion is tracked, so you always know exactly what your investment is returning.', a: 'One team, end to end', ad: 'Brand, website, ads, content and automation under one roof. One strategy, one point of contact, one invoice.' },
]
function Why() {
  const [ref, on] = useOnScreen<HTMLElement>()
  return (
    <section className={`nt-stage nt-why${on ? ' on' : ''}`} ref={ref} aria-labelledby="nt-why-h" id="nt-why">
      <Skin name="why" />
      <div className="nt-in">
        <h2 className="sr-only" id="nt-why-h">Why NEXTXEN: we pair senior strategy with AI automation, so every dollar you put into marketing is tracked, tested and working harder for your business.</h2>
        <svg className="nt-why-fx" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
          <defs><filter id="ntWB" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="5" /></filter></defs>
          <rect className="pill-run" pathLength={1} x="652" y="27" width="370" height="50" rx="25" />
          <rect className="pill-run b" pathLength={1} x="290" y="62" width="1150" height="178" rx="89" />
          <path className="ul" d="M668 214 Q 800 204 935 210" pathLength={1} />
          {WHY.map((c, i) => (
            <g key={c.k} style={{ '--c': c.c, '--c2': c.c2, '--i': i } as CSSProperties}>
              <rect className="card-run" pathLength={1} x={c.x} y="266" width={c.w} height="526" rx="54" />
              <rect className="card-run blur" pathLength={1} x={c.x} y="266" width={c.w} height="526" rx="54" filter="url(#ntWB)" />
            </g>
          ))}
          <path className="plat-run" pathLength={1} d="M110 812 Q 100 780 160 776 L 1510 776 Q 1572 780 1562 812" />
        </svg>
        {WHY.map((c, i) => (
          <article key={c.k} className="nt-card" style={{ ...box(c.x, 266, c.w, 526), '--c': c.c, '--i': i } as CSSProperties}
            onPointerMove={e => { const r = e.currentTarget.getBoundingClientRect(); e.currentTarget.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`); e.currentTarget.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`) }}>
            <i className="nt-card-spot" aria-hidden="true" />
            <i className="nt-card-ic" aria-hidden="true" />
            <div className="sr-only"><p>{`0${i + 1} ${c.k}`}</p><h3>{c.t}</h3><p>{c.d}</p><p>{c.a}: {c.ad}</p></div>
          </article>
        ))}
        <i className="nt-heart" style={box(285, 20, 150, 150)} aria-hidden="true" />
        <i className="nt-heart r" style={box(1355, 105, 90, 90)} aria-hidden="true" />
        <span className="nt-motes" aria-hidden="true">{Array.from({ length: 14 }, (_, i) => <i key={i} style={{ '--k': i } as CSSProperties} />)}</span>
      </div>
    </section>
  )
}

/* ═══════════════════════════ 3 · SERVICES EXPLORER ═══════════════════════════ */
const TABS: [number, number][] = [[620, 113], [745, 79], [836, 121], [968, 109], [1088, 90], [1189, 103], [1303, 121], [1434, 130]]
const CAT_DOT: Record<string, string> = { build: '#3df58f', advertise: '#ff4f7b', grow: '#ff6bd5', automate: '#4fd8ff' }
const SUB: Record<string, string> = {
  website: 'Build · Design · Development', seo: 'Build · Search · Traffic', google: 'Advertise · Search · Intent', facebook: 'Advertise · Social · Leads',
  social: 'Grow · Audience · Community', content: 'Grow · Photo · Video', chatbot: 'Automate · 24/7 · Bookings', automation: 'Automate · Workflows · Reports',
}
const TILE_Y = [262, 378, 495, 612]
const TILE_H = [104, 106, 106, 110]

function Count({ to }: { to: number }) {
  const [v, setV] = useState(to)
  const from = useRef(to)
  useEffect(() => {
    const start = from.current, t0 = performance.now(), dur = 700
    let raf = 0
    if (reduced()) { from.current = to; raf = requestAnimationFrame(() => setV(to)); return () => cancelAnimationFrame(raf) }
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3)
      setV(Math.round(start + (to - start) * e))
      if (k < 1) raf = requestAnimationFrame(step); else from.current = to
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [to])
  return <>{v}</>
}

function Explorer() {
  const [ref, on] = useOnScreen<HTMLElement>()
  const [svcIdx, setSvcIdx] = useState(0)
  const [cardIdx, setCardIdx] = useState(2)
  const [ask, setAsk] = useState('')
  const s = coreServices[svcIdx]
  const title = s.svc.title.split(' —')[0]
  const cards: { icon: IconName; value: number; label: ReactNode; aria: string; items: string[] }[] = [
    { icon: 'checkCircle', value: s.svc.feats.length, label: <>Deliverables in<br />{s.short}</>, aria: `Deliverables in ${s.short}`, items: s.svc.feats },
    { icon: 'building', value: COUNTS.industries, label: null, aria: 'Industries we serve', items: industryNames },
    { icon: 'sparkle', value: COUNTS.services, label: null, aria: 'Services in total', items: serviceNames },
    { icon: 'card', value: COUNTS.plans, label: null, aria: 'Pricing plans', items: PLANS.map(p => `${p.name} · ${p.price === 'Custom' ? 'Custom pricing' : `${p.price}/mo`}`) },
  ]
  const card = cards[cardIdx]
  const n = card.items.length, gap = n > 14 ? 26.3 : n > 9 ? 30 : 34
  const y0 = 494 - ((n - 1) * gap) / 2
  const fromY = TILE_Y[cardIdx] + TILE_H[cardIdx] / 2
  const go = (d: number) => setSvcIdx(i => (i + d + coreServices.length) % coreServices.length)
  const send = (e: FormEvent) => {
    e.preventDefault()
    const q = ask.trim()
    window.location.assign(`mailto:hello@nextxen.co.nz?subject=${encodeURIComponent(`Question about ${title}`)}${q ? `&body=${encodeURIComponent(q)}` : ''}`)
  }
  const longest = Math.max(...card.items.map(t => t.length))
  const listFs = longest > 30 ? 13.2 : longest > 24 ? 14.2 : 15.4
  const [tx, tw] = TABS[svcIdx]

  return (
    <section className={`nt-stage nt-svc${on ? ' on' : ''}`} ref={ref} id="nt-services" aria-labelledby="nt-svc-h">
      <Skin name="services" />
      <div className="nt-in">
        <h2 className="sr-only" id="nt-svc-h">Services: everything you need to grow, in one connected system.</h2>

        {/* tabs */}
        <div className="nt-tabs" role="tablist" aria-label="Core services">
          <i className="nt-tab-hl" style={box(tx, 190, tw, 38)} aria-hidden="true" />
          {coreServices.map((c, i) => (
            <button key={c.id} type="button" role="tab" aria-selected={i === svcIdx} className={`nt-tab${i === svcIdx ? ' on' : ''}`}
              style={{ ...box(TABS[i][0], 190, TABS[i][1], 38), ...fs(14.4), '--dot': CAT_DOT[c.cat] } as CSSProperties} onClick={() => setSvcIdx(i)}>
              <i />{c.short}
            </button>
          ))}
        </div>

        {/* crystal orb: icon, rings, rising sparks */}
        <svg className="nt-orb-fx" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
          <defs><filter id="ntOG" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="3" /></filter></defs>
          <g className="orb-r r1"><ellipse cx="322" cy="418" rx="168" ry="62" pathLength={1} transform="rotate(-12 322 418)" /></g>
          <g className="orb-r r2"><ellipse cx="322" cy="410" rx="150" ry="132" pathLength={1} transform="rotate(30 322 410)" /></g>
          <g className="orb-r r3" filter="url(#ntOG)"><ellipse cx="322" cy="418" rx="168" ry="62" pathLength={1} transform="rotate(-12 322 418)" /></g>
        </svg>
        <i className="nt-orb-sheen" style={box(222, 312, 210, 210)} aria-hidden="true" />
        <span className="nt-orb-ic" key={`ic${svcIdx}`} style={box(330 - 40, 422 - 40, 80, 80)} aria-hidden="true"><Icon name={s.icon} size={64} stroke={1.5} /></span>
        <span className="nt-sparks" style={box(240, 470, 180, 120)} aria-hidden="true">{Array.from({ length: 10 }, (_, i) => <i key={i} style={{ '--k': i } as CSSProperties} />)}</span>
        {/* the orb's wires to the tiles: light flows out to each tile */}
        <svg className="nt-wires" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
          {[`M455 380 C 500 370 486 312 528 312`, `M478 420 C 505 420 500 430 528 430`, `M470 470 C 500 490 495 548 528 548`, `M430 520 C 480 560 470 664 528 664`].map((d, i) => (
            <path key={i} d={d} className={`wire${i === cardIdx ? ' on' : ''}`} pathLength={1} style={{ '--i': i } as CSSProperties} />
          ))}
        </svg>

        <p className="nt-t nt-svc-name" key={`n${svcIdx}`} style={{ ...box(170, title.length > 16 ? 622 : 614, 312), ...fs(title.length > 16 ? 28 : 35) }} aria-live="polite">{title}</p>
        <p className="nt-t nt-svc-sub" style={{ ...box(185, 664, 282), ...fs(12.6) }}>{SUB[s.id]}</p>
        <button type="button" className="nt-hit nt-round" style={box(212, 706, 42, 42)} onClick={() => go(-1)} aria-label="Previous service" />
        <span className="nt-t nt-pager" style={{ ...box(270, 714, 112), ...fs(17) }}>{String(svcIdx + 1).padStart(2, '0')} / {String(coreServices.length).padStart(2, '0')}</span>
        <button type="button" className="nt-hit nt-round" style={box(396, 706, 42, 42)} onClick={() => go(1)} aria-label="Next service" />

        {/* stat tiles */}
        {cards.map((c, i) => (
          <button key={i} type="button" className={`nt-tile${i === cardIdx ? ' on' : ''}`} style={{ ...box(528, TILE_Y[i], 236, TILE_H[i]), '--i': i } as CSSProperties}
            aria-pressed={i === cardIdx} aria-label={`${c.value} ${c.aria}: show the list`} onClick={() => setCardIdx(i)}>
            {i === 0 && <span className="nt-tile-txt"><b style={fs(42)}><Count to={c.value} /></b><small style={fs(15.4)}>{c.label}</small></span>}
          </button>
        ))}

        {/* fan of light from the active tile to its list */}
        <svg className="nt-fan" viewBox={`0 0 ${W} ${H}`} key={`f${cardIdx}-${svcIdx}`} aria-hidden="true">
          <defs><radialGradient id="ntFp"><stop offset="0" stopColor="#fff" /><stop offset=".4" stopColor="#ffd98a" /><stop offset="1" stopColor="#f0a83c" stopOpacity="0" /></radialGradient></defs>
          <circle className="fan-src" cx="764" cy={fromY} r="7" />
          {card.items.map((_, i) => {
            const y = y0 + i * gap
            const d = `M764 ${fromY} C 822 ${fromY} 812 ${y} 866 ${y}`
            return (
              <g key={i} style={{ '--k': i } as CSSProperties}>
                <path d={d} className="fan-line" pathLength={1} />
                <path d={d} className="fan-flow" pathLength={1} />
                <circle r="3" className="fan-dot" cx="869" cy={y} />
                <circle r="5" fill="url(#ntFp)" className="fan-pk">
                  <animateMotion path={d} dur="2.4s" begin={`${(i * 0.13).toFixed(2)}s`} repeatCount="indefinite" />
                </circle>
              </g>
            )
          })}
        </svg>
        <ul className="nt-list" aria-label={card.aria}>
          {card.items.map((it, i) => (
            <li key={`${cardIdx}-${it}`} className="nt-t" style={{ ...box(886, y0 + i * gap - 11, 200), ...fs(listFs), '--k': i } as CSSProperties} title={it}>{it}</li>
          ))}
        </ul>

        {/* detail card */}
        <span className="nt-dic" key={`d${svcIdx}`} style={box(1152, 278, 36, 36)} aria-hidden="true"><Icon name={s.icon} size={24} stroke={1.9} /></span>
        <i className="nt-active" style={box(1415, 276, 112, 38)} aria-hidden="true" />
        <h3 className="nt-t nt-d-title" key={`t${svcIdx}`} style={{ ...box(1142, 323, 360), ...fs(title.length > 18 ? 27 : 34) }}>{title}</h3>
        <p className="nt-t nt-d-desc" style={{ ...box(1143, 370, 362), ...fs(16.2) }}>{s.svc.shortDesc}</p>
        <p className="nt-t nt-d-inc" style={{ ...box(1368, 447), ...fs(30) }}><Count to={s.svc.feats.length} /><small style={fs(17)}> deliverables</small></p>
        <p className="nt-t nt-d-cat" style={{ ...box(1167, 530), ...fs(28) }}>{s.catName}</p>
        <p className="sr-only">Plans from {PLANS[0].price} per month. Onboarding {STEPS[2].when}.</p>
        <button type="button" className="nt-hit nt-link-u" style={box(1140, 590, 236, 28)} onClick={() => openService(s.id)} aria-label={`See everything included in ${s.short}`} />
        <form className="nt-ask" onSubmit={send} style={box(1134, 630, 386, 56)}>
          <label className="sr-only" htmlFor="nt-ask">Ask Xen about {s.short}</label>
          <input id="nt-ask" value={ask} onChange={e => setAsk(e.target.value)} placeholder={`Ask Xen about ${s.short}…`} style={fs(17.4)} autoComplete="off" />
          <button type="submit" aria-label="Send question by email" />
        </form>
        <i className="nt-ped2" style={box(180, 755, 1320, 110)} aria-hidden="true" />
      </div>
    </section>
  )
}

// the space between two stages: a lit mountain ridge from the reference and a soft haze
function Ridge({ n, href }: { n: 1 | 2; href: string }) {
  return (
    <div className={`nt-gap g${n}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/home2/ridge-${n}.webp`} alt="" className="nt-ridge" loading="lazy" draggable={false} />
      <i className="nt-gap-line" aria-hidden="true" />
      <a href={href} className="nt-chev" aria-label="Next section"><Icon name="arrow" size={17} /></a>
    </div>
  )
}

export default function HomeTop() {
  return (
    <div className="nt-flow">
      <i className="nt-sky" aria-hidden="true" />
      <i className="nt-stars" aria-hidden="true" />
      <Hero />
      <Ridge n={1} href="#nt-why" />
      <Why />
      <Ridge n={2} href="#nt-services" />
      <Explorer />
    </div>
  )
}
