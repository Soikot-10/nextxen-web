import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import type { CSSProperties } from 'react'
import { industries, getIndustry, getRelatedIndustries } from '@/data/industries'
import { Words } from '@/components/ScrollReveal'
import Icon from '@/components/Icon'
import PageHero from '@/components/PageHero'
import CtaBlock from '@/components/CtaBlock'

export async function generateStaticParams() {
  return industries.map(i => ({ slug: i.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const ind = getIndustry(slug)
  if (!ind) return {}
  return { title: { absolute: ind.metaTitle }, description: ind.metaDesc, alternates: { canonical: `/industries/${ind.slug}` } }
}

const d = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties

export default async function IndustryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const ind = getIndustry(slug)
  if (!ind) notFound()

  const related = getRelatedIndustries(ind.relatedSlugs)
  const [lede, ...rest] = ind.intro.split('\n\n')

  return (
    <>
      <PageHero
        eyebrow="Industry"
        title={ind.name}
        sub={ind.shortDesc}
        top={<Link href="/industries" className="back rv rv-fade"><Icon name="arrow" size={14} /> All industries</Link>}
      />

      <section className="sec pt0">
        <div className="wrap narrow">
          <p className="lede rv rv-up">{lede}</p>
          {rest.map((para, i) => <p key={i} className="body rv rv-up">{para}</p>)}
        </div>
      </section>

      <section className="sec band">
        <div className="wrap">
          <div className="shead center rv rv-up">
            <p className="eyebrow">What we do</p>
            <h2 className="h2"><Words text="Services tailored for" /> <em>{ind.name}</em></h2>
            <p className="lead">Every service is built around the specific needs, opportunities and challenges of your industry.</p>
          </div>
          <div className="ind-grid">
            {ind.whatWeDo.map((item, i) => (
              <div key={item.title} className="rv rv-up" style={d((i % 3) * 70)}>
                <div className="ind card spot" data-tilt="6">
                  <span className="ind-top"><span className="ic3d"><Icon emoji={item.icon} size={21} /></span><span className="ind-n">{String(i + 1).padStart(2, '0')}</span></span>
                  <span className="ind-t">{item.title}</span>
                  <span className="ind-d">{item.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <div className="shead center rv rv-up">
            <p className="eyebrow">How we help</p>
            <h2 className="h2"><Words text="Results for" /> <em>{ind.name.toLowerCase()} businesses</em></h2>
          </div>
          <div className="statg">
            {ind.howWeHelp.map((item, i) => (
              <div key={item.label} className="rv rv-up" style={d(i * 80)}>
                <div className="statc card spot" data-tilt="5">
                  <div className="statc-n">{item.stat}</div>
                  <div className="statc-l">{item.label}</div>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec band">
        <div className="wrap">
          <div className="shead center rv rv-up">
            <p className="eyebrow">Key solutions</p>
            <h2 className="h2"><Words text="What’s included in" /> <em>your strategy</em></h2>
          </div>
          <ul className="feat-grid">
            {ind.features.map((feat, i) => (
              <li key={feat} className="rv rv-up" style={d((i % 2) * 60)}>
                <span className="feat card"><span className="tick"><Icon name="check" size={14} stroke={2.4} /></span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <div className="shead center rv rv-up">
            <p className="eyebrow">Case study</p>
            <h2 className="h2">{ind.caseStudy.company}</h2>
          </div>
          <div className="case">
            {([['The challenge', ind.caseStudy.challenge, 'target'], ['Our solution', ind.caseStudy.solution, 'sliders'], ['The result', ind.caseStudy.result, 'trend']] as const).map(([h, txt, ic], i) => (
              <div key={h} className="rv rv-up" style={d(i * 100)}>
                <div className={`case-c card spot${i === 2 ? ' hi' : ''}`}>
                  <span className="case-h"><span className="ic3d sm"><Icon name={ic} size={16} /></span>{h}</span>
                  <p>{txt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="sec band">
          <div className="wrap">
            <div className="shead center rv rv-up">
              <p className="eyebrow">Keep exploring</p>
              <h2 className="h2">Related <em>industries</em></h2>
            </div>
            <div className="rows">
              {related.map((r, i) => (
                <div key={r.slug} className="rv rv-up" style={d(i * 60)}>
                  <Link href={`/industries/${r.slug}`} className="row">
                    <span className="num">{String(i + 1).padStart(2, '0')}</span>
                    <span className="row-t">{r.name}</span>
                    <span className="row-d">{r.shortDesc}</span>
                    <span className="row-arr"><Icon name="arrowUpRight" size={18} stroke={1.8} /></span>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBlock title="Ready to grow your" accent={`${ind.name.toLowerCase()} business?`} text="Book a free strategy session. No obligation, real advice from NZ experts who understand your industry." />
    </>
  )
}
