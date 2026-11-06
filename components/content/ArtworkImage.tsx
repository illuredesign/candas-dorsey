import SanityImage from "@/components/sanity/SanityImage"
import type { SanityImage as SanityImageType } from "@/lib/sanity/types"
import { cn } from "@/lib/utils"

/**
 * Artwork image with an optional watermark overlay. The overlay is a
 * repeating text tile plus a blocked context menu — a deterrent, not DRM.
 */
export default function ArtworkImage({
  image,
  watermark = true,
  width,
  height,
  fill,
  sizes,
  priority,
  className,
}: {
  image: SanityImageType
  watermark?: boolean
  width: number
  height?: number
  fill?: boolean
  sizes?: string
  priority?: boolean
  className?: string
}) {
  return (
    <div
      className={cn("relative select-none overflow-hidden", fill && "h-full w-full", className)}
    >
      <SanityImage image={image} width={width} height={height} fill={fill} sizes={sizes} priority={priority} />
      {watermark && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[1] bg-[length:220px_140px] bg-repeat opacity-[0.16] mix-blend-overlay"
          style={{ backgroundImage: "url('/img/watermark.svg')" }}
        />
      )}
    </div>
  )
}
