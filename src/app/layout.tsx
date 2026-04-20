import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'NEXTXEN — AI-Powered Marketing for New Zealand Businesses',
  description: 'New Zealand\'s leading AI marketing agency. We help NZ businesses dominate online with precision digital marketing, AI automation, and world-class content.',
  keywords: 'AI marketing NZ, digital marketing Auckland, SEO New Zealand, Google Ads NZ, social media marketing',
  openGraph: {
    title: 'NEXTXEN — AI-Powered Marketing for New Zealand Businesses',
    description: 'New Zealand\'s leading AI marketing agency. Precision digital marketing and AI automation for NZ businesses.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col" suppressHydrationWarning>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
