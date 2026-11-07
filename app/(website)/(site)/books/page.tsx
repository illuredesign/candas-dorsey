import type { Metadata } from "next"
import Link from "next/link"
import PageShell from "@/components/layout/PageShell"
import BookCard from "@/components/content/BookCard"
import SectionHeading from "@/components/content/SectionHeading"
import EmptyState from "@/components/content/EmptyState"
import Reveal from "@/components/motion/Reveal"
import { getAllBooks } from "@/lib/sanity/fetch"
import { buildMetadata } from "@/lib/metadata"
import { bookCategoryPaths } from "@/lib/navigation"
import { formatBookCategory } from "@/lib/format"
import type { BookCard as BookCardType, BookCategory } from "@/lib/sanity/types"

export const metadata: Metadata = buildMetadata({
  title: "Books",
  description:
    "Novels, short fiction collections, anthologies and poetry by Candas Jane Dorsey, from Black Wine to At the Freak Show.",
  path: "/books",
})

const categoryOrder: BookCategory[] = ["novel", "shortFiction", "anthology", "poetry", "other"]

export default async function BooksPage() {
  const books = await getAllBooks()
  const upcoming = books.filter((b) => b.isUpcoming)
  const grouped = new Map<BookCategory, BookCardType[]>()
  for (const book of books) {
    if (book.isUpcoming) continue
    const list = grouped.get(book.category) ?? []
    list.push(book)
    grouped.set(book.category, list)
  }
  const shelves = categoryOrder.filter((c) => grouped.get(c)?.length)
  const years = books.map((b) => Number(b.year)).filter((y) => !Number.isNaN(y))
  const span = years.length ? `${Math.min(...years)}–${Math.max(...years)}` : null

  return (
    <PageShell
      title="The Library"
      subtitle={`Books · ${books.length} titles${span ? ` · ${span}` : ""}`}
      lead="Four decades of novels, stories, anthologies and poems. Pick a shelf, or browse the whole library."
      tone="ink"
      wide
      headerExtra={
        <nav aria-label="Shelves" className="flex flex-wrap gap-2">
          {upcoming.length > 0 && (
            <a href="#upcoming" className="border-2 border-cadmium-yellow bg-cadmium-yellow px-3 py-1.5 font-display text-sm tracking-[0.12em] uppercase text-night-soil hover:bg-transparent hover:text-cadmium-yellow">
              Forthcoming ({upcoming.length})
            </a>
          )}
          {shelves.map((c) => (
            <a
              key={c}
              href={`#${bookCategoryPaths[c]}`}
              className="border-2 border-canvas-cream/40 px-3 py-1.5 font-display text-sm tracking-[0.12em] uppercase text-canvas-cream hover:border-cadmium-yellow hover:text-cadmium-yellow"
            >
              {formatBookCategory(c)} ({grouped.get(c)!.length})
            </a>
          ))}
        </nav>
      }
    >
      {books.length === 0 && <EmptyState title="The library is being shelved">Books will appear here once they are added in the Studio.</EmptyState>}

      {upcoming.length > 0 && (
        <Reveal as="section" className="mb-20">
          <SectionHeading label="Coming soon" title="Forthcoming" id="upcoming" count={upcoming.length} />
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
            {upcoming.map((book) => (
              <BookCard key={book._id} book={book} priority />
            ))}
          </div>
        </Reveal>
      )}

      {shelves.map((category) => {
        const list = grouped.get(category)!
        return (
          <Reveal as="section" key={category} className="mb-20">
            <SectionHeading
              title={formatBookCategory(category)}
              id={bookCategoryPaths[category]}
              count={list.length}
              href={`/books/${bookCategoryPaths[category]}`}
              linkLabel={`Just the ${formatBookCategory(category).toLowerCase()}`}
            />
            <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
              {list.map((book, i) => (
                <BookCard key={book._id} book={book} priority={i < 5} />
              ))}
            </div>
          </Reveal>
        )
      })}

      <p className="body-lg max-w-[60ch] text-ink-soft">
        Looking for shorter pieces? Stories, poems and essays that live outside the books are collected under{" "}
        <Link href="/writing" className="link-ink text-label-red">Other Writing</Link>.
      </p>
    </PageShell>
  )
}
