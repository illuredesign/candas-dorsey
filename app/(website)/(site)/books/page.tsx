import type { Metadata } from "next"
import PageShell from "@/components/layout/PageShell"
import BookCard from "@/components/content/BookCard"
import SectionHeading from "@/components/content/SectionHeading"
import EmptyState from "@/components/content/EmptyState"
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

  return (
    <PageShell
      title="Candas @ Writing"
      subtitle="Books"
      lead="Four decades of novels, stories, anthologies and poems. Pick a shelf, or browse the whole library."
    >
      {books.length === 0 && <EmptyState title="The library is being shelved">Books will appear here once they are added in the CMS.</EmptyState>}

      {upcoming.length > 0 && (
        <section className="mb-16">
          <SectionHeading label="Coming soon" title="Upcoming Publications" id="upcoming" />
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {upcoming.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        </section>
      )}

      {categoryOrder.map((category) => {
        const list = grouped.get(category)
        if (!list?.length) return null
        return (
          <section key={category} className="mb-16">
            <SectionHeading
              title={formatBookCategory(category)}
              id={bookCategoryPaths[category]}
              href={`/books/${bookCategoryPaths[category]}`}
              linkLabel={`All ${formatBookCategory(category).toLowerCase()}`}
            />
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
              {list.map((book, i) => (
                <BookCard key={book._id} book={book} priority={i < 4} />
              ))}
            </div>
          </section>
        )
      })}
    </PageShell>
  )
}
