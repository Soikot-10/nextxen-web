import { useId, type CSSProperties } from 'react'

// NEXTXEN brand system (Neon Brand System Board, concept 10): a hexagon badge with a
// silver "N" inside a teal-to-gold glowing rim, plus the wide-spaced wordmark.
// Palette: Deep Emerald #0A3B37 · Gold #F6C46A · Charcoal #0B1413 · Cream #F9F6EC · Glow Teal #00E5C8.

export const HEX = 'M32 3.2 57.2 17.6v28.8L32 60.8 6.8 46.4V17.6Z'
export const N_PATH = 'M21.6 43.2V20.8h4.6l12 15.4V20.8h4.2v22.4h-4.4L25.8 27.6v15.6z'

export function BrandMark({ size = 36, tone = 'dark', glow = true, className = '', style }: {
  size?: number; tone?: 'dark' | 'light' | 'mono-white' | 'mono-black'; glow?: boolean; className?: string; style?: CSSProperties
}) {
  const id = useId().replace(/:/g, '')
  const mono = tone === 'mono-white' || tone === 'mono-black'
  const ink = tone === 'mono-black' ? '#0B1413' : '#F9F6EC'
  return (
    <svg className={`brand-mark ${className}`} style={style} width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`r${id}`} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#00E5C8" /><stop offset=".45" stopColor="#3fd9b4" /><stop offset=".72" stopColor="#F6C46A" /><stop offset="1" stopColor="#fff1c8" />
        </linearGradient>
        <radialGradient id={`f${id}`} cx=".35" cy=".25" r=".9">
          <stop offset="0" stopColor={tone === 'light' ? '#0f4a44' : '#123a35'} /><stop offset=".55" stopColor="#0A3B37" /><stop offset="1" stopColor="#0B1413" />
        </radialGradient>
        <linearGradient id={`n${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" /><stop offset=".5" stopColor="#e6ece9" /><stop offset="1" stopColor="#aebcb7" />
        </linearGradient>
        <filter id={`g${id}`} x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2.2" /></filter>
      </defs>
      {mono ? (
        <>
          <path d={HEX} fill="none" stroke={ink} strokeWidth="4" strokeLinejoin="round" />
          <path d={N_PATH} fill={ink} />
        </>
      ) : (
        <>
          {glow && <path d={HEX} fill="none" stroke={`url(#r${id})`} strokeWidth="5" strokeLinejoin="round" opacity=".55" filter={`url(#g${id})`} />}
          <path d={HEX} fill={`url(#f${id})`} />
          <path d={HEX} fill="none" stroke={`url(#r${id})`} strokeWidth="3.6" strokeLinejoin="round" />
          <path d="M32 7.6 53 19.6v6C42 18 22 18 11 25.6v-6Z" fill="#fff" opacity=".07" />
          <path d={N_PATH} fill={`url(#n${id})`} />
        </>
      )}
    </svg>
  )
}

/** Icon + wordmark. `stacked` puts the wordmark under the badge. */
export default function BrandLogo({ size = 34, tone = 'dark', stacked = false, wordmark = true, className = '' }: {
  size?: number; tone?: 'dark' | 'light' | 'mono-white' | 'mono-black'; stacked?: boolean; wordmark?: boolean; className?: string
}) {
  const ink = tone === 'light' || tone === 'mono-black' ? '#0B1413' : '#F9F6EC'
  return (
    <span className={`brand-logo${stacked ? ' stacked' : ''} ${className}`} style={{ '--brand-ink': ink, '--brand-size': `${size}px` } as CSSProperties}>
      <BrandMark size={size} tone={tone} />
      {wordmark && <span className="brand-word">NEXTXEN</span>}
    </span>
  )
}
