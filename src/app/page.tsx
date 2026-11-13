import Link from 'next/link'
import ScrollReveal from '@/components/ScrollReveal'
import AnimatedCounter from '@/components/AnimatedCounter'
import FaqSection from '@/components/FaqSection'
import ServicesSection from '@/components/ServicesSection'
import PricingSection from '@/components/PricingSection'
import Icon, { type IconName } from '@/components/Icon'
import { industries } from '@/data/industries'
import { blogPosts } from '@/data/blogs'

const approach: { icon: IconName; title: string; desc: string }[] = [
  { icon: 'cpu', title: 'AI-first, human-led', desc: 'We use AI to automate the busywork, personalise every touchpoint and move faster than traditional agencies, with senior people making the calls.' },
  { icon: 'pin', title: 'Built for New Zealand', desc: 'From Auckland to Invercargill, we know your customers, your competitors and what it takes to win in a small, word-of-mouth market.' },
  { icon: 'chart', title: 'Measured to the dollar', desc: 'Every click, call and conversion is tracked, so you always know exactly what your investment is returning.' },
  { icon: 'users', title: 'One team, end to end', desc: 'Brand, website, ads, content and automation under one roof. One strategy, one point of contact, one invoice.' },
  { icon: 'target', title: 'Precision targeting', desc: 'Your message reaches the right people at the right moment, so budget goes to buyers rather than browsers.' },
  { icon: 'clock', title: 'Always on', desc: 'AI assistants answer enquiries at 3am, campaigns optimise overnight and content publishes on schedule.' },
]

const steps = [
  { title: 'Discovery call', desc: 'A 30-minute conversation about your business, goals and what has or hasn’t worked so far.', when: 'Day 1' },
  { title: 'Strategy & proposal', desc: 'A clear plan with channels, budget and targets, tailored to your market. No templates.', when: 'Within 48 hours' },
  { title: 'Build & launch', desc: 'We set up tracking, creative, campaigns and automations, then go live.', when: '5–7 days' },
  { title: 'Optimise & report', desc: 'Continuous testing and a plain-English monthly report on leads, cost and return.', when: 'Every month' },
]

const testimonials = [
  { name: 'Rachel Thompson', company: 'Thompson Real Estate, Auckland', initials: 'RT', metric: '8 → 74', metricLabel: 'qualified enquiries per month', text: 'NEXTXEN transformed our lead generation. The ROI has been extraordinary.' },
  { name: 'Mike Patterson', company: 'Patterson Electrical, Waikato', initials: 'MP', metric: '100%', metricLabel: 'local, qualified leads', text: 'Best investment we’ve made in marketing. Our phone rings constantly now. Google Ads set up perfectly.' },
  { name: 'Sarah Nguyen', company: 'Luxe Beauty Studio, Wellington', initials: 'SN', metric: '800 → 14k', metricLabel: 'Instagram followers', text: 'Mid-week bookings tripled. The team genuinely cares about results.' },
]

const capabilities = ['Brand & Identity', 'Websites', 'Search & SEO', 'Google Ads', 'Meta Ads', 'Content Production', 'AI Assistants', 'Automation', 'Local Marketing']

