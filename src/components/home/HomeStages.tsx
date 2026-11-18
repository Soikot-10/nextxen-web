'use client'
import { useEffect, useMemo, useRef, useState, type CSSProperties, type FormEvent, type ReactNode } from 'react'
import Link from 'next/link'
import Icon, { type IconName } from '@/components/Icon'
import { openService } from '@/components/three/sceneStore'
import { COUNTS, PLANS, STEPS, coreServices, industryNames, serviceNames } from '@/components/v5/data'
import BrandLogo from '@/components/brand/BrandLogo'

// New homepage, sections 1–3, matched to the owner's references
// (_review/reference/home/1-hero.png, 2-why.png, 3-services.png). Each reference is
// the visual skin (baked text removed where live content sits) and everything you
// read or click is real HTML on the exact spot it occupies in the artwork.
// Coordinates are reference pixels (1672 × 941); sizes scale with the stage.

const W = 1672, H = 941
const box = (x: number, y: number, w?: number, h?: number): CSSProperties => ({
  left: `${(x / W) * 100}%`, top: `${(y / H) * 100}%`,
  ...(w !== undefined ? { width: `${(w / W) * 100}%` } : {}),
  ...(h !== undefined ? { height: `${(h / H) * 100}%` } : {}),
})
const fs = (px: number): CSSProperties => ({ fontSize: `calc(var(--u) * ${px})` })

function Skin({ name, priority = false }: { name: string; priority?: boolean }) {
  return (
    <picture className="hx-skin">
      <source type="image/webp" srcSet={`/home/${name}.webp 1672w, /home/${name}@2x.webp 3344w`} sizes="(min-width: 1672px) 1672px, 100vw" />
      <img src={`/home/${name}@2x.webp`} alt="" width={W} height={H} loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'} />
    </picture>
  )
}
const Sheen = ({ name, cls = '' }: { name: string; cls?: string }) => (
  <i className={`hx-sheen ${cls}`} style={{ maskImage: `url(/home/${name}-gold.png)`, WebkitMaskImage: `url(/home/${name}-gold.png)` }} aria-hidden="true" />
)

/* pause SVG/CSS animation while a stage is off screen */
function useOnScreen<T extends Element>() {
  const ref = useRef<T>(null)
  const [on, setOn] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting), { rootMargin: '120px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return [ref, on] as const
}

/* ─────────────────────────── 1 · HERO ─────────────────────────── */
const ENGINE = { x: 1113, y: 433 }
// node centres in the artwork, in the order of the site's core services
const NODES: { id: string; x: number; y: number; c: string }[] = [
  { id: 'website', x: 1105, y: 214, c: '#5dff8a' },
  { id: 'seo', x: 1308, y: 272, c: '#5dff8a' },
  { id: 'google', x: 1400, y: 420, c: '#c08bff' },
  { id: 'facebook', x: 1334, y: 565, c: '#5aa8ff' },
  { id: 'social', x: 1113, y: 632, c: '#c08bff' },
  { id: 'content', x: 910, y: 569, c: '#c08bff' },
  { id: 'chatbot', x: 842, y: 420, c: '#4ff0e0' },
  { id: 'automation', x: 897, y: 283, c: '#5aa8ff' },
]
const DUR = 2.6

