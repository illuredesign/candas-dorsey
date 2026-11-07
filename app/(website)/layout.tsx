import type { Metadata } from "next"
import { SanityLive } from "@/sanity/lib/live"
import { siteUrl } from "@/lib/site"
import "../globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
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
      className="grid min-h-dvh grid-cols-1 grid-rows-[1fr] font-sans antialiased"
    >
      {children}
      <SanityLive />
    </div>
  )
}
