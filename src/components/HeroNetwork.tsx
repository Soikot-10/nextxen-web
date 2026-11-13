'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Icon from '@/components/Icon'
import { services } from '@/data/services'

// The orbiting service network in the home hero: NEXTXEN core in the centre,
// services as 3D spheres on a tilted ring, glowing pulses along the links.

type Hub = { id: string; label: string; color: [number, number, number]; sats: Sat[] }
type Sat = { a: number; r: number; tilt: number; speed: number; size: number }

const HUBS: { id: string; label: string; color: [number, number, number] }[] = [
  { id: 'website', label: 'Websites', color: [214, 251, 65] },
  { id: 'seo', label: 'SEO', color: [111, 227, 255] },
  { id: 'google', label: 'Google Ads', color: [255, 210, 122] },
  { id: 'facebook', label: 'Meta Ads', color: [185, 162, 255] },
  { id: 'social', label: 'Social Growth', color: [240, 166, 216] },
  { id: 'content', label: 'Content', color: [127, 245, 201] },
  { id: 'chatbot', label: 'AI Chatbots', color: [111, 227, 255] },
  { id: 'automation', label: 'AI Automation', color: [214, 251, 65] },
]

type Pulse = { hub: number; t: number; speed: number; out: boolean }
type Dust = { x: number; y: number; z: number; v: number; s: number }

const rnd = (a: number, b: number) => a + Math.random() * (b - a)
const rgba = (c: [number, number, number], a: number) => `rgba(${c[0]},${c[1]},${c[2]},${a})`

