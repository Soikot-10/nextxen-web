import Link from 'next/link'
import type { CSSProperties } from 'react'
import { Words, ScrubText } from '@/components/ScrollReveal'
import AnimatedCounter from '@/components/AnimatedCounter'
import FaqSection from '@/components/FaqSection'
import HeroV5 from '@/components/v5/HeroV5'
import ServicesV5 from '@/components/v5/ServicesV5'
import PricingSection from '@/components/PricingSection'
import Icon, { type IconName } from '@/components/Icon'
import Orb3D from '@/components/Orb3D'
import ClayTestimonials from '@/components/ClayTestimonials'
import ServicesOrb from '@/components/ServicesOrb'
import XenSection from '@/components/XenSection'
import { industries } from '@/data/industries'
import { blogPosts } from '@/data/blogs'
import HomeTop from '@/components/home/HomeTop'
import './home.css'
import './top.css'

// Three pillars, each pairing two of the studio's principles.
const approach: { icon: IconName; color: string; kicker: string; title: string; desc: string; also: { title: string; desc: string } }[] = [
  { icon: 'cpu', color: '#d4ff3a', kicker: 'Intelligence', title: 'AI-first, human-led', desc: 'We use AI to automate the busywork, personalise every touchpoint and move faster than traditional agencies, with senior people making the calls.',
    also: { title: 'Always on', desc: 'AI assistants answer enquiries at 3am, campaigns optimise overnight and content publishes on schedule.' } },
  { icon: 'pin', color: '#7cf7ff', kicker: 'Local', title: 'Built for New Zealand', desc: 'From Auckland to Invercargill, we know your customers, your competitors and what it takes to win in a small, word-of-mouth market.',
    also: { title: 'Precision targeting', desc: 'Your message reaches the right people at the right moment, so budget goes to buyers rather than browsers.' } },
  { icon: 'chart', color: '#b794ff', kicker: 'Accountable', title: 'Measured to the dollar', desc: 'Every click, call and conversion is tracked, so you always know exactly what your investment is returning.',
    also: { title: 'One team, end to end', desc: 'Brand, website, ads, content and automation under one roof. One strategy, one point of contact, one invoice.' } },
]

const steps = [
  { title: 'Discovery call', desc: 'A 30-minute conversation about your business, goals and what has or hasn’t worked so far.', when: 'Day 1' },
  { title: 'Strategy & proposal', desc: 'A clear plan with channels, budget and targets, tailored to your market. No templates.', when: 'Within 48 hours' },
  { title: 'Build & launch', desc: 'We set up tracking, creative, campaigns and automations, then go live.', when: '5–7 days' },
  { title: 'Optimise & report', desc: 'Continuous testing and a plain-English monthly report on leads, cost and return.', when: 'Every month' },
]

const testimonials = [
  { name: 'Rachel Thompson', company: 'Thompson Real Estate, Auckland', initials: 'RT', metric: '74', from: '8', metricLabel: 'qualified enquiries per month', chart: { kind: 'bars' as const, a: 8, b: 74, la: '8', lb: '74' }, text: 'NEXTXEN transformed our lead generation. The ROI has been extraordinary.' },
  { name: 'Mike Patterson', company: 'Patterson Electrical, Waikato', initials: 'MP', metric: '100%', from: '', metricLabel: 'local, qualified leads', chart: { kind: 'ring' as const, a: 100, b: 100, la: '', lb: '' }, text: 'Best investment we’ve made in marketing. Our phone rings constantly now. Google Ads set up perfectly.' },
  { name: 'Sarah Nguyen', company: 'Luxe Beauty Studio, Wellington', initials: 'SN', metric: '14k', from: '800', metricLabel: 'Instagram followers', chart: { kind: 'bars' as const, a: 800, b: 14000, la: '800', lb: '14k' }, text: 'Mid-week bookings tripled. The team genuinely cares about results.' },
]

const stats = [
  { t: 150, s: '+', l: 'NZ businesses served' },
  { t: 8, p: '$', s: 'M+', l: 'Client revenue generated' },
  { t: 98, s: '%', l: 'Client retention' },
  { t: 3, s: '.2×', l: 'Average return on ad spend' },
]

const d = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties

type Chart = { kind: 'bars' | 'ring'; a: number; b: number; la: string; lb: string }

