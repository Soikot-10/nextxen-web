import type { CSSProperties } from 'react'

type T = { name: string; company: string; initials: string; text: string }

// Testimonials as a tactile clay scene: a thick matte slab with raised sand
// tiles, embossed initial coins, pill tags and sculpted clay decor (quote
// marks, a star pill, a sprout and a small peeking dome mascot). Pure CSS/SVG.
export default function ClayTestimonials({ items }: { items: T[] }) {
  const [lead, ...rest] = items
  return (
    <div className="clay-slab rv rv-up">
      {/* decor */}
      <span className="clay-mascot" aria-hidden="true"><span className="cm-eye" /><span className="cm-eye" /></span>
      <svg className="clay-sprout" viewBox="0 0 80 90" aria-hidden="true">
        <defs>
          <radialGradient id="cs-l" cx="35%" cy="30%" r="75%"><stop offset="0" stopColor="#9fca7c" /><stop offset=".6" stopColor="#5f8f45" /><stop offset="1" stopColor="#3c6330" /></radialGradient>
          <radialGradient id="cs-p" cx="35%" cy="30%" r="75%"><stop offset="0" stopColor="#e6a46a" /><stop offset=".6" stopColor="#b56a32" /><stop offset="1" stopColor="#7d4420" /></radialGradient>
        </defs>
        <path d="M40 86 C38 70 40 58 44 46" stroke="#4a7638" strokeWidth="6" strokeLinecap="round" fill="none" />
        <path d="M44 48 C 26 50 12 38 10 18 C 30 16 44 28 44 48 Z" fill="url(#cs-l)" />
        <path d="M44 42 C 52 22 66 14 76 14 C 76 34 62 46 44 42 Z" fill="url(#cs-l)" />
        <ellipse cx="40" cy="86" rx="18" ry="5" fill="url(#cs-p)" />
      </svg>

      <div className="clay-grid">
        <figure className="clay-tile lead">
          <span className="clay-quote" aria-hidden="true"><i /><i /></span>
          <span className="clay-stars" aria-label="Five stars">
            {[0, 1, 2, 3, 4].map(k => (
              <svg key={k} viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="m12 2.8 2.85 5.78 6.37.93-4.61 4.49 1.09 6.35L12 17.35l-5.7 3 1.09-6.35L2.78 9.5l6.37-.93z" /></svg>
            ))}
          </span>
          <blockquote>{lead.text}</blockquote>
          <figcaption>
            <span className="clay-coin">{lead.initials}</span>
            <span className="clay-tags"><b className="clay-pill">{lead.name}</b><small className="clay-pill alt">{lead.company}</small></span>
          </figcaption>
        </figure>

        <div className="clay-side">
          {rest.map((t, i) => (
            <figure key={t.name} className="clay-tile" style={{ '--k': i } as CSSProperties}>
              <blockquote>&ldquo;{t.text}&rdquo;</blockquote>
              <figcaption>
                <span className="clay-coin sm">{t.initials}</span>
                <span className="clay-tags"><b className="clay-pill">{t.name}</b><small className="clay-pill alt">{t.company}</small></span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </div>
  )
}