export default function HeroNetwork() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<number | null>(null)
  const activeRef = useRef<number | null>(null)
  const pinnedRef = useRef(false)

  useEffect(() => { activeRef.current = active }, [active])

  useEffect(() => {
    const wrap = wrapRef.current!, cv = canvasRef.current!
    const ctx = cv.getContext('2d')!
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const font = getComputedStyle(document.body).fontFamily

    const hubs: Hub[] = HUBS.map(h => ({
      ...h,
      sats: Array.from({ length: 4 + Math.floor(Math.random() * 3) }, () => ({
        a: rnd(0, Math.PI * 2), r: rnd(0.16, 0.3), tilt: rnd(-0.9, 0.9), speed: rnd(0.15, 0.4) * (Math.random() < 0.5 ? -1 : 1), size: rnd(1.6, 3.2),
      })),
    }))
    const pulses: Pulse[] = []
    const dust: Dust[] = Array.from({ length: 140 }, () => ({ x: rnd(-1.6, 1.6), y: rnd(-1, 1), z: rnd(-1.4, 1.4), v: rnd(0.004, 0.02), s: rnd(0.4, 1.4) }))
    const halo = Array.from({ length: 220 }, () => ({ a: rnd(0, Math.PI * 2), r: rnd(1.15, 2.6), s: rnd(0.4, 1.5), v: rnd(0.05, 0.35), o: rnd(0.2, 0.9) }))

    let W = 0, H = 0, dpr = 1, R = 200, mobile = false, wide = false
    const resize = () => {
      const r = wrap.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      W = r.width; H = r.height
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr)
      mobile = W < 640
      wide = W >= 1100 // desktop: network sits right of the headline, filling the hero
      R = wide ? Math.min(W * 0.205, H * 0.46) : Math.min(W * (mobile ? 0.34 : 0.31), H * (mobile ? 0.8 : 0.72))
    }
    resize()
    const ro = new ResizeObserver(resize); ro.observe(wrap)

    // pointer → tilt
    let tx = 0, ty = 0, cx = 0, cy = 0, px = -9999, py = -9999, overPanel = false
    const onMove = (e: PointerEvent) => {
      overPanel = !!panelRef.current?.contains(e.target as Node)
      const r = wrap.getBoundingClientRect()
      px = e.clientX - r.left; py = e.clientY - r.top
      tx = (px / W - 0.5); ty = (py / H - 0.5)
    }
    const onLeave = () => { px = py = -9999; tx = ty = 0; if (!pinnedRef.current) setActive(null) }
    wrap.addEventListener('pointermove', onMove)
    wrap.addEventListener('pointerleave', onLeave)

    let proj: { x: number; y: number; z: number; s: number }[] = []
    const onClick = () => {
      if (overPanel) return
      const hit = hitTest()
      if (hit !== null) { pinnedRef.current = true; setActive(hit) }
      else { pinnedRef.current = false; setActive(null) }
    }
    wrap.addEventListener('click', onClick)
    const hitTest = () => {
      let best: number | null = null, bd = 1e9
      proj.forEach((p, i) => {
        const d = Math.hypot(p.x - px, p.y - py)
        if (d < (mobile ? 30 : 38) * p.s && d < bd) { bd = d; best = i }
      })
      return best
    }

    const t0 = performance.now()
    let rot = 0, last = t0, raf = 0, visible = true, intro = reduce ? 1 : 0
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible && !raf) raf = requestAnimationFrame(frame) })
    io.observe(wrap)

    function sphere(x: number, y: number, r: number, c: [number, number, number], glow: number) {
      // outer glow
      const g = ctx.createRadialGradient(x, y, 0, x, y, r * 4.5)
      g.addColorStop(0, rgba(c, 0.35 * glow)); g.addColorStop(0.35, rgba(c, 0.1 * glow)); g.addColorStop(1, rgba(c, 0))
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r * 4.5, 0, Math.PI * 2); ctx.fill()
      // body with top-left key light for a 3D read
      const b = ctx.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.05, x, y, r)
      b.addColorStop(0, 'rgba(255,255,255,0.95)')
      b.addColorStop(0.25, rgba(c, 1))
      b.addColorStop(0.8, rgba([c[0] * 0.45, c[1] * 0.45, c[2] * 0.45].map(Math.round) as [number, number, number], 1))
      b.addColorStop(1, rgba([c[0] * 0.2, c[1] * 0.2, c[2] * 0.2].map(Math.round) as [number, number, number], 1))
      ctx.fillStyle = b; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill()
      // rim
      ctx.strokeStyle = rgba(c, 0.55); ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(x, y, r + 3, 0, Math.PI * 2); ctx.stroke()
    }

    function frame(now: number) {
      raf = 0
      if (!visible) return
      const dt = Math.min((now - last) / 1000, 0.05); last = now
      const time = (now - t0) / 1000
      if (!reduce) intro = Math.min(1, intro + dt / 1.8)
      const ease = 1 - Math.pow(1 - intro, 3)
      const act = activeRef.current
      if (!reduce) rot += dt * (act !== null ? 0.02 : 0.09)
      cx += (tx - cx) * 0.05; cy += (ty - cy) * 0.05

      const tilt = (mobile ? 0.85 : 0.52) + cy * 0.3           // rotation about X: ring tipped towards the viewer
      const yaw = rot + cx * 0.6             // rotation about Y
      const F = R * 3.2                      // perspective distance
      const ox = wide ? W * 0.69 : W / 2, oy = wide ? H * 0.53 : H / 2
      const project = (x: number, y: number, z: number) => {
        // yaw
        const x1 = x * Math.cos(yaw) - z * Math.sin(yaw)
        const z1 = x * Math.sin(yaw) + z * Math.cos(yaw)
        // tilt
        const y2 = y * Math.cos(tilt) - z1 * Math.sin(tilt)
        const z2 = y * Math.sin(tilt) + z1 * Math.cos(tilt)
        const s = F / (F + z2)
        return { x: ox + x1 * s, y: oy + y2 * s, z: z2, s }
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, W, H)

      // dust
      ctx.globalCompositeOperation = 'lighter'
      for (const d of dust) {
        if (!reduce) { d.y -= d.v * dt * 4; if (d.y < -1) d.y = 1 }
        const p = project(d.x * R, d.y * R * 0.8, d.z * R)
        ctx.fillStyle = `rgba(200,255,240,${0.18 * p.s * ease})`
        ctx.fillRect(p.x, p.y, d.s * p.s, d.s * p.s)
      }

      // hub positions (ring) + satellites
      const n = hubs.length
      proj = hubs.map((h, i) => {
        const a = (i / n) * Math.PI * 2
        const wob = Math.sin(time * 0.6 + i) * R * 0.05
        return project(Math.cos(a) * R * ease, wob, Math.sin(a) * R * ease)
      })
      const core = project(0, 0, 0)

      // orbit ring
      ctx.globalCompositeOperation = 'source-over'
      ctx.beginPath()
      for (let k = 0; k <= 96; k++) {
        const a = (k / 96) * Math.PI * 2
        const p = project(Math.cos(a) * R * ease, 0, Math.sin(a) * R * ease)
        if (k === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y)
      }
      ctx.strokeStyle = 'rgba(160,230,215,0.08)'; ctx.lineWidth = 1; ctx.stroke()

      // links core → hub (drawn behind everything)
      ctx.globalCompositeOperation = 'lighter'
      hubs.forEach((h, i) => {
        const p = proj[i]
        const on = act === i, dim = act !== null && !on
        const g = ctx.createLinearGradient(core.x, core.y, p.x, p.y)
        g.addColorStop(0, `rgba(255,226,150,${dim ? 0.08 : on ? 0.75 : 0.32})`)
        g.addColorStop(1, rgba(h.color, dim ? 0.06 : on ? 0.8 : 0.28))
        ctx.strokeStyle = g; ctx.lineWidth = on ? 2.2 : 1.2 * p.s
        ctx.beginPath(); ctx.moveTo(core.x, core.y)
        // slight curve for an organic feel
        const mx = (core.x + p.x) / 2 + (p.y - core.y) * 0.08, my = (core.y + p.y) / 2 - (p.x - core.x) * 0.08
        ctx.quadraticCurveTo(mx, my, p.x, p.y); ctx.stroke()
        // neighbour link
        const q = proj[(i + 1) % n]
        ctx.strokeStyle = `rgba(160,230,215,${dim ? 0.03 : 0.09})`; ctx.lineWidth = 1
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke()
      })

      // pulses travelling along the links
      if (!reduce && intro > 0.6 && Math.random() < dt * (act !== null ? 6 : 3.2)) {
        const hub = act !== null && Math.random() < 0.7 ? act : Math.floor(Math.random() * n)
        pulses.push({ hub, t: 0, speed: rnd(0.35, 0.7), out: Math.random() < 0.75 })
      }
      for (let k = pulses.length - 1; k >= 0; k--) {
        const pu = pulses[k]; pu.t += dt * pu.speed
        if (pu.t >= 1) { pulses.splice(k, 1); continue }
        const p = proj[pu.hub], c = hubs[pu.hub].color
        const mx = (core.x + p.x) / 2 + (p.y - core.y) * 0.08, my = (core.y + p.y) / 2 - (p.x - core.x) * 0.08
        const at = (u: number) => {
          const v = pu.out ? u : 1 - u
          return { x: (1 - v) ** 2 * core.x + 2 * (1 - v) * v * mx + v * v * p.x, y: (1 - v) ** 2 * core.y + 2 * (1 - v) * v * my + v * v * p.y }
        }
        const head = at(pu.t)
        for (let j = 1; j <= 10; j++) {
          const q = at(Math.max(0, pu.t - j * 0.018))
          ctx.fillStyle = rgba(c, 0.5 * (1 - j / 10))
          ctx.beginPath(); ctx.arc(q.x, q.y, 2.2 * (1 - j / 12), 0, Math.PI * 2); ctx.fill()
        }
        const hg = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, 14)
        hg.addColorStop(0, 'rgba(255,255,255,0.95)'); hg.addColorStop(0.25, rgba(c, 0.7)); hg.addColorStop(1, rgba(c, 0))
        ctx.fillStyle = hg; ctx.beginPath(); ctx.arc(head.x, head.y, 14, 0, Math.PI * 2); ctx.fill()
      }

      // draw order by depth: back hubs, core, front hubs
      const order = hubs.map((_, i) => i).sort((a, b) => proj[b].z - proj[a].z)
      const drawHub = (i: number) => {
        const h = hubs[i], p = proj[i]
        const on = act === i, dim = act !== null && !on
        const depth = Math.max(0.35, Math.min(1, 1.15 - p.z / (R * 2.2)))
        ctx.globalAlpha = (dim ? 0.45 : 1) * depth * ease
        // satellites
        ctx.globalCompositeOperation = 'lighter'
        h.sats.forEach(s => {
          const a = s.a + time * s.speed
          const sr = R * s.r * (on ? 1.25 : 1)
          const sx = Math.cos(a) * sr, sy = Math.sin(a) * sr * s.tilt * 0.5, sz = Math.sin(a) * sr
          const base = (i / n) * Math.PI * 2
          const q = project(Math.cos(base) * R * ease + sx, Math.sin(time * 0.6 + i) * R * 0.05 + sy, Math.sin(base) * R * ease + sz)
          ctx.strokeStyle = rgba(h.color, on ? 0.45 : 0.16); ctx.lineWidth = 0.8
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke()
          ctx.fillStyle = rgba(h.color, 0.9)
          ctx.beginPath(); ctx.arc(q.x, q.y, s.size * q.s, 0, Math.PI * 2); ctx.fill()
        })
        ctx.globalCompositeOperation = 'source-over'
        const r = (mobile ? 7 : 10) * p.s * (on ? 1.35 : 1)
        sphere(p.x, p.y, r, h.color, on ? 1.6 : 1)
        // label
        ctx.font = `500 ${mobile ? 10.5 : 13}px ${font}`
        ctx.fillStyle = on ? '#ffffff' : 'rgba(236,244,240,0.86)'
        if (mobile) {
          ctx.textAlign = 'center'; ctx.textBaseline = 'top'
          ctx.fillText(h.label, p.x, p.y + r + 7)
        } else {
          const right = p.x >= core.x - 4
          ctx.textAlign = right ? 'left' : 'right'; ctx.textBaseline = 'middle'
          ctx.fillText(h.label, p.x + (right ? 1 : -1) * (r + 10), p.y)
        }
        ctx.globalAlpha = 1
      }
      order.filter(i => proj[i].z > 0).forEach(drawHub)

      // core
      ctx.globalCompositeOperation = 'lighter'
      const cr = (mobile ? 26 : 38) * (0.6 + 0.4 * ease)
      for (const hp of halo) {
        const a = hp.a + time * hp.v * (reduce ? 0 : 1)
        const rr = cr * hp.r * (0.95 + 0.05 * Math.sin(time * 2 + hp.a * 3))
        ctx.fillStyle = `rgba(255,214,120,${hp.o * 0.55 * ease})`
        ctx.fillRect(core.x + Math.cos(a) * rr, core.y + Math.sin(a) * rr * 0.92, hp.s, hp.s)
      }
      const cg = ctx.createRadialGradient(core.x, core.y, 0, core.x, core.y, cr * 4)
      cg.addColorStop(0, 'rgba(255,230,160,0.5)'); cg.addColorStop(0.3, 'rgba(255,200,90,0.16)'); cg.addColorStop(1, 'rgba(255,200,90,0)')
      ctx.fillStyle = cg; ctx.beginPath(); ctx.arc(core.x, core.y, cr * 4, 0, Math.PI * 2); ctx.fill()
      ctx.globalCompositeOperation = 'source-over'
      const body = ctx.createRadialGradient(core.x - cr * 0.3, core.y - cr * 0.35, cr * 0.05, core.x, core.y, cr)
      body.addColorStop(0, '#fffbe8'); body.addColorStop(0.3, '#ffd977'); body.addColorStop(0.75, '#c88a22'); body.addColorStop(1, '#5a3a08')
      ctx.fillStyle = body; ctx.beginPath(); ctx.arc(core.x, core.y, cr, 0, Math.PI * 2); ctx.fill()
      // rotating dashed rings
      ctx.save(); ctx.translate(core.x, core.y)
      for (const [rr, sp, dash, al] of [[1.35, 0.3, [2, 6], 0.55], [1.7, -0.18, [14, 10], 0.25]] as const) {
        ctx.rotate(time * sp); ctx.setLineDash(dash as unknown as number[])
        ctx.strokeStyle = `rgba(255,220,140,${al})`; ctx.lineWidth = 1
        ctx.beginPath(); ctx.arc(0, 0, cr * rr, 0, Math.PI * 2); ctx.stroke()
      }
      ctx.restore(); ctx.setLineDash([])
      ctx.font = `600 ${mobile ? 11 : 13}px ${font}`; ctx.textAlign = 'center'; ctx.textBaseline = 'top'
      ctx.fillStyle = `rgba(255,248,225,${ease})`
      ctx.fillText('N E X T X E N', core.x, core.y + cr * 1.9 + 4)

      order.filter(i => proj[i].z <= 0).forEach(drawHub)

      // hover + floating panel position
      if (!pinnedRef.current && !overPanel && px > -999) {
        const hit = hitTest()
        if (hit !== activeRef.current) { activeRef.current = hit; setActive(hit) }
        wrap.style.cursor = hit !== null ? 'pointer' : 'default'
      }
      const pi = activeRef.current
      if (pi !== null && panelRef.current) {
        const p = proj[pi]
        const pw = panelRef.current.offsetWidth, ph = panelRef.current.offsetHeight
        let x = p.x + (p.x > ox ? -pw - 34 : 34), y = p.y - ph / 2
        x = Math.max(8, Math.min(W - pw - 8, x)); y = Math.max(8, Math.min(H - ph - 8, y))
        if (mobile) { x = (W - pw) / 2; y = H - ph - 8 }
        panelRef.current.style.transform = `translate3d(${x}px,${y}px,0)`
      }

      if (!reduce || intro < 1) raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf); ro.disconnect(); io.disconnect()
      wrap.removeEventListener('pointermove', onMove)
      wrap.removeEventListener('pointerleave', onLeave)
      wrap.removeEventListener('click', onClick)
    }
  }, [])

  const svc = active !== null ? services.find(s => s.id === HUBS[active].id) : null

  return (
    <div className="net" ref={wrapRef}>
      <canvas ref={canvasRef} className="net-cv" role="img" aria-label="NEXTXEN at the centre of its services: websites, SEO, Google Ads, Meta Ads, social growth, content, AI chatbots and AI automation" />
      <div ref={panelRef} className={`net-panel${svc ? ' on' : ''}`} aria-live="polite">
        {svc && (
          <>
            <div className="net-panel-top">
              <span className="net-panel-ic"><Icon emoji={svc.icon} size={18} /></span>
              <span>{svc.tag}</span>
            </div>
            <h3>{svc.title.split(' —')[0]}</h3>
            <p>{svc.shortDesc}</p>
            <ul>{svc.feats.slice(0, 3).map(f => <li key={f}>{f}</li>)}</ul>
            <Link href="/contact" className="net-panel-cta">Book a call <Icon name="arrow" size={14} /></Link>
          </>
        )}
      </div>
      <ul className="sr-only">
        {HUBS.map(h => <li key={h.id}>{h.label}</li>)}
      </ul>
    </div>
  )
}
