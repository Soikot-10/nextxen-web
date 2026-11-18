'use client'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import { coreServices, GOLD } from './data'
import { BOX, R, angleOf, live } from './wheel'

// WebGL layer of the hero wheel: the glossy gold core and the eight pearl
// nodes, drawn with an orthographic camera in the same 1000-unit space as
// the SVG layer so they sit exactly on the spokes.

function Orbs({ reduce, lite }: { reduce: boolean; lite: boolean }) {
  const core = useRef<THREE.Mesh>(null!)
  const pearls = useRef<(THREE.Mesh | null)[]>([])
  const t = useRef(0)
  const tints = useMemo(() => coreServices.map(s => new THREE.Color(s.color)), [])
  const gold = useMemo(() => new THREE.Color(GOLD), [])

  useFrame(({ camera, size }, dt) => {
    const cam = camera as THREE.OrthographicCamera
    const z = size.width / BOX
    if (cam.zoom !== z) { cam.zoom = z; cam.updateProjectionMatrix() }
    if (!reduce) t.current += Math.min(dt, 0.05)
    const tt = t.current
    core.current.rotation.y = tt * 0.25
    core.current.scale.setScalar(1 + Math.sin(tt * 1.4) * 0.025)
    pearls.current.forEach((m, i) => {
      if (!m) return
      const a = angleOf(i, coreServices.length)
      m.position.set(R.node * Math.cos(a), -R.node * Math.sin(a), 0)
      const on = live.active === i, dim = live.active >= 0 && !on
      const target = (on ? 1.3 : 1) * (1 + Math.sin(tt * 1.6 + i * 0.8) * 0.04)
      m.scale.setScalar(m.scale.x + (target - m.scale.x) * 0.15)
      const mat = m.material as THREE.MeshPhysicalMaterial
      mat.color.lerp(on ? gold : tints[i], 0.12)
      mat.emissive.copy(on ? gold : tints[i]).multiplyScalar(on ? 0.35 : 0.12)
      mat.opacity += ((dim ? 0.5 : 1) - mat.opacity) * 0.15
    })
  })

  return (
    <>
      <mesh ref={core}>
        <sphereGeometry args={[R.core, lite ? 64 : 192, lite ? 64 : 192]} />
        <meshPhysicalMaterial color={GOLD} metalness={0.55} roughness={0.22} clearcoat={1} clearcoatRoughness={0.06} envMapIntensity={2.2} emissive="#7a5718" emissiveIntensity={0.45} sheen={0.6} sheenColor="#fff2cc" />
      </mesh>
      {coreServices.map((s, i) => (
        <mesh key={s.id} ref={el => { pearls.current[i] = el }}>
          <sphereGeometry args={[25, lite ? 40 : 128, lite ? 40 : 128]} />
          <meshPhysicalMaterial color={s.color} roughness={0.2} metalness={0.05} clearcoat={1} clearcoatRoughness={0.05}
            sheen={1} sheenColor="#ffffff" iridescence={0.5} envMapIntensity={1.5} transparent />
        </mesh>
      ))}
    </>
  )
}

export default function WheelGL({ paused, reduce, dpr, lite = false }: { paused: boolean; reduce: boolean; dpr: number; lite?: boolean }) {
  return (
    <Canvas orthographic dpr={dpr} camera={{ position: [0, 0, 500], near: 1, far: 2000, zoom: 1 }}
      gl={{ antialias: !lite, alpha: true, stencil: false, powerPreference: lite ? 'low-power' : 'high-performance' }} frameloop={paused ? 'never' : 'always'}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      <Environment resolution={512} frames={1}>
        <Lightformer form="rect" intensity={3.2} position={[-2, 4, 3]} scale={[6, 2, 1]} color="#ffffff" />
        <Lightformer form="circle" intensity={2} position={[3, 3, 4]} scale={1.5} color="#fff6dc" />
        <Lightformer form="rect" intensity={1.2} position={[4, -1, 2]} scale={[4, 3, 1]} color="#7fe7e0" />
        <Lightformer form="ring" intensity={1.4} position={[0, 0, -5]} scale={5} color="#f3dca4" />
        <Lightformer form="rect" intensity={0.6} position={[0, -4, 1]} scale={[8, 1, 1]} color="#3fb6b0" />
      </Environment>
      <ambientLight intensity={0.35} />
      <directionalLight position={[-300, 400, 600]} intensity={1.4} />
      <Orbs reduce={reduce} lite={lite} />
    </Canvas>
  )
}
