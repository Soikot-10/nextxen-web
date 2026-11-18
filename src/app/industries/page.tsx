'use client'
import { useState, type CSSProperties } from 'react'
import Link from 'next/link'
import { industries } from '@/data/industries'
import Icon from '@/components/Icon'
import PageHero from '@/components/PageHero'
import CtaBlock from '@/components/CtaBlock'

export default function IndustriesPage() {
  const [search, setSearch] = useState('')
  const q = search.toLowerCase()
  const filtered = industries.filter(ind => ind.name.toLowerCase().includes(q) || ind.shortDesc.toLowerCase().includes(q))

  return (
    <>
      <PageHero eyebrow="Industries" title="Your industry." accent="Our expertise." sub="AI-powered marketing strategies shaped around how customers buy in your sector. Explore how we drive growth for businesses like yours.">
        <label className="search">
          <Icon name="search" size={17} />
          <input type="text" placeholder="Search industries" aria-label="Search industries" value={search} onChange={e => setSearch(e.target.value)} />
          <kbd>{filtered.length}</kbd>
        </label>
      </PageHero>

      <section className="sec pt0">
        <div className="wrap">
          {filtered.length === 0 ? (
            <p className="empty">No industries found for &ldquo;{search}&rdquo;</p>
          ) : (
            <div className="ind-grid">
              {filtered.map((ind, i) => (
                <div key={ind.slug} className="rv rv-up" style={{ '--d': `${(i % 3) * 70}ms` } as CSSProperties}>
                  <Link href={`/industries/${ind.slug}`} className="ind card spot" data-tilt="6">
                    <span className="ind-top">
                      <span className="ic3d"><Icon emoji={ind.icon} size={21} /></span>
                      <span className="ind-n">{String(i + 1).padStart(2, '0')}</span>
                    </span>
                    <span className="ind-t">{ind.name}</span>
                    <span className="ind-d">{ind.shortDesc}</span>
                    <span className="link-arrow">Explore <Icon name="arrow" size={14} /></span>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <CtaBlock title="Don’t see" accent="your industry?" text="We work with businesses across all industries. Book a free consultation and we’ll build a custom strategy for your specific market." button="Get a custom strategy" />
    </>
  )
}
