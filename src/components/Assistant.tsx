'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Icon, { type IconName } from '@/components/Icon'

// Floating assistant orb with a glass panel of quick actions. It links to
// real pages only; there is no live chat behind it.
const actions: { href: string; label: string; icon: IconName }[] = [
  { href: '/contact', label: 'Book a free strategy call', icon: 'calendar' },
  { href: '/#pricing', label: 'See plans and pricing', icon: 'card' },
  { href: '/#services', label: 'Explore our services', icon: 'sparkle' },
  { href: 'mailto:hello@nextxen.co.nz', label: 'Email the team', icon: 'mail' },
]

export default function Assistant() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    addEventListener('keydown', k); return () => removeEventListener('keydown', k)
  }, [])

  const toggle = () => {
    setOpen(o => !o)
  }

  return (
    <div className={`ast${open ? ' open' : ''}`}>
      <div className="ast-panel" role="dialog" aria-label="NEXTXEN quick actions" aria-hidden={!open}>
        <div className="ast-head">
          <span className="ast-mini" aria-hidden="true" />
          <div><strong>Xen</strong><small><i />NEXTXEN quick help</small></div>
        </div>
        <p className="ast-msg">Kia ora! Where would you like to go?</p>
        <ul>
          {actions.map(a => (
            <li key={a.href}>
              <Link href={a.href} onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}>
                <span className="ast-ic"><Icon name={a.icon} size={16} /></span>{a.label}<Icon name="arrow" size={14} className="ast-arr" />
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <button className="ast-orb" onClick={toggle} aria-expanded={open} aria-label={open ? 'Close quick actions' : 'Open quick actions'}>
        <span className="ast-sphere"><span className="ast-eyes"><i /><i /></span></span>
        <span className="ast-x"><Icon name="x" size={18} stroke={2} /></span>
      </button>
    </div>
  )
}
