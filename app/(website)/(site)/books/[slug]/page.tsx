import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { cache } from "react"
import PageShell from "@/components/layout/PageShell"
import BookCard from "@/components/content/BookCard"
import SectionHeading from "@/components/content/SectionHeading"
import EmptyState from "@/components/content/EmptyState"
import SanityImage from "@/components/sanity/SanityImage"
import Prose from "@/components/sanity/Prose"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getBookBySlug, getBooksByCategory } from "@/lib/sanity/fetch"
import { buildMetadata } from "@/lib/metadata"
import { bookCategorySlugs, bookCategoryPaths } from "@/lib/navigation"
import { formatBookCategory, formatEditionFormat } from "@/lib/format"
import { siteName, siteUrl } from "@/lib/site"

type Props = { params: Promise<{ slug: string }> }

/*
 * One route serves two things:
 *   /books/novels      → a category listing (slug matches a category)
 *   /books/black-wine  → a book detail page
 * Category slugs are reserved, so a book can never shadow one.
 */
const getBook = cache((slug: string) => getBookBySlug(slug))

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const category = bookCategorySlugs[slug]
  if (category) {
    return buildMetadata({
      title: formatBookCategory(category),
      description: `${formatBookCategory(category)} by Candas Jane Dorsey.`,
      path: `/books/${slug}`,
    })
  }
  const book = await getBook(slug)
  if (!book) return {}
  return buildMetadata({
    title: book.title,
    description: [book.genre, book.year, book.publisher].filter(Boolean).join(" · ") + " — a book by Candas Jane Dorsey.",
    path: `/books/${slug}`,
    image: book.coverImage,
    seo: book.seo,
    type: "book",
  })
}

