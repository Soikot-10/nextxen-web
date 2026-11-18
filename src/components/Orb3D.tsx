import type { CSSProperties } from 'react'
import Icon, { type IconName } from '@/components/Icon'

// A lit glass sphere rendered with layered CSS: key light, rim light, inner
// shadow, a tilted chrome ring and a soft contact shadow that breathes as
// the orb floats. Crisp at any DPR because it is all vector.
export default function Orb3D({ icon, emoji, color = '#d4ff3a', size = 104, className = '' }: {
  icon?: IconName; emoji?: string; color?: string; size?: number; className?: string
}) {
  return (
    <span className={`orb3d ${className}`} style={{ '--c': color, '--sz': `${size}px` } as CSSProperties} aria-hidden="true">
      <span className="o-float">
        <span className="o-ring" />
        <span className="o-sphere">
          <span className="o-face"><Icon name={icon} emoji={emoji} size={Math.round(size * 0.24)} stroke={1.7} /></span>
        </span>
      </span>
      <span className="o-shadow" />
    </span>
  )
}
