'use client'
import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type FormEvent, type PointerEvent as RPointerEvent, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import Icon from '@/components/Icon'
import LiveBrief from '@/components/contact/LiveBrief'
import CursorSparks from '@/components/contact/CursorSparks'
import { BlobClip, CHIP_ICONS } from '@/components/contact/v2'
import { Fern, Leaf } from '@/components/contact/Decor'
import { BrandMark } from '@/components/brand/BrandLogo'

// Desktop contact page: the owner's reference design is the visual skin
// (public/contact/stage*.webp, with its baked-in text removed) and every
// piece of text and every control is real HTML placed on the exact spot it
// occupies in the reference. Coordinates are reference pixels (1216 × 1294);
// sizes scale with the stage through container query units.

const W = 1216, H = 1294
const box = (x: number, y: number, w?: number, h?: number): CSSProperties => ({
  left: `${(x / W) * 100}%`, top: `${(y / H) * 100}%`,
  ...(w !== undefined ? { width: `${(w / W) * 100}%` } : {}),
  ...(h !== undefined ? { height: `${(h / H) * 100}%` } : {}),
})
const fs = (px: number): CSSProperties => ({ fontSize: `calc(var(--u) * ${px})` })

type Key = 'name' | 'email' | 'phone' | 'business' | 'services' | 'message'
type Form = { name: string; email: string; phone: string; business: string; services: string[]; budget: string; message: string }
export type StageProps = {
  form: Form
  set: <K extends keyof Form>(k: K, v: Form[K]) => void
  touch: (k: Key) => void
  toggleService: (s: string) => void
  errs: Partial<Record<Key, string>>
  show: (k: Key) => string | undefined
  pct: number
  minGoals: number
  submit: (e: FormEvent) => void
  sent: boolean
  setSent: (v: boolean) => void
  copyEmail: () => void
  now: { open: boolean; status: string; clock: string } | null
  email: string
}

const CHIPS: { name: string; b: [number, number, number, number]; tx: number; ic: number }[] = [
  { name: 'Website Design', b: [524, 641, 705, 676], tx: 587, ic: 552 },
  { name: 'SEO', b: [721, 641, 814, 676], tx: 771, ic: 749 },
  { name: 'Facebook Ads', b: [829, 641, 976, 676], tx: 877, ic: 857 },
  { name: 'Google Ads', b: [991, 641, 1135, 676], tx: 1042, ic: 1020 },
  { name: 'Social Media Management', b: [525, 687, 756, 722], tx: 585, ic: 557 },
  { name: 'AI Chatbot', b: [771, 687, 920, 722], tx: 830, ic: 807 },
  { name: 'AI Automation', b: [936, 687, 1125, 722], tx: 1002, ic: 975 },
  { name: 'Content Creation', b: [525, 730, 710, 766], tx: 585, ic: 559 },
  { name: 'Brand Identity', b: [732, 730, 915, 766], tx: 799, ic: 771 },
  { name: 'Lead Generation', b: [936, 730, 1125, 766], tx: 998, ic: 973 },
  { name: 'Full-Service Package', b: [525, 773, 740, 810], tx: 585, ic: 559 },
  { name: 'Other', b: [765, 773, 886, 810], tx: 826, ic: 801 },
]
const BUDGETS: { name: string; b: [number, number, number, number] }[] = [
  { name: 'Under $500/month', b: [527, 840, 705, 874] }, { name: '$500 – $1,000/month', b: [721, 840, 907, 874] },
  { name: '$1,000 – $2,500/month', b: [919, 840, 1127, 874] }, { name: '$2,500 – $5,000/month', b: [527, 882, 730, 917] },
  { name: '$5,000+/month', b: [750, 882, 919, 917] }, { name: 'Not sure yet', b: [940, 882, 1117, 917] },
]
// harbour lights that twinkle (reference px)
const LIGHTS = [[777, 255], [808, 250], [845, 253], [876, 247], [901, 255], [932, 251], [957, 256], [982, 248], [1006, 253], [1037, 250], [1062, 255], [1087, 251], [1112, 254], [826, 260], [913, 262], [1018, 261], [745, 258], [944, 241]]

