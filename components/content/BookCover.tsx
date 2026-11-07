import SanityImage from "@/components/sanity/SanityImage"
import type { BookCard, BookCategory } from "@/lib/sanity/types"
import { cn } from "@/lib/utils"

/** Flat colour per shelf, used when a book has no cover scan yet. */
const shelfTone: Record<BookCategory, string> = {
  novel: "bg-label-red text-canvas-cream",
  shortFiction: "bg-cobalt-blue text-canvas-cream",
  anthology: "bg-emerald-green text-night-soil",
  poetry: "bg-cadmium-yellow text-night-soil",
  other: "bg-burnt-sienna text-canvas-cream",
}

/**
 * A book cover at 2:3. Uses the Sanity scan when present; otherwise a
 * designed typographic cover in the shelf's colour, so a half-filled Studio
 * never shows a black box.
 */
export default function BookCover({
  book,
  width = 400,
  sizes,
  priority,
  className,
}: {
  book: Pick<BookCard, "title" | "subtitle" | "category" | "year" | "coverImage" | "coAuthors">
  width?: number
  sizes?: string
  priority?: boolean
  className?: string
}) {
  return (
    <div className={cn("@container relative aspect-[2/3] w-full overflow-hidden bg-warm-linen", className)}>
      {book.coverImage?.asset ? (
        <SanityImage
          image={book.coverImage}
          width={width}
          height={Math.round(width * 1.5)}
          fill
          sizes={sizes ?? `${width}px`}
          priority={priority}
          alt={book.coverImage.alt ?? `Cover of ${book.title}`}
        />
      ) : (
        <div className={cn("flex h-full w-full flex-col justify-between p-[8%]", shelfTone[book.category] ?? shelfTone.other)}>
          <span className="eyebrow opacity-80">{book.year ?? ""}</span>
          <span className="font-display text-[clamp(1.25rem,9cqw,2.75rem)] leading-[0.95] tracking-[0.03em] text-balance">
            {book.title}
          </span>
          <span className="font-sans text-[clamp(0.75rem,4cqw,1rem)] italic leading-tight opacity-90">
            Candas Jane Dorsey{book.coAuthors?.length ? ` & ${book.coAuthors.join(", ")}` : ""}
          </span>
          {/* Spine */}
          <span className="absolute inset-y-0 left-0 w-[4%] bg-night-soil/25" aria-hidden />
        </div>
      )}
    </div>
  )
}