// Refined before/after chart drawn only from the client's published figures.
function MiniChart({ c }: { c: Chart }) {
  if (c.kind === 'ring') {
    return (
      <svg className="chart ring" viewBox="0 0 120 120" aria-hidden="true">
        <circle cx="60" cy="60" r="52" className="chart-track" />
        <circle cx="60" cy="60" r="52" className="chart-arc" pathLength={100} style={{ '--v': c.a } as CSSProperties} />
      </svg>
    )
  }
  const h = (v: number) => Math.max(4, (v / c.b) * 100)
  return (
    <div className="chart bars" aria-hidden="true">
      <div className="bar"><span style={{ '--h': `${h(c.a)}%` } as CSSProperties} /><small>Before · {c.la}</small></div>
      <div className="bar on"><span style={{ '--h': `${h(c.b)}%` } as CSSProperties} /><small>With NEXTXEN · {c.lb}</small></div>
    </div>
  )
}

function Head({ eyebrow, a, b, sub, link }: { eyebrow: string; a: string; b: string; sub?: string; link?: { href: string; label: string } }) {
  return (
    <div className="grid12 shead">
      <div className="shead-l">
        <p className="eyebrow rv rv-up">{eyebrow}</p>
        <h2 className="h2 rv"><Words text={a} /> <em><Words text={b} delay={140} /></em></h2>
      </div>
      {(sub || link) && (
        <div className="shead-r rv rv-up" style={d(200)}>
          {sub && <p className="body">{sub}</p>}
          {link && <Link href={link.href} className="link-arrow">{link.label} <Icon name="arrow" size={15} /></Link>}
        </div>
      )}
    </div>
  )
}

