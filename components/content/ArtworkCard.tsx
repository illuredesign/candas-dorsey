import Link from "next/link"
import ArtworkImage from "./ArtworkImage"
import { Badge } from "@/components/ui/badge"
import type { ArtworkCard as ArtworkCardType } from "@/lib/sanity/types"
import { formatArtworkStatus } from "@/lib/format"
import { cn } from "@/lib/utils"

export default function ArtworkCard({
  artwork,
  priority,
  className,
}: {
  artwork: ArtworkCardType
  priority?: boolean
  className?: string
}) {
  const href = `/gallery/${artwork.slug.current}`
  return (
    <article className={cn("group flex flex-col", className)}>
      <Link href={href} className="relative block aspect-[4/3] overflow-hidden bg-warm-linen">
        <ArtworkImage
          image={artwork.image}
          watermark={artwork.watermarkImage !== false}
          width={600}
          height={450}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px"
          priority={priority}
          className="transition-transform duration-500 group-hover:scale-[1.03]"
        />
        {artwork.status === "available" && (
          <Badge variant="default" className="absolute top-3 left-3 bg-emerald-green text-night-soil">
            Available
          </Badge>
        )}
      </Link>
      <div className="mt-3">
        <h3 className="font-display text-lg leading-tight tracking-[0.04em] text-foreground">
          <Link href={href} className="transition-colors group-hover:text-label-red">
            {artwork.title}
          </Link>
        </h3>
        <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.12em] text-foreground/50">
          {[artwork.medium, artwork.year, artwork.status && artwork.status !== "available" && formatArtworkStatus(artwork.status)]
            .filter(Boolean)
            .join(" · ")}
        </p>
      </div>
    </article>
  )
}
