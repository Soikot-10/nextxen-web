import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { blogPosts, getBlogPost } from '@/data/blogs'
import ScrollReveal from '@/components/ScrollReveal'
import Icon from '@/components/Icon'

export async function generateStaticParams() {
  return blogPosts.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) return {}
  return {
    title: { absolute: post.metaTitle }, description: post.metaDesc,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { type: 'article', title: post.title, description: post.metaDesc, authors: [post.author.name] },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) notFound()

  const related = blogPosts.filter(p => p.slug !== slug && p.category === post.category).slice(0, 3)

  return (
    <>
      {/* Hero */}
      <section className="hero" style={{ minHeight: '58vh' }}>
        <div className="orb orb1" />
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 900, margin: '0 auto' }}>
          <span className="slbl">{post.category}</span>
          <h1 style={{ fontSize: 'clamp(2.4rem,5.5vw,4.4rem)' }}>{post.title}</h1>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap', color: 'var(--tx2)', fontSize: '.88rem' }}>
            <span className="tav">{post.author.name.split(' ').map(n => n[0]).join('')}</span>
            <span><span style={{ color: 'var(--tx)' }}>{post.author.name}</span> · {post.author.role}</span>
            <span style={{ color: 'var(--tx3)' }}>{post.publishDate} · {post.readTime}</span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section>
        <div className="cnt" style={{ maxWidth: '740px' }}>
          <p className="lede">{post.excerpt}</p>
          <div className="blog-content" dangerouslySetInnerHTML={{ __html: post.content }} />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem', marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--bd)' }}>
            {post.tags.map(tag => <span key={tag} className="bcat">{tag}</span>)}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section>
        <div className="cnt" style={{ maxWidth: '780px' }}>
          <ScrollReveal>
            <div className="ctabox" style={{ padding: '4.5rem 2rem' }}>
              <h2 style={{ fontSize: 'clamp(2.2rem,4vw,3.2rem)' }}>Ready to put this <span className="gt">into practice?</span></h2>
              <p>Book a free consultation and we&apos;ll build a custom growth strategy for your NZ business.</p>
              <Link href="/contact" className="btn1">Book a free strategy session <Icon name="arrow" size={16} /></Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Related posts */}
      {related.length > 0 && (
        <section style={{ borderTop: '1px solid var(--bd)' }}>
          <div className="cnt">
            <h2 className="stit" style={{ fontSize: 'clamp(2rem,4vw,3rem)' }}>Keep <span className="gt">reading.</span></h2>
            <div className="bgrid">
              {related.map((p, i) => (
                <ScrollReveal key={p.slug} delay={i * 80}>
                  <Link href={`/blog/${p.slug}`} className="bc">
                    <div className="bthumb"><Icon name="arrowUpRight" size={18} /><span>{p.category}</span></div>
                    <div className="bbody">
                      <div className="bmeta">
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
      <section style={{ paddingTop: '0', paddingBottom: '5rem' }}>
        <div className="cnt" style={{ textAlign: 'center' }}>
          <Link href="/blog" className="tlink">Back to the journal</Link>
        </div>
      </section>
    </>
  )
}
