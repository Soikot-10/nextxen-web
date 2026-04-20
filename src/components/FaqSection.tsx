'use client'
import ScrollReveal from '@/components/ScrollReveal'

const faqs = [
  { q: 'How quickly will I see results?', a: 'Google Ads and Facebook Ads typically generate enquiries within 24–48 hours of launch. SEO results build over 3–6 months. AI automation is live within 7–14 days of setup.' },
  { q: 'Do you lock clients into long-term contracts?', a: 'No lock-in contracts. We work month-to-month because we believe our results should do the talking. Most clients stay long-term because they see consistent ROI.' },
  { q: 'How much does it cost?', a: 'Our plans start at $239/month for the Starter package. We have options for every budget and business size — book a free consultation to get a tailored quote.' },
  { q: 'Do you work with small businesses?', a: 'Absolutely. We work with businesses of all sizes across NZ, from sole traders to multi-location enterprises. Our Starter and Growth plans are designed specifically for small businesses.' },
  { q: 'What makes NEXTXEN different from other agencies?', a: 'Three things: AI-first approach, true NZ expertise, and complete transparency — you see exactly where every dollar goes and what results it produces.' },
  { q: 'Do you provide reports?', a: 'Yes — monthly reports covering all key metrics including leads generated, cost per lead, ROI, SEO rankings, and social media performance. No jargon, just clear results.' },
]

export default function FaqSection() {
  function handleToggle(e: React.MouseEvent<HTMLElement>) {
    const el = e.currentTarget as HTMLDetailsElement
    document.querySelectorAll('details.fi').forEach(d => { if (d !== el) d.removeAttribute('open') })
    el.classList.toggle('open', el.open)
  }

  return (
    <div className="fwrap">
      {faqs.map((f, i) => (
        <ScrollReveal key={f.q} delay={i * 60}>
          <details className="fi" onClick={handleToggle}>
            <summary className="fq">
              {f.q}
              <span className="fic">+</span>
            </summary>
            <div className="fa"><div className="fain">{f.a}</div></div>
          </details>
        </ScrollReveal>
      ))}
    </div>
  )
}
