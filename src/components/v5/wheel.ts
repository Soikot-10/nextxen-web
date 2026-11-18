// Shared geometry + live state for the hero wheel, read by both the SVG layer
// and the WebGL layer so pearls and spokes always line up exactly.
export const BOX = 1000
export const C = BOX / 2
export const R = { core: 64, tick0: 86, tick1: 98, ring1: 124, ring2: 168, dots: 206, spoke0: 232, spoke1: 360, node: 398, label: 438, sat: 398 }

export const live = {
  rot: 0,       // degrees, slow ambient sway of the whole wheel
  active: -1,   // hovered / focused spoke
  breathe: 0,   // 0..1 shared breathing phase
}

export const angleOf = (i: number, n: number, rot = live.rot) => ((-90 + (i * 360) / n + rot) * Math.PI) / 180
const r2 = (v: number) => Math.round(v * 100) / 100
// rounded so server and client render identical SVG attributes
export const polar = (r: number, a: number) => ({ x: r2(C + r * Math.cos(a)), y: r2(C + r * Math.sin(a)) })

export function setLiveActive(i: number) { live.active = i }
