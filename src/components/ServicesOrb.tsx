'use client'
import dynamic from 'next/dynamic'
import type { Keycap, KeycapPalette } from '@/components/ui/keycap-orb'
import { openService } from '@/components/three/sceneStore'

// Lazy so the WebGL2 bundle never blocks first paint; the orb pauses itself
// when offscreen. Height comes from --orb-h (560px desktop, 420px mobile).
const KeycapOrb = dynamic(() => import('@/components/ui/keycap-orb'), {
  ssr: false,
  loading: () => <div className="keycap-orb keycap-orb-skeleton" aria-hidden="true" />,
})

// NEXTXEN's real services on the caps; pressing one opens its details.
const SEO: Keycap = { label: 'SEO', finish: 'cobalt', hotkey: 's' }
const KEYS: Keycap[] = [
  { label: 'NX', finish: 'lime' },
  SEO,
  { icon: 'search', finish: 'ink' },
  { label: 'ADS', finish: 'ash', hotkey: 'a' },
  { label: 'AI', finish: 'lime', hotkey: 'i' },
  { icon: 'code', finish: 'ink', hotkey: 'w' },
  { label: 'WEB', finish: 'glass' },
  { icon: 'at', finish: 'cobalt', hotkey: 'o' },
  { icon: 'heart', finish: 'ash' },
  { icon: 'pen', finish: 'ink', hotkey: 'c' },
  { icon: 'bolt', finish: 'lime' },
  { icon: 'arrow', finish: 'glass', hotkey: 'g' },
  { label: '⌘', finish: 'ink' },
  { icon: 'star', finish: 'ash' },
  { icon: 'check', finish: 'cobalt' },
  { icon: 'cube', finish: 'glass' },
]
const SERVICE_OF = new Map<Keycap, string>([
  [KEYS[1], 'seo'], [KEYS[2], 'seo'], [KEYS[3], 'google'], [KEYS[4], 'chatbot'],
  [KEYS[5], 'website'], [KEYS[6], 'website'], [KEYS[7], 'social'], [KEYS[8], 'social'],
  [KEYS[9], 'content'], [KEYS[10], 'automation'], [KEYS[11], 'leads'],
])

const PALETTE: KeycapPalette = {
  ink: { cap: '#0e1f1d', legend: '#e6f4f1' },
  ash: { cap: '#d9c4a0', legend: '#2a1c10' },
  cobalt: { cap: '#1f6f68', legend: '#eafffb' },
  lime: { cap: '#c9a253', legend: '#1a1407' },
  glass: { cap: '#a8e3dc', legend: '#0b2220' },
}

export default function ServicesOrb() {
  return (
    <KeycapOrb
      keys={KEYS}
      palette={PALETTE}
      background="#040b0b"
      glow="#19c3b0"
      rings={10}
      scale={0.8}
      speed={0.6}
      reflection
      height="var(--orb-h)"
      className="keycap-orb"
      aria-label="NEXTXEN services as a ball of keycaps. Drag to spin it, press a service key to see what's included."
      onKeyPress={k => { const id = SERVICE_OF.get(k); if (id) openService(id) }}
    />
  )
}
