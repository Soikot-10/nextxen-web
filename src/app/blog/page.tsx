'use client'
import { useState } from 'react'
import Link from 'next/link'
import { blogPosts, blogCategories } from '@/data/blogs'
import ScrollReveal from '@/components/ScrollReveal'
import Icon from '@/components/Icon'

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
      <section className="hero" style={{ minHeight: '56vh' }}>
        <div className="orb orb1" />
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '720px', margin: '0 auto' }}>
          <span className="slbl">Journal</span>
          <h1>Ideas worth <span className="gt">stealing.</span></h1>
          <p className="hero-sub" style={{ marginBottom: '2rem' }}>
            Practical guides on AI, search, advertising and social for New Zealand business owners.
          </p>
          {/* Search */}
          <div style={{ position: 'relative', maxWidth: '440px', margin: '0 auto 1.5rem' }}>
            <span style={{ position: 'absolute', left: '1.1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--tx3)' }}><Icon name="search" size={17} /></span>
            <input
              type="text"
              placeholder="Search posts and topics" aria-label="Search posts"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: '2.9rem', borderRadius: 999, background: 'var(--sf)' }}
            />
          </div>
          {/* Category filters */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '.5rem' }}>
            {blogCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                style={{
                  padding: '.45rem 1rem', borderRadius: 999, fontSize: '.84rem', fontWeight: 500,
                  cursor: 'pointer', transition: '.2s', fontFamily: 'var(--ff)',
                  background: category === cat ? 'var(--tx)' : 'transparent',
                  border: category === cat ? '1px solid var(--tx)' : '1px solid var(--bd2)',
                  color: category === cat ? 'var(--bg)' : 'var(--tx2)',
                }}
              >{cat}</button>
            ))}
          </div>
        </div>
      </section>

      {/* Posts */}
      <section>
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
                      <div className="bthumb"><Icon name="arrowUpRight" size={18} /><span>{post.category}</span></div>
                      <div className="bbody">
                        <div className="bmeta">
                          <span className="bdate">{post.publishDate}</span>
                        </div>
                        <h3>{post.title}</h3>
                        <p>{post.excerpt.slice(0,110)}…</p>
                        <div style={{ marginTop: 'auto', paddingTop: '1.2rem', fontSize: '.8rem', color: 'var(--tx3)', display: 'flex', justifyContent: 'space-between' }}>
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
    </>
  )
}
