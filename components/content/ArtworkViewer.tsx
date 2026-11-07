"use client"

import { useEffect, useState } from "react"
import { X, Maximize2 } from "lucide-react"
import ArtworkImage from "./ArtworkImage"
import type { SanityImage } from "@/lib/sanity/types"

/**
 * Artwork image with a "Focus" mode: the work alone on a night-soil field,
 * chrome hidden, Escape or click to leave. Borrowed from gallery sites that
 * offer a Focus / zoom toggle; it is the one piece of interaction on the page.
 */
export default function ArtworkViewer({
  image,
  title,
  watermark,
  caption,
}: {
  image: SanityImage
  title: string
  watermark: boolean
  caption?: string | null
}) {
  const [focus, setFocus] = useState(false)

  useEffect(() => {
    if (!focus) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setFocus(false)
    document.addEventListener("keydown", onKey)
    document.documentElement.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.documentElement.style.overflow = ""
    }
  }, [focus])

  return (
    <>
      <figure>
        <button
          type="button"
          onClick={() => setFocus(true)}
          className="group relative block w-full cursor-zoom-in bg-warm-linen text-left"
          aria-label={`View ${title} in focus mode`}
        >
          <ArtworkImage image={image} watermark={watermark} width={1400} sizes="(max-width: 1024px) 100vw, 900px" priority className="w-full" />
          <span className="absolute right-3 bottom-3 z-[2] inline-flex items-center gap-2 bg-night-soil px-3 py-2 font-display text-sm tracking-[0.12em] uppercase text-canvas-cream opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
            <Maximize2 className="size-3.5" aria-hidden /> Focus
          </span>
        </button>
        {caption && <figcaption className="meta mt-3 text-ink-soft">{caption}</figcaption>}
      </figure>

      {focus && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={title}
          className="fixed inset-0 z-[90] flex cursor-zoom-out items-center justify-center bg-night-soil p-4 md:p-10"
          onClick={() => setFocus(false)}
        >
          <ArtworkImage
            image={image}
            watermark={watermark}
            width={2000}
            sizes="100vw"
            className="max-h-[calc(100vh-2rem)] w-auto max-w-full [&_img]:max-h-[calc(100vh-2rem)] [&_img]:w-auto [&_img]:object-contain md:max-h-[calc(100vh-5rem)] md:[&_img]:max-h-[calc(100vh-5rem)]"
          />
          <button
            type="button"
            onClick={() => setFocus(false)}
            className="absolute top-4 right-4 inline-flex size-12 items-center justify-center bg-canvas-cream text-night-soil hover:bg-cadmium-yellow"
            autoFocus
          >
            <X className="size-5" />
            <span className="sr-only">Leave focus mode</span>
          </button>
          <p className="eyebrow absolute bottom-4 left-4 text-cream-mute">{title} · Esc to close</p>
        </div>
      )}
    </>
  )
}