function Signals({ hover }: { hover: number }) {
  const lines = useMemo(() => NODES.map((n, i) => {
    const dx = n.x - ENGINE.x, dy = n.y - ENGINE.y, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L
    const sx = ENGINE.x + ux * 116, sy = ENGINE.y + uy * 116, ex = n.x - ux * 46, ey = n.y - uy * 46
    // a jagged lightning polyline along the connector (deterministic jitter)
    const pts: string[] = []
    for (let k = 0; k <= 9; k++) {
      const t = k / 9, j = k === 0 || k === 9 ? 0 : Math.sin(i * 12.9 + k * 78.2) * 9
      pts.push(`${(sx + (ex - sx) * t - uy * j).toFixed(1)},${(sy + (ey - sy) * t + ux * j).toFixed(1)}`)
    }
    return { ...n, d: `M${sx.toFixed(1)} ${sy.toFixed(1)} L${ex.toFixed(1)} ${ey.toFixed(1)}`, sx, sy, ex, ey, bolt: pts.join(' '), begin: (i * 0.33).toFixed(2) }
  }), [])
  return (
    <svg className="hx-sig" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
      <defs>
        <radialGradient id="hxPk"><stop offset="0" stopColor="#fff" /><stop offset=".35" stopColor="#fff2c2" /><stop offset=".7" stopColor="#f6c46a" stopOpacity=".55" /><stop offset="1" stopColor="#f6c46a" stopOpacity="0" /></radialGradient>
        <radialGradient id="hxPkT"><stop offset="0" stopColor="#e8fffb" /><stop offset=".4" stopColor="#7ff8ea" stopOpacity=".8" /><stop offset="1" stopColor="#00e5c8" stopOpacity="0" /></radialGradient>
        <radialGradient id="hxFl"><stop offset="0" stopColor="#fff" stopOpacity=".95" /><stop offset=".3" stopColor="#ffe9b0" stopOpacity=".55" /><stop offset="1" stopColor="#f6c46a" stopOpacity="0" /></radialGradient>
        <filter id="hxGlow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>
      {/* engine ring: a light running around the orbital ring */}
      <ellipse className="hx-ring" cx={ENGINE.x} cy={ENGINE.y + 6} rx="172" ry="44" />
      <ellipse className="hx-ring b" cx={ENGINE.x} cy={ENGINE.y + 6} rx="172" ry="44" />
      {lines.map((l, i) => (
        <g key={l.id} className={`hx-line${hover === i ? ' on' : ''}`} style={{ '--c': l.c } as CSSProperties}>
          <path d={l.d} className="hx-wire" />
          <polyline points={l.bolt} className="hx-bolt" filter="url(#hxGlow)">
            <animate attributeName="opacity" values="0;0;.95;.15;.8;0;0" keyTimes="0;.18;.24;.3;.36;.44;1" dur={`${DUR}s`} begin={`${l.begin}s`} repeatCount="indefinite" />
          </polyline>
          {/* the energy packet and its spark trail */}
          {[0, .05, .1, .15].map((lag, k) => (
            <circle key={k} r={k ? 7.5 - k * 1.5 : 15} fill={k % 2 ? 'url(#hxPkT)' : 'url(#hxPk)'} opacity="0">
              <animateMotion path={l.d} dur={`${DUR}s`} begin={`${(+l.begin + lag).toFixed(2)}s`} repeatCount="indefinite" keyPoints="0;1;1" keyTimes="0;.62;1" calcMode="linear" />
              <animate attributeName="opacity" values={`0;${k ? .9 - k * .2 : 1};${k ? .9 - k * .2 : 1};0;0`} keyTimes="0;.04;.58;.63;1" dur={`${DUR}s`} begin={`${(+l.begin + lag).toFixed(2)}s`} repeatCount="indefinite" />
            </circle>
          ))}
          {/* arrival: the node flashes and its orb pulses */}
          <circle cx={l.x} cy={l.y} r="64" fill="url(#hxFl)" opacity="0" className="hx-flash">
            <animate attributeName="opacity" values="0;0;1;0;0" keyTimes="0;.6;.66;.86;1" dur={`${DUR}s`} begin={`${l.begin}s`} repeatCount="indefinite" />
            <animate attributeName="r" values="40;40;72;58;40" keyTimes="0;.6;.68;.86;1" dur={`${DUR}s`} begin={`${l.begin}s`} repeatCount="indefinite" />
          </circle>
          <circle cx={l.x} cy={l.y} r="50" className="hx-halo" />
        </g>
      ))}
    </svg>
  )
}

