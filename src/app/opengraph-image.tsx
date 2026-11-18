import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const alt = 'NEXTXEN — AI-powered marketing for New Zealand businesses'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  const serif = await readFile(join(process.cwd(), 'assets/InstrumentSerif-Regular.ttf'))
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '72px 80px', background: 'linear-gradient(160deg, #0B1413 0%, #0A3B37 140%)', color: '#F9F6EC' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 26, letterSpacing: 6 }}>
          <svg width="52" height="52" viewBox="0 0 64 64">
            <defs>
              <linearGradient id="r" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stopColor="#00E5C8" /><stop offset=".72" stopColor="#F6C46A" /><stop offset="1" stopColor="#fff1c8" /></linearGradient>
            </defs>
            <path d="M32 3.2 57.2 17.6v28.8L32 60.8 6.8 46.4V17.6Z" fill="#0A3B37" stroke="url(#r)" strokeWidth="3.6" strokeLinejoin="round" />
            <path d="M21.6 43.2V20.8h4.6l12 15.4V20.8h4.2v22.4h-4.4L25.8 27.6v15.6z" fill="#F9F6EC" />
          </svg>
          NEXTXEN
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', fontFamily: 'Serif', fontSize: 104, lineHeight: 1, letterSpacing: -2 }}>
          <span>Digital growth,</span>
          <span style={{ color: '#a6a299' }}>engineered with AI.</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 26, color: '#a6a299' }}>
          <span>AI-powered marketing studio · Auckland, New Zealand</span>
          <span style={{ color: '#f3f1ec' }}>nextxen.co.nz</span>
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: 'Serif', data: serif, style: 'normal', weight: 400 }] },
  )
}
