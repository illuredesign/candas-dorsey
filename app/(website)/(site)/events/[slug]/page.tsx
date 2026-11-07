import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { cache } from "react"
import PageShell from "@/components/layout/PageShell"
import ArtworkCard from "@/components/content/ArtworkCard"
import BookCard from "@/components/content/BookCard"
import SectionHeading from "@/components/content/SectionHeading"
import Prose from "@/components/sanity/Prose"
import SanityImage from "@/components/sanity/SanityImage"
import { Button } from "@/components/ui/button"
import { getEventBySlug, getExhibitionBySlug } from "@/lib/sanity/fetch"
import { buildMetadata } from "@/lib/metadata"
import { formatDateRange, formatEventType } from "@/lib/format"
import { siteName } from "@/lib/site"

type Props = { params: Promise<{ slug: string }> }

/* One route for events and exhibitions; events are looked up first. */
const resolve = cache(async (slug: string) => {
  const event = await getEventBySlug(slug)
  if (event) return { event, exhibition: null }
  const exhibition = await getExhibitionBySlug(slug)
  return { event: null, exhibition }
})

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const { event, exhibition } = await resolve(slug)
  const item = event ?? exhibition
  if (!item) return {}
  const where = event
    ? [event.location?.venue, event.location?.city].filter(Boolean).join(", ")
    : [exhibition?.venue, exhibition?.city].filter(Boolean).join(", ")
  const when = event ? formatDateRange(event.date, event.endDate) : exhibition?.startDate ? formatDateRange(exhibition.startDate, exhibition.endDate) : ""
  return buildMetadata({
    title: item.title,
    description: [when, where].filter(Boolean).join(" · "),
    path: `/events/${slug}`,
    image: item.featuredImage,
  })
}

export default async function EventOrExhibitionPage({ params }: Props) {
  const { slug } = await params
  const { event, exhibition } = await resolve(slug)
  const item = event ?? exhibition
  if (!item) notFound()

  const start = event ? event.date : exhibition?.startDate
  const end = item.endDate
  const venue = event ? event.location?.venue : exhibition?.venue
  const city = event ? event.location?.city : exhibition?.city
  const address = event?.location?.address
  const venueUrl = event?.location?.url
  const kind = event ? (event.eventType ? formatEventType(event.eventType) : "Event") : "Exhibition"

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": exhibition ? "ExhibitionEvent" : "Event",
    name: item.title,
    startDate: start ?? undefined,
    endDate: end ?? undefined,
    location: venue ? { "@type": "Place", name: venue, address: [address, city].filter(Boolean).join(", ") || undefined } : undefined,
    performer: { "@type": "Person", name: siteName },
    url: item.externalUrl ?? undefined,
  }

  return (
    <PageShell
      title={item.title}
      subtitle={kind}
      aside={
        <div className="flex flex-col gap-6">
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 font-sans text-[1.05rem]">
            {start && <><dt className="eyebrow pt-0.5 text-ink-soft">When</dt><dd><time dateTime={start}>{formatDateRange(start, end)}</time></dd></>}
            {venue && <><dt className="eyebrow pt-0.5 text-ink-soft">Where</dt><dd>{venueUrl ? <a href={venueUrl} target="_blank" rel="noopener noreferrer" className="text-label-red">{venue}</a> : venue}{city && <span className="block text-ink-soft">{city}</span>}{address && <span className="block whitespace-pre-line text-ink-soft">{address}</span>}</dd></>}
          </dl>
          {item.externalUrl && (
            <Button variant="dark" asChild>
              <a href={item.externalUrl} target="_blank" rel="noopener noreferrer">Event details / tickets ↗</a>
            </Button>
          )}
        </div>
      }
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {item.featuredImage?.asset && (
        <figure className="mb-8">
          <SanityImage image={item.featuredImage} width={800} priority className="w-full" />
          {item.featuredImage.credit && (
            <figcaption className="mt-2 meta text-ink-soft">Photo: {item.featuredImage.credit}</figcaption>
          )}
        </figure>
      )}
      <Prose value={item.description} />

      {event?.relatedBooks?.length ? (
        <section className="mt-16">
          <SectionHeading title="Featured Books" />
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
            {event.relatedBooks.map((b) => (
              <BookCard key={b._id} book={b} />
            ))}
          </div>
        </section>
      ) : null}

      {exhibition?.artworks?.length ? (
        <section className="mt-16">
          <SectionHeading title="Works in the Show" href="/gallery" linkLabel="Full gallery" />
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-3">
            {exhibition.artworks.map((a) => (
              <ArtworkCard key={a._id} artwork={a} />
            ))}
          </div>
        </section>
      ) : null}

      <p className="mt-12 eyebrow text-ink-soft">
        <Link href="/events" className="hover:text-label-red">← All events</Link>
      </p>
    </PageShell>
  )
}
