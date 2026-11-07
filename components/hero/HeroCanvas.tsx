"use client"

import dynamic from "next/dynamic"
import { useEffect, useRef, useState } from "react"
import { useReducedMotion } from "motion/react"

const FluidCanvas = dynamic(() => import("./FluidCanvas"), { ssr: false })

/**
 * Client shell for the WebGL hero backdrop. Loads the canvas only in the
 * browser, animates only while the hero is on screen, and renders a single
 * still frame for people who prefer reduced motion. The flat cadmium-yellow
 * field underneath stays as the fallback if WebGL is unavailable.
 */
export default function HeroCanvas() {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(true)
  const reduced = useReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === "undefined") return
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const frameloop = reduced ? "demand" : inView ? "always" : "never"

  return (
    <div ref={ref} className="absolute inset-0 z-0 bg-night-soil" aria-hidden>
      <FluidCanvas frameloop={frameloop} />
    </div>
  )
}
