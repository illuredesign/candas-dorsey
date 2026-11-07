import Link from "next/link"
import BookCover from "./BookCover"
import type { BookCard as BookCardType } from "@/lib/sanity/types"
import { cn } from "@/lib/utils"

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
    <article className={cn("group @container flex flex-col", className)}>
      <Link href={href} className="relative block" aria-label={book.title}>
        <BookCover
          book={book}
          width={400}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 280px"
          priority={priority}
          className="transition-transform duration-500 ease-out group-hover:-translate-y-1.5 group-hover:shadow-[8px_8px_0_0_var(--color-night-soil)]"
        />
        {book.isUpcoming && <span className="label-block absolute top-3 -left-1">Forthcoming</span>}
      </Link>
      <div className="mt-4 flex flex-col gap-1.5">
        <p className="meta text-ink-soft uppercase">{[book.genre, book.year].filter(Boolean).join(" · ")}</p>
        <h3 className="display-4 text-foreground">
          <Link href={href} className="transition-colors group-hover:text-label-red">
            {book.title}
          </Link>
        </h3>
        {book.coAuthors?.length ? (
          <p className="font-sans text-base italic text-ink-soft">with {book.coAuthors.join(", ")}</p>
        ) : null}
        {wins.length > 0 && (
          <p className="font-sans text-[0.95rem] leading-snug text-ink-soft">
            <span className="text-label-red" aria-hidden>★ </span>
            {wins.slice(0, 3).map((a) => a.name).join(", ")}
          </p>
        )}
      </div>
    </article>
  )
}
