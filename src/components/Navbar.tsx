'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/', label: 'Home' },
  { href: '/#services', label: 'Services' },
  { href: '/industries', label: 'Industries' },
  { href: '/blog', label: 'Blog' },
  { href: '/#pricing', label: 'Pricing' },
  { href: '/#about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobOpen, setMobOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  }, [])

  useEffect(() => { setMobOpen(false) }, [pathname])

  return (
    <>
      <nav id="main-nav" className={scrolled ? 'sc' : ''}>
        <Link href="/" className="logo">NEXTXEN</Link>

        <ul className="nav-links">
          {links.map(link => {
            const active = link.href === '/'
              ? pathname === '/'
              : pathname.startsWith(link.href.replace('#',''))
            return (
              <li key={link.href}>
                {link.label === 'Free Consultation' ? (
                  <Link href={link.href} className="nav-cta">{link.label}</Link>
                ) : (
                  <Link href={link.href} className={active ? 'active' : ''}>{link.label}</Link>
                )}
              </li>
            )
          })}
          <li style={{ animationDelay: '.52s' }}>
            <Link href="/contact" className="nav-cta">Free Consultation</Link>
          </li>
        </ul>

        <button className="hbg" onClick={() => setMobOpen(v => !v)} aria-label="Menu">
          <span style={{ transform: mobOpen ? 'rotate(45deg) translate(5px,5px)' : '' }} />
          <span style={{ opacity: mobOpen ? 0 : 1 }} />
          <span style={{ transform: mobOpen ? 'rotate(-45deg) translate(5px,-5px)' : '' }} />
        </button>
      </nav>

      <div className={`overlay${mobOpen ? ' open' : ''}`} onClick={() => setMobOpen(false)} />

      <nav className={`mobnav${mobOpen ? ' open' : ''}`}>
        <button className="mobclose" onClick={() => setMobOpen(false)}>✕</button>
        <ul>
          {links.map(link => (
            <li key={link.href}>
              <Link href={link.href} onClick={() => setMobOpen(false)}>{link.label}</Link>
            </li>
          ))}
          <li style={{ marginTop: '1rem' }}>
            <Link href="/contact" onClick={() => setMobOpen(false)} className="btn1" style={{ justifyContent: 'center', width: '100%', display: 'flex' }}>
              Free Consultation
            </Link>
          </li>
        </ul>
      </nav>
    </>
  )
}
