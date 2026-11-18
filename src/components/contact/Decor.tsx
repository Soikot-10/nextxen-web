import { useId, type CSSProperties } from 'react'

// Decorative, hand-built SVG for the contact page: glossy leaves, a fern
// frond, the silver fern, a small NZ map, line-art skyline and wave reliefs.
// All purely presentational (aria-hidden).

export function Leaf({ className = '', style, tone = 'deep' }: { className?: string; style?: CSSProperties; tone?: 'deep' | 'fresh' | 'ref' }) {
  const id = useId().replace(/:/g, '')
  const [a, b, c] = tone === 'deep' ? ['#2f7d4a', '#145233', '#0a3320'] : tone === 'ref' ? ['#c9e25a', '#6aa52c', '#2c6a1d'] : ['#5aa35c', '#22703f', '#0f4a2b']
  return (
    <svg className={`leaf ${className}`} style={style} viewBox="0 0 120 300" aria-hidden="true">
      <defs>
        <linearGradient id={`lf${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={a} /><stop offset=".55" stopColor={b} /><stop offset="1" stopColor={c} />
        </linearGradient>
        <linearGradient id={`ls${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity=".38" /><stop offset=".5" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M60 296C20 226 4 146 28 66 40 30 54 12 60 4c7 9 21 28 33 62 22 78 6 158-33 230z" fill={`url(#lf${id})`} />
      {tone === 'ref' && <path d="M60 296C20 226 4 146 28 66 40 30 54 12 60 4c7 9 21 28 33 62 22 78 6 158-33 230z" fill="none" stroke="#f0cf6a" strokeWidth="2.2" strokeOpacity=".85" />}
      <path d="M60 296C24 230 10 150 32 70 43 36 54 18 60 8c-2 60-4 180 0 288z" fill={`url(#ls${id})`} />
      <path d="M60 296C58 200 59 100 60 8" stroke="#d9efc9" strokeOpacity=".55" strokeWidth="2" fill="none" />
      {[60, 95, 130, 165, 200, 235].map((y, i) => (
        <g key={y} stroke="#cfe8bf" strokeOpacity=".28" strokeWidth="1.3" fill="none">
          <path d={`M60 ${y + 18}C${44 - i} ${y + 4} ${34 - i * 2} ${y - 6} ${28 - i} ${y - 16}`} />
          <path d={`M60 ${y + 18}C${76 + i} ${y + 4} ${86 + i * 2} ${y - 6} ${92 + i} ${y - 16}`} />
        </g>
      ))}
    </svg>
  )
}

/** A fern frond generated along a curve; `silver` renders the NZ silver fern. */
export function Fern({ className = '', silver = false, leaflets = 18 }: { className?: string; silver?: boolean; leaflets?: number }) {
  const id = useId().replace(/:/g, '')
  const pts: { x: number; y: number; a: number; s: number }[] = []
  for (let i = 0; i < leaflets; i++) {
    const t = i / (leaflets - 1)
    // quadratic curve from base (20,190) bending to tip (150,20)
    const x = (1 - t) ** 2 * 20 + 2 * (1 - t) * t * 40 + t * t * 150
    const y = (1 - t) ** 2 * 190 + 2 * (1 - t) * t * 50 + t * t * 20
    const dx = 2 * (1 - t) * (40 - 20) + 2 * t * (150 - 40), dy = 2 * (1 - t) * (50 - 190) + 2 * t * (20 - 50)
    pts.push({ x, y, a: Math.atan2(dy, dx) * 180 / Math.PI, s: 1 - t * 0.78 })
  }
  const fill = silver ? `url(#fs${id})` : `url(#fg${id})`
  return (
    <svg className={`fern ${className}`} viewBox="0 0 170 200" aria-hidden="true">
      <defs>
        <linearGradient id={`fg${id}`} x1="0" y1="1" x2="1" y2="0"><stop offset="0" stopColor="#1e5e37" /><stop offset="1" stopColor="#5fae63" /></linearGradient>
        <linearGradient id={`fs${id}`} x1="0" y1="1" x2="1" y2="0"><stop offset="0" stopColor="#c9d3cf" /><stop offset=".6" stopColor="#ffffff" /><stop offset="1" stopColor="#e6ece9" /></linearGradient>
      </defs>
      <path d="M20 190Q40 50 150 20" stroke={fill} strokeWidth="3" fill="none" strokeLinecap="round" />
      {pts.map((p, i) => (
        <g key={i} transform={`translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) rotate(${p.a.toFixed(1)})`}>
          <ellipse cx="0" cy={(-15 * p.s).toFixed(1)} rx={(4.2 * p.s).toFixed(1)} ry={(16 * p.s).toFixed(1)} transform={`rotate(-${(28 + i).toFixed(0)})`} fill={fill} />
          <ellipse cx="0" cy={(15 * p.s).toFixed(1)} rx={(4.2 * p.s).toFixed(1)} ry={(16 * p.s).toFixed(1)} transform={`rotate(${(28 + i).toFixed(0)})`} fill={fill} />
        </g>
      ))}
    </svg>
  )
}

export function NzMap({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 140" aria-hidden="true">
      <defs><linearGradient id="nzg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f6e2ae" /><stop offset="1" stopColor="#b8862e" /></linearGradient></defs>
      <polygon fill="url(#nzg)" points="30,2 34,6 38,14 44,20 48,24 52,28 58,30 66,30 74,28 82,26 84,30 78,36 74,42 72,50 66,58 60,64 56,66 52,60 48,56 40,54 34,50 38,46 44,44 46,38 42,32 36,24 32,14 28,6" strokeLinejoin="round" />
      <polygon fill="url(#nzg)" points="52,70 58,68 64,72 60,80 56,88 50,96 44,104 38,112 30,120 22,126 14,128 10,122 16,114 22,106 28,98 34,90 40,82 46,74" />
      <ellipse cx="16" cy="134" rx="4" ry="2.6" fill="url(#nzg)" />
      <circle cx="50" cy="30" r="2.8" fill="#fff6dc" />
    </svg>
  )
}

export function Monogram() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <defs><linearGradient id="mgg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fbecc0" /><stop offset=".5" stopColor="#e2b85c" /><stop offset="1" stopColor="#a8761f" /></linearGradient></defs>
      <path d="M17 46V18h6l18 19V18h6v28h-6L23 27v19z" fill="url(#mgg)" />
    </svg>
  )
}

