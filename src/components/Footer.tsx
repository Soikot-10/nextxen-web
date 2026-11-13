import Link from 'next/link'
import Icon from '@/components/Icon'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer>
      <div className="cnt">
        <div className="fgrid">
          <div>
            <Link href="/" className="logo"><i />NEXTXEN</Link>
            <p className="fdesc">An Auckland-based marketing studio combining senior strategy, sharp creative and AI automation to grow New Zealand businesses.</p>
            <Link href="/contact" className="tlink">Start a project <Icon name="arrowUpRight" size={15} /></Link>
          </div>

          <div>
            <h4>Studio</h4>
            <ul className="flinks">
              {[['/#services', 'Services'], ['/#work', 'Results'], ['/#pricing', 'Pricing'], ['/#faq', 'FAQ'], ['/blog', 'Journal']].map(([href, label]) => (
                <li key={href}><Link href={href}>{label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4>Industries</h4>
            <ul className="flinks">
              {[['real-estate', 'Real Estate'], ['healthcare', 'Healthcare'], ['ecommerce', 'E-commerce'], ['construction', 'Construction'], ['hospitality', 'Hospitality'], ['technology', 'Technology']].map(([slug, label]) => (
                <li key={slug}><Link href={`/industries/${slug}`}>{label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4>Contact</h4>
            <ul className="flinks">
              <li><a href="mailto:hello@nextxen.co.nz">hello@nextxen.co.nz</a></li>
              <li>Auckland, New Zealand</li>
              <li>Mon–Fri, 9am–6pm NZT</li>
            </ul>
          </div>
        </div>

        <div className="fbot">
          <p>© {year} NEXTXEN Limited. Made in Aotearoa New Zealand.</p>
          <div className="fbls">
            <a href="#top">Back to top ↑</a>
          </div>
        </div>
      </div>
      <div className="fmark" aria-hidden="true">Nextxen</div>
    </footer>
  )
}
