import Link from 'next/link'
import ScrollReveal from '@/components/ScrollReveal'
import AnimatedCounter from '@/components/AnimatedCounter'
import FaqSection from '@/components/FaqSection'
import ServicesSection from '@/components/ServicesSection'
import PricingSection from '@/components/PricingSection'
import { industries } from '@/data/industries'
import { blogPosts } from '@/data/blogs'

const whyUs = [
  { icon: '🤖', title: 'AI-First Approach', desc: 'Advanced AI tools to automate tasks, personalise experiences, and give you an edge traditional agencies cannot match.' },
  { icon: '🇳🇿', title: 'Local NZ Expertise', desc: 'From Auckland to Invercargill — we understand your customers, competition, and what it takes to win in the New Zealand market.' },
  { icon: '📊', title: 'Data-Driven Results', desc: 'Every decision backed by real data. We track every click, impression, and conversion so you know exactly what your investment returns.' },
  { icon: '⚡', title: 'Full-Service Agency', desc: 'Logo to Google Ads to AI chatbot — handled under one roof. One team, one vision, one invoice. No juggling multiple agencies.' },
  { icon: '🎯', title: 'Precision Targeting', desc: 'Advanced audience targeting puts your message in front of exactly the right people at exactly the right moment.' },
  { icon: '📱', title: '24/7 Performance', desc: 'Your AI chatbot handles enquiries at 3am. Campaigns optimise overnight. Content posts automatically. Always on.' },
]

const testimonials = [
  { name: 'Rachel Thompson', company: 'Thompson Real Estate, Auckland', initials: 'RT', text: 'NEXTXEN transformed our lead generation. We went from 8 leads a month to 74 qualified buyer and seller enquiries. The ROI has been extraordinary.', stars: 5 },
  { name: 'Mike Patterson', company: 'Patterson Electrical, Waikato', initials: 'MP', text: "Best investment we've made in marketing. Our phone rings constantly now. Google Ads set up perfectly — every lead is local and qualified.", stars: 5 },
  { name: 'Sarah Nguyen', company: 'Luxe Beauty Studio, Wellington', initials: 'SN', text: 'Our Instagram following grew from 800 to 14,000+ and mid-week bookings tripled. The team at NEXTXEN genuinely cares about results.', stars: 5 },
]