function Hero() {
  const [ref, on] = useOnScreen<HTMLDivElement>()
  const [hover, setHover] = useState(-1)
  const svgHost = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const svg = svgHost.current?.querySelector('svg') as SVGSVGElement | null
    if (!svg) return
    if (on && !matchMedia('(prefers-reduced-motion: reduce)').matches) svg.unpauseAnimations(); else svg.pauseAnimations()
  }, [on])
  const core = coreServices
  return (
    <section className="hx-stage hx-hero" ref={ref} aria-labelledby="hx-h1">
      <Skin name="hero" priority />
      <div className="hx-in" ref={svgHost}>
        <Signals hover={hover} />
        <Sheen name="hero" />
        <i className="hx-ped" aria-hidden="true" />

        <nav className="hx-nav" aria-label="Main">
          <Link href="/" className="hx-logo" style={box(80, 12, 240, 66)} aria-label="NEXTXEN home"><BrandLogo size={56} /></Link>
          {([['/#services', 'Services', 793], ['/industries', 'Industries', 918], ['/#work', 'Results', 1054], ['/#pricing', 'Pricing', 1168], ['/blog', 'Journal', 1280]] as [string, string, number][]).map(([href, l, x]) => (
            <Link key={l} href={href} className="hx-link" style={{ ...box(x, 22, undefined, 32), ...fs(18.4) }}>{l}</Link>
          ))}
          <Link href="/contact" className="hx-book" style={box(1415, 17, 185, 50)}><span style={fs(19)}>Book a call</span><i className="hx-btn-sheen" /></Link>
        </nav>

        <p className="hx-t pill" style={{ ...box(82, 128, 404, 38), ...fs(13.4) }}>AI-powered marketing studio · Auckland</p>
        <h1 className="hx-t h1" id="hx-h1" style={{ ...box(88, 184), ...fs(60) }}>
          The marketing<br />engine for<br /><em>real business<br />growth.</em>
        </h1>
        <p className="hx-t sub" style={{ ...box(80, 452, 395), ...fs(17.6) }}>Strategy, creative, media and AI automation — all in one connected system, built to win in New Zealand.</p>
        <Link href="/contact" className="hx-btn gold" style={box(66, 555, 227, 47)}><span style={fs(13.2)}>Book a free strategy call</span><i className="hx-btn-sheen" /></Link>
        <a href="#hx-services" className="hx-btn ghost" style={box(305, 557, 154, 42)}><span style={fs(13)}>Explore services</span></a>
        <ol className="sr-only">{STEPS.map((s, i) => <li key={s.title}>{`0${i + 1} ${s.title}, ${s.when}`}</li>)}</ol>
        <span className="hx-t fix" style={{ ...box(612, 546), ...fs(9.4) }}>AI Chatbots · AI Automation</span>
        <p className="sr-only">Services: Build (Websites, SEO), Advertise (Google Ads, Meta Ads), Grow (Social, Content), Automate (AI Chatbots, AI Automation). {COUNTS.core} core services, {COUNTS.services} services in total.</p>

        <Link href="/contact" className="hx-hit sq" style={box(1265, 120, 148, 42)} aria-label="Book a call" />
        <Link href="/blog" className="hx-hit round" style={box(1432, 117, 46, 46)} aria-label="Search the Journal" />
        <a href="#hx-services" className="hx-hit round" style={box(1496, 117, 46, 46)} aria-label="Browse all services" />
        {NODES.map((n, i) => (
          <button key={n.id} type="button" className="hx-hit node" style={box(n.x - 58, n.y - 58, 116, 116)} aria-label={`${core[i].short}: see what's included`}
            onPointerEnter={() => setHover(i)} onPointerLeave={() => setHover(-1)} onFocus={() => setHover(i)} onBlur={() => setHover(-1)} onClick={() => openService(n.id)} />
        ))}
      </div>
    </section>
  )
}

