import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { industries, getIndustry, getRelatedIndustries } from '@/data/industries'
import ScrollReveal from '@/components/ScrollReveal'
import Icon from '@/components/Icon'

export async function generateStaticParams() {
  return industries.map(i => ({ slug: i.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const ind = getIndustry(slug)
  if (!ind) return {}
  return { title: { absolute: ind.metaTitle }, description: ind.metaDesc, alternates: { canonical: `/industries/${ind.slug}` } }
}

export default async function IndustryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const ind = getIndustry(slug)
  if (!ind) notFound()

  const related = getRelatedIndustries(ind.relatedSlugs)

  return (
    <>
      {/* Hero */}
      <section className="hero" style={{ minHeight: '60vh' }}>
        <div className="orb orb1" />
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 860 }}>
          <Link href="/industries" className="tlink" style={{ marginBottom: '2.2rem', color: 'var(--tx2)', fontSize: '.85rem' }}>
            <span style={{ transform: 'rotate(180deg)', display: 'inline-flex' }}><Icon name="arrow" size={14} /></span> All industries
          </Link>
          <div className="ind-icon" style={{ margin: '0 auto 1.6rem', width: 56, height: 56, borderRadius: 16 }}><Icon emoji={ind.icon} size={24} /></div>
          <h1>{ind.name}</h1>
          <p className="hero-sub" style={{ marginBottom: 0 }}>{ind.shortDesc}</p>
        </div>
      </section>

      {/* Intro */}
      <section>
        <div className="cnt" style={{ maxWidth: '780px' }}>
          {ind.intro.split('\n\n').map((para, i) => (
            <p key={i} className={i === 0 ? 'lede' : ''} style={i === 0 ? undefined : { color: 'var(--tx2)', lineHeight: 1.8, marginBottom: '1.3rem', fontSize: '1.05rem' }}>{para}</p>
          ))}
        </div>
      </section>

      {/* What We Do */}
      <section style={{ background: 'var(--bg2)', borderTop: '1px solid var(--bd)', borderBottom: '1px solid var(--bd)' }}>
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
                  <div className="si"><Icon emoji={item.icon} /></div>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
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
              <h2 className="stit">Real Results for <span className="gt">{ind.name} Businesses</span></h2>
              <p className="ssub" style={{ maxWidth: '500px', margin: '.6rem auto 0' }}>ROI-driven outcomes that our {ind.name.toLowerCase()} clients experience consistently.</p>
            </div>
          </ScrollReveal>
          <div className="cgrid">
            {ind.howWeHelp.map((item, i) => (
              <ScrollReveal key={item.label} delay={i * 80}>
                <div className="ci-box">
                  <div className="cn">{item.stat}</div>
                  <div className="cl" style={{ color: 'var(--tx)', margin: '1rem 0 .5rem' }}>{item.label}</div>
                  <p style={{ color: 'var(--tx2)', fontSize: '.86rem', lineHeight: 1.6 }}>{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section style={{ background: 'var(--bg2)', borderTop: '1px solid var(--bd)', borderBottom: '1px solid var(--bd)' }}>
        <div className="cnt">
          <ScrollReveal>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <span className="slbl" style={{ display: 'block', marginBottom: '.6rem' }}>Key Solutions</span>
              <h2 className="stit">What&apos;s Included in Your <span className="gt">Strategy</span></h2>
            </div>
          </ScrollReveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(min(100%,340px),1fr))', gap: '.75rem', maxWidth: '960px', margin: '0 auto' }}>
            {ind.features.map((feat, i) => (
              <ScrollReveal key={feat} delay={i * 50}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '.8rem', padding: '1.1rem 1.3rem', borderRadius: 14, background: 'var(--sf)', border: '1px solid var(--bd)', height: '100%' }}>
                  <span style={{ color: 'var(--ac)', flexShrink: 0, marginTop: '.15rem' }}><Icon name="check" size={16} stroke={2} /></span>
                  <span style={{ color: 'var(--tx2)', fontSize: '.94rem' }}>{feat}</span>
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
            <div style={{ padding: 'clamp(1.6rem,4vw,3rem)', borderRadius: 24, background: 'var(--sf)', border: '1px solid var(--bd)' }}>
              <h3 className="serif" style={{ fontSize: '2rem', marginBottom: '2rem' }}>{ind.caseStudy.company}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '1.5rem' }}>
                <div>
                  <div style={{ fontSize: '.74rem', letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--tx3)', marginBottom: '.8rem', paddingBottom: '.8rem', borderBottom: '1px solid var(--bd)' }}>The Challenge</div>
                  <p style={{ color: 'var(--tx2)', fontSize: '.95rem', lineHeight: 1.7 }}>{ind.caseStudy.challenge}</p>
                </div>
                <div>
                  <div style={{ fontSize: '.74rem', letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--tx3)', marginBottom: '.8rem', paddingBottom: '.8rem', borderBottom: '1px solid var(--bd)' }}>Our Solution</div>
                  <p style={{ color: 'var(--tx2)', fontSize: '.95rem', lineHeight: 1.7 }}>{ind.caseStudy.solution}</p>
                </div>
                <div>
                  <div style={{ fontSize: '.74rem', letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--ac)', marginBottom: '.8rem', paddingBottom: '.8rem', borderBottom: '1px solid var(--bd)' }}>The Result</div>
                  <p style={{ color: 'var(--tx2)', fontSize: '.95rem', lineHeight: 1.7 }}>{ind.caseStudy.result}</p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Related Industries */}
      {related.length > 0 && (
        <section style={{ background: 'var(--bg2)', borderTop: '1px solid var(--bd)', borderBottom: '1px solid var(--bd)' }}>
          <div className="cnt">
            <ScrollReveal>
              <h2 className="stit" style={{ textAlign: 'center', marginBottom: '2rem' }}>Related Industries</h2>
            </ScrollReveal>
            <div className="ind-grid" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))' }}>
              {related.map((r, i) => (
                <ScrollReveal key={r.slug} delay={i * 80}>
                  <Link href={`/industries/${r.slug}`} className="ind-card">
                    <span className="ind-icon"><Icon emoji={r.icon} size={20} /></span>
                    <h3>{r.name}</h3>
                    <span className="ind-arrow">Explore <Icon name="arrow" size={14} /></span>
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
              <h2>Ready to grow your <span className="gt">{ind.name.toLowerCase()} business?</span></h2>
              <p>Book a free strategy session — no obligation, real advice from NZ experts who understand your industry.</p>
              <Link href="/contact" className="btn1">Book a free strategy session <Icon name="arrow" size={16} /></Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
