import type { IconName } from '@/components/Icon'

// Shared, mutable state between the DOM and the 3D scene. Kept outside React
// so scroll and pointer updates never trigger re-renders.

export const ORBIT: { id: string; label: string; icon: IconName; color: string }[] = [
  { id: 'website', label: 'Websites', icon: 'globe', color: '#d4ff3a' },
  { id: 'seo', label: 'SEO', icon: 'search', color: '#7cf7ff' },
  { id: 'google', label: 'Google Ads', icon: 'target', color: '#ffcf6e' },
  { id: 'facebook', label: 'Meta Ads', icon: 'megaphone', color: '#8fa2ff' },
  { id: 'social', label: 'Social', icon: 'trend', color: '#ff8fcf' },
  { id: 'content', label: 'Content', icon: 'camera', color: '#7ff5c9' },
  { id: 'chatbot', label: 'AI Chatbots', icon: 'bot', color: '#b794ff' },
  { id: 'automation', label: 'AI Automation', icon: 'zap', color: '#5fd8c8' },
]

/** Related services joined by a secondary trail (indexes into ORBIT). */
export const CROSS: [number, number][] = [[1, 5], [2, 0], [6, 7]]

export const scene = {
  /** service index highlighted by the pinned services section, -1 for none */
  active: -1,
  /** service index under the pointer, -1 for none */
  hovered: -1,
}

/** Ask the global service panel to open a service by id. */
export function openService(id: string) {
  window.dispatchEvent(new CustomEvent('nx:service', { detail: id }))
}
