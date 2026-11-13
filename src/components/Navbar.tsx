'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Icon from '@/components/Icon'

const links = [
  { href: '/#services', label: 'Services' },
  { href: '/industries', label: 'Industries' },
  { href: '/#work', label: 'Results' },
  { href: '/#pricing', label: 'Pricing' },
  { href: '/blog', label: 'Journal' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobOpen, setMobOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 24)
    h()
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobOpen])

  return (
    <>
      <nav id="main-nav" className={scrolled ? 'sc' : ''} aria-label="Main">
        <Link href="/" className="logo" aria-label="NEXTXEN home"><i />NEXTXEN</Link>

        <ul className="nav-links">
          {links.map(link => {
            const active = !link.href.includes('#') && pathname.startsWith(link.href)
            return (
              <li key={link.href}>
                <Link href={link.href} className={active ? 'active' : ''}>{link.label}</Link>
              </li>
            )
          })}
          <li><Link href="/contact" className="nav-cta">Book a call</Link></li>
        </ul>

        <button className="hbg" onClick={() => setMobOpen(true)} aria-label="Open menu" aria-expanded={mobOpen}>
          <span /><span />
        </button>
      </nav>

      <div className={`mobnav${mobOpen ? ' open' : ''}`} role="dialog" aria-modal="true" aria-label="Menu">
        <button className="mobclose" onClick={() => setMobOpen(false)} aria-label="Close menu">
          <Icon name="x" size={18} />
        </button>
        <ul>
          {[{ href: '/', label: 'Home' }, ...links, { href: '/contact', label: 'Contact' }].map(link => (
            <li key={link.href}>
              <Link href={link.href} onClick={() => setMobOpen(false)}>{link.label}</Link>
            </li>
          ))}
        </ul>
        <Link href="/contact" onClick={() => setMobOpen(false)} className="btn1" style={{ width: '100%', marginTop: '2rem' }}>
          Book a free strategy call <Icon name="arrow" size={16} />
        </Link>
      </div>
    </>
  )
}
