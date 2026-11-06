import { Suspense } from "react"
import Hero from "@/components/hero/Hero"
import HomeStrip from "@/components/home/HomeStrip"
import SiteFooter from "@/components/layout/SiteFooter"

export default function Home() {
  return (
    <>
      <Hero />
      <Suspense>
        <HomeStrip />
      </Suspense>
      <SiteFooter />
    </>
  )
}
