'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

// One delegated layer for the site's micro-interactions, so pages can stay
// server components and opt in with classes and data attributes:
//   .rv              reveal on scroll (adds .in)
//   [data-tilt]      gentle 3D tilt towards the pointer (max 6°)
//   [data-magnetic]  small pull towards the pointer
//   .spot            soft pointer-following spotlight via --mx / --my
//   .scrub           words light up as the paragraph scrolls through view
//   .track           --p progress as a timeline scrolls past
export default function Interactions() {
  const pathname = usePathname()

  useEffect(() => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    const fine = matchMedia('(hover: hover) and (pointer: fine)').matches

    // A fully clipped .rv-mask has no visible area, and Chrome's observer
    // honours the target's own clip-path, so it would never "intersect".
    // Masked elements are therefore revealed when their parent comes into view.
    const masked = new Map<Element, Element[]>()
    const io = new IntersectionObserver(entries => {
      for (const e of entries) if (e.isIntersecting) {
        const kids = masked.get(e.target)
        if (kids) { kids.forEach(k => k.classList.add('in')); masked.delete(e.target) } else e.target.classList.add('in')
        io.unobserve(e.target)
      }
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' })
    const scan = () => document.querySelectorAll('.rv:not(.in)').forEach(el => {
      const host = el.classList.contains('rv-mask') ? el.parentElement : null
      if (!host) { io.observe(el); return }
      const list = masked.get(host)
      if (list) { if (!list.includes(el)) list.push(el) } else { masked.set(host, [el]); io.observe(host) }
    })
    scan()
    const mo = new MutationObserver(scan)
    mo.observe(document.body, { childList: true, subtree: true })

    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        ticking = false
        document.querySelectorAll<HTMLElement>('.scrub').forEach(el => {
          const r = el.getBoundingClientRect()
          // fully lit by the time the paragraph's top reaches ~35% of the
          // viewport, so the statement is readable while it is on screen
          const p = reduce ? 1 : Math.min(1, Math.max(0, (innerHeight * 0.95 - r.top) / (innerHeight * 0.6)))
          const words = el.querySelectorAll<HTMLElement>('.sw')
          const lit = p * words.length
          words.forEach((w, i) => w.style.setProperty('--o', String(Math.min(1, Math.max(0.34, lit - i + 0.34)))))
        })
        document.querySelectorAll<HTMLElement>('.track').forEach(el => {
          const r = el.getBoundingClientRect()
          el.style.setProperty('--p', String(Math.min(1, Math.max(0, (innerHeight * 0.6 - r.top) / r.height))))
        })
        document.documentElement.classList.toggle('scrolled', scrollY > 24)
        if (!reduce) document.querySelectorAll<HTMLElement>('[data-parallax]').forEach(el => {
          const r = el.getBoundingClientRect()
          const f = parseFloat(el.dataset.parallax || '0.05')
          el.style.translate = `0 ${((r.top + r.height / 2 - innerHeight / 2) * -f).toFixed(1)}px`
        })
      })
    }
    onScroll()
    addEventListener('scroll', onScroll, { passive: true })
    addEventListener('resize', onScroll)

    let tiltEl: HTMLElement | null = null, magEl: HTMLElement | null = null
    const resetTilt = (el: HTMLElement) => { el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg'); setTimeout(() => { if (tiltEl !== el) el.classList.remove('tilting') }, 900) }
    const onMove = (e: PointerEvent) => {
      if (reduce || !fine) return
      const t = e.target as HTMLElement
      const spot = t.closest<HTMLElement>('.spot')
      if (spot) {
        const r = spot.getBoundingClientRect()
        spot.style.setProperty('--mx', `${e.clientX - r.left}px`)
        spot.style.setProperty('--my', `${e.clientY - r.top}px`)
      }
      const tilt = t.closest<HTMLElement>('[data-tilt]')
      if (tiltEl && tiltEl !== tilt) resetTilt(tiltEl)
      tiltEl = tilt
      if (tilt) {
        const r = tilt.getBoundingClientRect()
        tilt.classList.add('tilting')
        const amt = Math.min(6, parseFloat(tilt.dataset.tilt || '5'))
        const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5
        tilt.style.setProperty('--rx', `${(-y * amt).toFixed(2)}deg`)
        tilt.style.setProperty('--ry', `${(x * amt).toFixed(2)}deg`)
      }
      const mag = t.closest<HTMLElement>('[data-magnetic]')
      if (magEl && magEl !== mag) magEl.style.translate = ''
      magEl = mag
      if (mag) {
        const r = mag.getBoundingClientRect()
        mag.style.translate = `${((e.clientX - r.left - r.width / 2) * 0.18).toFixed(1)}px ${((e.clientY - r.top - r.height / 2) * 0.25).toFixed(1)}px`
      }
    }
    addEventListener('pointermove', onMove, { passive: true })

    return () => {
      io.disconnect(); mo.disconnect()
      removeEventListener('scroll', onScroll); removeEventListener('resize', onScroll)
      removeEventListener('pointermove', onMove)
    }
  }, [pathname])

  return null
}
