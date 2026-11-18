import type { IconName } from '@/components/Icon'
import { services } from '@/data/services'
import { industries } from '@/data/industries'

// Single source for the v5 glass-dashboard visuals. Every number shown in the
// UI is derived from the site's own data files; nothing here is invented.

export const GOLD = '#e9c77b'

export type Cat = { key: string; name: string; color: string }
export const CATS: Cat[] = [
  { key: 'build', name: 'Build', color: '#86f2cf' },
  { key: 'advertise', name: 'Advertise', color: '#ff9fcb' },
  { key: 'grow', name: 'Grow', color: '#b8a1ff' },
  { key: 'automate', name: 'Automate', color: '#7fdcff' },
]

export const CORE: { id: string; short: string; icon: IconName; cat: string }[] = [
  { id: 'website', short: 'Websites', icon: 'globe', cat: 'build' },
  { id: 'seo', short: 'SEO', icon: 'search', cat: 'build' },
  { id: 'google', short: 'Google Ads', icon: 'target', cat: 'advertise' },
  { id: 'facebook', short: 'Meta Ads', icon: 'megaphone', cat: 'advertise' },
  { id: 'social', short: 'Social', icon: 'trend', cat: 'grow' },
  { id: 'content', short: 'Content', icon: 'camera', cat: 'grow' },
  { id: 'chatbot', short: 'AI Chatbots', icon: 'bot', cat: 'automate' },
  { id: 'automation', short: 'AI Automation', icon: 'zap', cat: 'automate' },
]

export const coreServices = CORE.map(c => {
  const svc = services.find(s => s.id === c.id)!
  const cat = CATS.find(k => k.key === c.cat)!
  return { ...c, svc, color: cat.color, catName: cat.name }
})

export const PLANS = [
  { name: 'Starter', price: '$399' },
  { name: 'Growth', price: '$699' },
  { name: 'Premium', price: '$1,249' },
  { name: 'Ultimate', price: '$1,999' },
  { name: 'Enterprise', price: 'Custom' },
]

export const STEPS = [
  { title: 'Discovery call', when: 'Day 1' },
  { title: 'Strategy & proposal', when: 'Within 48 hours' },
  { title: 'Build & launch', when: '5–7 days' },
  { title: 'Optimise & report', when: 'Every month' },
]

export const COUNTS = {
  services: services.length,
  core: CORE.length,
  industries: industries.length,
  plans: PLANS.length,
}

export const industryNames = industries.map(i => i.name)
export const serviceNames = services.map(s => s.title.split(' —')[0])
