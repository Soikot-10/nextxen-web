import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Industries We Serve',
  description: 'Marketing strategies tailored to New Zealand real estate, healthcare, hospitality, trades, e-commerce, professional services and more.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
