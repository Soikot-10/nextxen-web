'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Icon, { type IconName } from '@/components/Icon'

// Floating 3D assistant orb with a glass chat panel of quick actions.
const actions: { href: string; label: string; icon: IconName }[] = [
  { href: '/contact', label: 'Book a free strategy call', icon: 'calendar' },
  { href: '/#pricing', label: 'See plans and pricing', icon: 'card' },
  { href: '/#services', label: 'Explore our services', icon: 'sparkle' },
  { href: 'mailto:hello@nextxen.co.nz', label: 'Email the team', icon: 'mail' },
]

export default function Assistant() {
  const [open, setOpen] = useState(false)
  const [hint, setHint] = useState(false)

  useEffect(() => {
    let seen = false
    try { seen = sessionStorage.getItem('nx-hint') === '1' } catch {}
    if (seen) return
    const t = setTimeout(() => setHint(true), 4500)
    const t2 = setTimeout(() => setHint(false), 14000)
    return () => { clearTimeout(t); clearTimeout(t2) }
  }, [])

  const toggle = () => {
    setOpen(o => !o); setHint(false)
    try { sessionStorage.setItem('nx-hint', '1') } catch {}
  }

  return (
    <div className={`ast${open ? ' open' : ''}`}>
      <div className="ast-panel" role="dialog" aria-label="NEXTXEN assistant" aria-hidden={!open}>
        <div className="ast-head">
          <span className="ast-mini" aria-hidden="true" />
          <div><strong>Xen</strong><small><i />NEXTXEN AI assistant</small></div>
        </div>
        <p className="ast-msg">Kia ora! I&apos;m Xen. How can I help you grow today?</p>
        <ul>
          {actions.map(a => (
            <li key={a.href}>
              <Link href={a.href} onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}>
                <Icon name={a.icon} size={16} />{a.label}<Icon name="arrow" size={14} className="ast-arr" />
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className={`ast-hint${hint && !open ? ' on' : ''}`} aria-hidden="true">
        Hi, I&apos;m Xen. Need a hand growing your business?
      </div>

      <button className="ast-orb" onClick={toggle} aria-expanded={open} aria-label={open ? 'Close assistant' : 'Open assistant'}>
        <span className="ast-sphere"><span className="ast-eyes"><i /><i /></span></span>
        <span className="ast-shadow" />
      </button>
    </div>
  )
}
