import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { industries, getIndustry, getRelatedIndustries } from '@/data/industries'
import ScrollReveal from '@/components/ScrollReveal'

export async function generateStaticParams() {
  return industries.map(i => ({ slug: i.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const ind = getIndustry(slug)
  if (!ind) return {}
  return { title: ind.metaTitle, description: ind.metaDesc }
}

export default async function IndustryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const ind = getIndustry(slug)
  if (!ind) notFound()

  const related = getRelatedIndustries(ind.relatedSlugs)

  return (
    <>
      {/* Hero */}
      <section className="hero" style={{ minHeight: '48vh', paddingTop: '10rem', paddingBottom: '3.5rem' }}>
        <div className="orb orb1" style={{ opacity: .5 }} />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div className="cnt">
            <Link href="/industries" style={{ display: 'inline-flex', alignItems: 'center', gap: '.5rem', fontSize: '.75rem', color: 'var(--tx2)', textDecoration: 'none', marginBottom: '1.5rem' }}>
              ← All Industries
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', marginBottom: '1.2rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '4rem', lineHeight: 1 }}>{ind.icon}</span>
              <div>
                <span className="slbl" style={{ display: 'block', marginBottom: '.3rem' }}>Industry Expertise</span>
                <h1 style={{ fontSize: 'clamp(1.9rem,4.5vw,3.4rem)', fontWeight: 900, lineHeight: 1.08, letterSpacing: '-.03em', margin: 0 }}>{ind.name}</h1>
              </div>
            </div>
            <p style={{ color: 'var(--tx2)', fontSize: '1rem', maxWidth: '620px', lineHeight: 1.72 }}>{ind.shortDesc}</p>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section>
        <div className="cnt" style={{ maxWidth: '780px' }}>
          {ind.intro.split('\n\n').map((para, i) => (
            <p key={i} style={{ color: 'var(--tx2)', lineHeight: 1.78, marginBottom: '1.2rem', fontSize: '.95rem' }}>{para}</p>
          ))}
        </div>
      </section>

      {/* What We Do */}
      <section style={{ background: 'var(--bg2)' }}>
        <div className="cnt">
          <ScrollReveal>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <span className="slbl" style={{ display: 'block', marginBottom: '.6rem' }}>What We Do</span>
              <h2 className="stit">Services Tailored for <span className="gt">{ind.name}</span></h2>
              <p className="ssub" style={{ maxWidth: '500px', margin: '.6rem auto 0' }}>Every service is built around the specific needs, opportunities, and challenges of your industry.</p>
            </div>
          </ScrollReveal>
          <div className="sgrid">
            {ind.whatWeDo.map((item, i) => (
              <ScrollReveal key={item.title} delay={i * 70}>
                <div className="sc2">
                  <div className="si">{item.icon}</div>
                  <h3 style={{ fontWeight: 700, fontSize: '.88rem', marginBottom: '.5rem' }}>{item.title}</h3>
                  <p style={{ color: 'var(--tx2)', fontSize: '.82rem', lineHeight: 1.68 }}>{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* How We Help */}
      <section>
        <div className="cnt">
          <ScrollReveal>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <span className="slbl" style={{ display: 'block', marginBottom: '.6rem' }}>How We Help</span>
              <h2 className="stit">Real Results for <span className="gt2">{ind.name} Businesses</span></h2>
              <p className="ssub" style={{ maxWidth: '500px', margin: '.6rem auto 0' }}>ROI-driven outcomes that our {ind.name.toLowerCase()} clients experience consistently.</p>
            </div>
          </ScrollReveal>
          <div className="cgrid" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
            {ind.howWeHelp.map((item, i) => (
              <ScrollReveal key={item.label} delay={i * 80}>
                <div className="ci-box" style={{ textAlign: 'center', padding: '2rem 1.2rem' }}>
                  <div className="cn gt" style={{ fontSize: 'clamp(1.6rem,3vw,2.4rem)', marginBottom: '.4rem' }}>{item.stat}</div>
                  <div className="cl" style={{ marginBottom: '.6rem', color: 'var(--ac2)' }}>{item.label}</div>
                  <p style={{ color: 'var(--tx2)', fontSize: '.76rem', lineHeight: 1.65 }}>{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section style={{ background: 'var(--bg2)' }}>
        <div className="cnt">
          <ScrollReveal>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <span className="slbl" style={{ display: 'block', marginBottom: '.6rem' }}>Key Solutions</span>
              <h2 className="stit">What&apos;s Included in Your <span className="gt">Strategy</span></h2>
            </div>
          </ScrollReveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(340px,1fr))', gap: '.75rem', maxWidth: '860px', margin: '0 auto' }}>
            {ind.features.map((feat, i) => (
              <ScrollReveal key={feat} delay={i * 50}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '.75rem', padding: '1rem 1.2rem', borderRadius: '10px', background: 'var(--glass)', border: '1px solid var(--bd)' }}>
                  <span style={{ color: 'var(--cy2)', fontWeight: 700, flexShrink: 0, marginTop: '.05rem' }}>✓</span>
                  <span style={{ color: 'var(--tx2)', fontSize: '.85rem' }}>{feat}</span>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Case Study */}
      <section>
        <div className="cnt" style={{ maxWidth: '900px' }}>
          <ScrollReveal>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <span className="slbl" style={{ display: 'block', marginBottom: '.6rem' }}>Case Study</span>
              <h2 className="stit">Real Results in Action</h2>
            </div>
          </ScrollReveal>
          <ScrollReveal>
            <div style={{ padding: '2.5rem', borderRadius: '20px', background: 'linear-gradient(135deg,rgba(108,92,231,.1),rgba(0,206,201,.05))', border: '1px solid rgba(108,92,231,.22)' }}>
              <h3 style={{ fontWeight: 800, fontSize: '1.15rem', marginBottom: '1.8rem' }}>{ind.caseStudy.company}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '1.5rem' }}>
                <div>
                  <div style={{ fontSize: '.68rem', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: '#e17055', marginBottom: '.6rem' }}>🔴 The Challenge</div>
                  <p style={{ color: 'var(--tx2)', fontSize: '.84rem', lineHeight: 1.7 }}>{ind.caseStudy.challenge}</p>
                </div>
                <div>
                  <div style={{ fontSize: '.68rem', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--ac2)', marginBottom: '.6rem' }}>🔵 Our Solution</div>
                  <p style={{ color: 'var(--tx2)', fontSize: '.84rem', lineHeight: 1.7 }}>{ind.caseStudy.solution}</p>
                </div>
                <div>
                  <div style={{ fontSize: '.68rem', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--cy2)', marginBottom: '.6rem' }}>🟢 The Result</div>
                  <p style={{ color: 'var(--tx2)', fontSize: '.84rem', lineHeight: 1.7 }}>{ind.caseStudy.result}</p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Related Industries */}
      {related.length > 0 && (
        <section style={{ background: 'var(--bg2)' }}>
          <div className="cnt">
            <ScrollReveal>
              <h2 className="stit" style={{ textAlign: 'center', marginBottom: '2rem' }}>Related Industries</h2>
            </ScrollReveal>
            <div className="ind-grid" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))' }}>
              {related.map((r, i) => (
                <ScrollReveal key={r.slug} delay={i * 80}>
                  <Link href={`/industries/${r.slug}`} className="ind-card" style={{ textAlign: 'center' }}>
                    <span className="ind-icon">{r.icon}</span>
                    <h3 style={{ fontSize: '.9rem' }}>{r.name}</h3>
                    <span className="ind-arrow">Explore →</span>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section>
        <div className="cnt">
          <ScrollReveal>
            <div className="ctabox">
              <h2>Ready to grow your {ind.name.toLowerCase()} business?</h2>
              <p>Book a free strategy session — no obligation, real advice from NZ experts who understand your industry.</p>
              <Link href="/contact" className="btn1">Get Free Strategy Session →</Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