function Stars() {
  return <span className="stars" aria-label="5 out of 5 stars">{[0, 1, 2, 3, 4].map(i => <Icon key={i} name="star" size={14} stroke={0} className="star-fill" />)}</span>
}

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="hx">
        <div className="cnt hx-grid">
          <div>
            <div className="hx-eyebrow"><b>NZ</b> AI-powered marketing studio, Auckland</div>
            <h1>Digital growth, <em>engineered</em> with AI.</h1>
            <p className="hx-sub">We help ambitious New Zealand businesses win online with precision marketing, AI automation and content that actually converts.</p>
            <div className="hx-btns">
              <Link href="/contact" className="btn1">Book a free strategy call <Icon name="arrow" size={16} /></Link>
              <Link href="#work" className="btn2">See client results</Link>
            </div>
            <div className="hx-proof">
              <Stars />
              <p><strong>5.0 rating</strong> from 150+ NZ businesses · <strong>98%</strong> client retention</p>
            </div>
          </div>

          <div className="rep" aria-hidden="true">
            <div className="rep-card">
              <div className="rep-top">
                <span>Growth report · 90 days</span>
                <span className="rep-live"><i />Live</span>
              </div>
              <div className="rep-big"><strong>74</strong><em>+825%</em></div>
              <div className="rep-lbl">Qualified leads per month</div>
              <div className="rep-chart">
                <svg viewBox="0 0 400 150" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="rg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor="#d6fb41" stopOpacity=".28" />
                      <stop offset="1" stopColor="#d6fb41" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {[30, 70, 110].map(y => <line key={y} x1="0" x2="400" y1={y} y2={y} stroke="rgba(243,241,236,.07)" />)}
                  <path d="M0 132 C40 128 60 126 90 120 S150 112 180 100 S240 92 270 70 S330 46 360 30 S390 18 400 14 L400 150 L0 150Z" fill="url(#rg)" />
                  <path d="M0 132 C40 128 60 126 90 120 S150 112 180 100 S240 92 270 70 S330 46 360 30 S390 18 400 14" fill="none" stroke="#d6fb41" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                  <path d="M0 138 C60 136 120 134 180 131 S300 126 400 122" fill="none" stroke="rgba(243,241,236,.25)" strokeWidth="1.5" strokeDasharray="4 5" vectorEffect="non-scaling-stroke" />
                </svg>
              </div>
              <div className="rep-kpis">
                <div><b>3.2×</b><span>Avg. ROI</span></div>
                <div><b>−67%</b><span>Cost per lead</span></div>
                <div><b>24/7</b><span>AI response</span></div>
              </div>
            </div>
            <div className="rep-float">
              <span className="ic"><Icon name="calendar" size={18} /></span>
              <div>New consultation booked<small>by your AI assistant · 2 min ago</small></div>
            </div>
          </div>
        </div>
      </section>

      {/* CAPABILITIES MARQUEE */}
      <div className="mq" aria-hidden="true">
        <div className="mq-track">
          {[0, 1].map(ri => (
            <div key={ri} className="mi">
              {capabilities.map(item => <span key={item} style={{ display: 'contents' }}>{item}<span className="md" /></span>)}
            </div>
          ))}
        </div>
      </div>

      {/* NUMBERS */}
      <section style={{ paddingTop: '5rem', paddingBottom: '5rem' }}>
        <div className="cnt">
          <div className="cgrid">
            {[{ t: 150, s: '+', l: 'New Zealand businesses served' }, { t: 8, p: '$', s: 'M+', l: 'Client revenue generated' }, { t: 98, s: '%', l: 'Client retention rate' }, { t: 3, s: '.2×', l: 'Average return on ad spend' }].map((c, i) => (
              <ScrollReveal key={c.l} delay={i * 80}>
                <div className="ci-box">
                  <div className="cn"><AnimatedCounter target={c.t} prefix={c.p || ''} suffix={c.s} /></div>
                  <div className="cl">{c.l}</div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* APPROACH */}
      <section id="about" style={{ paddingTop: '4rem' }}>
        <div className="cnt">
          <ScrollReveal className="shead">
            <div>
              <span className="slbl">Why NEXTXEN</span>
              <h2 className="stit">Built different. <span className="gt">Delivers different.</span></h2>
            </div>
            <p className="ssub">Cutting-edge AI paired with deep New Zealand market knowledge, focused on one thing: measurable growth for your business.</p>
          </ScrollReveal>
          <div className="why-grid">
            {approach.map((w, i) => (
              <ScrollReveal key={w.title} delay={(i % 3) * 90}>
                <div className="wc">
                  <div className="wc-n"><span>{String(i + 1).padStart(2, '0')}</span><span className="wi"><Icon name={w.icon} size={20} /></span></div>
                  <h3>{w.title}</h3>
                  <p>{w.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" style={{ background: 'var(--bg2)', borderTop: '1px solid var(--bd)', borderBottom: '1px solid var(--bd)' }}>
        <div className="cnt">
          <ScrollReveal className="shead">
            <div>
              <span className="slbl">Services</span>
              <h2 className="stit">Everything you need <span className="gt">to grow.</span></h2>
            </div>
            <p className="ssub">A complete suite of marketing, creative and AI services, designed for New Zealand businesses ready to scale. Select any service to see what&apos;s included.</p>
          </ScrollReveal>
          <ServicesSection />
        </div>
      </section>

      {/* PROCESS */}
      <section>
        <div className="cnt">
          <ScrollReveal className="shead">
            <div>
              <span className="slbl">How we work</span>
              <h2 className="stit">From first call to <span className="gt">first results.</span></h2>
            </div>
            <p className="ssub">A simple, transparent process with no long contracts and no surprises. Most clients are live within a week.</p>
          </ScrollReveal>
          <div className="steps">
            {steps.map((s, i) => (
              <ScrollReveal key={s.title} delay={i * 90}>
                <div className="step">
                  <div className="step-n">0{i + 1}</div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                  <small>{s.when}</small>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* RESULTS */}
      <section id="work" style={{ background: 'var(--bg2)', borderTop: '1px solid var(--bd)', borderBottom: '1px solid var(--bd)' }}>
        <div className="cnt">
          <ScrollReveal className="shead">
            <div>
              <span className="slbl">Client results</span>
              <h2 className="stit">Real businesses. <span className="gt">Real numbers.</span></h2>
            </div>
            <p className="ssub">We measure success the way you do: more enquiries, more bookings and more revenue.</p>
          </ScrollReveal>
          <div className="tgrid">
            {testimonials.map((t, i) => (
              <ScrollReveal key={t.name} delay={i * 100}>
                <figure className="tc2">
                  <div className="tmetric">{t.metric}</div>
                  <div className="tmetric-l">{t.metricLabel}</div>
                  <blockquote className="ttxt">&ldquo;{t.text}&rdquo;</blockquote>
                  <figcaption className="tau">
                    <div className="tav">{t.initials}</div>
                    <div><div className="tan">{t.name}</div><div className="tab">{t.company}</div></div>
                  </figcaption>
                </figure>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* INDUSTRIES */}
      <section>
        <div className="cnt">
          <ScrollReveal className="shead">
            <div>
              <span className="slbl">Industries</span>
              <h2 className="stit">Your industry. <span className="gt">Our expertise.</span></h2>
            </div>
            <div>
              <p className="ssub" style={{ marginBottom: '1.4rem' }}>Strategies shaped around how your customers actually buy, whether you sell homes, appointments or products.</p>
              <Link href="/industries" className="tlink">All 12 industries <Icon name="arrow" size={15} /></Link>
            </div>
          </ScrollReveal>
          <div className="ind-grid" style={{ marginTop: 0 }}>
            {industries.slice(0, 8).map((ind, i) => (
              <ScrollReveal key={ind.slug} delay={(i % 4) * 70}>
                <Link href={`/industries/${ind.slug}`} className="ind-card">
                  <span className="ind-icon"><Icon emoji={ind.icon} size={20} /></span>
                  <h3>{ind.name}</h3>
                  <p>{ind.shortDesc}</p>
                  <span className="ind-arrow">Explore <Icon name="arrow" size={14} /></span>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <div style={{ background: 'var(--bg2)', borderTop: '1px solid var(--bd)', borderBottom: '1px solid var(--bd)' }}>
        <PricingSection />
      </div>

      {/* JOURNAL */}
      <section>
        <div className="cnt">
          <ScrollReveal className="shead">
            <div>
              <span className="slbl">Journal</span>
              <h2 className="stit">Ideas worth <span className="gt">stealing.</span></h2>
            </div>
            <div>
              <p className="ssub" style={{ marginBottom: '1.4rem' }}>Practical guides on AI, search and advertising for New Zealand business owners.</p>
              <Link href="/blog" className="tlink">Read the journal <Icon name="arrow" size={15} /></Link>
            </div>
          </ScrollReveal>
          <div className="bgrid" style={{ marginTop: 0 }}>
            {blogPosts.slice(0, 3).map((post, i) => (
              <ScrollReveal key={post.slug} delay={i * 80}>
                <Link href={`/blog/${post.slug}`} className="bc">
                  <div className="bthumb"><Icon name="arrowUpRight" size={18} /><span>{post.category}</span></div>
                  <div className="bbody">
                    <div className="bmeta"><span className="bdate">{post.publishDate} · {post.readTime}</span></div>
                    <h3>{post.title}</h3>
                    <p>{post.excerpt.slice(0, 120)}…</p>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ borderTop: '1px solid var(--bd)' }}>
        <div className="cnt faq-grid">
          <div className="stit-wrap">
            <span className="slbl">FAQ</span>
            <h2 className="stit">Questions, <span className="gt">answered.</span></h2>
            <p className="ssub" style={{ marginTop: '1rem' }}>Can&apos;t find what you need? Email <a href="mailto:hello@nextxen.co.nz" style={{ color: 'var(--tx)' }}>hello@nextxen.co.nz</a>.</p>
          </div>
          <FaqSection />
        </div>
      </section>

      {/* CTA */}
      <section style={{ paddingTop: '2rem' }}>
        <div className="cnt">
          <ScrollReveal>
            <div className="ctabox">
              <span className="slbl">Free 30-minute strategy session</span>
              <h2>Let&apos;s build your <span className="gt">growth engine.</span></h2>
              <p>No obligation and no sales pressure. Just an honest conversation about your goals and how we can help you reach them.</p>
              <div className="cta-btns">
                <Link href="/contact" className="btn1">Book your session <Icon name="arrow" size={16} /></Link>
                <a href="mailto:hello@nextxen.co.nz" className="btn2">hello@nextxen.co.nz</a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
