import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact — Book a Free Strategy Call',
  description: 'Talk to NEXTXEN, an Auckland-based AI marketing studio. Book a free 30-minute strategy session for your New Zealand business.',
  alternates: { canonical: '/contact' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
