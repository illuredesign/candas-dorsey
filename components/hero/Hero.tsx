"use client"

import dynamic from "next/dynamic"
import Image from "next/image"
import SiteHeader from "@/components/layout/SiteHeader"
import HeroContent from "./HeroContent"
import ScrollHint from "./ScrollHint"

const FluidCanvas = dynamic(() => import("./FluidCanvas"), { ssr: false })

export default function Hero() {
  return (
    <section className="relative h-dvh w-full overflow-hidden bg-night-soil">
      {/* WebGL fluid background */}
      <FluidCanvas />

      {/* Halftone portrait — bottom right, responsive */}
      <Image
        src="/img/half-tone-30.png"
        alt=""
        width={520}
        height={780}
        priority
        className="pointer-events-none absolute bottom-[-30px] right-[-20px] z-[2] h-auto w-[min(520px,45vw)] opacity-60 mix-blend-multiply portrait-mask max-md:bottom-0 max-md:right-[-10px] max-md:w-[min(280px,55vw)] max-md:opacity-40"
      />

      {/* Navigation — transparent overlay */}
      <SiteHeader variant="transparent" />

      {/* Text overlay */}
      <HeroContent />

      {/* Scroll indicator */}
      <ScrollHint />
    </section>
  )
}
