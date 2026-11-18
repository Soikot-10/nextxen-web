import type { Metadata } from 'next'
import { DM_Serif_Display } from 'next/font/google'

export const metadata: Metadata = {
  title: 'Journal — Marketing Insights for NZ Businesses',
  description: 'Practical guides on AI, SEO, Google Ads and social media marketing for New Zealand business owners.',
  alternates: { canonical: '/blog' },
  openGraph: { title: 'Journal — Marketing Insights for NZ Businesses', description: 'Practical guides on AI, SEO, Google Ads and social media marketing for New Zealand business owners.', url: '/blog' },
}

// the display serif used in the Journal design
const display = DM_Serif_Display({ subsets: ['latin'], weight: '400', style: ['normal', 'italic'], variable: '--font-display', display: 'swap' })

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className={display.variable}>{children}</div>
}
