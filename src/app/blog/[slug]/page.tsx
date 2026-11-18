import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import type { CSSProperties } from 'react'
import { blogPosts, getBlogPost } from '@/data/blogs'
import Icon from '@/components/Icon'
import PageHero from '@/components/PageHero'
import CtaBlock from '@/components/CtaBlock'

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
      <PageHero
        eyebrow={post.category}
        title={post.title}
        top={<Link href="/blog" className="back rv rv-fade"><Icon name="arrow" size={14} /> The journal</Link>}
      >
        <div className="byline">
          <span className="av">{post.author.name.split(' ').map(n => n[0]).join('')}</span>
          <span><b>{post.author.name}</b><small>{post.author.role}</small></span>
          <span className="byline-sep" />
          <span className="muted">{post.publishDate} · {post.readTime}</span>
        </div>
      </PageHero>

      <section className="sec pt0">
        <div className="wrap narrow">
          <p className="lede rv rv-up">{post.excerpt}</p>
          <article className="prose" dangerouslySetInnerHTML={{ __html: post.content }} />
          <div className="tags">
            {post.tags.map(tag => <span key={tag} className="chip">{tag}</span>)}
          </div>
        </div>
      </section>

      <CtaBlock title="Ready to put this" accent="into practice?" text="Book a free consultation and we’ll build a custom growth strategy for your NZ business." />

      {related.length > 0 && (
        <section className="sec band">
          <div className="wrap">
            <div className="shead rv rv-up">
              <div><p className="eyebrow">More from the journal</p><h2 className="h2">Keep <em>reading.</em></h2></div>
              <div><Link href="/blog" className="link-arrow">Back to the journal <Icon name="arrow" size={15} /></Link></div>
            </div>
            <div className="posts">
              {related.map((p, i) => (
                <div key={p.slug} className="rv rv-up" style={{ '--d': `${i * 80}ms` } as CSSProperties}>
                  <Link href={`/blog/${p.slug}`} className="post card" data-tilt="5">
                    <span className="post-body">
                      <span className="post-meta"><span className="chip">{p.category}</span>{p.readTime}</span>
                      <span className="post-t">{p.title}</span>
                      <span className="post-d">{p.excerpt.slice(0, 100)}…</span>
                    </span>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
