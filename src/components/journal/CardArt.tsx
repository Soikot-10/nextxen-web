import { useId, type ReactNode } from 'react'

// Card illustrations for the Journal. Three categories use artwork cut from the
// owner's reference; the rest are drawn here in the same look (a glossy object
// on a cream marble pedestal with tropical leaves), so any future post gets art
// automatically from its category, with a tasteful default for unknown ones.

export const ART_IMAGE: Record<string, string> = {
  'Google Ads': '/journal/art-google-ads',
  'Local SEO': '/journal/art-local-seo',
  'Social Media': '/journal/art-social-media',
  'AI Tools': '/journal/art-ai-tools-wide',
}

function Scene({ children, id }: { children: ReactNode; id: string }) {
  return (
    <svg viewBox="0 0 320 160" className="jx-art-svg" aria-hidden="true">
      <defs>
        <linearGradient id={`m${id}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fbf3e2" /><stop offset=".6" stopColor="#e9d8b8" /><stop offset="1" stopColor="#c9b28a" /></linearGradient>
        <linearGradient id={`ms${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#dcc8a2" /><stop offset="1" stopColor="#a8916a" /></linearGradient>
        <linearGradient id={`l${id}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#9ed36a" /><stop offset=".5" stopColor="#3f8f3c" /><stop offset="1" stopColor="#1d5a2c" /></linearGradient>
        <linearGradient id={`g${id}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff3c4" /><stop offset=".45" stopColor="#e9b84f" /><stop offset="1" stopColor="#a8761f" /></linearGradient>
        <radialGradient id={`sh${id}`} cx=".5" cy=".5" r=".5"><stop offset="0" stopColor="#000" stopOpacity=".45" /><stop offset="1" stopColor="#000" stopOpacity="0" /></radialGradient>
      </defs>
      {/* leaves behind */}
      {[[38, 150, -38, 62], [62, 152, -12, 70], [276, 150, 30, 64], [254, 152, 8, 56]].map(([x, y, r, h], i) => (
        <path key={i} d={`M0 0C-${h * .22} -${h * .35} -${h * .2} -${h * .8} 0 -${h}C${h * .2} -${h * .8} ${h * .22} -${h * .35} 0 0Z`} transform={`translate(${x} ${y}) rotate(${r})`} fill={`url(#l${id})`} opacity=".95" />
      ))}
      <ellipse cx="160" cy="146" rx="118" ry="14" fill={`url(#sh${id})`} />
      {/* marble pedestal */}
      <path d="M58 118v16c0 9 46 16 102 16s102-7 102-16v-16z" fill={`url(#ms${id})`} />
      <ellipse cx="160" cy="118" rx="102" ry="16" fill={`url(#m${id})`} />
      <path d="M90 112c14 6 30 4 44 9M180 110c20 4 34 10 52 6" stroke="#b89a6a" strokeOpacity=".5" strokeWidth=".8" fill="none" />
      {children}
      <path d="M0 0C-9 -14 -8 -32 0 -40C8 -32 9 -14 0 0Z" transform="translate(86 132) rotate(-22)" fill={`url(#l${id})`} />
      <path d="M0 0C-9 -14 -8 -32 0 -40C8 -32 9 -14 0 0Z" transform="translate(236 132) rotate(24)" fill={`url(#l${id})`} />
    </svg>
  )
}

export default function CardArt({ category }: { category: string }) {
  const id = useId().replace(/:/g, '')
  const g = `url(#g${id})`
  switch (category) {
    case 'Email Marketing':
      return (
        <Scene id={id}>
          <g transform="translate(160 78) rotate(-6)">
            <rect x="-54" y="-34" width="108" height="72" rx="10" fill="#fbf6ec" stroke="#d9c49c" />
            <path d="M-54 -26l54 38 54-38" fill="none" stroke="#c9ad7a" strokeWidth="3" strokeLinejoin="round" />
            <path d="M-54 38l38-30M54 38l-38-30" stroke="#e2d2b2" strokeWidth="2" />
          </g>
          <circle cx="206" cy="52" r="20" fill={g} stroke="#8a6418" />
          <text x="206" y="59" textAnchor="middle" fontSize="22" fontWeight="700" fill="#4a3208">@</text>
        </Scene>
      )
    case 'SEO':
      return (
        <Scene id={id}>
          {[0, 1, 2].map(i => <rect key={i} x={112 + i * 8} y={40 + i * 16} width="84" height="46" rx="10" fill={i === 2 ? '#fbf6ec' : '#2f8f74'} fillOpacity={i === 2 ? 1 : .55 + i * .15} stroke="#e9c77b" strokeOpacity=".7" />)}
          <path d="M138 98h40M138 108h28" stroke="#c9ad7a" strokeWidth="4" strokeLinecap="round" />
          <circle cx="206" cy="66" r="20" fill="#bdf2e2" fillOpacity=".35" stroke={g} strokeWidth="7" />
          <path d="M220 81l18 18" stroke={g} strokeWidth="9" strokeLinecap="round" />
        </Scene>
      )
    case 'Paid Ads':
      return (
        <Scene id={id}>
          {[[114, 34], [140, 50], [166, 66], [192, 84]].map(([x, h]) => <rect key={x} x={x} y={112 - h} width="20" height={h} rx="4" fill={g} stroke="#8a6418" strokeWidth=".8" />)}
          <path d="M112 76l32-16 26 6 34-26" fill="none" stroke="#fff3c4" strokeWidth="3" strokeLinecap="round" />
          <circle cx="232" cy="74" r="18" fill={g} stroke="#8a6418" />
          <text x="232" y="81" textAnchor="middle" fontSize="20" fontWeight="700" fill="#4a3208">$</text>
        </Scene>
      )
    case 'Content':
      return (
        <Scene id={id}>
          <rect x="120" y="34" width="70" height="84" rx="6" fill="#efe4cf" transform="rotate(-8 155 76)" />
          <rect x="128" y="30" width="70" height="84" rx="6" fill="#fbf6ec" stroke="#dcc8a2" />
          {[46, 58, 70, 82].map(y => <path key={y} d={`M140 ${y}h${y === 82 ? 26 : 46}`} stroke="#c9ad7a" strokeWidth="4" strokeLinecap="round" />)}
          <g transform="translate(214 46) rotate(38)">
            <rect x="-6" y="-36" width="12" height="62" rx="4" fill={g} stroke="#8a6418" strokeWidth=".8" />
            <path d="M-6 26l6 14 6-14z" fill="#2a1d05" />
          </g>
        </Scene>
      )
    default:
      return (
        <Scene id={id}>
          <circle cx="160" cy="70" r="36" fill="#0d3b2e" stroke={g} strokeWidth="6" />
          <path d="M146 86V54l28 32V54" fill="none" stroke={g} strokeWidth="7" strokeLinejoin="round" strokeLinecap="round" />
          <path d="M214 34l4 10 10 4-10 4-4 10-4-10-10-4 10-4z" fill={g} />
        </Scene>
      )
  }
}