// 3D live buttons: the button carries its own crop of the artwork so it can tilt and lift
const fine = () => typeof window !== 'undefined' && matchMedia('(hover: hover) and (pointer: fine)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches
function tiltMove(e: RPointerEvent<HTMLElement>) {
  if (!fine()) return
  const el = e.currentTarget, r = el.getBoundingClientRect()
  const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height
  el.style.setProperty('--tx', (x * 100).toFixed(1) + '%'); el.style.setProperty('--ty', (y * 100).toFixed(1) + '%')
  el.style.setProperty('--ry', ((x - .5) * 5).toFixed(2) + 'deg'); el.style.setProperty('--rx', ((.5 - y) * 8).toFixed(2) + 'deg')
}
function tiltLeave(e: RPointerEvent<HTMLElement>) {
  const el = e.currentTarget
  el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg')
}
function Live({ coin }: { coin: [number, number] }) {
  return (
    <>
      <i className="lv-spec" aria-hidden="true" />
      <i className="lv-sweep" aria-hidden="true" />
      <i className="lv-ring" aria-hidden="true" />
      <i className="lv-coin" aria-hidden="true" style={{ left: `${coin[0]}%`, top: `${coin[1]}%` }}>
        <b className="lv-ripple" />
        <svg viewBox="0 0 24 24"><path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </i>
    </>
  )
}
const noop = () => () => {}

function T({ at, size, className = '', children, w }: { at: [number, number]; size: number; className?: string; children: ReactNode; w?: number }) {
  return <span className={`st-t ${className}`} style={{ ...box(at[0], at[1], w), ...fs(size) }}>{children}</span>
}

function FieldPill({ id, b, x0, label, type = 'text', value, onChange, onBlur, error, valid, autoComplete, inputMode }: {
  id: string; b: [number, number, number, number]; x0: number; label: string; type?: string; value: string
  onChange: (v: string) => void; onBlur: () => void; error?: string; valid: boolean; autoComplete?: string; inputMode?: 'email' | 'tel' | 'text'
}) {
  const [l, t, r, btm] = b
  return (
    <div className={`sf${error ? ' err' : ''}${valid && value ? ' ok' : ''}`} style={box(l, t, r - l, btm - t)}>
      <label htmlFor={id} className="sr-only">{label}</label>
      <input id={id} name={id.replace(/^d-/, '')} type={type} value={value} placeholder={label} autoComplete={autoComplete} inputMode={inputMode}
        onChange={e => onChange(e.target.value)} onBlur={onBlur} aria-invalid={!!error} aria-describedby={error ? `${id}-err` : undefined}
        style={{ left: `${((x0 - l) / (r - l)) * 100}%`, ...fs(16) }} />
      <svg className="sf-tick" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
      {error && <p className="sf-err" id={`${id}-err`} role="alert" style={fs(12.5)}>{error}</p>}
    </div>
  )
}

export default function Stage(p: StageProps) {
  const root = useRef<HTMLDivElement>(null)
  const { form } = p
  const mounted = useSyncExternalStore(noop, () => true, () => false)
  const [sending, setSending] = useState(false)
  // Xen folds to a slim bar while the Send button is on screen so it never covers it
  const [fold, setFold] = useState(false)
  useEffect(() => {
    const btn = document.querySelector('.st-send')
    if (!btn) return
    const io = new IntersectionObserver(([e]) => setFold(e.isIntersecting), { threshold: .2 })
    io.observe(btn)
    return () => io.disconnect()
  }, [p.sent])
  // a short shimmering "sending" moment before the email hand-off (only when the form is valid)
  const onSend = (e: FormEvent) => {
    e.preventDefault()
    if (Object.keys(p.errs).length || sending) { p.submit(e); return }
    setSending(true)
    window.setTimeout(() => { setSending(false); p.submit({ preventDefault() {} } as FormEvent) }, 900)
  }

  // cursor light: the stage tracks the pointer as --cx / --cy
  useEffect(() => {
    const el = root.current
    if (!el || !matchMedia('(hover: hover) and (pointer: fine)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    const move = (e: PointerEvent) => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect()
        el.style.setProperty('--cx', `${(((e.clientX - r.left) / r.width) * 100).toFixed(2)}%`)
        el.style.setProperty('--cy', `${(((e.clientY - r.top) / r.height) * 100).toFixed(2)}%`)
        el.classList.add('lit')
        const w = el.parentElement
        if (w) {
          const wr = w.getBoundingClientRect()
          w.style.setProperty('--wx', `${(e.clientX - wr.left).toFixed(0)}px`)
          w.style.setProperty('--wy', `${(e.clientY - wr.top).toFixed(0)}px`)
          w.classList.add('lit')
        }
      })
    }
    const leave = () => { el.classList.remove('lit'); el.parentElement?.classList.remove('lit') }
    addEventListener('pointermove', move, { passive: true })
    document.documentElement.addEventListener('pointerleave', leave)
    return () => { removeEventListener('pointermove', move); document.documentElement.removeEventListener('pointerleave', leave); cancelAnimationFrame(raf) }
  }, [])

  return (
    <div className="st-wrap">
      <i className="st-silk" aria-hidden="true" />
      <i className="st-amb a" aria-hidden="true" /><i className="st-amb b" aria-hidden="true" />
      <div className="st-side l" aria-hidden="true">
        <Leaf className="sl a" tone="ref" style={{ '--r': '-34deg' } as CSSProperties} />
        <Leaf className="sl b" tone="ref" style={{ '--r': '-8deg' } as CSSProperties} />
        <Leaf className="sl c" tone="deep" style={{ '--r': '18deg' } as CSSProperties} />
        <Fern className="sf1" leaflets={18} />
        <Leaf className="sl d" tone="ref" style={{ '--r': '40deg' } as CSSProperties} />
        <Leaf className="sl e" tone="fresh" style={{ '--r': '-60deg' } as CSSProperties} />
      </div>
      <div className="st-side r" aria-hidden="true">
        <Leaf className="sl a" tone="ref" style={{ '--r': '-34deg' } as CSSProperties} />
        <Leaf className="sl b" tone="ref" style={{ '--r': '-8deg' } as CSSProperties} />
        <Leaf className="sl c" tone="deep" style={{ '--r': '18deg' } as CSSProperties} />
        <Fern className="sf1" leaflets={18} />
        <Leaf className="sl d" tone="ref" style={{ '--r': '40deg' } as CSSProperties} />
        <Leaf className="sl e" tone="fresh" style={{ '--r': '-60deg' } as CSSProperties} />
      </div>
      <i className="st-wglow" aria-hidden="true" />
      <i className="st-tail" aria-hidden="true" />
      <div className="st" ref={root}>
        <div className="st-in">
          <BlobClip id="st-window" shape="window" />
          <picture className="st-skin">
            <source type="image/webp" srcSet="/contact/stage-matte.webp 1216w, /contact/stage-matte@2x.webp 2432w" sizes="(min-width: 1400px) 1400px, 100vw" />
            <img src="/contact/stage-matte@2x.webp" alt="" width={W} height={H} fetchPriority="high" />
          </picture>

          {/* live layer: harbour parallax, shimmer, clouds, twinkling lights */}
          <div className="st-harbour" style={box(522, 92, 621, 286)} aria-hidden="true">
            <i className="st-clouds" /><i className="st-water" />
          </div>
          {LIGHTS.map(([x, y], i) => <i key={i} className="st-light" aria-hidden="true" style={{ ...box(x, y), '--i': i } as CSSProperties} />)}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="st-leaf tl" src="/contact/leaf-tl.webp" alt="" aria-hidden="true" style={box(0, 0, 104, 252)} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="st-leaf r" src="/contact/leaf-r.webp" alt="" aria-hidden="true" style={box(1174, 760, 42, 250)} />
          <i className="st-sheen" aria-hidden="true" />
          <i className="st-cursor" aria-hidden="true" />
          <i className="st-rimlight" aria-hidden="true" />
          <CursorSparks />
          <i className="st-glow" aria-hidden="true" />

          {/* nav */}
          <nav className="st-nav" aria-label="Main">
            <Link href="/" className="st-logo" style={box(128, 16, 214, 50)} aria-label="NEXTXEN home"><BrandMark className="st-mark" tone="light" /><span style={fs(28)}>NEXTXEN</span></Link>
            {[['/#services', 'Services', 440], ['/industries', 'Industries', 545], ['/#work', 'Results', 665], ['/#pricing', 'Pricing', 762], ['/blog', 'Journal', 850]].map(([href, label, x]) => (
              <Link key={href as string} href={href as string} className="st-link" style={{ ...box(x as number, 24, undefined, 34), ...fs(18) }}>{label}</Link>
            ))}
            <Link href="/contact#enquiry" className="st-book live3d" style={{ ...box(962, 16, 198, 52), '--bx': 962, '--by': 16 } as CSSProperties}
              onPointerMove={tiltMove} onPointerLeave={tiltLeave}>
              <span className="lv-face"><span className="bk-l" style={fs(18.5)}>Book a call</span><Live coin={[80.3, 50]} /></span>
            </Link>
          </nav>

          {/* hero copy */}
          <T at={[136, 97]} size={13.5} className="eye rule">Contact us</T>
          <h1 className="st-h1">
            <span className="st-t s1" style={{ ...box(133, 112), ...fs(53) }}>Start your</span>
            <span className="st-t s2" style={{ ...box(113, 160), ...fs(60) }}><em>growth story.</em></span>
          </h1>
          <p className="st-t bodyt" style={{ ...box(96, 247, 400), ...fs(17) }}>Tell us a little about your business and a specialist will be in touch within one business day.<br />No obligation, just honest advice.</p>
          {[['Fast response', '(within 1 business day)', 122], ['Real people', 'NZ-based team', 315], ['No obligation', 'Honest, practical advice', 477]].map(([t, s, x]) => (
            <span key={t as string} className="st-t badge" style={{ ...box(x as number, 336) }}>
              <b style={fs(13)}>{t}</b><small style={fs(10.2)}>{s}</small>
            </span>
          ))}

          {/* team card */}
          <T at={[110, 442]} size={12.5} className="eye gold">Talk to a real team —</T>
          <h2 className="st-t h-team" style={{ ...box(112, 458), ...fs(31.5) }}>Based in Auckland,<br />working <em>nationwide.</em></h2>
          <p className="st-t team-p" style={{ ...box(110, 539, 320), ...fs(14.2) }}>We&apos;re a NZ-based team that understands the local market. No offshore call centres, just real people who care about your results.</p>

          {/* contact pills */}
          <T at={[181, 685]} size={12.5} className="eye gold">Email</T>
          <a className="st-t val st-mail" href={`mailto:${p.email}`} style={{ ...box(180, 697), ...fs(19.5) }}>{p.email}</a>
          <button type="button" className="st-copy" style={box(428, 689, 38, 38)} onClick={p.copyEmail} aria-label="Copy email address"><Icon name="clipboard" size={16} /></button>
          <T at={[181, 757]} size={12.5} className="eye gold">Location</T>
          <T at={[180, 770]} size={19.5} className="val">Auckland, New Zealand</T>
          <T at={[182, 830]} size={12.5} className="eye gold">Hours</T>
          {p.now && <span className={`st-t livet${p.now.open ? ' open' : ''}`} style={{ ...box(246, 830), ...fs(11) }}><i />{p.now.status}</span>}
          <T at={[182, 843]} size={19.5} className="val">Mon–Fri, 9am–6pm NZT</T>

          {/* steps */}
          <h2 className="st-t h-steps" style={{ ...box(101, 929), ...fs(31) }}>What happens next?</h2>
          <ol className="st-steps">
            <li className="st-t step" style={{ ...box(170, 977), ...fs(14.6) }}>We review your enquiry within<br />one business day</li>
            <li className="st-t step" style={{ ...box(170, 1026), ...fs(14.6) }}>A specialist calls to discuss your goals</li>
            <li className="st-t step" style={{ ...box(170, 1060), ...fs(14.6) }}>You receive a tailored proposal<br />within 48 hours</li>
            <li className="st-t step" style={{ ...box(170, 1103), ...fs(14.6) }}>You decide. Zero pressure,<br />zero obligation.</li>
          </ol>

          {/* the form */}
          <h2 className="st-t f-title" id="enquiry" style={{ ...box(640, 428), ...fs(33.5) }}>Tell us about your business</h2>
          {p.sent ? (
            <div className="st-done" role="status" style={box(508, 486, 636, 690)}>
              <div className="dn" aria-hidden="true"><span className="dn-ring" /><svg className="tick" viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg></div>
              <h3 style={fs(30)}>Thanks, {form.name.trim().split(' ')[0]}.</h3>
              <p style={fs(15.5)}>Your email app should have opened with your enquiry ready to send. If it didn&apos;t, email us at <a href={`mailto:${p.email}`}>{p.email}</a> and a specialist will reply within one business day.</p>
              <div className="dn-acts"><button type="button" onClick={() => p.setSent(false)} style={fs(15)}>Edit my enquiry</button><Link href="/" style={fs(15)}>Back to home</Link></div>
            </div>
          ) : (
            <form className="st-form" onSubmit={onSend} noValidate>
              <FieldPill id="d-name" b={[522, 499, 812, 542]} x0={574} label="Full name *" value={form.name} onChange={v => p.set('name', v)} onBlur={() => p.touch('name')} error={p.show('name')} valid={!p.errs.name} autoComplete="name" />
              <FieldPill id="d-email" b={[830, 499, 1132, 542]} x0={892} label="Email *" type="email" inputMode="email" value={form.email} onChange={v => p.set('email', v)} onBlur={() => p.touch('email')} error={p.show('email')} valid={!p.errs.email} autoComplete="email" />
              <FieldPill id="d-phone" b={[522, 554, 812, 598]} x0={582} label="Phone" type="tel" inputMode="tel" value={form.phone} onChange={v => p.set('phone', v)} onBlur={() => p.touch('phone')} error={p.show('phone')} valid={!p.errs.phone} autoComplete="tel" />
              <FieldPill id="d-business" b={[830, 554, 1132, 598]} x0={892} label="Business name *" value={form.business} onChange={v => p.set('business', v)} onBlur={() => p.touch('business')} error={p.show('business')} valid={!p.errs.business} autoComplete="organization" />

              <fieldset className="st-fs" aria-describedby={p.show('services') ? 'd-svc-err' : undefined}>
                <legend id="d-svc-legend" tabIndex={-1} className="st-t lgd" style={{ ...box(525, 608), ...fs(17.5) }}>Service of interest *</legend>
                {CHIPS.map(c => {
                  const on = form.services.includes(c.name)
                  const [l, t, r, b] = c.b
                  return (
                    <button key={c.name} type="button" className={`sc${on ? ' on' : ''}${c.name === 'Website Design' ? ' own-ic' : ''}`} aria-pressed={on} onClick={() => p.toggleService(c.name)} style={box(l, t, r - l, b - t)}>
                      <span className="sc-ic" style={{ left: `${((c.ic - 10 - l) / (r - l)) * 100}%` }}>{CHIP_ICONS[c.name]}</span>
                      <span className="sc-l" style={{ left: `${((c.tx - l) / (r - l)) * 100}%`, ...fs(13.9) }}>{c.name}</span>
                    </button>
                  )
                })}
                {p.show('services') && <p className="sf-err chips" id="d-svc-err" role="alert" style={{ ...box(690, 610), ...fs(12.5) }}>{p.errs.services}</p>}
              </fieldset>

              <fieldset className="st-fs">
                <legend className="st-t lgd" style={{ ...box(527, 815), ...fs(17.5) }}>Monthly budget</legend>
                <div role="radiogroup" aria-label="Monthly budget">
                  {BUDGETS.map(c => {
                    const on = form.budget === c.name
                    const [l, t, r, b] = c.b
                    return (
                      <button key={c.name} type="button" role="radio" aria-checked={on} className={`sc b${on ? ' on' : ''}`} onClick={() => p.set('budget', on ? '' : c.name)} style={box(l, t, r - l, b - t)}>
                        <span className="sc-l c" style={fs(14.4)}>{c.name}</span>
                      </button>
                    )
                  })}
                </div>
              </fieldset>

              <label htmlFor="d-message" className="st-t lgd" style={{ ...box(527, 924), ...fs(17.5) }}>Your goals *</label>
              <div className={`sf ta${p.show('message') ? ' err' : ''}${!p.errs.message ? ' ok' : ''}`} style={box(525, 957, 605, 81)}>
                <textarea id="d-message" name="message" value={form.message} placeholder="Tell us what you’re looking to achieve…" rows={2}
                  onChange={e => p.set('message', e.target.value)} onBlur={() => p.touch('message')}
                  aria-invalid={!!p.show('message')} aria-describedby={`d-message-count${p.show('message') ? ' d-message-err' : ''}`} style={fs(15)} />
                <span className={`sf-count${form.message.trim().length >= p.minGoals ? ' good' : ''}`} id="d-message-count" style={fs(11)}>
                  {form.message.trim().length < p.minGoals ? `${form.message.trim().length} / ${p.minGoals} min` : `${form.message.length} characters`}
                </span>
                {p.show('message') && <p className="sf-err" id="d-message-err" role="alert" style={fs(12.5)}>{p.errs.message}</p>}
              </div>

              <button type="submit" className={`st-send live3d${sending ? ' sending' : ''}`} style={{ ...box(527, 1062, 590, 65), '--bx': 527, '--by': 1062 } as CSSProperties}
                onPointerMove={tiltMove} onPointerLeave={tiltLeave} aria-busy={sending}>
                <span className="lv-face">
                  <span className="snd-plane" aria-hidden="true" />
                  <span className="snd-l" style={fs(25.5)}>{sending ? 'Sending…' : 'Send enquiry'}</span>
                  <Live coin={[92, 49]} />
                  <i className="lv-progress" aria-hidden="true" />
                </span>
              </button>
              <p className="st-t fnote" style={{ ...box(623, 1149), ...fs(12.3) }}>No spam and no lock-in contracts. Just genuine advice from a real NZ team.</p>
            </form>
          )}
        </div>
      </div>

      {/* Xen: always the top layer (portalled to <body>), slides in once there is something to draft */}
      {mounted && !p.sent && createPortal(
        <aside className={`st-xen${form.services.length || form.budget || form.message.trim() ? ' on' : ''}${fold ? ' fold' : ''}`} aria-label="Live plan preview" tabIndex={-1}>
          <div className="st-xen-meter" role="progressbar" aria-label="Form completion" aria-valuenow={p.pct} aria-valuemin={0} aria-valuemax={100}>
            <svg viewBox="0 0 44 44" aria-hidden="true"><circle cx="22" cy="22" r="19" /><circle cx="22" cy="22" r="19" className="m-on" style={{ strokeDashoffset: 119.4 * (1 - p.pct / 100) }} /></svg>
            <b>{p.pct}%</b>
          </div>
          <LiveBrief services={form.services} budget={form.budget} message={form.message} business={form.business} />
        </aside>,
        document.body,
      )}
    </div>
  )
}
