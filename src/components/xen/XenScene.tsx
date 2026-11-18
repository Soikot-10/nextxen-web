'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, Environment, Lightformer, QuadraticBezierLine, RoundedBox } from '@react-three/drei'
import Icon from '@/components/Icon'
import { CHANNELS } from './channels'

// Xen: a glossy floating orb character linked to the marketing channels by
// glowing violet trails. The selected channel's trail lights up and carries
// pulses. Motion stops completely when `paused` (frameloop "never").

const VIOLET = new THREE.Color('#a78bfa')
const HOT = new THREE.Color('#d9ccff')
const NODE_POS: [number, number, number][] = [
  [-1.7, 1.45, -0.4], [-1.75, -0.85, -0.2], [0, 2.35, -0.6], [1.75, -0.85, -0.2], [1.7, 1.45, -0.4],
]
// DOM labels for the channel tiles, positioned from the frame loop
const labelEls: (HTMLElement | null)[] = []

type LineRef = { setPoints: (a: THREE.Vector3, b: THREE.Vector3, m: THREE.Vector3) => void; material: THREE.Material & { opacity: number; color: THREE.Color } } | null

function Xen({ active, onPick, lite }: { active: number; onPick: (i: number) => void; lite: boolean }) {
  const body = useRef<THREE.Group>(null!)
  const head = useRef<THREE.Group>(null!)
  const eyes = useRef<THREE.Group>(null!)
  const lines = useRef<LineRef[]>([])
  const glows = useRef<LineRef[]>([])
  const pulses = useRef<(THREE.Mesh | null)[]>([])
  const tiles = useRef<(THREE.Group | null)[]>([])
  const v = useMemo(() => ({ o: new THREE.Vector3(), e: NODE_POS.map(p => new THREE.Vector3(...p)), m: new THREE.Vector3(), look: new THREE.Vector3() }), [])
  const t0 = useRef(0)
  const proj = useMemo(() => new THREE.Vector3(), [])

  useFrame(({ camera, size }, rawDt) => {
    const dt = Math.min(rawDt, 0.05)
    t0.current += dt
    const t = t0.current
    const bob = Math.sin(t * 1.3) * 0.14
    body.current.position.y = bob
    body.current.rotation.z = Math.sin(t * 0.9) * 0.04
    // look towards the active channel
    v.look.copy(v.e[active]).sub(body.current.position).normalize()
    head.current.rotation.y += (v.look.x * 0.45 - head.current.rotation.y) * Math.min(1, dt * 4)
    head.current.rotation.x += (-v.look.y * 0.25 - head.current.rotation.x) * Math.min(1, dt * 4)
    const blink = (t % 4.2) > 4.05 ? 0.12 : 1
    eyes.current.scale.y += (blink - eyes.current.scale.y) * Math.min(1, dt * 20)

    v.o.set(0, bob, 0.2)
    NODE_POS.forEach((_, i) => {
      const on = i === active
      const e = v.e[i]
      const tile = tiles.current[i]
      if (tile) {
        tile.position.y = e.y + Math.sin(t * 1.1 + i) * 0.06
        const s = tile.scale.x + ((on ? 1.18 : 1) - tile.scale.x) * Math.min(1, dt * 6)
        tile.scale.setScalar(s)
      }
      const end = tile ? tile.position : e
      const m = v.m.copy(v.o).add(end).multiplyScalar(0.5); m.y += 0.7
      const ln = lines.current[i], gl = glows.current[i]
      if (ln) { ln.setPoints(v.o, end, m); ln.material.opacity = on ? 0.95 : 0.22; ln.material.color.copy(on ? HOT : VIOLET) }
      if (gl) { gl.setPoints(v.o, end, m); gl.material.opacity = on ? 0.32 : 0.05 }
      const pu = pulses.current[i]
      if (pu) {
        const u = (t * (on ? 0.7 : 0.25) + i * 0.21) % 1, iu = 1 - u
        pu.position.set(iu * iu * v.o.x + 2 * iu * u * m.x + u * u * end.x, iu * iu * v.o.y + 2 * iu * u * m.y + u * u * end.y, iu * iu * v.o.z + 2 * iu * u * m.z + u * u * end.z)
        pu.scale.setScalar((on ? 1.3 : 0.7) * (0.6 + Math.sin(u * Math.PI)))
        ;(pu.material as THREE.MeshBasicMaterial).opacity = on ? 1 : 0.35
      }
      const el = labelEls[i]
      if (el && tile) {
        tile.getWorldPosition(proj).project(camera)
        el.style.transform = `translate3d(${((proj.x + 1) / 2 * size.width).toFixed(1)}px, ${((1 - proj.y) / 2 * size.height).toFixed(1)}px, 0)`
      }
    })
  })

  const seg = lite ? 64 : 160
  return (
    <>
      {NODE_POS.map((p, i) => (
        <group key={i}>
          <QuadraticBezierLine ref={el => { glows.current[i] = el as unknown as LineRef }} start={[0, 0, 0]} end={p} mid={[0, 1, 0]}
            color="#a78bfa" lineWidth={8} transparent opacity={0.05} depthWrite={false} toneMapped={false} />
          <QuadraticBezierLine ref={el => { lines.current[i] = el as unknown as LineRef }} start={[0, 0, 0]} end={p} mid={[0, 1, 0]}
            color="#a78bfa" lineWidth={1.6} transparent opacity={0.22} depthWrite={false} toneMapped={false} />
          <mesh ref={el => { pulses.current[i] = el }}>
            <sphereGeometry args={[0.05, 32, 32]} />
            <meshBasicMaterial color={new THREE.Color('#e6dcff').multiplyScalar(2)} toneMapped={false} transparent />
          </mesh>
          <group ref={el => { tiles.current[i] = el }} position={p}>
            <RoundedBox args={[0.7, 0.7, 0.2]} radius={0.14} smoothness={8} onClick={() => onPick(i)}
              onPointerOver={() => { document.body.style.cursor = 'pointer' }} onPointerOut={() => { document.body.style.cursor = '' }}>
              <meshPhysicalMaterial color={i === active ? '#c4b2ff' : '#5b4a9a'} roughness={0.15} metalness={0.1} clearcoat={1}
                clearcoatRoughness={0.05} transmission={0.4} thickness={0.5} envMapIntensity={1.6}
                emissive="#7c5cff" emissiveIntensity={i === active ? 0.5 : 0.08} />
            </RoundedBox>
          </group>
        </group>
      ))}

      <group ref={body}>
        <group ref={head}>
          <mesh>
            <sphereGeometry args={[0.95, seg, seg]} />
            <meshPhysicalMaterial color="#f1edff" roughness={0.12} metalness={0} clearcoat={1} clearcoatRoughness={0.04}
              iridescence={0.7} iridescenceIOR={1.35} sheen={1} sheenColor="#b9a4ff" envMapIntensity={1.4} />
          </mesh>
          {/* visor */}
          <mesh position={[0, 0.06, 0.62]} scale={[1, 0.62, 0.5]}>
            <sphereGeometry args={[0.62, seg, seg]} />
            <meshPhysicalMaterial color="#120d24" roughness={0.08} metalness={0.3} clearcoat={1} envMapIntensity={1.2} />
          </mesh>
          <group ref={eyes} position={[0, 0.08, 0.93]}>
            {[-0.2, 0.2].map(x => (
              <mesh key={x} position={[x, 0, 0]}>
                <capsuleGeometry args={[0.06, 0.12, 12, 24]} />
                <meshBasicMaterial color={new THREE.Color('#d4ff3a').multiplyScalar(1.6)} toneMapped={false} />
              </mesh>
            ))}
          </group>
          {/* antenna */}
          <mesh position={[0, 1.02, 0]}>
            <cylinderGeometry args={[0.018, 0.018, 0.22, 16]} />
            <meshStandardMaterial color="#d8d0ff" metalness={1} roughness={0.2} />
          </mesh>
          <mesh position={[0, 1.16, 0]}>
            <sphereGeometry args={[0.07, 32, 32]} />
            <meshBasicMaterial color={new THREE.Color('#c4b2ff').multiplyScalar(1.8)} toneMapped={false} />
          </mesh>
        </group>
        {/* violet halo ring */}
        <mesh rotation={[Math.PI / 2.2, 0, 0]}>
          <torusGeometry args={[1.25, 0.008, 16, 320]} />
          <meshBasicMaterial color="#a78bfa" transparent opacity={0.55} toneMapped={false} />
        </mesh>
      </group>

      <ContactShadows position={[0, -1.45, 0]} scale={7} blur={2.6} far={3} opacity={0.55} resolution={lite ? 512 : 1024} color="#1a0f3a" frames={Infinity} />
    </>
  )
}

