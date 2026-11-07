import Link from "next/link"
import BookCover from "@/components/content/BookCover"
import ArtworkImage from "@/components/content/ArtworkImage"
import Reveal from "@/components/motion/Reveal"
import type { BookCard, HomeSeries } from "@/lib/sanity/types"

/**
 * The site has two halves. This section is the doorway to each:
 * Writing on a night-soil field, Art on a cobalt field. Hard split, no gradient.
 */
export default function TwoDoors({
  featuredBook,
  isUpcoming,
  recentBooks,
  series,
  counts,
}: {
  featuredBook?: BookCard | null
  isUpcoming?: boolean
  recentBooks?: BookCard[] | null
  series?: HomeSeries[] | null
  counts?: { books: number; artworks: number; series: number } | null
}) {
  const shelf = (recentBooks ?? []).filter((b) => b._id !== featuredBook?._id).slice(0, 4)
  const tiles = (series ?? []).filter((s) => s.cover?.asset).slice(0, 4)

  return (
    <section className="grid lg:grid-cols-2" aria-label="Writing and art">
      {/* Writing */}
      <div className="bg-night-soil text-canvas-cream">
        <Reveal className="container-x flex h-full flex-col py-14 lg:py-20 lg:pr-12">
          <div className="flex items-baseline justify-between gap-4 border-b-2 border-canvas-cream/30 pb-4">
            <p className="eyebrow text-cadmium-yellow">01 — Writing</p>
            {counts?.books ? <p className="meta text-cream-mute">{counts.books} books</p> : null}
          </div>

          {featuredBook ? (
            <div className="mt-10 grid grid-cols-[minmax(120px,38%)_1fr] items-end gap-6 md:gap-10">
              <Link href={`/books/${featuredBook.slug.current}`} className="group block">
                <BookCover
                  book={featuredBook}
                  width={420}
                  sizes="(max-width: 1024px) 38vw, 260px"
                  priority
                  className="transition-transform duration-500 ease-out group-hover:-translate-y-1.5 group-hover:shadow-[10px_10px_0_0_var(--color-cadmium-yellow)]"
                />
              </Link>
              <div>
                <p className="eyebrow text-cadmium-yellow">{isUpcoming ? "Forthcoming" : "Latest book"}</p>
                <h2 className="display-2 mt-3 text-canvas-cream">
                  <Link href={`/books/${featuredBook.slug.current}`} className="hover:text-cadmium-yellow">
                    {featuredBook.title}
                  </Link>
                </h2>
                <p className="meta mt-3 text-cream-soft uppercase">
                  {[featuredBook.genre, featuredBook.publisher, featuredBook.year].filter(Boolean).join(" · ")}
                </p>
                {featuredBook.subtitle && <p className="body-lg mt-4 text-cream-soft">{featuredBook.subtitle}</p>}
              </div>
            </div>
          ) : null}

          {shelf.length > 0 && (
            <ul className="mt-10 grid grid-cols-4 gap-3">
              {shelf.map((b) => (
                <li key={b._id}>
                  <Link href={`/books/${b.slug.current}`} className="group block" aria-label={b.title}>
                    <BookCover book={b} width={200} sizes="12vw" className="transition-transform duration-500 group-hover:-translate-y-1" />
                  </Link>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-auto pt-10">
            <Link
              href="/books"
              className="inline-flex h-12 items-center bg-cadmium-yellow px-6 pt-[3px] font-display text-lg tracking-[0.12em] uppercase text-night-soil transition-colors hover:bg-canvas-cream"
            >
              Browse the library →
            </Link>
          </div>
        </Reveal>
      </div>

      {/* Art */}
      <div className="bg-cobalt-blue text-canvas-cream">
        <Reveal delay={0.1} className="container-x flex h-full flex-col py-14 lg:py-20 lg:pl-12">
          <div className="flex items-baseline justify-between gap-4 border-b-2 border-canvas-cream/40 pb-4">
            <p className="eyebrow text-cadmium-yellow">02 — Art</p>
            {counts?.artworks ? (
              <p className="meta text-canvas-cream/80">
                {counts.artworks} works · {counts.series} series
              </p>
            ) : null}
          </div>

          {tiles.length > 0 ? (
            <ul className="mt-10 grid grid-cols-2 gap-3">
              {tiles.map((s) => (
                <li key={s._id}>
                  <Link href={`/gallery/${s.slug.current}`} className="group relative block aspect-[5/4] overflow-hidden bg-night-soil">
                    <ArtworkImage
                      image={s.cover}
                      width={520}
                      height={416}
                      fill
                      sizes="(max-width: 1024px) 50vw, 25vw"
                      className="transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />
                    <span className="absolute inset-x-0 bottom-0 flex items-baseline justify-between gap-2 bg-canvas-cream px-3 py-2 text-night-soil">
                      <span className="font-display text-base leading-none tracking-[0.08em] uppercase">{s.title}</span>
                      <span className="meta">{s.count}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="lede mt-10 text-canvas-cream/90">Acrylics, watercolours, drawings, word-salad collage and photographs. The gallery is being hung.</p>
          )}

          <div className="mt-auto pt-10">
            <Link
              href="/gallery"
              className="inline-flex h-12 items-center bg-canvas-cream px-6 pt-[3px] font-display text-lg tracking-[0.12em] uppercase text-night-soil transition-colors hover:bg-cadmium-yellow"
            >
              Enter the gallery →
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
