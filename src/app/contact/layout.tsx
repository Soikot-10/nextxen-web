import type { Metadata } from 'next'
import { DM_Serif_Display } from 'next/font/google'

export const metadata: Metadata = {
  title: 'Contact — Book a Free Strategy Call',
  description: 'Talk to NEXTXEN, an Auckland-based AI marketing studio. Book a free 30-minute strategy session for your New Zealand business.',
  alternates: { canonical: '/contact' },
}

// the display serif used in the contact page design
const display = DM_Serif_Display({ subsets: ['latin'], weight: '400', style: ['normal', 'italic'], variable: '--font-display', display: 'swap' })

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className={display.variable}>{children}</div>
}