export default function XenScene({ active, onPick, paused }: { active: number; onPick: (i: number) => void; paused: boolean }) {
  const wrap = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  const [cfg, setCfg] = useState<{ lite: boolean; dpr: number } | null>(null)

  useEffect(() => {
    const lite = matchMedia('(max-width: 820px), (pointer: coarse)').matches
    const dpr = lite ? Math.min(devicePixelRatio || 1, 1.5) : Math.min(2, Math.max(devicePixelRatio || 1, 1.5))
    const id = requestAnimationFrame(() => setCfg({ lite, dpr }))
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: '120px' })
    if (wrap.current) io.observe(wrap.current)
    return () => { cancelAnimationFrame(id); io.disconnect() }
  }, [])

  return (
    <div ref={wrap} className="xen-cv">
      {cfg && (
        <Canvas dpr={cfg.dpr} camera={{ position: [0, 0.45, 10.2], fov: 38 }} gl={{ antialias: true, alpha: true, stencil: false }}
          frameloop={paused || !inView ? 'never' : 'always'} onCreated={({ gl }) => gl.domElement.closest('.xen-stage-glass')?.classList.add('on')}>
          <Environment resolution={512} frames={1}>
            <Lightformer form="rect" intensity={2} position={[0, 5, 2]} scale={[8, 2, 1]} color="#ffffff" />
            <Lightformer form="rect" intensity={1.2} position={[-5, 1, 0]} rotation-y={Math.PI / 2} scale={[6, 2, 1]} color="#a78bfa" />
            <Lightformer form="rect" intensity={1} position={[5, 0, 0]} rotation-y={-Math.PI / 2} scale={[6, 2, 1]} color="#7c9bff" />
            <Lightformer form="ring" intensity={1.6} position={[0, 0, -6]} scale={6} color="#c9b8ff" />
          </Environment>
          <ambientLight intensity={0.4} />
          <directionalLight position={[2, 5, 4]} intensity={1.1} />
          <Xen active={active} onPick={onPick} lite={cfg.lite} />
        </Canvas>
      )}
      <div className="xn-labels" aria-hidden="true">
        {CHANNELS.map((c, i) => (
          <div key={c.short} className="lbl-anchor" ref={el => { labelEls[i] = el }}>
            <div className={`xn-node${i === active ? ' on' : ''}`}>
              <span className="xn-ic"><Icon name={c.icon} size={16} stroke={1.8} /></span>
              <span className="xn-lb">{c.short}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
