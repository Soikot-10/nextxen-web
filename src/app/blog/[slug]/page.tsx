import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { blogPosts, getBlogPost } from '@/data/blogs'
import ScrollReveal from '@/components/ScrollReveal'

export async function generateStaticParams() {
  return blogPosts.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) return {}
  return { title: post.metaTitle, description: post.metaDesc }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) notFound()

  const related = blogPosts.filter(p => p.slug !== slug && p.category === post.category).slice(0, 3)

  return (
    <>
      {/* Hero */}
      <section className="hero" style={{ minHeight: '44vh', paddingTop: '10rem', paddingBottom: '3rem' }}>
        <div className="orb orb1" style={{ opacity: .5 }} />
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '780px', margin: '0 auto', textAlign: 'center' }}>
          <span className="bcat" style={{ display: 'inline-block', marginBottom: '1.2rem' }}>{post.category}</span>
          <h1 style={{ fontSize: 'clamp(1.7rem,4vw,3rem)', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-.03em' }}>{post.title}</h1>
        </div>
      </section>

      {/* Meta bar */}
      <section style={{ background: 'var(--bg2)', borderBottom: '1px solid var(--bd)', padding: '1.4rem 0' }}>
        <div className="cnt" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'var(--g3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '.85rem', color: '#fff', flexShrink: 0 }}>
              {post.author.name[0]}
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '.85rem' }}>{post.author.name}</div>
              <div style={{ color: 'var(--tx3)', fontSize: '.75rem' }}>{post.author.role}</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', color: 'var(--tx3)', fontSize: '.78rem' }}>
            <span>📅 {post.publishDate}</span>
            <span>⏱ {post.readTime}</span>
          </div>
          <div style={{ display: 'flex', gap: '.5rem' }}>
            {['Facebook','Twitter','LinkedIn'].map(s => (
              <a key={s} href="#" style={{ padding: '.35rem .8rem', fontSize: '.72rem', fontWeight: 600, borderRadius: '8px', background: 'var(--glass)', border: '1px solid var(--bd)', color: 'var(--tx2)', textDecoration: 'none', transition: '.2s' }}>{s}</a>
            ))}
          </div>
        </div>
      </section>

      {/* Tags */}
      <section style={{ background: 'var(--bg2)', paddingTop: 0, paddingBottom: '1rem' }}>
        <div className="cnt" style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem' }}>
          {post.tags.map(tag => (
            <span key={tag} className="stag">{tag}</span>
          ))}
        </div>
      </section>

      {/* Content */}
      <section style={{ background: 'var(--bg2)' }}>
        <div className="cnt" style={{ maxWidth: '780px' }}>
          <p style={{ color: 'var(--ac2)', fontSize: '1rem', fontWeight: 500, lineHeight: 1.75, marginBottom: '2rem', borderLeft: '3px solid var(--ac)', paddingLeft: '1.2rem' }}>{post.excerpt}</p>
          <div className="blog-content" dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
      </section>

      {/* CTA */}
      <section>
        <div className="cnt" style={{ maxWidth: '780px' }}>
          <ScrollReveal>
            <div className="ctabox" style={{ padding: '3rem 2.5rem' }}>
              <h2 style={{ fontSize: '1.5rem' }}>Ready to implement these strategies?</h2>
              <p>Book a free consultation and we&apos;ll build a custom growth strategy for your NZ business.</p>
              <Link href="/contact" className="btn1">🚀 Book Free Strategy Session</Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Related posts */}
      {related.length > 0 && (
        <section style={{ background: 'var(--bg2)' }}>
          <div className="cnt">
            <h3 className="stit" style={{ marginBottom: '1.8rem' }}>Related Posts</h3>
            <div className="bgrid">
              {related.map((p, i) => (
                <ScrollReveal key={p.slug} delay={i * 80}>
                  <Link href={`/blog/${p.slug}`} className="bc">
                    <div className="bthumb" style={{ background: 'linear-gradient(135deg,#1a0a2e,#0d1040)' }}>📖</div>
                    <div className="bbody">
                      <div className="bmeta">
                        <span className="bcat">{p.category}</span>
                        <span className="bdate">{p.publishDate}</span>
                      </div>
                      <h3>{p.title}</h3>
                      <p>{p.excerpt.slice(0, 100)}…</p>
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Back */}
      <section style={{ background: 'var(--bg2)', paddingTop: '1.5rem', paddingBottom: '1.5rem' }}>
        <div className="cnt" style={{ textAlign: 'center' }}>
          <Link href="/blog" style={{ color: 'var(--ac)', fontSize: '.85rem', textDecoration: 'none' }}>← Back to all posts</Link>
        </div>
      </section>
    </>
  )
}
