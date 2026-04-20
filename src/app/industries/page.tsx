'use client'
import { useState } from 'react'
import Link from 'next/link'
import { industries } from '@/data/industries'
import ScrollReveal from '@/components/ScrollReveal'

export default function IndustriesPage() {
  const [search, setSearch] = useState('')
  const filtered = industries.filter(ind =>
    ind.name.toLowerCase().includes(search.toLowerCase()) ||
    ind.shortDesc.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      {/* Hero */}
      <section className="hero" style={{ minHeight: '50vh', paddingTop: '10rem', paddingBottom: '4rem' }}>
        <div className="orb orb1" />
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '720px', margin: '0 auto' }}>
          <span className="slbl" style={{ display: 'block', marginBottom: '.9rem' }}>Industries We Serve</span>
          <h1 style={{ fontSize: 'clamp(2rem,5vw,3.8rem)', fontWeight: 900, lineHeight: 1.08, letterSpacing: '-.03em', marginBottom: '1rem' }}>
            Your Industry. <span className="gt2">Our Expertise.</span>
          </h1>
          <p className="hero-sub" style={{ marginBottom: '2rem' }}>
            Tailored AI-powered marketing strategies for every industry in New Zealand. Click any industry to explore how we drive real growth.
          </p>
          {/* Search */}
          <div style={{ position: 'relative', maxWidth: '440px', margin: '0 auto' }}>
            <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--tx3)', fontSize: '.9rem' }}>🔍</span>
            <input
              type="text"
              placeholder="Search industries..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: '2.8rem', background: 'rgba(255,255,255,.06)', border: '1px solid var(--bd2)' }}
            />
          </div>
        </div>
      </section>

      {/* Grid */}
      <section style={{ background: 'var(--bg2)' }}>
        <div className="cnt">
          {filtered.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--tx3)', padding: '4rem 0' }}>No industries found for &ldquo;{search}&rdquo;</p>
          ) : (
            <div className="ind-grid" style={{ marginTop: 0 }}>
              {filtered.map((ind, i) => (
                <ScrollReveal key={ind.slug} delay={i * 50}>
                  <Link href={`/industries/${ind.slug}`} className="ind-card">
                    <span className="ind-icon">{ind.icon}</span>
                    <h3>{ind.name}</h3>
                    <p>{ind.shortDesc}</p>
                    <span className="ind-arrow">Explore →</span>
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
            <div className="ctabox" style={{ padding: '3.5rem 2.5rem' }}>
              <h2>Don&apos;t see your industry?</h2>
              <p>We work with businesses across all industries. Book a free consultation and we&apos;ll build a custom strategy for your specific market.</p>
              <Link href="/contact" className="btn1">Get a Custom Strategy</Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
