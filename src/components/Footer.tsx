import Link from 'next/link'

export default function Footer() {
  return (
    <footer>
      <div className="cnt">
        <div className="fgrid">
          <div>
            <Link href="/" className="logo" style={{ fontSize: '1.4rem' }}>NEXTXEN</Link>
            <p className="fdesc">New Zealand&apos;s leading AI-powered marketing agency. We help businesses dominate online with precision digital marketing and AI automation.</p>
            <div className="socrow">
              {['fb','ig','yt','li'].map(s => (
                <a key={s} href="#" className="sb" style={{ fontSize: '.7rem', fontWeight: 700, textTransform: 'uppercase' }}>{s}</a>
              ))}
            </div>
          </div>

          <div>
            <h4>Company</h4>
            <ul className="flinks">
              {[['/#about','About Us'],['/#pricing','Pricing'],['/#testimonials','Testimonials'],['/#faq','FAQ']].map(([href,label]) => (
                <li key={href}><Link href={href}>{label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4>Industries</h4>
            <ul className="flinks">
              {[['real-estate','Real Estate'],['healthcare','Healthcare'],['ecommerce','E-commerce'],['construction','Construction'],['hospitality','Hospitality'],['technology','Technology']].map(([slug,label]) => (
                <li key={slug}><Link href={`/industries/${slug}`}>{label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4>Contact</h4>
            <ul className="flinks">
              <li><a href="mailto:hello@nextxen.co.nz">hello@nextxen.co.nz</a></li>
              <li style={{ color: 'var(--tx2)', fontSize: '.8rem' }}>+64 (0) 00 000 0000</li>
              <li style={{ color: 'var(--tx2)', fontSize: '.8rem' }}>Auckland, New Zealand</li>
            </ul>
            <div style={{ marginTop: '1.3rem', background: 'rgba(108,92,231,.08)', border: '1px solid rgba(108,92,231,.18)', borderRadius: '8px', padding: '.9rem' }}>
              <div style={{ fontSize: '.64rem', fontWeight: 700, color: 'var(--ac2)', letterSpacing: '.08em', marginBottom: '.35rem' }}>🇳🇿 NZ BASED</div>
              <div style={{ color: 'var(--tx2)', fontSize: '.74rem' }}>Serving businesses across all of New Zealand</div>
            </div>
          </div>
        </div>

        <div className="fbot">
          <p>© 2025 NEXTXEN Limited. All rights reserved. Auckland, New Zealand.</p>
          <div className="fbls">
            {['Privacy Policy','Terms of Service','Cookie Policy'].map(l => (
              <a key={l} href="#">{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
