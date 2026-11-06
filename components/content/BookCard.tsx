import Link from "next/link"
import SanityImage from "@/components/sanity/SanityImage"
import { Badge } from "@/components/ui/badge"
import type { BookCard as BookCardType } from "@/lib/sanity/types"
import { cn } from "@/lib/utils"

/** Placeholder cover when no image has been uploaded. */
function CoverFallback({ title }: { title: string }) {
  return (
    <div className="flex h-full w-full items-end bg-night-soil p-4">
      <span className="font-display text-2xl leading-none tracking-[0.04em] text-canvas-cream/80">{title}</span>
    </div>
  )
}

export default function BookCard({
  book,
  priority,
  className,
}: {
  book: BookCardType
  priority?: boolean
  className?: string
}) {
  const href = `/books/${book.slug.current}`
  const wins = book.awards?.filter((a) => a.isWinner !== false) ?? []

  return (
    <article className={cn("group flex flex-col", className)}>
      <Link href={href} className="relative block aspect-[2/3] overflow-hidden bg-warm-linen">
        {book.coverImage?.asset ? (
          <SanityImage
            image={book.coverImage}
            width={400}
            height={600}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 260px"
            priority={priority}
            className="transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <CoverFallback title={book.title} />
        )}
        {book.isUpcoming && (
          <Badge className="absolute top-3 left-3">Forthcoming</Badge>
        )}
      </Link>
      <div className="mt-3 flex flex-col gap-1.5">
        <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-foreground/50">
          {[book.genre, book.year].filter(Boolean).join(" · ")}
        </p>
        <h3 className="font-display text-xl leading-tight tracking-[0.04em] text-foreground">
          <Link href={href} className="transition-colors group-hover:text-label-red">
            {book.title}
          </Link>
        </h3>
        {book.coAuthors?.length ? (
          <p className="font-sans text-sm italic text-foreground/60">with {book.coAuthors.join(", ")}</p>
        ) : null}
        {wins.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1">
            {wins.slice(0, 3).map((a) => (
              <Badge key={a.name} variant="award">
                {a.name}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </article>
  )
}
