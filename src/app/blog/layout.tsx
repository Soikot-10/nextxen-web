import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Journal — Marketing Insights for NZ Businesses',
  description: 'Practical guides on AI, SEO, Google Ads and social media marketing for New Zealand business owners.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
