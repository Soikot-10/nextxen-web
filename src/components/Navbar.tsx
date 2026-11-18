'use client'
import { useState, useEffect, type CSSProperties } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Icon from '@/components/Icon'
import { BrandMark } from '@/components/brand/BrandLogo'

const links = [
  { href: '/#services', label: 'Services' },
  { href: '/industries', label: 'Industries' },
  { href: '/#work', label: 'Results' },
  { href: '/#pricing', label: 'Pricing' },
  { href: '/blog', label: 'Journal' },
]

/** The NEXTXEN hex badge (brand system v1.0); light tone on the cream contact nav. */
function GoldLogo() {
  return <span className="logo-mark" aria-hidden="true"><BrandMark size={32} tone="light" /></span>
}

export function Logo() {
  return <span className="logo-mark" aria-hidden="true"><BrandMark size={32} /></span>
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [mobOpen, setMobOpen] = useState(false)
  const pathname = usePathname()
  const cream = pathname === '/contact'

  useEffect(() => {
    let lastY = scrollY
    const h = () => {
      const y = scrollY
      setScrolled(y > 24)
      setHidden(y > 400 && y > lastY + 4)
      if (y < lastY - 4 || y < 400) setHidden(false)
      lastY = y
    }
    h()
    addEventListener('scroll', h, { passive: true })
    return () => removeEventListener('scroll', h)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('menu-open', mobOpen)
    document.body.style.overflow = mobOpen ? 'hidden' : ''
    if (!mobOpen) return () => { document.body.style.overflow = '' }
    // Escape closes the menu; widening past the mobile breakpoint closes it too
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMobOpen(false) }
    const mq = matchMedia('(min-width: 961px)')
    const onMq = () => { if (mq.matches) setMobOpen(false) }
    addEventListener('keydown', onKey)
    mq.addEventListener('change', onMq)
    return () => { document.body.style.overflow = ''; removeEventListener('keydown', onKey); mq.removeEventListener('change', onMq) }
  }, [mobOpen])

  return (
    <>
      <header className={`nav${scrolled || pathname === '/contact' || cream ? ' sc' : ''}${cream ? ' nav-cream' : ''}${pathname === '/blog' ? ' nav-jx' : ''}${pathname === '/home-preview' ? ' nav-hx' : ''}${hidden && !mobOpen ? ' up' : ''}`}>
        <nav className="nav-in" aria-label="Main">
          <Link href="/" className="logo" aria-label="NEXTXEN home">{cream ? <GoldLogo /> : <Logo />}<span>NEXTXEN</span></Link>

          <ul className="nav-links">
            {links.map(link => {
              const active = !link.href.includes('#') && pathname.startsWith(link.href)
              return (
                <li key={link.href}>
                  <Link href={link.href} className={active ? 'active' : ''}><span data-t={link.label}>{link.label}</span></Link>
                </li>
              )
            })}
          </ul>

          <Link href="/contact" className="btn btn-sm nav-cta" data-magnetic>
            <span className="btn-l">Book a call</span>
            <span className="btn-ic"><Icon name="arrowUpRight" size={14} stroke={2} /></span>
          </Link>

          <button className={`hbg${mobOpen ? ' on' : ''}`} onClick={() => setMobOpen(o => !o)} aria-label={mobOpen ? 'Close menu' : 'Open menu'} aria-expanded={mobOpen}>
            <span /><span />
          </button>
        </nav>
      </header>

      <div className={`mobnav${mobOpen ? ' open' : ''}`} role="dialog" aria-modal="true" aria-label="Menu" aria-hidden={!mobOpen}>
        <div className="mobnav-bg" />
        <ul>
          {[{ href: '/', label: 'Home' }, ...links, { href: '/contact', label: 'Contact' }].map((link, i) => (
            <li key={link.href} style={{ '--i': i } as CSSProperties}>
              <Link href={link.href} onClick={() => setMobOpen(false)} tabIndex={mobOpen ? 0 : -1}>
                <small>0{i + 1}</small>{link.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mobnav-foot">
          <a href="mailto:hello@nextxen.co.nz" tabIndex={mobOpen ? 0 : -1}>hello@nextxen.co.nz</a>
          <span>Auckland, New Zealand</span>
        </div>
      </div>
    </>
  )
}
