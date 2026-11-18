'use client'
import { useId, useSyncExternalStore, type CSSProperties, type ElementType, type ReactNode } from 'react'

// Visual kit for the emerald "contact v2" preview: organic blob panels whose
// gold rim, bevel, gloss and drop shadow all follow the wavy outline, glossy
// ribbon waves, gold line art and the service chip icons. Presentational only.

/** Organic outlines in a 0–100 box (stretched to the panel with preserveAspectRatio="none"). */
export const SHAPES = {
  // traced from the reference layout (each box is stretched to its panel)
  form: 'M10 6C18 1 40 1 62 1C80 1 94 1 97 8C100 16 99 30 99 44C99 60 97 70 98 82C99 94 92 99 80 99C64 99 50 97 34 98C18 99 4 99 2 88C0 76 2 62 1 46C0 30 0 14 10 6Z',
  card: 'M12 8C30 2 70 4 90 4C98 5 100 14 99 30C98 50 100 68 96 84C92 94 82 92 70 90C54 88 40 96 24 98C8 100 1 88 1 70C1 50 2 34 4 22C5 14 7 10 12 8Z',
  tall: 'M8 12C20 4 36 8 50 6C66 4 84 2 94 8C100 14 99 34 98 52C97 72 100 88 92 94C82 100 60 96 42 97C24 98 6 100 3 86C0 72 4 56 2 40C1 26 2 16 8 12Z',
  steps: 'M6 22C10 8 26 2 44 3C62 4 82 2 93 8C100 14 99 30 97 46C95 62 99 78 94 88C88 98 72 96 56 97C38 98 18 100 8 92C2 86 1 70 2 54C3 40 3 30 6 22Z',
  window: 'M3 20C6 8 10 5 13 4.5C20 2 24 1 29 1C36 1 40 7 45 8C51 9 56 10 61 9.8C67 9 72 5 77 4.5C84 4 90 2 94 4C99 7 100 16 100 27C100 40 100 52 99 62C97 76 86 86 74 90C66 92 60 94 53 94C44 95 36 99 29 99C20 99 14 98 11 97C6 93 4 88 3 83C1 76 0 66 0 56C0 44 1 30 3 20Z',
  frame: 'M50 3C72 2 92 6 96 26C99 42 94 50 97 66C100 84 84 97 62 96C46 95 36 99 20 95C6 92 2 80 3 62C4 48 0 36 4 22C8 8 30 4 50 3Z',
  pill: 'M20 10C40 0 80 4 94 14C100 22 98 50 90 70C80 92 50 100 26 96C8 92 0 76 2 56C4 36 6 18 20 10Z',
} as const
export type Shape = keyof typeof SHAPES
type Mat = 'cream' | 'glass'

const subscribe = (cb: () => void) => { const m = matchMedia('(prefers-reduced-motion: reduce)'); m.addEventListener('change', cb); return () => m.removeEventListener('change', cb) }
export const useReducedMotion = () => useSyncExternalStore(subscribe, () => matchMedia('(prefers-reduced-motion: reduce)').matches, () => true)

function GoldStops() {
  return (
    <>
      <stop offset="0" stopColor="#7d5a14" /><stop offset=".18" stopColor="#d9ae55" /><stop offset=".3" stopColor="#fff6d8" />
      <stop offset=".42" stopColor="#c99a3e" /><stop offset=".62" stopColor="#8a6418" /><stop offset=".8" stopColor="#f3dc9a" /><stop offset="1" stopColor="#a8761f" />
    </>
  )
}

