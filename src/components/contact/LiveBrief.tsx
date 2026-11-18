'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import { PLANS, STEPS } from '@/components/v5/data'

// Live plan preview. Simple client-side rules turn the visitor's own choices
// into a starting outline: closest plan (from the site's real plan prices),
// focus mix, timeline (from the site's real process steps) and the goals we
// picked up from their text. Nothing is sent anywhere and it is clearly an
// estimate, not a quote or an AI answer.

type Cat = 'build' | 'advertise' | 'grow' | 'automate'
const CAT_OF: Record<string, Cat | null> = {
  'Website Design': 'build', SEO: 'build', 'Brand Identity': 'build',
  'Google Ads': 'advertise', 'Facebook Ads': 'advertise', 'Lead Generation': 'advertise',
  'Social Media Management': 'grow', 'Content Creation': 'grow',
  'AI Chatbot': 'automate', 'AI Automation': 'automate', Other: null,
}
const CATS: { key: Cat; label: string }[] = [
  { key: 'build', label: 'Build' }, { key: 'advertise', label: 'Advertise' }, { key: 'grow', label: 'Grow' }, { key: 'automate', label: 'Automate' },
]
const PLAN_FOR: Record<string, number> = {
  'Under $500/month': 0, '$500 – $1,000/month': 1, '$1,000 – $2,500/month': 2, '$2,500 – $5,000/month': 3, '$5,000+/month': 4,
}
const GOALS: { re: RegExp; label: string }[] = [
  { re: /lead|enquir|inquir|quote|calls?\b/i, label: 'more leads' },
  { re: /sale|revenue|sell|orders?\b|shop|e-?commerce/i, label: 'more sales' },
  { re: /book|appointment|reservation|clients?\b|patients?\b/i, label: 'more bookings' },
  { re: /rank|google|seo|traffic|found|visib|search/i, label: 'getting found online' },
  { re: /brand|aware|social|follow|audience|instagram|tiktok/i, label: 'brand awareness' },
  { re: /automat|time|admin|chat|respond|24\/7|after.?hours|manual/i, label: 'saving time with AI' },
  { re: /website|site|redesign|landing|page/i, label: 'a stronger website' },
]

export type BriefInput = { services: string[]; budget: string; message: string; business: string }

export default function LiveBrief({ services, budget, message, business }: BriefInput) {
  const brief = useMemo(() => {
    const counts: Record<Cat, number> = { build: 0, advertise: 0, grow: 0, automate: 0 }
    const full = services.includes('Full-Service Package')
    services.forEach(s => { const c = CAT_OF[s]; if (c) counts[c]++ })
    if (full) CATS.forEach(c => { counts[c.key] = Math.max(counts[c.key], 1) })
    const max = Math.max(1, ...Object.values(counts))
    const mix = CATS.filter(c => counts[c.key] > 0).map(c => ({ ...c, w: counts[c.key] / max }))
    const goals = GOALS.filter(g => g.re.test(message)).map(g => g.label)
    const planIdx = PLAN_FOR[budget]
    const plan = planIdx === undefined ? null : PLANS[planIdx]
    const has = (k: Cat) => counts[k] > 0
    const timeline = [
      { t: STEPS[0].title, w: STEPS[0].when },
      { t: STEPS[1].title, w: STEPS[1].when },
      ...(has('build') || has('automate') ? [{ t: STEPS[2].title, w: STEPS[2].when }] : []),
      ...(has('advertise') || has('grow') || has('automate') ? [{ t: STEPS[3].title, w: STEPS[3].when }] : []),
    ]
    const focus = full ? 'A full-service' : mix.length ? `A ${mix.map(m => m.label).join(' + ')}` : 'A tailored'
    const name = business.trim()
    const sentence = !services.length && !goals.length && !budget
      ? ''
      : `${focus} plan${name ? ` for ${name}` : ''}${goals.length ? `, aimed at ${goals.slice(0, 2).join(' and ')}` : ''}.`
    const filled = services.length > 0 || goals.length > 0 || !!budget
    return { mix, goals, plan, timeline, sentence, filled, notSure: budget === 'Not sure yet' }
  }, [services, budget, message, business])

  // drafting shimmer, then a typewriter reveal whenever the summary changes
  const [typed, setTyped] = useState('')
  const [drafting, setDrafting] = useState(false)
  const timer = useRef<number | null>(null)
  useEffect(() => {
    const target = brief.sentence
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    let i = 0
    const start = window.setTimeout(() => {
      if (!target) { setTyped(''); setDrafting(false); return }
      if (reduce) { setTyped(target); return }
      setDrafting(true)
      timer.current = window.setTimeout(function tick() {
        setDrafting(false)
        i = Math.min(target.length, i + 2)
        setTyped(target.slice(0, i))
        if (i < target.length) timer.current = window.setTimeout(tick, 16)
      }, 420)
    }, 260) // debounce while typing
    return () => { clearTimeout(start); if (timer.current) clearTimeout(timer.current) }
  }, [brief.sentence])

  const done = typed.length > 0 && typed === brief.sentence

  return (
    <section className={`lb${brief.filled ? ' on' : ''}`} aria-label="Live plan preview" aria-live="polite">
      <div className="lb-head">
        <span className="lb-orb" aria-hidden="true"><i /><i /></span>
        <div>
          <p className="lb-t">Xen <span>· live plan preview</span></p>
          <p className="lb-s">{brief.filled ? (drafting ? 'Drafting your plan…' : 'Updates as you fill in the form') : 'Pick a service or describe your goals to start a draft'}</p>
        </div>
        <span className="lb-tag">Estimate</span>
      </div>

      {brief.filled ? (
        <div className="lb-body">
          <p className={`lb-line${drafting ? ' drafting' : ''}${done ? ' done' : ''}`}>
            {drafting ? <><span className="sk" /><span className="sk s2" /></> : <>{typed}<span className="caret" aria-hidden="true" /></>}
          </p>
          <div className="lb-grid">
            <div className="lb-cell">
              <small>Closest plan</small>
              {brief.plan ? (
                <b>{brief.plan.name}<em>{brief.plan.price === 'Custom' ? ' · custom pricing' : ` · from ${brief.plan.price}/mo`}</em></b>
              ) : (
                <b className="dim">{brief.notSure ? 'We’ll recommend one on the call' : 'Choose a budget to match a plan'}</b>
              )}
            </div>
            <div className="lb-cell">
              <small>Focus mix</small>
              {brief.mix.length ? (
                <ul className="lb-mix">
                  {brief.mix.map(m => (
                    <li key={m.key} className={`c-${m.key}`}><span>{m.label}</span><i style={{ '--w': m.w } as React.CSSProperties} /></li>
                  ))}
                </ul>
              ) : <b className="dim">Pick services to see the mix</b>}
            </div>
            <div className="lb-cell wide">
              <small>How it would run</small>
              <ol className="lb-steps">
                {brief.timeline.map((s, i) => <li key={s.t} style={{ '--i': i } as React.CSSProperties}><b>{s.t}</b><span>{s.w}</span></li>)}
              </ol>
            </div>
            {brief.goals.length > 0 && (
              <div className="lb-cell wide">
                <small>Goals we picked up</small>
                <p className="lb-goals">{brief.goals.map(g => <span key={g}>{g}</span>)}</p>
              </div>
            )}
          </div>
          <p className="lb-note">A starting outline from your answers, not a quote. A specialist confirms the real plan with you.</p>
        </div>
      ) : (
        <div className="lb-empty" aria-hidden="true"><span /><span /><span /></div>
      )}
    </section>
  )
}
