import type { Metadata } from 'next'
import { Playfair_Display } from 'next/font/google'

// Design preview of the next homepage. Kept out of search results until it replaces /.
export const metadata: Metadata = {
  title: 'Home (preview)',
  robots: { index: false, follow: false },
}

const display = Playfair_Display({ subsets: ['latin'], weight: ['400', '500', '600', '700'], style: ['normal', 'italic'], variable: '--font-hx', display: 'swap' })

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className={display.variable}>{children}</div>
}
