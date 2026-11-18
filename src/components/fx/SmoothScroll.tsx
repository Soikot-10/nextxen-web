'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Lenis from 'lenis'

// Inertial smooth scrolling for the whole site. Skipped for people who ask
// for reduced motion and on touch devices, which already scroll natively.
let lenis: Lenis | null = null

/** Smoothly scroll to a page offset, through Lenis when it is active. */
export function scrollToY(y: number) {
  if (lenis) lenis.scrollTo(y, { duration: 1.1 })
  else window.scrollTo({ top: y, behavior: 'smooth' })
}

export default function SmoothScroll() {
  const pathname = usePathname()

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const coarse = window.matchMedia('(pointer: coarse)').matches
    if (reduce || coarse) return

    lenis = new Lenis({ duration: 1.2, easing: t => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)), wheelMultiplier: 0.95 })
    let raf = 0
    const loop = (t: number) => { lenis?.raf(t); raf = requestAnimationFrame(loop) }
    raf = requestAnimationFrame(loop)

    // in-page anchor links glide instead of jumping
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest('a')
      if (!a) return
      const href = a.getAttribute('href') || ''
      const hash = href.startsWith('#') ? href : href.startsWith('/#') && location.pathname === '/' ? href.slice(1) : ''
      if (!hash || hash === '#') return
      const el = hash === '#top' ? document.body : document.querySelector(hash)
      if (!el) return
      e.preventDefault()
      lenis?.scrollTo(el as HTMLElement, { offset: -80 })
      history.replaceState(null, '', hash)
    }
    document.addEventListener('click', onClick)

    // freeze the page while a dialog or the mobile menu is open
    const html = document.documentElement
    const mo = new MutationObserver(() => {
      if (html.classList.contains('lock') || html.classList.contains('menu-open')) lenis?.stop(); else lenis?.start()
    })
    mo.observe(html, { attributes: true, attributeFilter: ['class'] })

    return () => {
      cancelAnimationFrame(raf); document.removeEventListener('click', onClick); mo.disconnect()
      lenis?.destroy(); lenis = null
    }
  }, [])

  useEffect(() => {
    if (!location.hash) lenis?.scrollTo(0, { immediate: true })
  }, [pathname])

  return null
}
