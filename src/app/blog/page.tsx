'use client'
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type PointerEvent as RPointerEvent, type ReactNode } from 'react'
import Link from 'next/link'
import { blogPosts, blogCategories, type BlogPost } from '@/data/blogs'
import CardArt, { ART_IMAGE } from '@/components/journal/CardArt'
import CursorSparks from '@/components/contact/CursorSparks'
import { Fern, Leaf } from '@/components/contact/Decor'
import { BrandMark } from '@/components/brand/BrandLogo'
import './journal.css'

// Journal, matched to the owner's reference (_review/reference/journal-reference.png).
// On desktop the hero and the featured card are the reference artwork (baked text
// removed) with real HTML placed on top; pills and post cards are built in code so
// every post, present or future, renders from the blog data.

const RW = 1122
const at = (x: number, y: number, w: number, h: number, bw?: number, bh?: number): CSSProperties => ({
  left: `${(x / w) * 100}%`, top: `${(y / h) * 100}%`,
  ...(bw !== undefined ? { width: `${(bw / w) * 100}%` } : {}),
  ...(bh !== undefined ? { height: `${(bh / h) * 100}%` } : {}),
})
const fs = (px: number): CSSProperties => ({ fontSize: `calc(var(--u) * ${px})` })
const initials = (n: string) => n.split(' ').map(p => p[0]).join('').slice(0, 2)

const I = ({ children }: { children: ReactNode }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>
)
export const CAT_ICON: Record<string, ReactNode> = {
  'AI Tools': <I><path d="M12 3l1.8 4.6L18 9.5l-4.2 1.9L12 16l-1.8-4.6L6 9.5l4.2-1.9z" /><path d="M19 15l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8zM5 3l.6 1.4L7 5l-1.4.6L5 7l-.6-1.4L3 5l1.4-.6z" /></I>,
  'Google Ads': <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.2 3.6a3 3 0 0 1 4.1 1.1l6.3 10.9a3 3 0 1 1-5.2 3L8.1 7.7a3 3 0 0 1 1.1-4.1z" fill="#4285F4" /><path d="M8.1 7.7 3.4 15.8a3 3 0 1 0 5.2 3l4.7-8.1z" fill="#FBBC04" /><circle cx="6" cy="17.3" r="3" fill="#34A853" /></svg>,
  'Local SEO': <I><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></I>,
  'Social Media': <I><circle cx="9" cy="8" r="3" /><circle cx="17" cy="9" r="2.4" /><path d="M3 19c.6-3.4 3-5 6-5s5.4 1.6 6 5M14.5 14.6c2.8-.5 5.6.8 6.5 4.4" /></I>,
  'Email Marketing': <I><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></I>,
  SEO: <I><path d="M12 3l9 5-9 5-9-5z" /><path d="M3 13l9 5 9-5" /><path d="M3 17l9 5 9-5" opacity=".6" /></I>,
  'Paid Ads': <I><path d="M5 20v-6M10 20v-9M15 20v-5M20 20V6" /></I>,
  Content: <I><path d="M4 20h4L19 9l-4-4L4 16z" /><path d="M13 7l4 4" /></I>,
}
const catIcon = (c: string) => CAT_ICON[c] ?? <I><circle cx="12" cy="12" r="3" /></I>

// cards and pills tilt towards the cursor (pointer devices only)
const canTilt = () => matchMedia('(hover: hover) and (pointer: fine)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches
function tilt(e: RPointerEvent<HTMLElement>, k = 1) {
  if (!canTilt()) return
  const el = e.currentTarget, r = el.getBoundingClientRect()
  const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height
  el.style.setProperty('--tx', `${(x * 100).toFixed(1)}%`); el.style.setProperty('--ty', `${(y * 100).toFixed(1)}%`)
  el.style.setProperty('--ry', `${((x - .5) * 8 * k).toFixed(2)}deg`); el.style.setProperty('--rx', `${((.5 - y) * 8 * k).toFixed(2)}deg`)
}
// the robot looks toward the cursor: --lx / --ly in -1..1 around the robot's head
function look(e: RPointerEvent<HTMLElement>) {
  if (!canTilt()) return
  const el = e.currentTarget, r = el.getBoundingClientRect()
  const hx = r.left + r.width * .74, hy = r.top + r.height * .4
  el.style.setProperty('--lx', Math.max(-1, Math.min(1, (e.clientX - hx) / (r.width * .4))).toFixed(3))
  el.style.setProperty('--ly', Math.max(-1, Math.min(1, (e.clientY - hy) / (r.height * .5))).toFixed(3))
}
function untilt(e: RPointerEvent<HTMLElement>) { e.currentTarget.style.setProperty('--rx', '0deg'); e.currentTarget.style.setProperty('--ry', '0deg') }

function Art({ category, wide = false }: { category: string; wide?: boolean }) {
  const src = ART_IMAGE[category]
  if (!src) return <span className="jx-art code"><CardArt category={category} /></span>
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img className={`jx-art img${wide ? ' wide' : ''}`} src={`${src}@2x.webp`} alt="" loading="lazy" />
  )
}

