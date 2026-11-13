export const faqs = [
  { q: 'How quickly will I see results?', a: 'Google Ads and Facebook Ads typically generate enquiries within 24–48 hours of launch. SEO results build over 3–6 months. AI automation is live within 7–14 days of setup.' },
  { q: 'Do you lock clients into long-term contracts?', a: 'No lock-in contracts. We work month-to-month because we believe our results should do the talking. Most clients stay long-term because they see consistent ROI.' },
  { q: 'How much does it cost?', a: 'Our plans start at $399/month for the Starter package. We have options for every budget and business size — book a free consultation to get a tailored quote.' },
  { q: 'Do you work with small businesses?', a: 'Absolutely. We work with businesses of all sizes across NZ, from sole traders to multi-location enterprises. Our Starter and Growth plans are designed specifically for small businesses.' },
  { q: 'What makes NEXTXEN different from other agencies?', a: 'Three things: an AI-first approach, true NZ expertise, and complete transparency — you see exactly where every dollar goes and what results it produces.' },
  { q: 'Do you provide reports?', a: 'Yes — monthly reports covering all key metrics including leads generated, cost per lead, ROI, SEO rankings, and social media performance. No jargon, just clear results.' },
]

export default function FaqSection() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  }
  return (
    <div className="fwrap">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {faqs.map((f, i) => (
        <details className="fi" key={f.q} name="faq" open={i === 0}>
          <summary className="fq">
            {f.q}
            <span className="fic" aria-hidden="true">+</span>
          </summary>
          <div className="fa"><div className="fain">{f.a}</div></div>
        </details>
      ))}
    </div>
  )
}