export function Blob({ as: Tag = 'div', shape = 'card', mat = 'cream', rim = 4.5, className = '', style, children, glow = mat === 'glass' }: {
  as?: ElementType; shape?: Shape; mat?: Mat; rim?: number; className?: string; style?: CSSProperties; children?: ReactNode; glow?: boolean
}) {
  const id = useId().replace(/:/g, '')
  const reduce = useReducedMotion()
  const d = SHAPES[shape]
  return (
    <Tag className={`bl bl-${mat} ${className}`} style={style}>
      {glow && (
        <svg className="bl-glow" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <path d={d} fill="none" stroke="#e9c77b" strokeWidth="10" vectorEffect="non-scaling-stroke" />
        </svg>
      )}
      <svg className="bl-svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          {mat === 'cream' ? (
            <linearGradient id={`f${id}`} x1="0" y1="0" x2=".6" y2="1"><stop offset="0" stopColor="#fbf4e8" /><stop offset=".55" stopColor="#f1e6d4" /><stop offset="1" stopColor="#e5d5bb" /></linearGradient>
          ) : (
            <linearGradient id={`f${id}`} x1="0" y1="0" x2=".4" y2="1"><stop offset="0" stopColor="#1d2622" /><stop offset=".45" stopColor="#0c110f" /><stop offset="1" stopColor="#050807" /></linearGradient>
          )}
          <linearGradient id={`b${id}`} x1="0" y1="0" x2="1" y2="1">
            {mat === 'cream'
              ? <><stop offset="0" stopColor="#fff" stopOpacity=".95" /><stop offset=".45" stopColor="#fff" stopOpacity="0" /><stop offset=".7" stopColor="#7a5a2a" stopOpacity="0" /><stop offset="1" stopColor="#7a5a2a" stopOpacity=".32" /></>
              : <><stop offset="0" stopColor="#fff" stopOpacity=".35" /><stop offset=".4" stopColor="#fff" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity=".5" /></>}
          </linearGradient>
          <linearGradient id={`g${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity={mat === 'cream' ? .55 : .16} /><stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={`r${id}`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="60" y2="60" spreadMethod="reflect">
            <GoldStops />
            {!reduce && <animateTransform attributeName="gradientTransform" type="translate" values="-60 -60;60 60;-60 -60" dur="11s" repeatCount="indefinite" />}
          </linearGradient>
          <clipPath id={`c${id}`}><path d={d} /></clipPath>
        </defs>
        <path d={d} fill={`url(#f${id})`} />
        <g clipPath={`url(#c${id})`}>
          <ellipse cx="38" cy="-6" rx="70" ry="30" fill={`url(#g${id})`} />
          <path d={d} fill="none" stroke={`url(#b${id})`} strokeWidth="22" vectorEffect="non-scaling-stroke" />
        </g>
        <path d={d} fill="none" stroke={`url(#r${id})`} strokeWidth={rim} vectorEffect="non-scaling-stroke" />
        <path d={d} fill="none" stroke="#fff8e0" strokeOpacity=".55" strokeWidth=".8" vectorEffect="non-scaling-stroke" transform="translate(.15 .25)" />
      </svg>
      <div className="bl-in">{children}</div>
    </Tag>
  )
}

/** objectBoundingBox clip path matching a blob outline, referenced as clip-path: url(#id). */
export function BlobClip({ id, shape }: { id: string; shape: Shape }) {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <clipPath id={id} clipPathUnits="objectBoundingBox"><path transform="scale(.01)" d={SHAPES[shape]} /></clipPath>
    </svg>
  )
}

