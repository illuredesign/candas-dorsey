"use client"

import { useRef } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"
import { vertexShader, fragmentShader } from "./shaders"

type Frameloop = "always" | "demand" | "never"

function ShaderPlane() {
  const { size, viewport } = useThree()
  const material = useRef<THREE.ShaderMaterial>(null)

  useFrame(({ clock }) => {
    const u = material.current?.uniforms
    if (!u) return
    u.u_time.value = clock.getElapsedTime()
    u.u_resolution.value.set(size.width * viewport.dpr, size.height * viewport.dpr)
  })

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={material}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{ u_time: { value: 0 }, u_resolution: { value: new THREE.Vector2() } }}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  )
}

/**
 * The painted, slowly moving backdrop behind the home hero. Fills whichever
 * positioned ancestor it sits in; the parent decides when it should animate.
 */
export default function FluidCanvas({ frameloop = "always", dpr = [1, 1.5] }: { frameloop?: Frameloop; dpr?: [number, number] }) {
  return (
    <Canvas
      className="pointer-events-none"
      dpr={dpr}
      gl={{
        alpha: false,
        antialias: false,
        preserveDrawingBuffer: false,
        powerPreference: "high-performance",
      }}
      frameloop={frameloop}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      aria-hidden
    >
      <ShaderPlane />
    </Canvas>
  )
}
