import Image from "next/image"
import { urlFor } from "@/sanity/lib/image"
import type { SanityImage as SanityImageType } from "@/lib/sanity/types"
import { cn } from "@/lib/utils"

type Props = {
  image: SanityImageType
  /** Rendered width in CSS px at the largest breakpoint; drives the source size. */
  width: number
  /** Omit for intrinsic aspect ratio; set to crop. */
  height?: number
  sizes?: string
  priority?: boolean
  className?: string
  alt?: string
  /** Fill the parent (parent must be positioned). */
  fill?: boolean
}

/**
 * next/image backed by Sanity's image CDN. Honours hotspot/crop and asks the
 * CDN for the right size and format.
 */
export default function SanityImage({
  image,
  width,
  height,
  sizes,
  priority,
  className,
  alt,
  fill,
}: Props) {
  if (!image?.asset) return null

  let builder = urlFor(image).width(width * 2).auto("format").quality(80)
  if (height) builder = builder.height(height * 2).fit("crop")
  const src = builder.url()

  const altText = alt ?? image.alt ?? ""

  if (fill) {
    return (
      <Image
        src={src}
        alt={altText}
        fill
        sizes={sizes ?? `${width}px`}
        priority={priority}
        className={cn("object-cover", className)}
        draggable={false}
      />
    )
  }

  return (
    <Image
      src={src}
      alt={altText}
      width={width}
      height={height ?? Math.round(width * 1.33)}
      sizes={sizes ?? `(max-width: 768px) 100vw, ${width}px`}
      priority={priority}
      className={cn(height ? "object-cover" : "h-auto w-full", className)}
      draggable={false}
      unoptimized={!height}
    />
  )
}
