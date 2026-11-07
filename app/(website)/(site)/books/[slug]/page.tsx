import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { cache } from "react"
import PageShell from "@/components/layout/PageShell"
import BookCard from "@/components/content/BookCard"
import BookCover from "@/components/content/BookCover"
import SectionHeading from "@/components/content/SectionHeading"
import EmptyState from "@/components/content/EmptyState"
import Reveal from "@/components/motion/Reveal"
import Prose from "@/components/sanity/Prose"
import { getBookBySlug, getBooksByCategory } from "@/lib/sanity/fetch"
import { buildMetadata } from "@/lib/metadata"
import { bookCategorySlugs, bookCategoryPaths } from "@/lib/navigation"
import { formatBookCategory, formatEditionFormat } from "@/lib/format"
import { siteName, siteUrl } from "@/lib/site"
import type { BookCategory } from "@/lib/sanity/types"

type Props = { params: Promise<{ slug: string }> }

/*
 * One route serves two things:
 *   /books/novels      → a category listing (slug matches a category)
 *   /books/black-wine  → a book detail page
 * Category slugs are reserved, so a book can never shadow one.
 */
const getBook = cache((slug: string) => getBookBySlug(slug))

const shelfField: Record<BookCategory, "red" | "blue" | "yellow" | "ink" | "cream"> = {
  novel: "red",
  shortFiction: "blue",
  anthology: "ink",
  poetry: "yellow",
  other: "cream",
}

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
  if (category) return <CategoryListing category={category as BookCategory} />

  const book = await getBook(slug)
  if (!book) notFound()

  const wins = book.awards?.filter((a) => a.isWinner !== false) ?? []
  const nominations = book.awards?.filter((a) => a.isWinner === false) ?? []
  const categoryPath = `/books/${bookCategoryPaths[book.category] ?? ""}`
  const formatLine = [
    formatBookCategory(book.category).replace(/s$/, ""),
    book.genre,
    book.publisher,
    book.year,
    book.coAuthors?.length ? `with ${book.coAuthors.join(", ")}` : null,
  ]
    .filter(Boolean)
    .join(" · ")

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

  const tone = shelfField[book.category] ?? "cream"
  const onDark = tone === "red" || tone === "blue" || tone === "ink"

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Header band: flat colour field per shelf, cover sits on it */}
      <header
        className={
          {
            red: "bg-label-red text-canvas-cream",
            blue: "bg-cobalt-blue text-canvas-cream",
            ink: "bg-night-soil text-canvas-cream",
            yellow: "bg-cadmium-yellow text-night-soil",
            cream: "bg-canvas-cream text-night-soil",
          }[tone] + " band border-b-2 border-night-soil"
        }
      >
        <div className="container-x grid gap-10 pt-10 pb-12 md:pt-16 md:pb-16 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4 lg:col-start-1">
            <div className="mx-auto w-[min(100%,320px)] lg:mx-0 lg:w-full lg:max-w-[360px]">
              <BookCover book={book} width={720} sizes="(max-width: 1024px) 320px, 360px" priority className="shadow-[12px_12px_0_0_var(--color-night-soil)]" />
            </div>
          </div>
          <div className="flex flex-col justify-end lg:col-span-8">
            <p className={`eyebrow mb-4 ${onDark ? "text-cadmium-yellow" : "text-label-red"}`}>
              <Link href="/books" className="hover:underline">Books</Link>
              <span className="mx-2" aria-hidden>/</span>
              <Link href={categoryPath} className="hover:underline">{formatBookCategory(book.category)}</Link>
              {book.isUpcoming && <span className="ml-3 bg-cadmium-yellow px-2 py-0.5 text-night-soil">Forthcoming</span>}
            </p>
            <h1 className="display-1 text-balance">{book.title}</h1>
            {book.subtitle && <p className={`lede mt-4 ${onDark ? "text-canvas-cream/90" : "text-night-soil/85"}`}>{book.subtitle}</p>}
            <p className={`body-lg mt-5 ${onDark ? "text-canvas-cream/85" : "text-ink-soft"}`}>{formatLine}</p>

            {(wins.length > 0 || nominations.length > 0) && (
              <ul className="mt-6 flex flex-wrap gap-2">
                {wins.map((a) => (
                  <li key={a.name} className={`px-3 py-1.5 font-display text-sm tracking-[0.1em] uppercase ${onDark ? "bg-cadmium-yellow text-night-soil" : "bg-night-soil text-canvas-cream"}`}>
                    ★ {a.name}{a.year ? ` ${a.year}` : ""}
                  </li>
                ))}
                {nominations.map((a) => (
                  <li key={a.name} className={`border-2 px-3 py-1 font-display text-sm tracking-[0.1em] uppercase ${onDark ? "border-canvas-cream/60" : "border-night-soil/60"}`}>
                    {a.name}{a.year ? ` ${a.year}` : ""} · shortlist
                  </li>
                ))}
              </ul>
            )}

            {/* Buy row */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              {book.purchaseLinks?.length ? (
                book.purchaseLinks.map((l) => (
                  <a
                    key={l.url}
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex h-11 items-center px-5 pt-[3px] font-display text-base tracking-[0.12em] uppercase transition-colors ${onDark ? "bg-canvas-cream text-night-soil hover:bg-cadmium-yellow" : "bg-night-soil text-canvas-cream hover:bg-label-red"}`}
                  >
                    {l.label || l.retailer} ↗
                  </a>
                ))
              ) : (
                <p className={`font-sans text-[1.05rem] italic ${onDark ? "text-canvas-cream/85" : "text-ink-soft"}`}>
                  Ask your local bookshop, or{" "}
                  <Link href={`/contact?subject=${encodeURIComponent(`Copies of ${book.title}`)}`} className="link-ink">get in touch</Link> about copies.
                </p>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container-x grid gap-12 py-12 md:py-16 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7 lg:col-start-1">
          {book.excerpt?.length ? (
            <Reveal as="section" className="mb-12 border-l-[6px] border-cadmium-yellow pl-6 md:pl-8">
              <p className="eyebrow mb-4 text-label-red">Excerpt</p>
              <Prose value={book.excerpt} className="text-[1.15rem] leading-[1.7]" />
            </Reveal>
          ) : null}

          <Reveal as="section">
            {book.description?.length ? (
              <Prose value={book.description} className="body-lg" />
            ) : (
              <p className="lede italic text-ink-soft">Write-up coming soon.</p>
            )}
          </Reveal>

          {book.reviews?.length ? (
            <Reveal as="section" className="mt-16">
              <SectionHeading label="Praise" title="What they said" />
              <div className="flex flex-col gap-12">
                {book.reviews.map((r, i) => (
                  <blockquote key={r._key ?? i} className="relative max-w-[62ch] pl-10 md:pl-14">
                    <span className="display-hero absolute -top-4 left-0 text-label-red leading-none select-none md:-top-6" aria-hidden>“</span>
                    <p className="font-sans text-[1.35rem] leading-[1.45] text-foreground md:text-[1.5rem]">{r.quote}</p>
                    <footer className="mt-3 font-sans text-base text-ink-soft">
                      — {r.reviewer ? `${r.reviewer}, ` : ""}
                      {r.url ? (
                        <a href={r.url} target="_blank" rel="noopener noreferrer" className="link-ink italic">{r.source}</a>
                      ) : (
                        <em>{r.source}</em>
                      )}
                      {r.year && ` (${r.year})`}
                    </footer>
                  </blockquote>
                ))}
              </div>
            </Reveal>
          ) : null}
        </div>

        <aside className="flex flex-col gap-10 lg:col-span-4 lg:col-start-9 lg:sticky lg:top-24 lg:self-start">
          {book.editions?.length ? (
            <div>
              <p className="eyebrow mb-3 text-label-red">Editions</p>
              <ul className="border-t-2 border-night-soil">
                {book.editions.map((e, i) => (
                  <li key={e._key ?? i} className="border-b border-night-soil/20 py-3">
                    <p className="font-sans text-[1.05rem] leading-snug">
                      <span className="font-semibold">{e.publisher}</span>
                      {e.year && <span className="text-ink-soft"> · {e.year}</span>}
                    </p>
                    <p className="meta mt-1 text-ink-soft">
                      {[formatEditionFormat(e.format), e.language, e.note, e.isbn && `ISBN ${e.isbn}`].filter(Boolean).join(" · ")}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <dl className="grid grid-cols-[130px_1fr] gap-x-4 gap-y-2 border-t-2 border-night-soil pt-4">
            {book.year && (<><dt className="eyebrow pt-0.5 text-ink-soft">First published</dt><dd className="font-sans text-[1.05rem]">{book.year}</dd></>)}
            {book.publisher && (<><dt className="eyebrow pt-0.5 text-ink-soft">Publisher</dt><dd className="font-sans text-[1.05rem]">{book.publisher}</dd></>)}
            {book.genre && (<><dt className="eyebrow pt-0.5 text-ink-soft">Genre</dt><dd className="font-sans text-[1.05rem]">{book.genre}</dd></>)}
            {book.coAuthors?.length ? (<><dt className="eyebrow pt-0.5 text-ink-soft">With</dt><dd className="font-sans text-[1.05rem]">{book.coAuthors.join(", ")}</dd></>) : null}
          </dl>

          <div className="bg-warm-linen p-5">
            <p className="eyebrow text-label-red">Reading in public?</p>
            <p className="mt-2 font-sans text-[1.05rem] leading-snug">
              Candas does launches, readings and panels. <Link href="/contact?subject=Invitation" className="link-ink text-label-red">Invite her</Link>, or see the{" "}
              <Link href="/events" className="link-ink text-label-red">events page</Link>.
            </p>
          </div>
        </aside>
      </div>

      {book.relatedBooks?.length ? (
        <section className="container-x border-t-2 border-night-soil py-14">
          <SectionHeading title="Related books" href={categoryPath} linkLabel={`More ${formatBookCategory(book.category).toLowerCase()}`} />
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
            {book.relatedBooks.map((b) => (
              <BookCard key={b._id} book={b} />
            ))}
          </div>
        </section>
      ) : null}
    </>
  )
}

async function CategoryListing({ category }: { category: BookCategory }) {
  const books = await getBooksByCategory(category)
  const label = formatBookCategory(category)
  const tone = shelfField[category] ?? "cream"
  return (
    <PageShell
      title={label}
      subtitle={`Books · ${books.length} ${books.length === 1 ? "title" : "titles"}`}
      tone={tone}
      wide
      headerExtra={
        <Link href="/books" className={`eyebrow link-ink ${tone === "cream" || tone === "yellow" ? "text-ink-soft hover:text-label-red" : "text-canvas-cream/80 hover:text-cadmium-yellow"}`}>
          ← The whole library
        </Link>
      }
    >
      {books.length === 0 ? (
        <EmptyState title={`No ${label.toLowerCase()} yet`}>
          <Link href="/books" className="link-ink text-label-red">Browse all books</Link>
        </EmptyState>
      ) : (
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
          {books.map((book, i) => (
            <BookCard key={book._id} book={book} priority={i < 5} />
          ))}
        </div>
      )}
    </PageShell>
  )
}