/** Thick porcelain rim with gold lines inside and out, drawn along a blob outline. */
export function PorcelainRim({ shape, className = '' }: { shape: Shape; className?: string }) {
  const id = useId().replace(/:/g, '')
  const reduce = useReducedMotion()
  const d = SHAPES[shape]
  return (
    <svg className={className} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id={`pg${id}`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="60" y2="60" spreadMethod="reflect">
          <GoldStops />
          {!reduce && <animateTransform attributeName="gradientTransform" type="translate" values="-60 -60;60 60;-60 -60" dur="9s" repeatCount="indefinite" />}
        </linearGradient>
        <linearGradient id={`pc${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fffaf0" /><stop offset=".5" stopColor="#f1e4cc" /><stop offset="1" stopColor="#d9c3a0" /></linearGradient>
      </defs>
      <path d={d} fill="none" stroke="#2a1d05" strokeOpacity=".55" strokeWidth="40" vectorEffect="non-scaling-stroke" />
      <path d={d} fill="none" stroke={`url(#pg${id})`} strokeWidth="36" vectorEffect="non-scaling-stroke" />
      <path d={d} fill="none" stroke={`url(#pc${id})`} strokeWidth="28" vectorEffect="non-scaling-stroke" />
      <path d={d} fill="none" stroke="#fff" strokeOpacity=".75" strokeWidth="2" vectorEffect="non-scaling-stroke" transform="translate(-.25 -.6)" />
    </svg>
  )
}

/** Glowing gold line-art Auckland skyline with the Sky Tower and Rangitoto. */
export function SkylineGold({ className = '' }: { className?: string }) {
  const b = [[18, 26], [32, 40], [46, 22], [58, 52], [72, 34], [86, 60], [100, 44], [140, 56], [154, 36], [168, 70], [182, 46], [196, 30], [208, 52]]
  return (
    <svg className={className} viewBox="0 0 300 160" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" aria-hidden="true">
      <path d="M222 128c14-10 26-24 40-26s26 14 38 26" opacity=".85" />
      {b.map(([x, h], i) => <rect key={i} x={x} y={128 - h} width="11" height={h} rx="1" />)}
      {b.map(([x, h], i) => h > 34 ? <path key={`w${i}`} d={`M${x + 3} ${134 - h}v${h - 14}M${x + 8} ${134 - h}v${h - 14}`} strokeWidth=".6" opacity=".5" /> : null)}
      <path d="M121 128V44M117 128l4-84 4 84M112 44h18l-2 8h-14zM115 36h12l-1 8h-10zM121 36V6" />
      <circle cx="121" cy="5" r="1.6" fill="currentColor" />
      <path d="M0 136c24-6 48 6 72 0s48-6 72 0 48 6 72 0 48-6 84 0" opacity=".7" />
      <path d="M10 146c22-5 44 5 66 0s44-5 66 0 44 5 66 0 44-5 70 0" opacity=".45" />
    </svg>
  )
}

export function MountainArt({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 50" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 46L26 16l10 12 14-22 20 28 8-8 18 20" />
      <path d="M44 12l6-6 5 7M22 22l4-6 4 5" opacity=".7" />
      <path d="M0 48h120" opacity=".5" />
    </svg>
  )
}

/* ── service chip icons (generic marks; brand-coloured where the service is a platform) ── */
const I = ({ children }: { children: ReactNode }) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>
)
export const CHIP_ICONS: Record<string, ReactNode> = {
  'Website Design': <I><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M9 20h6M12 16v4" /></I>,
  SEO: <I><circle cx="11" cy="11" r="6" /><path d="m20 20-4.5-4.5" /></I>,
  'Facebook Ads': <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="#1877F2" /><path d="M13.3 19v-6h2l.3-2.4h-2.3V9.1c0-.7.2-1.1 1.2-1.1h1.2V5.9c-.2 0-1-.1-1.8-.1-1.8 0-3 1.1-3 3.1v1.7h-2V13h2v6z" fill="#fff" /></svg>,
  'Google Ads': <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M9.2 3.6a3 3 0 0 1 4.1 1.1l6.3 10.9a3 3 0 1 1-5.2 3L8.1 7.7a3 3 0 0 1 1.1-4.1z" fill="#4285F4" /><path d="M8.1 7.7 3.4 15.8a3 3 0 1 0 5.2 3l4.7-8.1z" fill="#FBBC04" /><circle cx="6" cy="17.3" r="3" fill="#34A853" /></svg>,
  'Social Media Management': <I><circle cx="18" cy="5" r="2.5" /><circle cx="6" cy="12" r="2.5" /><circle cx="18" cy="19" r="2.5" /><path d="m8.2 10.8 7.6-4.4M8.2 13.2l7.6 4.4" /></I>,
  'AI Chatbot': <I><rect x="4" y="8" width="16" height="11" rx="3" /><path d="M12 4v4M9 13h.01M15 13h.01M2 13v2M22 13v2" /></I>,
  'AI Automation': <I><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M4.9 4.9 7 7M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1 7 17M17 7l2.1-2.1" /></I>,
  'Content Creation': <I><rect x="3" y="5" width="18" height="14" rx="3" /><path d="m10 9 5 3-5 3z" fill="currentColor" /></I>,
  'Brand Identity': <I><path d="M6 3h12l3 6-9 12L3 9z" /><path d="M3 9h18M9 3l3 18 3-18" /></I>,
  'Lead Generation': <I><path d="M5 20V12M10 20V8M15 20v-6M20 20V4" /></I>,
  'Full-Service Package': <I><path d="m12 3 9 5-9 5-9-5z" /><path d="m3 13 9 5 9-5" /><path d="m3 17 9 5 9-5" opacity=".6" /></I>,
  Other: <I><circle cx="6" cy="12" r="1.3" fill="currentColor" /><circle cx="12" cy="12" r="1.3" fill="currentColor" /><circle cx="18" cy="12" r="1.3" fill="currentColor" /></I>,
}