export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="orb orb1" />
        <div className="orb orb2" />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div className="hero-badge">
            <span className="pulse-dot" />
            🇳🇿 New Zealand&apos;s Premier AI Marketing Agency
          </div>
          <h1>
            <span className="gt">Next Generation</span><br />
            Digital Growth<br />
            <span className="gt2">Powered by AI</span>
          </h1>
          <p className="hero-sub">
            We help New Zealand businesses dominate online with AI automation, precision digital marketing, and world-class content creation.
          </p>
          <div className="hero-btns">
            <Link href="/contact" className="btn1">🚀 Get Free Consultation</Link>
            <Link href="#pricing" className="btn2">View Pricing →</Link>
          </div>
          <div className="hstats">
            <div className="stat"><div className="stat-n">150+</div><div className="stat-l">NZ Clients</div></div>
            <div className="sdiv" />
            <div className="stat"><div className="stat-n">3.2×</div><div className="stat-l">Avg. ROI</div></div>
            <div className="sdiv" />
            <div className="stat"><div className="stat-n">98%</div><div className="stat-l">Retention</div></div>
            <div className="sdiv" />
            <div className="stat"><div className="stat-n">5★</div><div className="stat-l">Rating</div></div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="mq">
        <div className="mq-track">
          {[...Array(2)].map((_, ri) =>
            ['AI-Powered Marketing','Lead Generation','SEO Dominance','Facebook Ads','Google Ads','AI Chatbots','Content Creation','Brand Strategy','Local SEO','NZ Based'].map((item, i) => (
              <div key={`${ri}-${i}`} className="mi"><span className="md" />{item}</div>
            ))
          )}
        </div>
      </div>

      {/* COUNTERS */}
      <section style={{ background: 'var(--bg2)' }}>
        <div className="cnt">
          <div className="cgrid">
            {[{t:150,s:'+',l:'NZ Businesses Served'},{t:8,p:'$',s:'M+',l:'Revenue Generated'},{t:98,s:'%',l:'Client Retention'},{t:5,s:'★',l:'Google Rating'}].map((c,i) => (
              <div key={c.l} className="ci-box">
                <div className="cn"><AnimatedCounter target={c.t} prefix={c.p||''} suffix={c.s} /></div>
                <div className="cl">{c.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section id="about">
        <div className="cnt">
          <ScrollReveal className="tc">
            <span className="slbl">Why Choose Us</span>
            <h2 className="stit">Built Different. <span className="gt">Delivers Different.</span></h2>
            <p className="ssub">We combine cutting-edge AI with deep NZ market knowledge to drive real, measurable results for every client.</p>
          </ScrollReveal>
          <div className="why-grid">
            {whyUs.map((w,i) => (
              <ScrollReveal key={w.title} delay={i * 80}>
                <div className="wc card3d">
                  <div className="wi">{w.icon}</div>
                  <h3>{w.title}</h3>
                  <p>{w.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" style={{ background: 'var(--bg2)' }}>
        <div className="cnt">
          <ScrollReveal className="tc">
            <span className="slbl">What We Do</span>
            <h2 className="stit">Everything Your Business <span className="gt">Needs to Grow</span></h2>
            <p className="ssub">Click any service to learn more. A complete suite of digital marketing and AI services designed for NZ businesses ready to scale.</p>
          </ScrollReveal>
          <ServicesSection />
        </div>
      </section>

      {/* INDUSTRIES PREVIEW */}
      <section>
        <div className="cnt">
          <ScrollReveal className="tc">
            <span className="slbl">Industries We Serve</span>
            <h2 className="stit">Your Industry. <span className="gt2">Our Expertise.</span></h2>
            <p className="ssub">Tailored strategies for every industry. Click any industry to see how we&apos;ve driven growth for businesses like yours.</p>
          </ScrollReveal>
          <div className="ind-grid" style={{ marginTop: '3.5rem' }}>
            {industries.slice(0,8).map((ind,i) => (
              <ScrollReveal key={ind.slug} delay={i * 60}>
                <Link href={`/industries/${ind.slug}`} className="ind-card">
                  <span className="ind-icon">{ind.icon}</span>
                  <h3>{ind.name}</h3>
                  <p>{ind.shortDesc.slice(0,65)}…</p>
                  <span className="ind-arrow">Explore →</span>
                </Link>
              </ScrollReveal>
            ))}
          </div>
          <div className="tc" style={{ marginTop: '2.5rem' }}>
            <Link href="/industries" className="btn2" style={{ display: 'inline-flex' }}>View All 12 Industries →</Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" style={{ background: 'var(--bg2)' }}>
        <div className="cnt">
          <ScrollReveal className="tc">
            <span className="slbl">Client Results</span>
            <h2 className="stit">What Our Clients <span className="gt">Are Saying</span></h2>
          </ScrollReveal>
          <div className="tgrid">
            {testimonials.map((t,i) => (
              <ScrollReveal key={t.name} delay={i * 100}>
                <div className="tc2">
                  <div className="stars">{'★'.repeat(t.stars)}</div>
                  <p className="ttxt">&ldquo;{t.text}&rdquo;</p>
                  <div className="tau">
                    <div className="tav">{t.initials}</div>
                    <div><div className="tan">{t.name}</div><div className="tab">{t.company}</div></div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <PricingSection />

      {/* BLOG PREVIEW */}
      <section style={{ background: 'var(--bg2)' }}>
        <div className="cnt">
          <ScrollReveal className="tc">
            <span className="slbl">Insights</span>
            <h2 className="stit">Latest from the <span className="gt">Blog</span></h2>
          </ScrollReveal>
          <div className="bgrid">
            {blogPosts.slice(0,3).map((post,i) => (
              <ScrollReveal key={post.slug} delay={i * 80}>
                <Link href={`/blog/${post.slug}`} className="bc">
                  <div className="bthumb" style={{ background: `linear-gradient(135deg, ${post.featuredGradient.replace('from-','').replace(' to-',' ,')})` }}>📖</div>
                  <div className="bbody">
                    <div className="bmeta">
                      <span className="bcat">{post.category}</span>
                      <span className="bdate">{post.publishDate}</span>
                    </div>
                    <h3>{post.title}</h3>
                    <p>{post.excerpt.slice(0, 100)}…</p>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
          <div className="tc" style={{ marginTop: '2.5rem' }}>
            <Link href="/blog" className="btn2" style={{ display: 'inline-flex' }}>View All Posts →</Link>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <div className="tstrip">
        <div className="cnt">
          <div className="tsin">
            <div className="tbdg">🔒 No Lock-In Contracts</div><div className="tsep" />
            <div className="tbdg">📊 Monthly Reports</div><div className="tsep" />
            <div className="tbdg">⚡ 5–7 Day Onboarding</div><div className="tsep" />
            <div className="tbdg">🤖 AI-Powered Tools</div><div className="tsep" />
            <div className="tbdg">⭐ 5-Star Google Rating</div>
          </div>
        </div>
      </div>

      {/* NEWSLETTER */}
      <section>
        <div className="cnt">
          <div className="nlbox">
            <span className="slbl" style={{ textAlign: 'center' }}>Free Marketing Tips</span>
            <h2>Get Weekly <span className="gt">Growth Strategies</span></h2>
            <p>Join 2,400+ NZ business owners getting free AI marketing tips every week. No spam, unsubscribe anytime.</p>
            <div className="nlform">
              <input type="email" placeholder="your@email.co.nz" />
              <button>Subscribe Free</button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ background: 'var(--bg2)' }}>
        <div className="cnt">
          <ScrollReveal className="tc">
            <span className="slbl">FAQ</span>
            <h2 className="stit">Common <span className="gt">Questions</span></h2>
          </ScrollReveal>
          <FaqSection />
        </div>
      </section>

      {/* CTA */}
      <section>
        <div className="cnt">
          <ScrollReveal>
            <div className="ctabox">
              <span className="slbl" style={{ position: 'relative' }}>Ready to Grow?</span>
              <h2>Let&apos;s Build Your <span className="gt3">Growth Engine</span></h2>
              <p>Book a free 30-minute strategy session. No obligation, no sales pressure — just a genuine conversation about your business goals and how we can help.</p>
              <Link href="/contact" className="btn1">🚀 Book Free Strategy Session</Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
