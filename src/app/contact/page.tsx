'use client'
import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Icon, { type IconName } from '@/components/Icon'
import LiveBrief from '@/components/contact/LiveBrief'
import Stage from '@/components/contact/Stage'
import { Fern, Monogram, NzMap } from '@/components/contact/Decor'
import { Blob, BlobClip, CHIP_ICONS, MountainArt, PorcelainRim, SkylineGold } from '@/components/contact/v2'
import './contact.css'
import './preview.css'

const EMAIL = 'hello@nextxen.co.nz'
const SERVICES = ['Website Design', 'SEO', 'Facebook Ads', 'Google Ads', 'Social Media Management', 'AI Chatbot', 'AI Automation', 'Content Creation', 'Brand Identity', 'Lead Generation', 'Full-Service Package', 'Other']
const BUDGETS = ['Under $500/month', '$500 – $1,000/month', '$1,000 – $2,500/month', '$2,500 – $5,000/month', '$5,000+/month', 'Not sure yet']
const NEXT = ['We review your enquiry within one business day', 'A specialist calls to discuss your goals', 'You receive a tailored proposal within 48 hours', 'You decide. Zero pressure, zero obligation.']
const MIN_GOALS = 20
// city lights that twinkle over the harbour photo (positions within the window, in %)
const LIGHTS = [[41, 57], [46, 55], [52, 56.5], [57, 54], [61, 57], [66, 55.5], [70, 57.5], [74, 54.5], [78, 56], [83, 55], [87, 57], [91, 55.5], [95, 56.5], [49, 59], [63, 59.5], [80, 59], [36, 58], [68, 52]]

type Form = { name: string; email: string; phone: string; business: string; services: string[]; budget: string; message: string }
type Key = 'name' | 'email' | 'phone' | 'business' | 'services' | 'message'

