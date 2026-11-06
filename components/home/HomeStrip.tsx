import Link from "next/link"
import BookCard from "@/components/content/BookCard"
import { toListing } from "@/components/content/EventCard"
import { Badge } from "@/components/ui/badge"
import { getHomeData } from "@/lib/sanity/fetch"
import { formatDate, formatDateRange } from "@/lib/format"

/** "What's new" strip under the hero: latest/upcoming book, next event, latest post. */
export default async function HomeStrip() {
  const { latestBook, upcomingBook, nextEvent, latestPost } = await getHomeData()
  const book = upcomingBook ?? latestBook
  if (!book && !nextEvent && !latestPost) return null
  const ev = nextEvent ? toListing(nextEvent) : null

  return (
    <section className="page-container bg-warm-linen py-14 md:py-20">
      <div className="mx-auto grid w-full max-w-[1100px] gap-12 md:grid-cols-[200px_1fr] lg:grid-cols-[240px_1fr_1fr]">
        {book && (
          <div>
            <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-label-red">
              {upcomingBook ? "Forthcoming" : "Latest book"}
            </p>
            <BookCard book={book} priority />
          </div>
        )}

        <div className="flex flex-col gap-10 lg:col-span-2 lg:grid lg:grid-cols-2 lg:gap-12">
          <div>
            <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-label-red">Next up</p>
            {ev ? (
              <article className="border-t-2 border-night-soil pt-4">
                <Badge variant="metadata">{ev.kind}</Badge>
                <h2 className="mt-2 font-display text-3xl leading-tight tracking-[0.04em]">
                  <Link href={ev.href} className="transition-colors hover:text-label-red">{ev.title}</Link>
                </h2>
                <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.12em] text-foreground/50">
                  {[ev.start && formatDateRange(ev.start, ev.end), ev.place].filter(Boolean).join(" · ")}
                </p>
              </article>
            ) : (
              <p className="border-t-2 border-night-soil pt-4 font-sans text-base italic text-foreground/60">
                No events scheduled. <Link href="/events" className="text-label-red underline underline-offset-4">See past appearances</Link>.
              </p>
            )}
          </div>

          <div>
            <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-label-red">From the blog</p>
            {latestPost ? (
              <article className="border-t-2 border-night-soil pt-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-foreground/50">
                  <time dateTime={latestPost.publishedAt}>{formatDate(latestPost.publishedAt)}</time>
                </p>
                <h2 className="mt-2 font-display text-3xl leading-tight tracking-[0.04em]">
                  <Link href={`/blog/${latestPost.slug.current}`} className="transition-colors hover:text-label-red">{latestPost.title}</Link>
                </h2>
                {latestPost.excerpt && <p className="mt-2 font-sans text-base text-foreground/70">{latestPost.excerpt}</p>}
              </article>
            ) : (
              <p className="border-t-2 border-night-soil pt-4 font-sans text-base italic text-foreground/60">
                Surreptitiously incognito — <Link href="/blog" className="text-label-red underline underline-offset-4">the blog</Link>.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
