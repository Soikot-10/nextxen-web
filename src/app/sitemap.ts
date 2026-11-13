import type { MetadataRoute } from 'next'
import { industries } from '@/data/industries'
import { blogPosts } from '@/data/blogs'

const SITE = 'https://nextxen.co.nz'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return [
    { url: SITE, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE}/contact`, lastModified: now, changeFrequency: 'yearly', priority: 0.8 },
    { url: `${SITE}/industries`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    ...industries.map(i => ({ url: `${SITE}/industries/${i.slug}`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.7 })),
    ...blogPosts.map(p => {
      const d = new Date(p.publishDate)
      return { url: `${SITE}/blog/${p.slug}`, lastModified: isNaN(d.getTime()) ? now : d, changeFrequency: 'yearly' as const, priority: 0.5 }
    }),
  ]
}
