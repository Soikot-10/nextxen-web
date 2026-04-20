'use client'
import { useState } from 'react'
import Link from 'next/link'
import { blogPosts, blogCategories } from '@/data/blogs'
import ScrollReveal from '@/components/ScrollReveal'

export default function BlogPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')

  const filtered = blogPosts.filter(p => {
    const matchesCat = category === 'All' || p.category === category
    const matchesSearch = !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
    return matchesCat && matchesSearch
  })

  return (
    <>
      {/* Hero */}
      <section className="hero" style={{ minHeight: '50vh', paddingTop: '10rem', paddingBottom: '4rem' }}>
        <div className="orb orb1" />
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '720px', margin: '0 auto' }}>
          <span className="slbl" style={{ display: 'block' }}>NEXTXEN Blog</span>
          <h1 style={{ fontSize: 'clamp(2rem,5vw,3.8rem)', fontWeight: 900, lineHeight: 1.08, letterSpacing: '-.03em', marginBottom: '1rem' }}>
            Marketing <span className="gt">Insights</span> for NZ Businesses
          </h1>
          <p className="hero-sub" style={{ marginBottom: '2rem' }}>
            Expert guides, strategies, and insights to help your NZ business grow online.
          </p>
          {/* Search */}
          <div style={{ position: 'relative', maxWidth: '440px', margin: '0 auto 1.5rem' }}>
            <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--tx3)' }}>🔍</span>
            <input
              type="text"
              placeholder="Search posts, topics, tags..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: '2.8rem', background: 'rgba(255,255,255,.06)', border: '1px solid var(--bd2)' }}
            />
          </div>
          {/* Category filters */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '.5rem' }}>
            {blogCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                style={{
                  padding: '.38rem .9rem', borderRadius: '50px', fontSize: '.75rem', fontWeight: 600,
                  cursor: 'pointer', transition: '.2s', fontFamily: 'var(--ff)',
                  background: category === cat ? 'var(--g1)' : 'transparent',
                  border: category === cat ? '1px solid transparent' : '1px solid var(--bd)',
                  color: category === cat ? '#fff' : 'var(--tx2)',
                  boxShadow: category === cat ? '0 0 15px rgba(108,92,231,.4)' : 'none',
                }}
              >{cat}</button>
            ))}
          </div>
        </div>
      </section>

      {/* Posts */}
      <section style={{ background: 'var(--bg2)' }}>
        <div className="cnt">
          {filtered.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--tx3)', padding: '4rem 0' }}>No posts found. Try a different search or category.</p>
          ) : (
            <>
              <p style={{ color: 'var(--tx3)', fontSize: '.76rem', marginBottom: '1.5rem' }}>{filtered.length} {filtered.length === 1 ? 'post' : 'posts'} found</p>
              <div className="bgrid" style={{ marginTop: 0 }}>
                {filtered.map((post, i) => (
                  <ScrollReveal key={post.slug} delay={i * 60}>
                    <Link href={`/blog/${post.slug}`} className="bc">
                      <div className="bthumb" style={{ background: `linear-gradient(135deg,#1a0a2e,#0d1040)` }}>📖</div>
                      <div className="bbody">
                        <div className="bmeta">
                          <span className="bcat">{post.category}</span>
                          <span className="bdate">{post.publishDate}</span>
                        </div>
                        <h3>{post.title}</h3>
                        <p>{post.excerpt.slice(0,110)}…</p>
                        <div style={{ marginTop: '.65rem', fontSize: '.7rem', color: 'var(--tx3)', display: 'flex', justifyContent: 'space-between' }}>
                          <span>{post.author.name}</span>
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                    </Link>
                  </ScrollReveal>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section>
        <div className="cnt">
          <ScrollReveal>
            <div className="nlbox">
              <span className="slbl" style={{ display: 'block', textAlign: 'center' }}>Free Tips</span>
              <h2>Get Weekly <span className="gt">Growth Strategies</span></h2>
              <p>Join 2,400+ NZ business owners getting free AI marketing tips every week. No spam, unsubscribe anytime.</p>
              <div className="nlform">
                <input type="email" placeholder="your@email.co.nz" />
                <button>Subscribe Free</button>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
