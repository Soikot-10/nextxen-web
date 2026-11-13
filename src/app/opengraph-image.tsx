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
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '72px 80px', background: '#0b0b0a', color: '#f3f1ec' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 26, letterSpacing: 6 }}>
          <div style={{ width: 14, height: 14, borderRadius: 7, background: '#d6fb41' }} />
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
