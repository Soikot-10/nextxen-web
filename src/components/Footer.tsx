import Link from 'next/link'
import { Logo } from '@/components/Navbar'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="foot">
      <div className="wrap">
        <div className="fgrid">
          <div className="fbrand">
            <Link href="/" className="logo"><Logo /><span>NEXTXEN</span></Link>
            <p>An Auckland-based marketing studio combining senior strategy, sharp creative and AI automation to grow New Zealand businesses.</p>
          </div>
          <div>
            <h4>Studio</h4>
            <ul>
              {[['/#services', 'Services'], ['/#work', 'Results'], ['/#pricing', 'Pricing'], ['/#faq', 'FAQ'], ['/blog', 'Journal'], ['/contact', 'Contact']].map(([href, label]) => (
                <li key={href}><Link href={href}>{label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Industries</h4>
            <ul>
              {[['real-estate', 'Real Estate'], ['healthcare', 'Healthcare'], ['ecommerce', 'E-commerce'], ['construction', 'Construction'], ['hospitality', 'Hospitality'], ['technology', 'Technology']].map(([slug, label]) => (
                <li key={slug}><Link href={`/industries/${slug}`}>{label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Contact</h4>
            <ul>
              <li><a href="mailto:hello@nextxen.co.nz">hello@nextxen.co.nz</a></li>
              <li>Auckland, New Zealand</li>
              <li>Mon–Fri, 9am–6pm NZT</li>
            </ul>
          </div>
        </div>

        <div className="fbot">
          <p>© {year} NEXTXEN Limited. Made in Aotearoa New Zealand.</p>
          <a href="#top" className="link-u">Back to top</a>
        </div>
      </div>
    </footer>
  )
}