function Card({ post, i }: { post: BlogPost; i: number }) {
  return (
    <Link href={`/blog/${post.slug}`} className="jx-card" style={{ '--i': i } as CSSProperties} onPointerMove={e => tilt(e, .8)} onPointerLeave={untilt}>
      <span className="jx-card-top">
        <span className="jx-art-wrap"><Art category={post.category} /></span>
        <span className="jx-chip cream" style={fs(13.4)}><i>{catIcon(post.category)}</i>{post.category}</span>
        <span className="jx-read" style={fs(13.4)}>{post.readTime}</span>
      </span>
      <span className="jx-card-body">
        <svg className="jx-cream" viewBox="0 0 326 250" preserveAspectRatio="none" aria-hidden="true">
          <defs><linearGradient id="jxc" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fbf4e6" /><stop offset="1" stopColor="#efe2c8" /></linearGradient></defs>
          <path d="M0 26C40 6 92 2 150 18S262 34 326 8V250H0Z" fill="url(#jxc)" />
          <path d="M0 26C40 6 92 2 150 18S262 34 326 8" fill="none" stroke="#fff" strokeOpacity=".9" strokeWidth="2" />
        </svg>
        <span className="jx-t" style={fs(24.5)}>{post.title}</span>
        <span className="jx-d" style={fs(13.6)}>{post.excerpt}</span>
        <span className="jx-by" style={fs(13.4)}>
          <span className="jx-av" style={fs(11.5)}>{initials(post.author.name)}</span>
          <b>{post.author.name}</b><i className="jx-div" /><span>{post.publishDate}</span>
        </span>
      </span>
      <i className="jx-spec" aria-hidden="true" />
    </Link>
  )
}

