import type { Metadata } from "next"
import { Bebas_Neue, EB_Garamond, JetBrains_Mono } from "next/font/google"
import { SanityLive } from "@/sanity/lib/live"
import "../globals.css"

const bebasNeue = Bebas_Neue({
  weight: "400",
  variable: "--font-bebas-neue",
  subsets: ["latin"],
  display: "swap",
})

const ebGaramond = EB_Garamond({
  variable: "--font-eb-garamond",
  subsets: ["latin", "latin-ext"],
  display: "swap",
})

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "Candas Jane Dorsey",
    template: "%s — Candas Jane Dorsey",
  },
  description:
    "Novelist, poet, visual artist, editor, publisher, teacher, advocate.",
}

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      className={`${bebasNeue.variable} ${ebGaramond.variable} ${jetBrainsMono.variable} grid min-h-dvh grid-rows-[1fr] font-sans antialiased`}
    >
      {children}
      <SanityLive />
    </div>
  )
}
