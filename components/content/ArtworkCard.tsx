import Link from "next/link"
import ArtworkImage from "./ArtworkImage"
import type { ArtworkCard as ArtworkCardType } from "@/lib/sanity/types"
import { formatArtworkStatus } from "@/lib/format"
import { cn } from "@/lib/utils"

/**
 * Artwork card. `intrinsic` keeps the work's own aspect ratio (masonry
 * grids); otherwise it crops to 4:3 for uniform strips.
 */
export default function ArtworkCard({
  artwork,
  priority,
  intrinsic,
  className,
}: {
  artwork: ArtworkCardType
  priority?: boolean
  intrinsic?: boolean
  className?: string
}) {
  const href = `/gallery/${artwork.slug.current}`
  const left = artwork.status === "sold" || artwork.status === "privateCollection"
  return (
    <article className={cn("group flex flex-col", className)}>
      <Link
        href={href}
        className={cn("relative block overflow-hidden bg-warm-linen", !intrinsic && "aspect-[4/3]")}
        aria-label={artwork.title}
      >
        <ArtworkImage
          image={artwork.image}
          watermark={artwork.watermarkImage !== false}
          width={720}
          height={intrinsic ? undefined : 540}
          fill={!intrinsic}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 420px"
          priority={priority}
          className="transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
        {artwork.status === "available" && (
          <span className="absolute top-3 left-3 bg-emerald-green px-2.5 pt-1.5 pb-1 font-display text-sm leading-none tracking-[0.12em] uppercase text-night-soil">
            Available
          </span>
        )}
      </Link>
      <div className="mt-3 flex items-baseline justify-between gap-4">
        <h3 className="display-4 text-foreground">
          <Link href={href} className="transition-colors group-hover:text-label-red">
            {artwork.title}
          </Link>
        </h3>
        {artwork.year && <span className="meta shrink-0 text-ink-soft">{artwork.year}</span>}
      </div>
      <p className="meta mt-1 text-ink-soft">
        {[artwork.medium, left && formatArtworkStatus(artwork.status)].filter(Boolean).join(" · ")}
      </p>
    </article>
  )
}