export default function JournalPreview() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const q = search.trim().toLowerCase()
  const filtered = blogPosts.filter(p => {
    const matchesCat = category === 'All' || p.category === category
    const matchesSearch = !q || p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.tags.some(t => t.toLowerCase().includes(q))
    return matchesCat && matchesSearch
  })
  const [lead, ...others] = filtered

  // sliding gold highlight behind the active pill
  const pillsRef = useRef<HTMLDivElement>(null)
  const [hl, setHl] = useState<{ x: number; w: number } | null>(null)
  useLayoutEffect(() => {
    const measure = () => {
      const el = pillsRef.current?.querySelector<HTMLElement>('.jx-pill.on')
      if (el) setHl({ x: el.offsetLeft, w: el.offsetWidth })
    }
    const id = requestAnimationFrame(measure)
    addEventListener('resize', measure)
    return () => { cancelAnimationFrame(id); removeEventListener('resize', measure) }
  }, [category])

  // cursor glow (fixed, page-wide)
  const cur = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = cur.current
    if (!el || !canTilt()) return
    let raf = 0
    const move = (e: PointerEvent) => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        el.style.setProperty('--cx', `${e.clientX}px`); el.style.setProperty('--cy', `${e.clientY}px`); el.classList.add('lit')
        const root = el.parentElement
        root?.style.setProperty('--mx', ((e.clientX / innerWidth) * 2 - 1).toFixed(3))
        root?.style.setProperty('--my', ((e.clientY / innerHeight) * 2 - 1).toFixed(3))
      })
    }
    let sraf = 0
    const scroll = () => { cancelAnimationFrame(sraf); sraf = requestAnimationFrame(() => el.parentElement?.style.setProperty('--sy', String(Math.min(scrollY, 600)))) }
    addEventListener('pointermove', move, { passive: true })
    addEventListener('scroll', scroll, { passive: true })
    return () => { removeEventListener('pointermove', move); removeEventListener('scroll', scroll); cancelAnimationFrame(raf); cancelAnimationFrame(sraf) }
  }, [])

  const H1 = 374, FW = 1076, FH = 422
  const searchBox = (cls: string) => (
    <label className={cls}>
      <span className="sr-only">Search posts</span>
      <input type="search" placeholder="Search posts and topics" value={search} onChange={e => setSearch(e.target.value)} />
      <i className="jx-twinkle" aria-hidden="true" />
    </label>
  )

  return (
    <div className="jx">
      <div className="jx-bg" aria-hidden="true"><i className="g1" /><i className="g2" /><i className="g3" /></div>
      {(['l', 'r'] as const).map(s => (
        <div key={s} className={`jx-side ${s}`} aria-hidden="true">
          <Leaf className="sl a" tone="ref" style={{ '--r': '-30deg' } as CSSProperties} />
          <Leaf className="sl b" tone="deep" style={{ '--r': '14deg' } as CSSProperties} />
          <Fern className="sf1" leaflets={18} />
          <Leaf className="sl d" tone="ref" style={{ '--r': '36deg' } as CSSProperties} />
          <Leaf className="sl e" tone="fresh" style={{ '--r': '-56deg' } as CSSProperties} />
        </div>
      ))}
      <div className="jx-cur" ref={cur} aria-hidden="true"><i className="jx-glow" /><CursorSparks /></div>

      <div className="jx-w">
        {/* ── desktop hero: reference artwork + live HTML ── */}
        <section className="jx-hero jx-desk" aria-labelledby="jx-title">
          <picture className="jx-skin">
            <source type="image/webp" srcSet="/journal/hero.webp 1122w, /journal/hero@2x.webp 2244w" sizes="(min-width: 1400px) 1400px, 100vw" />
            <img src="/journal/hero@2x.webp" alt="" width={RW} height={H1} fetchPriority="high" />
          </picture>
          <i className="jx-lake" style={at(930, 252, RW, H1, 130, 90)} aria-hidden="true" />
          <i className="jx-sheen" style={{ maskImage: 'url(/journal/hero-gold.png)', WebkitMaskImage: 'url(/journal/hero-gold.png)' }} aria-hidden="true" />
          <nav className="jx-nav" aria-label="Main">
            <Link href="/" className="jx-logo" style={{ ...at(134, 12, RW, H1, 166, 44) }} aria-label="NEXTXEN home"><BrandMark className="jx-mark" /><span style={fs(19.5)}>NEXTXEN</span></Link>
            {[['/#services', 'Services', 428], ['/industries', 'Industries', 522], ['/#work', 'Results', 622], ['/#pricing', 'Pricing', 706], ['/blog', 'Journal', 788]].map(([href, label, x]) => (
              <Link key={label as string} href={href as string} className={`jx-link${label === 'Journal' ? ' on' : ''}`} aria-current={label === 'Journal' ? 'page' : undefined}
                style={{ ...at(x as number, 16, RW, H1, undefined, 32), ...fs(16.4) }}>{label}</Link>
            ))}
            <Link href="/contact" className="jx-book" style={{ ...at(897, 12, RW, H1, 168, 44), '--bx': 897, '--by': 12 } as CSSProperties} onPointerMove={e => tilt(e, .9)} onPointerLeave={untilt}>
              <span className="jb-face">
                <span className="jb-l" style={fs(16.6)}>Book a call</span>
                <i className="jb-sweep" /><i className="jb-spec" />
                <i className="jb-coin"><b className="jb-ripple" /><svg viewBox="0 0 24 24"><path d="M7 17L17 7M9 7h8v8" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg></i>
              </span>
            </Link>
          </nav>
          <div className="jx-par">
          <p className="jx-t1 eye" style={{ ...at(0, 126, RW, H1, RW), ...fs(14.5) }}>Journal</p>
          <h1 className="jx-t1 h1" id="jx-title" style={{ ...at(0, 148, RW, H1, RW), ...fs(80) }}>Ideas worth <em>stealing.</em></h1>
          <p className="jx-t1 sub" style={{ ...at(300, 233, RW, H1, 500), ...fs(18.4) }}>Practical guides on AI, search, advertising and social for New Zealand business owners.</p>
          </div>
          <div className="jx-search-at" style={at(270, 296, RW, H1, 556, 56)}>
            {searchBox('jx-search')}
            <span className="jx-count" style={fs(13)} aria-live="polite">{filtered.length} {filtered.length === 1 ? 'post' : 'posts'}</span>
          </div>
        </section>

        {/* ── phone / tablet hero ── */}
        <section className="jx-mhero jx-mob">
          <span className="jx-mlake" aria-hidden="true" />
          <p className="jx-meye">Journal</p>
          <h1 className="jx-mh1">Ideas worth <em>stealing.</em></h1>
          <p className="jx-msub">Practical guides on AI, search, advertising and social for New Zealand business owners.</p>
          {searchBox('jx-search m')}
          <p className="jx-mcount" aria-live="polite">{filtered.length} {filtered.length === 1 ? 'post' : 'posts'}</p>
        </section>

        {/* ── category pills ── */}
        <div className="jx-pills" ref={pillsRef} role="group" aria-label="Filter by category">
          {hl && <i className="jx-pill-hl" style={{ left: hl.x, width: hl.w }} aria-hidden="true" />}
          {blogCategories.map((c, i) => (
            <button key={c} type="button" className={`jx-pill${category === c ? ' on' : ''}`} aria-pressed={category === c} onClick={() => setCategory(c)}
              onPointerMove={e => tilt(e, 1.6)} onPointerLeave={untilt} style={{ '--i': i } as CSSProperties}>
              {c !== 'All' && <i>{catIcon(c)}</i>}<span>{c}</span>
            </button>
          ))}
        </div>

        {!lead ? (
          <p className="jx-empty">No posts found. Try a different search or category.</p>
        ) : (
          <>
            {/* ── featured: desktop skin ── */}
            <section className="jx-feat jx-desk" key={`f-${lead.slug}`} onPointerMove={e => { tilt(e, .25); look(e) }} onPointerLeave={e => { untilt(e); e.currentTarget.style.setProperty('--lx', '0'); e.currentTarget.style.setProperty('--ly', '0') }}>
              <picture className="jx-skin">
                <source type="image/webp" srcSet="/journal/featured.webp 1076w, /journal/featured@2x.webp 2152w" sizes="(min-width: 1400px) 1340px, 96vw" />
                <img src="/journal/featured@2x.webp" alt="" width={FW} height={FH} loading="lazy" />
              </picture>
              <i className="jx-sheen" style={{ maskImage: 'url(/journal/featured-gold.png)', WebkitMaskImage: 'url(/journal/featured-gold.png)' }} aria-hidden="true" />
              {lead.category !== 'AI Tools' ? (
                <span className="jx-feat-alt" style={at(560, 40, FW, FH, 440, 340)}><Art category={lead.category} wide /></span>
              ) : (
                <>
                  <i className="jx-lap" style={at(640, 270, FW, FH, 110, 70)} aria-hidden="true" />
                  <span className="jx-robot" style={at(666, 74, FW, FH, 222, 186)} aria-hidden="true">
                    <span className="jx-robot-in">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/journal/robot@2x.webp" alt="" />
                      <i className="jx-face" />
                      <svg className="jx-eyes" viewBox="0 0 222 186">
                        <g className="jx-eye-l"><path d="M60 106Q73 88 86 106" /></g>
                        <g className="jx-eye-r"><path d="M125 106Q138 88 151 106" /></g>
                      </svg>
                    </span>
                  </span>
                  <span className="jx-dots" style={at(862, 58, FW, FH, 72, 26)} aria-hidden="true"><i /><i /><i /></span>
                  <svg className="jx-star" style={at(642, 89, FW, FH, 40, 40)} viewBox="0 0 40 40" aria-hidden="true"><path d="M20 2l4 13 14 5-14 5-4 13-4-13-14-5 14-5z" /></svg>
                  <i className="jx-tile-glint" style={at(576, 174, FW, FH, 90, 83)} aria-hidden="true" />
                  <span className="jx-motes" style={at(540, 40, FW, FH, 480, 330)} aria-hidden="true">{Array.from({ length: 12 }, (_, k) => <i key={k} style={{ '--k': k } as CSSProperties} />)}</span>
                </>
              )}
              <span className="jx-chip gold" style={{ ...at(106, 47, FW, FH), ...fs(14) }}><i>{catIcon(lead.category)}</i>{lead.category}</span>
              <h2 className="jx-ft" style={{ ...at(110, 84, FW, FH, 420), ...fs(38.5) }}>{lead.title}</h2>
              <p className="jx-fd" style={{ ...at(116, 241, FW, FH, 372), ...fs(16.2) }}>{lead.excerpt}</p>
              <p className="jx-fby" style={{ ...at(110, 332, FW, FH), ...fs(14) }}>
                <span className="jx-av gold" style={fs(12.5)}>{initials(lead.author.name)}</span><b>{lead.author.name}</b><i className="jx-div" /><span>{lead.publishDate} · {lead.readTime}</span>
              </p>
              <Link href={`/blog/${lead.slug}`} className="jx-feat-link" aria-label={`Read: ${lead.title}`} />
            </section>

            {/* ── featured: phone / tablet ── */}
            <Link href={`/blog/${lead.slug}`} className="jx-mfeat jx-mob" key={`m-${lead.slug}`}>
              <span className="jx-mfeat-art"><Art category={lead.category} wide /></span>
              <span className="jx-chip gold"><i>{catIcon(lead.category)}</i>{lead.category}</span>
              <span className="jx-mft">{lead.title}</span>
              <span className="jx-mfd">{lead.excerpt}</span>
              <span className="jx-fby m"><span className="jx-av gold">{initials(lead.author.name)}</span><b>{lead.author.name}</b><i className="jx-div" /><span>{lead.publishDate} · {lead.readTime}</span></span>
            </Link>

            {others.length > 0 && (
              <div className="jx-grid" key={`${category}|${q}`}>
                {others.map((post, i) => <Card key={post.slug} post={post} i={i} />)}
              </div>
            )}
          </>
        )}
      </div>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="jx-bottom" src="/journal/bottom@2x.webp" alt="" aria-hidden="true" />
    </div>
  )
}
