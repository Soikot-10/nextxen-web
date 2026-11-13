'use client'
import { useState } from 'react'
import Link from 'next/link'
import { industries } from '@/data/industries'
import ScrollReveal from '@/components/ScrollReveal'
import Icon from '@/components/Icon'

export default function IndustriesPage() {
  const [search, setSearch] = useState('')
  const filtered = industries.filter(ind =>
    ind.name.toLowerCase().includes(search.toLowerCase()) ||
    ind.shortDesc.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      {/* Hero */}
      <section className="hero" style={{ minHeight: '56vh' }}>
        <div className="orb orb1" />
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '720px', margin: '0 auto' }}>
          <span className="slbl">Industries</span>
          <h1>Your industry. <span className="gt">Our expertise.</span></h1>
          <p className="hero-sub" style={{ marginBottom: '2rem' }}>
            AI-powered marketing strategies shaped around how customers buy in your sector. Explore how we drive growth for businesses like yours.
          </p>
          {/* Search */}
          <div style={{ position: 'relative', maxWidth: '440px', margin: '0 auto' }}>
            <span style={{ position: 'absolute', left: '1.1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--tx3)' }}><Icon name="search" size={17} /></span>
            <input
              type="text"
              placeholder="Search industries" aria-label="Search industries"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: '2.9rem', borderRadius: 999, background: 'var(--sf)' }}
            />
          </div>
        </div>
      </section>

      {/* Grid */}
      <section>
        <div className="cnt">
          {filtered.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--tx3)', padding: '4rem 0' }}>No industries found for &ldquo;{search}&rdquo;</p>
          ) : (
            <div className="ind-grid" style={{ marginTop: 0 }}>
              {filtered.map((ind, i) => (
                <ScrollReveal key={ind.slug} delay={i * 50}>
                  <Link href={`/industries/${ind.slug}`} className="ind-card">
                    <span className="ind-icon"><Icon emoji={ind.icon} size={20} /></span>
                    <h3>{ind.name}</h3>
                    <p>{ind.shortDesc}</p>
                    <span className="ind-arrow">Explore <Icon name="arrow" size={14} /></span>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section>
        <div className="cnt">
          <ScrollReveal>
            <div className="ctabox">
              <h2>Don&apos;t see <span className="gt">your industry?</span></h2>
              <p>We work with businesses across all industries. Book a free consultation and we&apos;ll build a custom strategy for your specific market.</p>
              <Link href="/contact" className="btn1">Get a custom strategy <Icon name="arrow" size={16} /></Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
