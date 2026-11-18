'use client'
import { useEffect, useRef } from 'react'

// A short, fading trail of gold and teal sparks behind the pointer.
// Canvas only, pointer-events: none, animates only while sparks are alive,
// and does nothing on touch screens or with reduced motion.
type Spark = { x: number; y: number; vx: number; vy: number; life: number; max: number; r: number; teal: boolean }

export default function CursorSparks() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const cv = ref.current
    if (!cv) return
    if (!matchMedia('(hover: hover) and (pointer: fine)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = cv.getContext('2d')
    if (!ctx) return
    const host = cv.parentElement as HTMLElement
    const sparks: Spark[] = []
    let raf = 0, lastX = -1, lastY = -1, dpr = 1

    const size = () => {
      dpr = Math.min(devicePixelRatio || 1, 2)
      cv.width = Math.round(host.clientWidth * dpr); cv.height = Math.round(host.clientHeight * dpr)
    }
    size()
    const ro = new ResizeObserver(size); ro.observe(host)

    const tick = () => {
      ctx.clearRect(0, 0, cv.width, cv.height)
      ctx.globalCompositeOperation = 'lighter'
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i]
        s.life++
        if (s.life >= s.max) { sparks.splice(i, 1); continue }
        s.x += s.vx; s.y += s.vy; s.vx *= .96; s.vy = s.vy * .96 + .012
        const k = 1 - s.life / s.max
        const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 3 * dpr)
        g.addColorStop(0, s.teal ? `rgba(160,255,230,${k})` : `rgba(255,240,180,${k})`)
        g.addColorStop(1, 'rgba(255,200,100,0)')
        ctx.fillStyle = g
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r * 3 * dpr, 0, Math.PI * 2); ctx.fill()
        ctx.fillStyle = `rgba(255,255,245,${k})`
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r * .55 * dpr, 0, Math.PI * 2); ctx.fill()
      }
      raf = sparks.length ? requestAnimationFrame(tick) : 0
    }

    const move = (e: PointerEvent) => {
      const r = host.getBoundingClientRect()
      const x = (e.clientX - r.left) * dpr, y = (e.clientY - r.top) * dpr
      if (x < 0 || y < 0 || x > cv.width || y > cv.height) { lastX = -1; return }
      const dist = lastX < 0 ? 0 : Math.hypot(x - lastX, y - lastY)
      const n = Math.min(6, Math.floor(dist / (9 * dpr)) + (Math.random() < .5 ? 1 : 0))
      for (let i = 0; i < n && sparks.length < 120; i++) {
        const t = Math.random()
        sparks.push({
          x: lastX < 0 ? x : lastX + (x - lastX) * t, y: lastY < 0 ? y : lastY + (y - lastY) * t,
          vx: (Math.random() - .5) * .8 * dpr, vy: (Math.random() - .7) * .8 * dpr,
          life: 0, max: 30 + Math.random() * 34, r: 1.3 + Math.random() * 1.9, teal: Math.random() < .3,
        })
      }
      lastX = x; lastY = y
      if (!raf && sparks.length) raf = requestAnimationFrame(tick)
    }
    addEventListener('pointermove', move, { passive: true })
    return () => { removeEventListener('pointermove', move); ro.disconnect(); cancelAnimationFrame(raf) }
  }, [])

  return <canvas ref={ref} className="st-sparks" aria-hidden="true" />
}