const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())
const phoneOk = (v: string) => /^[+(]?[\d\s()-]{7,}$/.test(v.trim())
function validate(f: Form): Partial<Record<Key, string>> {
  const e: Partial<Record<Key, string>> = {}
  if (f.name.trim().length < 2) e.name = 'Please tell us your name'
  if (!f.email.trim()) e.email = 'We need an email to reply to'
  else if (!emailOk(f.email)) e.email = 'That email doesn’t look quite right'
  if (f.phone.trim() && !phoneOk(f.phone)) e.phone = 'Check the number, or leave it blank'
  if (f.business.trim().length < 2) e.business = 'What’s your business called?'
  if (!f.services.length) e.services = 'Pick at least one service'
  if (f.message.trim().length < MIN_GOALS) e.message = `A little more detail helps (${MIN_GOALS}+ characters)`
  return e
}

function useNzNow() {
  const [now, setNow] = useState<Date | null>(null)
  useEffect(() => {
    const id0 = requestAnimationFrame(() => setNow(new Date()))
    const id = setInterval(() => setNow(new Date()), 15000)
    return () => { cancelAnimationFrame(id0); clearInterval(id) }
  }, [])
  return useMemo(() => {
    if (!now) return null
    const parts = new Intl.DateTimeFormat('en-NZ', { timeZone: 'Pacific/Auckland', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' }).formatToParts(now)
    const get = (t: string) => parts.find(p => p.type === t)?.value ?? ''
    const day = get('weekday'), h = Number(get('hour'))
    const weekday = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].includes(day)
    const open = weekday && h >= 9 && h < 18
    const status = open ? 'Open now · closes 6pm' : weekday && h < 9 ? 'Closed · opens 9am today'
      : day === 'Fri' || day === 'Sat' || day === 'Sun' ? 'Closed · opens Mon 9am' : 'Closed · opens 9am tomorrow'
    const clock = new Intl.DateTimeFormat('en-NZ', { timeZone: 'Pacific/Auckland', hour: 'numeric', minute: '2-digit', hour12: true }).format(now)
    return { open, status, clock: clock.replace(/\s?([ap])\.?m\.?/i, (_, a: string) => ` ${a.toLowerCase()}m`) }
  }, [now])
}

const PlaneIcon = () => (
  <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" aria-hidden="true">
    <path d="M21.5 2.5 2.8 10.1c-.8.3-.8 1.5.1 1.7l7 2 2 7c.2.9 1.4 1 1.7.1L21.5 2.5z" /><path d="m10 14 5.5-5.5" />
  </svg>
)
const Bubble = () => (
  <svg viewBox="0 0 64 64" aria-hidden="true">
    <defs>
      <radialGradient id="bbg" cx=".35" cy=".3" r=".8"><stop offset="0" stopColor="#fff4cf" /><stop offset=".45" stopColor="#e7bd5f" /><stop offset="1" stopColor="#8f6214" /></radialGradient>
      <linearGradient id="bbh" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff" stopOpacity=".85" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></linearGradient>
    </defs>
    <path d="M32 7c14 0 25 9.2 25 20.6S46 48.2 32 48.2c-2.6 0-5.1-.3-7.5-1L13 53l3.2-10C11 39.2 7 33.8 7 27.6 7 16.2 18 7 32 7z" fill="url(#bbg)" />
    <ellipse cx="27" cy="16" rx="13" ry="5" fill="url(#bbh)" />
    {[21, 32, 43].map(x => <circle key={x} cx={x} cy="28" r="3.4" fill="#5b3e0c" />)}
  </svg>
)
const Tick = () => <svg className="tick" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>

function Field({ id, label, icon, type = 'text', value, onChange, onBlur, error, valid, autoComplete, inputMode }: {
  id: string; label: string; icon: IconName; type?: string; value: string; onChange: (v: string) => void; onBlur: () => void
  error?: string; valid: boolean; autoComplete?: string; inputMode?: 'email' | 'tel' | 'text'
}) {
  return (
    <div className={`xf${error ? ' err' : ''}${valid ? ' ok' : ''}`}>
      <span className="xf-ic" aria-hidden="true"><Icon name={icon} size={19} /></span>
      <input id={id} name={id} type={type} value={value} placeholder=" " autoComplete={autoComplete} inputMode={inputMode}
        onChange={e => onChange(e.target.value)} onBlur={onBlur} aria-invalid={!!error} aria-describedby={error ? `${id}-err` : undefined} />
      <label htmlFor={id}>{label}</label>
      <Tick />
      <i className="xf-sweep" aria-hidden="true" />
      {error && <p className="xf-err" id={`${id}-err`} role="alert">{error}</p>}
    </div>
  )
}

export default function ContactPreview() {
  const [form, setForm] = useState<Form>({ name: '', email: '', phone: '', business: '', services: [], budget: '', message: '' })
  const [touched, setTouched] = useState<Partial<Record<Key, boolean>>>({})
  const [tried, setTried] = useState(false)
  const [sent, setSent] = useState(false)
  const [toast, setToast] = useState('')
  const toastT = useRef<number | null>(null)
  const root = useRef<HTMLDivElement>(null)
  const now = useNzNow()

  // subtle parallax: blobs drift a few pixels with the pointer (desktop only)
  useEffect(() => {
    const el = root.current
    if (!el || !matchMedia('(hover: hover) and (pointer: fine)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        el.style.setProperty('--mx', ((e.clientX / innerWidth) * 2 - 1).toFixed(3))
        el.style.setProperty('--my', ((e.clientY / innerHeight) * 2 - 1).toFixed(3))
      })
    }
    addEventListener('pointermove', onMove, { passive: true })
    return () => { removeEventListener('pointermove', onMove); cancelAnimationFrame(raf) }
  }, [])
  useEffect(() => () => { if (toastT.current) clearTimeout(toastT.current) }, [])

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm(f => ({ ...f, [k]: v }))
  const touch = (k: Key) => setTouched(t => ({ ...t, [k]: true }))
  const errs = validate(form)
  const show = (k: Key) => (tried || touched[k]) ? errs[k] : undefined
  const required: Key[] = ['name', 'email', 'business', 'services', 'message']
  const pct = Math.round((required.filter(k => !errs[k]).length / required.length) * 100)

  const flash = (msg: string) => {
    setToast(msg)
    if (toastT.current) clearTimeout(toastT.current)
    toastT.current = window.setTimeout(() => setToast(''), 2400)
  }
  const copyEmail = async () => {
    try { await navigator.clipboard.writeText(EMAIL); flash('Email address copied') } catch { flash(`Copy failed. Our email is ${EMAIL}`) }
  }
  const toggleService = (s: string) => { set('services', form.services.includes(s) ? form.services.filter(x => x !== s) : [...form.services, s]); touch('services') }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setTried(true)
    const first = required.concat('phone').find(k => errs[k])
    if (first) {
      const pfx = matchMedia('(min-width: 1200px), (min-width: 900px) and (hover: hover) and (pointer: fine)').matches ? 'd-' : ''
      const el = document.getElementById(pfx + (first === 'services' ? 'svc-legend' : first))
      el?.focus(); el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    // No form backend yet: hand the enquiry to the visitor's email app rather than claim it was sent.
    const body = [`Name: ${form.name}`, `Email: ${form.email}`, `Phone: ${form.phone || '-'}`, `Business: ${form.business}`,
      `Services: ${form.services.join(', ')}`, `Budget: ${form.budget || '-'}`, '', form.message].join('\n')
    window.location.assign(`mailto:${EMAIL}?subject=${encodeURIComponent(`New enquiry: ${form.business}`)}&body=${encodeURIComponent(body)}`)
    setSent(true)
  }

  const d = (ms: number) => ({ '--d': `${ms}ms` } as CSSProperties)

  return (
    <>
    <div className="cx-desk">
      <Stage form={form} set={set} touch={touch} toggleService={toggleService} errs={errs} show={show} pct={pct} minGoals={MIN_GOALS}
        submit={submit} sent={sent} setSent={setSent} copyEmail={copyEmail} now={now} email={EMAIL} />
    </div>
    <div className="cx cx-mob" ref={root}>
      <BlobClip id="cx-frame-clip" shape="window" />
      <div className="cx-bg" aria-hidden="true"><i className="sh s1" /><i className="sh s2" /><i className="sh s3" /></div>
      <div className="cx-leaves" aria-hidden="true">
        <Image className="lf lf-tl" src="/contact/leaf-tl.webp" alt="" width={208} height={504} unoptimized priority />
        <Image className="lf lf-r" src="/contact/leaf-r.webp" alt="" width={84} height={500} unoptimized />
        <Image className="lf lf-br" src="/contact/leaf-tl.webp" alt="" width={208} height={504} unoptimized />
      </div>

      <section className="wrap cx-hero">
        <div className="cx-intro">
          <p className="cx-eye hero-fade">Contact us</p>
          <h1 className="cx-h1 hero-fade" style={d(80)}>Start your <em>growth story.</em></h1>
          <p className="cx-lead hero-fade" style={d(160)}>Tell us a little about your business and a specialist will be in touch within one business day. No obligation, just honest advice.</p>
          <ul className="cx-badges hero-fade" style={d(240)}>
            {([['zap', 'Fast response', 'Within 1 business day'], ['users', 'Real people', 'NZ-based team'], ['shield', 'No obligation', 'Honest, practical advice']] as [IconName, string, string][]).map(([ic, t, s]) => (
              <li key={t}><span className="bd-ic"><Icon name={ic} size={20} /></span><span><b>{t}</b><small>{s}</small></span></li>
            ))}
          </ul>
        </div>

        <div className="cx-scene hero-fade" style={d(200)}>
          <div className="cx-window">
            <div className="cx-photo">
              <Image src="/contact/harbour.webp" alt="Auckland's Waitematā Harbour and the Sky Tower at sunset" fill sizes="(max-width: 1100px) 100vw, 56vw" unoptimized priority />
              <i className="cx-clouds" aria-hidden="true" />
              <i className="cx-water" aria-hidden="true" />
              {LIGHTS.map(([x, y], i) => <i key={i} className="cx-light" aria-hidden="true" style={{ left: `${x}%`, top: `${y}%`, '--i': i } as CSSProperties} />)}
            </div>
          </div>
          <PorcelainRim shape="window" className="cx-rim" />
          <span className="cx-coin" aria-hidden="true"><Monogram /></span>
          <Blob shape="pill" mat="glass" rim={3} className="cx-fernpill"><Fern silver leaflets={14} /></Blob>
        </div>
      </section>

      <section className="wrap cx-main">
        <aside className="cx-side" aria-label="Contact details">
          <Blob shape="card" mat="glass" className="cx-team rv rv-up">
            <p className="xg-eye">Talk to a real team</p>
            <h2 className="xg-h">Based in Auckland, working <em>nationwide.</em></h2>
            <p className="xg-p">We&apos;re a NZ-based team that understands the local market. No offshore call centres, just real people who care about your results.</p>
            <SkylineGold className="xg-sky" />
          </Blob>

          <Blob shape="tall" mat="cream" className="cx-tray rv rv-up" style={d(80)}>
            <div className="gp">
              <span className="gp-coin"><Icon name="mail" size={20} /></span>
              <div className="gp-t"><small>Email</small><a href={`mailto:${EMAIL}`}>{EMAIL}</a></div>
              <button type="button" className="gp-copy" onClick={copyEmail} aria-label="Copy email address"><Icon name="clipboard" size={18} /></button>
            </div>
            <div className="gp">
              <span className="gp-coin"><Icon name="pin" size={20} /></span>
              <div className="gp-t"><small>Location</small><span>Auckland, New Zealand</span></div>
              <NzMap className="gp-art map" />
            </div>
            <div className="gp">
              <span className="gp-coin"><Icon name="clock" size={20} /></span>
              <div className="gp-t">
                <small>Hours</small><span>Mon–Fri, 9am–6pm NZT</span>
                {now && <em className={`live${now.open ? ' open' : ''}`}><i />{now.status} · NZ {now.clock}</em>}
              </div>
              <MountainArt className="gp-art mtn" />
            </div>
          </Blob>

          <Blob shape="steps" mat="glass" className="cx-next rv rv-up" style={d(140)}>
            <h2 className="xg-h sm">What happens next?</h2>
            <ol className="xn">
              {NEXT.map((s, i) => <li key={s} style={{ '--i': i } as CSSProperties}><span className="xn-n">{i + 1}</span><span>{s}</span></li>)}
            </ol>
            <Image className="xg-fern" src="/contact/fern-rock.webp" alt="" width={392} height={460} unoptimized />
          </Blob>
        </aside>

        <Blob shape="form" mat="cream" rim={3.5} className="cx-formblob rv rv-up" style={d(100)}>
          {sent ? (
            <div className="cx-done" role="status">
              <div className="dn" aria-hidden="true"><span className="dn-ring" /><span className="dn-plane"><PlaneIcon /></span><Tick /></div>
              <h2 className="cx-ftitle">Thanks, {form.name.trim().split(' ')[0]}.</h2>
              <p className="cx-fsub">Your email app should have opened with your enquiry ready to send. If it didn&apos;t, email us at <a href={`mailto:${EMAIL}`}>{EMAIL}</a> and a specialist will reply within one business day.</p>
              <div className="dn-acts">
                <button type="button" className="cx-ghost" onClick={() => setSent(false)}>Edit my enquiry</button>
                <Link href="/" className="cx-ghost">Back to home</Link>
              </div>
            </div>
          ) : (
            <form className="cx-form" onSubmit={submit} noValidate>
              <div className="cx-fhead">
                <span className="cx-bubble"><Bubble /></span>
                <h2 className="cx-ftitle">Tell us about your business</h2>
                <div className="cx-meter" role="progressbar" aria-label="Form completion" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
                  <svg viewBox="0 0 44 44" aria-hidden="true"><circle cx="22" cy="22" r="19" /><circle cx="22" cy="22" r="19" className="m-on" style={{ strokeDashoffset: 119.4 * (1 - pct / 100) }} /></svg>
                  <b>{pct}%</b>
                </div>
              </div>

              <div className="cx-grid2">
                <Field id="name" label="Full name *" icon="users" value={form.name} onChange={v => set('name', v)} onBlur={() => touch('name')} error={show('name')} valid={!errs.name} autoComplete="name" />
                <Field id="email" label="Email *" icon="mail" type="email" inputMode="email" value={form.email} onChange={v => set('email', v)} onBlur={() => touch('email')} error={show('email')} valid={!errs.email} autoComplete="email" />
                <Field id="phone" label="Phone" icon="phone" type="tel" inputMode="tel" value={form.phone} onChange={v => set('phone', v)} onBlur={() => touch('phone')} error={show('phone')} valid={!!form.phone.trim() && !errs.phone} autoComplete="tel" />
                <Field id="business" label="Business name *" icon="briefcase" value={form.business} onChange={v => set('business', v)} onBlur={() => touch('business')} error={show('business')} valid={!errs.business} autoComplete="organization" />
              </div>

              <fieldset className={`cx-chips${show('services') ? ' err' : ''}`} aria-describedby={show('services') ? 'svc-err' : undefined}>
                <legend id="svc-legend" tabIndex={-1}>Service of interest * <span>choose any</span></legend>
                <div className="chips">
                  {SERVICES.map(s => {
                    const on = form.services.includes(s)
                    return <button type="button" key={s} className={`xchip${on ? ' on' : ''}`} aria-pressed={on} onClick={() => toggleService(s)}><span className="xchip-ic">{CHIP_ICONS[s]}</span><span>{s}</span></button>
                  })}
                </div>
                {show('services') && <p className="xf-err" id="svc-err" role="alert">{errs.services}</p>}
              </fieldset>

              <fieldset className="cx-chips">
                <legend>Monthly budget</legend>
                <div className="chips" role="radiogroup" aria-label="Monthly budget">
                  {BUDGETS.map(b => {
                    const on = form.budget === b
                    return <button type="button" role="radio" aria-checked={on} key={b} className={`xchip b${on ? ' on' : ''}`} onClick={() => set('budget', on ? '' : b)}><span>{b}</span></button>
                  })}
                </div>
              </fieldset>

              <div className={`xf ta${show('message') ? ' err' : ''}${!errs.message ? ' ok' : ''}`}>
                <span className="xf-ic" aria-hidden="true"><Icon name="target" size={19} /></span>
                <textarea id="message" name="message" value={form.message} placeholder=" " rows={2}
                  onChange={e => set('message', e.target.value)} onBlur={() => touch('message')}
                  aria-invalid={!!show('message')} aria-describedby={`message-count${show('message') ? ' message-err' : ''}`} />
                <label htmlFor="message">Your goals *</label>
                <span className="xf-hint" aria-hidden="true">Tell us what you&apos;re looking to achieve…</span>
                <Tick />
                <i className="xf-sweep" aria-hidden="true" />
                <span className={`xf-count${form.message.trim().length >= MIN_GOALS ? ' good' : ''}`} id="message-count">
                  {form.message.trim().length < MIN_GOALS ? `${form.message.trim().length} / ${MIN_GOALS} min` : `${form.message.length} characters`}
                </span>
                {show('message') && <p className="xf-err" id="message-err" role="alert">{errs.message}</p>}
              </div>

              <LiveBrief services={form.services} budget={form.budget} message={form.message} business={form.business} />

              <button type="submit" className="cx-send" data-magnetic>
                <span className="snd-plane"><PlaneIcon /></span>
                <span className="snd-l">Send enquiry</span>
                <span className="snd-coin"><Icon name="arrow" size={20} stroke={2.2} /></span>
                <i className="snd-sheen" aria-hidden="true" />
              </button>
              <p className="cx-fine"><Icon name="lock" size={15} /> No spam and no lock-in contracts. Just genuine advice from a real NZ team.</p>
            </form>
          )}
        </Blob>
      </section>

      <div className="cx-ribbons" aria-hidden="true" />
    </div>
    <div className={`cx-toast${toast ? ' on' : ''}`} role="status" aria-live="polite">{toast && <><Icon name="checkCircle" size={16} />{toast}</>}</div>
    </>
  )
}