/* ─────────────────────────── 2 · WHY ─────────────────────────── */
const WHY = [
  { x: 237, c: '#a6ff3a', k: 'Intelligence', t: 'AI-first, human-led', d: 'We use AI to automate the busywork, personalise every touchpoint and move faster than traditional agencies, with senior people making the calls.', a: 'Always on', ad: 'AI assistants answer enquiries at 3am, campaigns optimise overnight and content publishes on schedule.' },
  { x: 651, c: '#2ff3e0', k: 'Local', t: 'Built for New Zealand', d: 'From Auckland to Invercargill, we know your customers, your competitors and what it takes to win in a small, word-of-mouth market.', a: 'Precision targeting', ad: 'Your message reaches the right people at the right moment, so budget goes to buyers rather than browsers.' },
  { x: 1062, c: '#c47bff', k: 'Accountable', t: 'Measured to the dollar', d: 'Every click, call and conversion is tracked, so you always know exactly what your investment is returning.', a: 'One team, end to end', ad: 'Brand, website, ads, content and automation under one roof. One strategy, one point of contact, one invoice.' },
]
function Why() {
  const [ref, on] = useOnScreen<HTMLElement>()
  return (
    <section className={`hx-stage hx-why${on ? ' on' : ''}`} ref={ref} aria-labelledby="hx-why">
      <Skin name="why" />
      <div className="hx-in">
        <Sheen name="why" cls="slow" />
        <h2 className="sr-only" id="hx-why">Why NEXTXEN: we pair senior strategy with AI automation, so every dollar you put into marketing is tracked, tested and working harder for your business.</h2>
        {WHY.map((c, i) => (
          <article key={c.k} className="hx-card" style={{ ...box(c.x, 243, 385, 515), '--c': c.c, '--i': i } as CSSProperties}>
            <span className="hx-orbring" style={{ left: `${((c.x + 190 - c.x) / 385) * 100}%` }} aria-hidden="true" />
            <i className="hx-card-glow" aria-hidden="true" />
            <i className="hx-card-sheen" aria-hidden="true" />
            <div className="sr-only"><p>{`0${i + 1} ${c.k}`}</p><h3>{c.t}</h3><p>{c.d}</p><p>{c.a}: {c.ad}</p></div>
          </article>
        ))}
      </div>
    </section>
  )
}

/* ─────────────────────────── 3 · SERVICES EXPLORER ─────────────────────────── */
const TABS: [number, number][] = [[625, 108], [749, 70], [836, 117], [970, 105], [1090, 83], [1189, 97], [1299, 115], [1428, 123]]
const CAT_DOT: Record<string, string> = { build: '#2ff3e0', advertise: '#ff4fa3', grow: '#a66bff', automate: '#4fb6ff' }
const TILE_Y = [263, 378, 493, 612]
const TILE_H = [125, 124, 129, 131]