export default async function BookOrCategoryPage({ params }: Props) {
  const { slug } = await params
  const category = bookCategorySlugs[slug]
  if (category) return <CategoryListing category={category} slug={slug} />

  const book = await getBook(slug)
  if (!book) notFound()

  const wins = book.awards?.filter((a) => a.isWinner !== false) ?? []
  const nominations = book.awards?.filter((a) => a.isWinner === false) ?? []
  const categoryPath = `/books/${bookCategoryPaths[book.category] ?? ""}`

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: book.title,
    author: { "@type": "Person", name: siteName, url: siteUrl },
    url: `${siteUrl}/books/${slug}`,
    datePublished: book.year ?? undefined,
    publisher: book.publisher ? { "@type": "Organization", name: book.publisher } : undefined,
    genre: book.genre ?? undefined,
    workExample: book.editions?.map((e) => ({
      "@type": "Book",
      bookFormat: e.format === "audiobook" ? "https://schema.org/AudiobookFormat" : e.format === "ebook" ? "https://schema.org/EBook" : e.format === "hardcover" ? "https://schema.org/Hardcover" : e.format === "paperback" ? "https://schema.org/Paperback" : undefined,
      isbn: e.isbn ?? undefined,
      publisher: { "@type": "Organization", name: e.publisher },
      datePublished: e.year ?? undefined,
      inLanguage: e.language ?? undefined,
    })),
    award: wins.map((a) => `${a.name}${a.year ? ` (${a.year})` : ""}`),
  }

  return (
    <PageShell
      title={book.title}
      subtitle={[formatBookCategory(book.category), book.genre].filter(Boolean).join(" · ")}
      lead={book.subtitle}
      aside={
        <div className="flex flex-col gap-8">
          {book.coverImage?.asset ? (
            <SanityImage image={book.coverImage} width={320} sizes="(max-width: 1024px) 60vw, 320px" priority className="w-full max-w-[320px]" />
          ) : null}

          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 font-mono text-[11px] tracking-[0.06em]">
            {book.year && <><dt className="uppercase text-foreground/40">First published</dt><dd>{book.year}</dd></>}
            {book.publisher && <><dt className="uppercase text-foreground/40">Publisher</dt><dd>{book.publisher}</dd></>}
            {book.coAuthors?.length ? <><dt className="uppercase text-foreground/40">With</dt><dd>{book.coAuthors.join(", ")}</dd></> : null}
          </dl>

          {book.purchaseLinks?.length ? (
            <div>
              <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-label-red">Where to buy</p>
              <div className="flex flex-col gap-2">
                {book.purchaseLinks.map((l) => (
                  <Button key={l.url} variant="dark" asChild>
                    <a href={l.url} target="_blank" rel="noopener noreferrer">{l.label || l.retailer}</a>
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <p className="font-sans text-sm italic text-foreground/50">
              Ask your local bookshop, or <Link href="/contact" className="text-label-red underline underline-offset-4">get in touch</Link> about copies.
            </p>
          )}

          {book.editions?.length ? (
            <div>
              <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-label-red">Editions</p>
              <ul className="flex flex-col divide-y divide-foreground/10 border-y border-foreground/10">
                {book.editions.map((e, i) => (
                  <li key={e._key ?? i} className="py-2 font-sans text-sm leading-snug">
                    <span className="font-semibold">{e.publisher}</span>
                    {e.year && <span className="text-foreground/60"> · {e.year}</span>}
                    <span className="block font-mono text-[10px] uppercase tracking-[0.1em] text-foreground/50">
                      {[formatEditionFormat(e.format), e.language, e.note, e.isbn && `ISBN ${e.isbn}`].filter(Boolean).join(" · ")}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      }
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {(wins.length > 0 || nominations.length > 0) && (
        <div className="mb-8 flex flex-wrap gap-2">
          {wins.map((a) => (
            <Badge key={a.name} variant="award">
              {a.name}{a.year ? ` · ${a.year}` : ""}
            </Badge>
          ))}
          {nominations.map((a) => (
            <Badge key={a.name} variant="metadata">
              {a.name}{a.year ? ` · ${a.year}` : ""} · shortlisted
            </Badge>
          ))}
        </div>
      )}

      {book.description?.length ? (
        <Prose value={book.description} />
      ) : (
        <p className="font-sans text-lg italic text-foreground/50">Write-up coming soon.</p>
      )}

      {book.excerpt?.length ? (
        <section className="mt-12 border-l-4 border-warm-gold bg-warm-linen px-6 py-6 md:px-8">
          <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-label-red">Excerpt</p>
          <Prose value={book.excerpt} />
        </section>
      ) : null}

      {book.reviews?.length ? (
        <section className="mt-12">
          <SectionHeading label="Press" title="Reviews" />
          <div className="flex flex-col gap-8">
            {book.reviews.map((r, i) => (
              <blockquote key={r._key ?? i} className="max-w-prose">
                <p className="font-sans text-xl italic leading-relaxed text-foreground">“{r.quote}”</p>
                <footer className="mt-2 font-mono text-[10px] uppercase tracking-[0.15em] text-foreground/50">
                  {r.url ? (
                    <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-label-red">{r.source}</a>
                  ) : (
                    r.source
                  )}
                  {r.reviewer && ` · ${r.reviewer}`}
                  {r.year && ` · ${r.year}`}
                </footer>
              </blockquote>
            ))}
          </div>
        </section>
      ) : null}

      {book.relatedBooks?.length ? (
        <section className="mt-16">
          <SectionHeading title="Related Books" href={categoryPath} linkLabel={`More ${formatBookCategory(book.category).toLowerCase()}`} />
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
            {book.relatedBooks.map((b) => (
              <BookCard key={b._id} book={b} />
            ))}
          </div>
        </section>
      ) : null}
    </PageShell>
  )
}

async function CategoryListing({ category, slug }: { category: string; slug: string }) {
  const books = await getBooksByCategory(category)
  const label = formatBookCategory(category)
  return (
    <PageShell title={label} subtitle="Books">
      {books.length === 0 ? (
        <EmptyState title={`No ${label.toLowerCase()} yet`}>
          <Link href="/books" className="text-label-red underline underline-offset-4">Browse all books</Link>
        </EmptyState>
      ) : (
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {books.map((book, i) => (
            <BookCard key={book._id} book={book} priority={i < 4} />
          ))}
        </div>
      )}
      <p className="mt-12 font-mono text-[10px] uppercase tracking-[0.15em] text-foreground/50">
        <Link href="/books" className="hover:text-label-red">← All books</Link>
        <span className="sr-only">{slug}</span>
      </p>
    </PageShell>
  )
}
