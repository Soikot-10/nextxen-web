import type { Metadata, Viewport } from 'next'
import { Inter, Instrument_Serif, Montserrat } from 'next/font/google'
import './globals.css'
import './premium.css'
import './sections.css'
import './v5.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Assistant from '@/components/Assistant'
import SmoothScroll from '@/components/fx/SmoothScroll'
import Interactions from '@/components/fx/Interactions'
import ServicePanel from '@/components/ServicePanel'

const sans = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' })
const brand = Montserrat({ subsets: ['latin'], weight: ['500', '600'], variable: '--font-brand', display: 'swap' })
const serif = Instrument_Serif({
  subsets: ['latin'], weight: '400', style: ['normal', 'italic'],
  variable: '--font-serif', display: 'swap',
})

const SITE = 'https://nextxen.co.nz'
const DESC = 'NEXTXEN is an Auckland-based AI marketing studio. Websites, search, paid media, content and automation for New Zealand businesses that want measurable growth.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: 'NEXTXEN — AI-Powered Marketing for New Zealand Businesses',
    template: '%s | NEXTXEN',
  },
  description: DESC,
  keywords: ['AI marketing NZ', 'digital marketing Auckland', 'SEO New Zealand', 'Google Ads NZ', 'social media marketing NZ', 'website design Auckland'],
  openGraph: {
    title: 'NEXTXEN — AI-Powered Marketing for New Zealand Businesses',
    description: DESC,
    url: SITE,
    siteName: 'NEXTXEN',
    locale: 'en_NZ',
    type: 'website',
  },
  twitter: { card: 'summary_large_image' },
}

export const viewport: Viewport = { themeColor: '#040b0b', colorScheme: 'dark' }

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'NEXTXEN',
  url: SITE,
  email: 'hello@nextxen.co.nz',
  description: DESC,
  areaServed: { '@type': 'Country', name: 'New Zealand' },
  address: { '@type': 'PostalAddress', addressLocality: 'Auckland', addressCountry: 'NZ' },
  knowsAbout: ['Digital marketing', 'SEO', 'Google Ads', 'Meta Ads', 'Website design', 'AI chatbots', 'Marketing automation'],
}

// Marks the document as script-enabled before first paint, so reveal
// animations only hide content when JavaScript is there to show it again.
const jsFlag = `document.documentElement.classList.add('js')`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-NZ" data-scroll-behavior="smooth" className={`${sans.variable} ${serif.variable} ${brand.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: jsFlag }} />
      </head>
      <body suppressHydrationWarning>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <div className="space" aria-hidden="true"><i /><i /><i /></div>
        <Navbar />
        <main id="top">{children}</main>
        <Footer />
        <ServicePanel />
        <Assistant />
        <SmoothScroll />
        <Interactions />
      </body>
    </html>
  )
}
