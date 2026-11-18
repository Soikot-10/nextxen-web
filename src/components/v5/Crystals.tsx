'use client'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Lightformer, MeshTransmissionMaterial } from '@react-three/drei'

// Foreground ice-like crystals at the bottom-right corner of the hero slab:
// faceted, refractive, slowly turning. Geometry is a jittered icosahedron
// with flat facets; the material is physically based glass.

function makeRock(seed: number, detail: number) {
  const g = new THREE.IcosahedronGeometry(1, detail).toNonIndexed()
  const pos = g.attributes.position as THREE.BufferAttribute
  const rand = (n: number) => { const x = Math.sin(n * 127.1 + seed * 311.7) * 43758.5453; return x - Math.floor(x) }
  const cache = new Map<string, number>()
  for (let i = 0; i < pos.count; i++) {
    const v = new THREE.Vector3().fromBufferAttribute(pos, i)
    const key = `${v.x.toFixed(3)}|${v.y.toFixed(3)}|${v.z.toFixed(3)}`
    let k = cache.get(key)
    if (k === undefined) { k = 0.82 + rand(cache.size + 1) * 0.3; cache.set(key, k) }
    v.multiplyScalar(k)
    v.y *= 1.35 // elongated shards
    pos.setXYZ(i, v.x, v.y, v.z)
  }
  g.computeVertexNormals()
  return g
}

// Right-hand cluster only: the left cluster overlapped the process rail.
const ROCKS = [
  { p: [7.3, -1.5, 1.0], s: 0.9, r: [0.3, -0.5, -0.6], seed: 4, spin: -0.07 },
  { p: [8.5, 0.2, -0.6], s: 0.5, r: [0.9, 0.3, 0.2], seed: 5, spin: 0.11 },
] as const

function Rocks({ reduce }: { reduce: boolean }) {
  const refs = useRef<(THREE.Mesh | null)[]>([])
  const geos = useMemo(() => ROCKS.map(r => makeRock(r.seed, 2)), [])
  useFrame((_, dt) => {
    if (reduce) return
    refs.current.forEach((m, i) => {
      if (!m) return
      m.rotation.y += dt * ROCKS[i].spin
      m.rotation.x += dt * ROCKS[i].spin * 0.4
    })
  })
  return (
    <>
      {ROCKS.map((r, i) => (
        <mesh key={i} ref={el => { refs.current[i] = el }} geometry={geos[i]} position={r.p as unknown as THREE.Vector3Tuple}
          scale={r.s} rotation={r.r as unknown as THREE.Vector3Tuple}>
          <MeshTransmissionMaterial samples={6} resolution={1024} thickness={1.4} roughness={0.08} ior={1.7}
            chromaticAberration={0.12} anisotropy={0.2} distortion={0.1} distortionScale={0.4} temporalDistortion={0}
            color="#e8fcff" attenuationColor="#4fb3c4" attenuationDistance={3.5} background={new THREE.Color('#123f45')}
            clearcoat={1} clearcoatRoughness={0.08} envMapIntensity={2.6} flatShading />
        </mesh>
      ))}
    </>
  )
}

export default function Crystals({ paused, reduce, dpr }: { paused: boolean; reduce: boolean; dpr: number }) {
  return (
    <div className="crystals" aria-hidden="true">
      <Canvas dpr={dpr} camera={{ position: [0, 0, 10], fov: 40 }} gl={{ antialias: true, alpha: true, stencil: false }}
        frameloop={paused ? 'never' : 'always'}>
        <Environment resolution={1024} frames={1}>
          <Lightformer form="rect" intensity={4} position={[0, 6, 2]} scale={[10, 2, 1]} color="#ffffff" />
          <Lightformer form="rect" intensity={2} position={[-6, 0, 3]} rotation-y={Math.PI / 2} scale={[8, 3, 1]} color="#6fe6e0" />
          <Lightformer form="rect" intensity={1.6} position={[6, 1, 3]} rotation-y={-Math.PI / 2} scale={[8, 3, 1]} color="#9fd8ff" />
          <Lightformer form="ring" intensity={2.2} position={[0, 0, -6]} scale={8} color="#e9c77b" />
        </Environment>
        <ambientLight intensity={0.25} />
        <directionalLight position={[2, 6, 5]} intensity={2} />
        <Rocks reduce={reduce} />
      </Canvas>
    </div>
  )
}
