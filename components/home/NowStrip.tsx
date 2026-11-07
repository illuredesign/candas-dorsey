import Link from "next/link"
import Reveal from "@/components/motion/Reveal"
import { toListing } from "@/components/content/EventCard"
import type { EventCard, ExhibitionCard, PostCard } from "@/lib/sanity/types"
import { formatDate, formatDateRange } from "@/lib/format"

/** Three flat panels: next event, next exhibition, latest post. */
export default function NowStrip({
  nextEvent,
  nextExhibition,
  latestPost,
}: {
  nextEvent?: EventCard | null
  nextExhibition?: ExhibitionCard | null
  latestPost?: PostCard | null
}) {
  const ev = nextEvent ? toListing(nextEvent) : null
  const ex = nextExhibition ? toListing(nextExhibition) : null

  return (
    <section className="band border-b-2 border-night-soil" aria-label="What's on">
      <div className="grid md:grid-cols-3">
        <Reveal className="border-b-2 border-night-soil bg-cadmium-yellow p-8 text-night-soil md:border-r-2 md:border-b-0 md:p-10">
          <p className="eyebrow">Next appearance</p>
          {ev ? (
            <>
              <p className="display-1 mt-6">{new Date(ev.start!).toLocaleDateString("en-CA", { day: "numeric" })}</p>
              <p className="eyebrow">{new Date(ev.start!).toLocaleDateString("en-CA", { month: "long", year: "numeric" })}</p>
              <h3 className="display-3 mt-6">
                <Link href={ev.href} className="hover:text-label-red">{ev.title}</Link>
              </h3>
              <p className="meta mt-2 text-night-soil/80">{[ev.kind, ev.place].filter(Boolean).join(" · ")}</p>
            </>
          ) : (
            <>
              <p className="display-3 mt-6 max-w-[16ch]">Nothing on the calendar just now.</p>
              <Link href="/events" className="eyebrow link-ink mt-6 inline-block">Past appearances →</Link>
            </>
          )}
        </Reveal>

        <Reveal delay={0.08} className="border-b-2 border-night-soil bg-canvas-cream p-8 text-night-soil md:border-r-2 md:border-b-0 md:p-10">
          <p className="eyebrow text-label-red">On the walls</p>
          {ex ? (
            <>
              <h3 className="display-3 mt-6">
                <Link href={ex.href} className="hover:text-label-red">{ex.title}</Link>
              </h3>
              <p className="meta mt-3 text-ink-soft">{[ex.start && formatDateRange(ex.start, ex.end), ex.place].filter(Boolean).join(" · ")}</p>
            </>
          ) : (
            <>
              <p className="display-3 mt-6 max-w-[16ch]">No exhibition up right now.</p>
              <Link href="/gallery" className="eyebrow link-ink mt-6 inline-block text-label-red">Visit the gallery instead →</Link>
            </>
          )}
        </Reveal>

        <Reveal delay={0.16} className="bg-night-soil p-8 text-canvas-cream md:p-10">
          <p className="eyebrow text-cadmium-yellow">From the blog</p>
          {latestPost ? (
            <>
              <p className="meta mt-6 text-cream-mute">
                <time dateTime={latestPost.publishedAt}>{formatDate(latestPost.publishedAt)}</time>
              </p>
              <h3 className="display-3 mt-2">
                <Link href={`/blog/${latestPost.slug.current}`} className="hover:text-cadmium-yellow">{latestPost.title}</Link>
              </h3>
              {latestPost.excerpt && <p className="mt-3 line-clamp-3 font-sans text-base text-cream-soft">{latestPost.excerpt}</p>}
            </>
          ) : (
            <>
              <p className="display-3 mt-6 max-w-[16ch]">Surreptitiously incognito.</p>
              <Link href="/blog" className="eyebrow link-ink mt-6 inline-block text-cadmium-yellow">Read the blog →</Link>
            </>
          )}
        </Reveal>
      </div>
    </section>
  )
}
