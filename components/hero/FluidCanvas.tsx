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

/**
 * Owns the GPU resources for the two-pass painting for the life of one WebGL
 * context: a single off-screen target that is resized in place, and two
 * materials whose uniform objects never change identity. (Replacing either
 * on resize leaves three.js's compiled program pointing at stale uniform
 * objects and a disposed texture, which renders black.)
 */
class Painter {
  readonly target: THREE.WebGLRenderTarget
  readonly noiseMat: THREE.ShaderMaterial
  readonly compositeMat: THREE.ShaderMaterial
  readonly offScene = new THREE.Scene()
  readonly offCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
  private last = 0
  private interval = 1000 / TARGET_FPS
  private slow = 0

  constructor(gl: THREE.WebGLRenderer) {
    this.target = new THREE.WebGLRenderTarget(1, 1, {
      type: gl.capabilities.isWebGL2 ? THREE.HalfFloatType : THREE.UnsignedByteType,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      depthBuffer: false,
      stencilBuffer: false,
      generateMipmaps: false,
    })
    this.noiseMat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader: noiseFragmentShader,
      uniforms: {
        u_time: { value: 0 },
        u_resolution: { value: new THREE.Vector2(1, 1) },
        u_ground: { value: new THREE.Vector2(0.85, 0.4) },
      },
      depthWrite: false,
      depthTest: false,
    })
    this.compositeMat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader: compositeFragmentShader,
      uniforms: {
        u_painting: { value: this.target.texture },
        u_resolution: { value: new THREE.Vector2(1, 1) },
      },
      depthWrite: false,
      depthTest: false,
    })
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.noiseMat)
    quad.frustumCulled = false
    this.offScene.add(quad)
  }

  resize(width: number, height: number, dpr: number) {
    this.target.setSize(Math.max(1, Math.round(width * dpr * PAINT_SCALE)), Math.max(1, Math.round(height * dpr * PAINT_SCALE)))
    this.compositeMat.uniforms.u_resolution.value.set(width * dpr, height * dpr)
    this.noiseMat.uniforms.u_resolution.value.set(this.target.width, this.target.height)
  }

  setGround(left: number, right: number) {
    this.noiseMat.uniforms.u_ground.value.set(left, right)
  }

  /** Returns false when the frame was skipped to hold the target cadence. */
  render(gl: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.Camera, time: number, throttle: boolean) {
    const now = performance.now()
    const since = now - this.last
    if (throttle && since < this.interval) return false

    // Adaptive cadence: if frames keep arriving late, ease the target down.
    if (this.last) {
      this.slow = since > this.interval * 1.6 ? Math.min(this.slow + 1, 60) : Math.max(this.slow - 1, 0)
      this.interval = 1000 / (this.slow > 30 ? FLOOR_FPS : TARGET_FPS)
    }
    this.last = now

    this.noiseMat.uniforms.u_time.value = time
    gl.setRenderTarget(this.target)
    gl.render(this.offScene, this.offCamera)
    gl.setRenderTarget(null)
    gl.render(scene, camera)
    return true
  }

  dispose() {
    this.target.dispose()
    this.noiseMat.dispose()
    this.compositeMat.dispose()
    this.offScene.traverse((o) => {
      if (o instanceof THREE.Mesh) o.geometry.dispose()
    })
  }
}

function Painting({ frameloop, ground }: { frameloop: Frameloop; ground: [number, number] }) {
  const { gl, size, viewport, scene, camera, invalidate } = useThree()
  const dpr = viewport.dpr

  const painter = useMemo(() => new Painter(gl), [gl])
  useEffect(() => () => painter.dispose(), [painter])

  useEffect(() => {
    painter.resize(size.width, size.height, dpr)
    invalidate()
  }, [painter, size.width, size.height, dpr, invalidate])

  useEffect(() => {
    painter.setGround(ground[0], ground[1])
    invalidate()
  }, [painter, ground, invalidate])

  // Manual render so we can skip frames: with priority > 0, r3f leaves the
  // drawing to us and the last presented frame stays on screen when we skip.
  const loop = useRef(frameloop)
  useEffect(() => {
    loop.current = frameloop
  }, [frameloop])
  useFrame((state) => {
    painter.render(gl, scene, camera, state.clock.getElapsedTime(), loop.current === "always")
  }, 1)

  return (
    <mesh frustumCulled={false} material={painter.compositeMat}>
      <planeGeometry args={[2, 2]} />
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