function Count({ to }: { to: number }) {
  const [v, setV] = useState(to)
  const from = useRef(to)
  useEffect(() => {
    const start = from.current, t0 = performance.now(), dur = 700
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { from.current = to; requestAnimationFrame(() => setV(to)); return }
    let raf = 0
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
  const cards: { icon: IconName; value: number; label: ReactNode; items: string[] }[] = [
    { icon: 'checkCircle', value: s.svc.feats.length, label: <>Deliverables in<br />{s.short}</>, items: s.svc.feats },
    { icon: 'building', value: COUNTS.industries, label: <>Industries we<br />serve</>, items: industryNames },
    { icon: 'sparkle', value: COUNTS.services, label: <>Services in<br />total</>, items: serviceNames },
    { icon: 'card', value: COUNTS.plans, label: <>Pricing<br />plans</>, items: PLANS.map(p => `${p.name} · ${p.price === 'Custom' ? 'Custom pricing' : `${p.price}/mo`}`) },
  ]
  const card = cards[cardIdx]
  const n = card.items.length, gap = 26.3
  const y0 = 505 - ((n - 1) * gap) / 2
  const fromY = TILE_Y[cardIdx] + TILE_H[cardIdx] / 2
  const go = (d: number) => setSvcIdx(i => (i + d + coreServices.length) % coreServices.length)
  const send = (e: FormEvent) => {
    e.preventDefault()
    const q = ask.trim()
    const subject = encodeURIComponent(`Question about ${s.svc.title.split(' —')[0]}`)
    window.location.assign(`mailto:hello@nextxen.co.nz?subject=${subject}${q ? `&body=${encodeURIComponent(q)}` : ''}`)
  }
  const [tx, tw] = TABS[svcIdx]
  const title = s.svc.title.split(' —')[0]
  const long = title.length > 16
  const longest = Math.max(...card.items.map(t => t.length))
  const listFs = longest > 30 ? 13 : longest > 24 ? 14 : 15.2
  const cat = s.cat as keyof typeof CAT_DOT

  return (
    <section className={`hx-stage hx-svc${on ? ' on' : ''}`} ref={ref} id="hx-services" aria-labelledby="hx-svc-h">
      <Skin name="services" />
      <div className="hx-in">
        <Sheen name="services" cls="slow" />
        <h2 className="sr-only" id="hx-svc-h">Services: everything you need to grow, in one connected system.</h2>

        {/* tabs with a sliding glow indicator */}
        <div className="hx-tabs" role="tablist" aria-label="Core services">
          <i className="hx-tab-hl" style={box(tx, 203, tw, 36)} aria-hidden="true" />
          {coreServices.map((c, i) => (
            <button key={c.id} type="button" role="tab" aria-selected={i === svcIdx} className={`hx-tab${i === svcIdx ? ' on' : ''}`}
              style={{ ...box(TABS[i][0], 203, TABS[i][1], 36), ...fs(14.6), '--dot': CAT_DOT[c.cat] } as CSSProperties} onClick={() => setSvcIdx(i)}>
              <i />{c.short}
            </button>
          ))}
        </div>

        {/* orb, name, pager */}
        <span className="hx-orb" key={`o${svcIdx}`} style={box(160, 272, 356, 360)} aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/home/orb@2x.webp" alt="" />
          <span className="hx-orb-ic" style={{ left: `${((340 - 160) / 356) * 100}%`, top: `${((425 - 272) / 360) * 100}%` }}><Icon name={s.icon} size={64} stroke={1.6} /></span>
        </span>
        <svg className="hx-orb-rings" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
          <ellipse cx="334" cy="440" rx="166" ry="56" transform="rotate(-14 334 440)" />
          <ellipse cx="334" cy="440" rx="150" ry="140" transform="rotate(28 334 440)" className="b" />
        </svg>
        <p className={`hx-t svc-name${long ? ' long' : ''}`} key={`n${svcIdx}`} style={{ ...box(150, long ? 616 : 628, 380), ...fs(long ? 27 : 36) }} aria-live="polite">{title}</p>
        <p className="hx-t svc-tag" style={{ ...box(210, long ? 684 : 677, 260), ...fs(13.4) }}><i />{`${s.catName} · ${s.svc.cardTag}`}</p>
        <button type="button" className="hx-hit round" style={box(242, 720, 40, 40)} onClick={() => go(-1)} aria-label="Previous service" />
        <span className="hx-t pager" style={{ ...box(290, 728, 96), ...fs(17) }}>{String(svcIdx + 1).padStart(2, '0')} / {String(coreServices.length).padStart(2, '0')}</span>
        <button type="button" className="hx-hit round" style={box(392, 720, 40, 40)} onClick={() => go(1)} aria-label="Next service" />

        {/* stat tiles */}
        {cards.map((c, i) => (
          <button key={i} type="button" className={`hx-tile${i === cardIdx ? ' on' : ''}`} style={{ ...box(527, TILE_Y[i], 240, TILE_H[i]), '--i': i } as CSSProperties}
            aria-pressed={i === cardIdx} onClick={() => setCardIdx(i)}>
            <span className="hx-tile-ic" style={box(0, 0)}><Icon name={c.icon} size={20} /></span>
            <b style={fs(40)}><Count to={c.value} /></b>
            <small style={fs(15.4)}>{c.label}</small>
          </button>
        ))}

        {/* fan of gold lines from the active tile to its list */}
        <svg className="hx-fan" viewBox={`0 0 ${W} ${H}`} key={`f${cardIdx}-${svcIdx}`} aria-hidden="true">
          {card.items.map((_, i) => {
            const y = y0 + i * gap
            const d = `M760 ${fromY} C${820} ${fromY} ${818} ${y} ${876} ${y}`
            return (
              <g key={i} style={{ '--k': i } as CSSProperties}>
                <path d={d} className="fan-line" pathLength={1} />
                <circle r="2.6" className="fan-dot" cx="878" cy={y} />
                <circle r="3.4" className="fan-pulse">
                  <animateMotion path={d} dur="2.2s" begin={`${(i * 0.11).toFixed(2)}s`} repeatCount="indefinite" />
                </circle>
              </g>
            )
          })}
        </svg>
        <ul className="hx-list" aria-label={typeof card.label === 'string' ? card.label : 'Items'}>
          {card.items.map((it, i) => (
            <li key={`${cardIdx}-${it}`} className="hx-t" style={{ ...box(894, y0 + i * gap - 11, 200), ...fs(listFs), '--k': i } as CSSProperties} title={it}>{it}</li>
          ))}
        </ul>

        {/* detail card */}
        <span className="hx-dic" style={box(1150, 288, 40, 34)} aria-hidden="true"><Icon name={s.icon} size={22} stroke={1.9} /></span>
        <h3 className="hx-t d-title" key={`t${svcIdx}`} style={{ ...box(1143, title.length > 18 ? 342 : 336, 336), ...fs(title.length > 18 ? 24 : 32) }}>{title}</h3>
        <p className="hx-t d-desc" style={{ ...box(1145, 380, 330), ...fs(16.4) }}>{s.svc.shortDesc}</p>
        <p className="hx-t d-inc" style={{ ...box(1345, 456), ...fs(29) }}><Count to={s.svc.feats.length} /><small style={fs(17.5)}> deliverables</small></p>
        <p className="hx-t d-cat" style={{ ...box(1166, 541), ...fs(26) }}>{s.catName}</p>
        <p className="sr-only">Plans from {PLANS[0].price} per month. Onboarding {STEPS[2].when}.</p>
        <button type="button" className="hx-hit sq" style={box(1143, 593, 222, 28)} onClick={() => openService(s.id)} aria-label={`See everything included in ${s.short}`} />
        <form className="hx-ask" onSubmit={send} style={box(1135, 633, 362, 58)}>
          <label className="sr-only" htmlFor="hx-ask">Ask Xen about {s.short}</label>
          <input id="hx-ask" value={ask} onChange={e => setAsk(e.target.value)} placeholder={`Ask Xen about ${s.short}…`} style={fs(17.6)} />
          <button type="submit" aria-label="Send question by email" />
        </form>
        <i className={`hx-dot-anchor c-${cat}`} aria-hidden="true" />
      </div>
    </section>
  )
}

// the space between sections: teal haze, a gold light line and the chevron
function Gap({ href }: { href: string }) {
  return (
    <div className="hx-gap">
      <span className="hx-gap-haze" aria-hidden="true" />
      <a href={href} className="hx-chev" aria-label="Next section"><Icon name="arrow" size={18} /></a>
      <span className="hx-gap-line" aria-hidden="true" />
    </div>
  )
}

export default function HomeStages() {
  return (
    <div className="hx-flow">
      <div className="hx-silk" aria-hidden="true" />
      <Hero />
      <Gap href="#hx-why-anchor" />
      <span id="hx-why-anchor" />
      <Why />
      <Gap href="#hx-services" />
      <Explorer />
    </div>
  )
}