export default function HomePreview() {
  return (
    <>
      {/* Sections 1–3: the new reference-matched stages (desktop) */}
      <div className="hx-desk"><HomeTop /></div>
      {/* Phones and touch tablets keep the responsive v5 sections */}
      <div className="hx-mob">
      <HeroV5 />

        {/* WHY NEXTXEN: masked statement, then three floating 3D glass pillars */}
        <section className="sec why">
          <div className="wrap">
            <div className="grid12">
              <p className="eyebrow rv rv-up col-full">Why NEXTXEN</p>
              <ScrubText className="col-wide rv rv-mask" text="We pair senior strategy with AI automation, so every dollar you put into marketing is tracked, tested and working harder for your business." />
            </div>

            <div className="pillars3">
              {approach.map((w, i) => (
                <div key={w.title} className="p3-slot rv rv-depth" style={d(i * 160)} data-parallax={[0.04, 0.09, 0.06][i]}>
                  <article className="p3 card spot" data-tilt="6" style={{ '--c': w.color, '--fd': `${i * -1.7}s` } as CSSProperties}>
                    <div className="p3-top">
                      <Orb3D icon={w.icon} color={w.color} size={112} />
                      <span className="p3-n">0{i + 1}</span>
                    </div>
                    <p className="p3-k">{w.kicker}</p>
                    <h3 className="h3">{w.title}</h3>
                    <p className="body">{w.desc}</p>
                    <div className="p3-also">
                      <span className="p3-dot" />
                      <div><b>{w.also.title}</b><p>{w.also.desc}</p></div>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SERVICES: pinned scroll story driven together with the 3D pearls */}
        <ServicesV5 />

      </div>

      <div className="hx-rest">
      {/* SERVICES ORB: an interactive keycap ball of the studio's services */}
      <section className="sec orb-band" aria-labelledby="orb-title">
        <h2 id="orb-title" className="sr-only">NEXTXEN services: spin the orb and press a key to see what&apos;s included</h2>
        <div className="orb-stage rv rv-depth"><ServicesOrb /></div>
        <p className="orb-hint"><kbd>S</kbd> SEO <kbd>A</kbd> Ads <kbd>W</kbd> Web <kbd>I</kbd> AI <kbd>C</kbd> Content</p>
      </section>

      {/* XEN: the AI growth assistant */}
      <XenSection />

      {/* PROCESS */}
      <section className="sec">
        <div className="wrap grid12">
          <div className="process-head">
            <p className="eyebrow rv rv-up">How we work</p>
            <h2 className="h2 rv"><Words text="From first call" /> <em><Words text="to first results." delay={140} /></em></h2>
            <p className="body rv rv-up" style={d(200)}>A simple, transparent process with no long contracts and no surprises. Most clients are live within a week.</p>
          </div>
          <ol className="track">
            <span className="track-line" aria-hidden="true"><i /></span>
            {steps.map((s, i) => (
              <li key={s.title} className="rv rv-up" style={d(i * 80)}>
                <span className="track-dot" aria-hidden="true" />
                <div className="track-card card">
                  <div className="track-meta"><span className="track-n">0{i + 1}</span><span className="pill-sm">{s.when}</span></div>
                  <h3 className="h3">{s.title}</h3>
                  <p className="body">{s.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* RESULTS: huge numerals with refined charts */}
      <section id="work" className="sec">
        <div className="wrap">
          <Head eyebrow="Client results" a="Real businesses." b="Real numbers." sub="We measure success the way you do: more enquiries, more bookings and more revenue." />
          <div className="kpi-strip rv rv-depth">
            {stats.map((c, i) => (
              <div key={c.l} className="kpi">
                <span className="kpi-tab" />
                <span className="kpi-k">{['Clients', 'Revenue', 'Retention', 'Return'][i]}</span>
                <div className="kpi-n"><AnimatedCounter target={c.t} prefix={c.p || ''} suffix={c.s} /></div>
                <div className="kpi-l">{c.l}</div>
              </div>
            ))}
          </div>
          <div className="metrics">
            {testimonials.map((t, i) => (
              <div key={t.name} className="metric rv rv-up" style={d(i * 100)}>
                <div className="metric-top">
                  <span className="metric-n">{t.metric}</span>
                  {t.from && <span className="metric-from">from {t.from}</span>}
                </div>
                <p className="metric-l">{t.metricLabel}</p>
                <MiniChart c={t.chart} />
                <p className="metric-who">{t.company}</p>
              </div>
            ))}
          </div>

          {/* TESTIMONIALS: tactile clay scene */}
          <ClayTestimonials items={testimonials} />
        </div>
      </section>

      {/* INDUSTRIES */}
      <section className="sec">
        <div className="wrap">
          <Head eyebrow="Industries" a="Your industry." b="Our expertise." sub="Strategies shaped around how your customers actually buy, whether you sell homes, appointments or products." link={{ href: '/industries', label: `All ${industries.length} industries` }} />
          <div className="rows">
            {industries.slice(0, 6).map((ind, i) => (
              <Link key={ind.slug} href={`/industries/${ind.slug}`} className="row rv rv-up" style={d(i * 50)}>
                <span className="num">{String(i + 1).padStart(2, '0')}</span>
                <span className="row-t">{ind.name}</span>
                <span className="row-d">{ind.shortDesc}</span>
                <span className="row-arr"><Icon name="arrowUpRight" size={17} stroke={1.6} /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <PricingSection />

      {/* JOURNAL */}
      <section className="sec">
        <div className="wrap">
          <Head eyebrow="Journal" a="Ideas worth" b="stealing." sub="Practical guides on AI, search and advertising for New Zealand business owners." link={{ href: '/blog', label: 'Read the journal' }} />
          <div className="posts">
            {blogPosts.slice(0, 3).map((post, i) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="post card spot rv rv-up" data-tilt="4" style={d(i * 90)}>
                <span className="post-cover" aria-hidden="true"><span className="post-glyph">{post.category.charAt(0)}</span><span className="post-no">{String(i + 1).padStart(2, '0')}</span></span>
                <span className="post-meta"><span>{post.category}</span><span>{post.readTime}</span></span>
                <span className="post-t">{post.title}</span>
                <span className="post-d">{post.excerpt.slice(0, 130)}…</span>
                <span className="link-arrow">Read article <Icon name="arrow" size={14} /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="sec">
        <div className="wrap grid12">
          <div className="faq-side">
            <p className="eyebrow rv rv-up">FAQ</p>
            <h2 className="h2 rv"><Words text="Questions," /> <em><Words text="answered." delay={140} /></em></h2>
            <p className="body rv rv-up" style={d(200)}>Can&apos;t find what you need? Email <a href="mailto:hello@nextxen.co.nz" className="link-u">hello@nextxen.co.nz</a>.</p>
          </div>
          <div className="faq-main rv rv-up" style={d(120)}><FaqSection /></div>
        </div>
      </section>

      {/* CTA: the core settles calmly behind the closing message */}
      <section className="sec cta" data-scene="cta">
        <div className="wrap cta-in">
          <p className="eyebrow rv rv-up">Free 30-minute strategy session</p>
          <h2 className="h1 sm rv"><Words text="Let’s build your" /> <em><Words text="growth engine." delay={160} /></em></h2>
          <p className="lead rv rv-up" style={d(200)}>No obligation and no sales pressure. Just an honest conversation about your goals and how we can help you reach them.</p>
          <div className="hero-btns center rv rv-up" style={d(300)}>
            <Link href="/contact" className="btn" data-magnetic><span className="btn-l">Book your session</span><span className="btn-ic"><Icon name="arrow" size={15} stroke={2} /></span></Link>
            <a href="mailto:hello@nextxen.co.nz" className="btn btn-ghost" data-magnetic><span className="btn-l">hello@nextxen.co.nz</span></a>
          </div>
        </div>
      </section>
      </div>
    </>
  )
}
