"use client"

import { useEffect, useMemo, useRef } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"
import { vertexShader, noiseFragmentShader, compositeFragmentShader } from "./shaders"

type Frameloop = "always" | "demand" | "never"

/** Internal resolution of the painting pass, as a fraction of device pixels. */
const PAINT_SCALE = 0.5
/** Target cadence. The drift is slow enough that 30 fps is indistinguishable from 60. */
const TARGET_FPS = 30
/** If a device cannot hold the target, ease to this rather than drop resolution. */
const FLOOR_FPS = 20

function Painting({ frameloop, ground }: { frameloop: Frameloop; ground: [number, number] }) {
  const { gl, size, viewport, scene, camera, invalidate } = useThree()
  const dpr = viewport.dpr

  // Off-screen target for the expensive pass. Half float keeps the gradients
  // smooth through the second pass; WebGL1 devices fall back to 8-bit.
  const target = useMemo(() => {
    const w = Math.max(1, Math.round(size.width * dpr * PAINT_SCALE))
    const h = Math.max(1, Math.round(size.height * dpr * PAINT_SCALE))
    return new THREE.WebGLRenderTarget(w, h, {
      type: gl.capabilities.isWebGL2 ? THREE.HalfFloatType : THREE.UnsignedByteType,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      depthBuffer: false,
      stencilBuffer: false,
      generateMipmaps: false,
    })
  }, [gl, size.width, size.height, dpr])
  useEffect(() => () => target.dispose(), [target])

  const noiseMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader: noiseFragmentShader,
        uniforms: {
          u_time: { value: 0 },
          u_resolution: { value: new THREE.Vector2(1, 1) },
          u_ground: { value: new THREE.Vector2(ground[0], ground[1]) },
        },
        depthWrite: false,
        depthTest: false,
      }),
    // ground is applied below so a prop change doesn't rebuild the material
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  useEffect(() => {
    noiseMat.uniforms.u_ground.value.set(ground[0], ground[1])
    invalidate()
  }, [ground, noiseMat, invalidate])

  const offScene = useMemo(() => {
    const s = new THREE.Scene()
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), noiseMat)
    quad.frustumCulled = false
    s.add(quad)
    return s
  }, [noiseMat])
  const offCamera = useMemo(() => new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1), [])

  const composite = useRef<THREE.ShaderMaterial>(null)
  const clock = useRef({ last: 0, interval: 1000 / TARGET_FPS, slow: 0 })

  // Manual render so we can skip frames: with priority > 0, r3f leaves the
  // drawing to us and the last presented frame stays on screen when we skip.
  useFrame((state) => {
    const now = performance.now()
    const c = clock.current
    const since = now - c.last
    if (frameloop === "always" && since < c.interval) return

    // Adaptive cadence: if frames keep arriving late, ease the target down.
    if (c.last) {
      if (since > c.interval * 1.6) c.slow = Math.min(c.slow + 1, 60)
      else c.slow = Math.max(c.slow - 1, 0)
      const fps = c.slow > 30 ? FLOOR_FPS : TARGET_FPS
      c.interval = 1000 / fps
    }
    c.last = now

    const w = size.width * dpr
    const h = size.height * dpr
    noiseMat.uniforms.u_time.value = state.clock.getElapsedTime()
    noiseMat.uniforms.u_resolution.value.set(target.width, target.height)

    gl.setRenderTarget(target)
    gl.render(offScene, offCamera)
    gl.setRenderTarget(null)

    const m = composite.current
    if (m) {
      m.uniforms.u_painting.value = target.texture
      m.uniforms.u_resolution.value.set(w, h)
    }
    gl.render(scene, camera)
  }, 1)

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={composite}
        vertexShader={vertexShader}
        fragmentShader={compositeFragmentShader}
        uniforms={{ u_painting: { value: null }, u_resolution: { value: new THREE.Vector2(1, 1) } }}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  )
}

/**
 * The painted, slowly moving backdrop behind the home hero. Fills whichever
 * positioned ancestor it sits in; the parent decides when it should animate.
 * `ground` is the opacity of the dark lower band at the left and right edges.
 */
export default function FluidCanvas({
  frameloop = "always",
  dpr = [1, 1.5],
  ground = [0.85, 0.4],
}: {
  frameloop?: Frameloop
  dpr?: [number, number]
  ground?: [number, number]
}) {
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
      <Painting frameloop={frameloop} ground={ground} />
    </Canvas>
  )
}
