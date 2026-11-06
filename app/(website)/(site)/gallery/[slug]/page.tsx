import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { cache } from "react"
import PageShell from "@/components/layout/PageShell"
import ArtworkCard from "@/components/content/ArtworkCard"
import ArtworkImage from "@/components/content/ArtworkImage"
import EmptyState from "@/components/content/EmptyState"
import SectionHeading from "@/components/content/SectionHeading"
import Prose from "@/components/sanity/Prose"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getArtworkBySlug, getGalleryCategoryBySlug } from "@/lib/sanity/fetch"
import { buildMetadata } from "@/lib/metadata"
import { formatArtworkStatus, formatPrice } from "@/lib/format"

type Props = { params: Promise<{ slug: string }> }

/*
 * /gallery/acrylic-paintings → category grid
 * /gallery/unsettled-day     → artwork detail
 * Categories are checked first, so category slugs are effectively reserved.
 */
const resolve = cache(async (slug: string) => {
  const category = await getGalleryCategoryBySlug(slug)
  if (category) return { category, artwork: null }
  const artwork = await getArtworkBySlug(slug)
  return { category: null, artwork }
})

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const { category, artwork } = await resolve(slug)
  if (category) {
    return buildMetadata({
      title: category.title,
      description: category.description ?? `${category.title} by Candas Jane Dorsey.`,
      path: `/gallery/${slug}`,
      image: category.artworks[0]?.image,
    })
  }
  if (!artwork) return {}
  return buildMetadata({
    title: artwork.title,
    description: [artwork.medium, artwork.dimensions, artwork.year].filter(Boolean).join(" · ") + " — artwork by Candas Jane Dorsey.",
    path: `/gallery/${slug}`,
    image: artwork.image,
  })
}

export default async function GallerySlugPage({ params }: Props) {
  const { slug } = await params
  const { category, artwork } = await resolve(slug)

  if (category) {
    return (
      <PageShell title={category.title} subtitle="Gallery" lead={category.description} wide>
        {category.artworks.length === 0 ? (
          <EmptyState title="Nothing hung here yet" />
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {category.artworks.map((a, i) => (
              <ArtworkCard key={a._id} artwork={a} priority={i < 3} />
            ))}
          </div>
        )}
        <p className="mt-12 font-mono text-[10px] uppercase tracking-[0.15em] text-foreground/50">
          <Link href="/gallery" className="hover:text-label-red">← All categories</Link>
        </p>
      </PageShell>
    )
  }

  if (!artwork) notFound()

  const available = artwork.status === "available"

  return (
    <PageShell
      title={artwork.title}
      subtitle={artwork.category ? artwork.category.title : "Artwork"}
      aside={
        <div className="flex flex-col gap-6">
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 font-mono text-[11px] tracking-[0.06em]">
            {artwork.medium && <><dt className="uppercase text-foreground/40">Medium</dt><dd>{artwork.medium}</dd></>}
            {artwork.dimensions && <><dt className="uppercase text-foreground/40">Size</dt><dd>{artwork.dimensions}</dd></>}
            {artwork.year && <><dt className="uppercase text-foreground/40">Year</dt><dd>{artwork.year}</dd></>}
            {artwork.series && <><dt className="uppercase text-foreground/40">Series</dt><dd>{artwork.series}</dd></>}
            {artwork.status && <><dt className="uppercase text-foreground/40">Status</dt><dd>{formatArtworkStatus(artwork.status)}</dd></>}
          </dl>

          {available ? (
            <div className="border-t-2 border-emerald-green pt-4">
              {artwork.price ? (
                <p className="font-display text-3xl tracking-[0.04em] text-foreground">{formatPrice(artwork.price)}</p>
              ) : null}
              <p className="mt-1 mb-4 font-sans text-sm text-foreground/60">
                This piece is available. Shipping is arranged per order.
              </p>
              <Button variant="dark" asChild>
                <Link href={`/contact?subject=${encodeURIComponent(`Enquiry: ${artwork.title}`)}`}>Enquire about this piece</Link>
              </Button>
            </div>
          ) : (
            <p className="font-sans text-sm italic text-foreground/50">
              Not currently for sale. <Link href="/contact" className="text-label-red underline underline-offset-4">Ask about prints or similar work.</Link>
            </p>
          )}

          {artwork.image?.credit && (
            <p className="font-mono text-[9px] tracking-[0.1em] text-foreground/40">Photo: {artwork.image.credit}</p>
          )}
        </div>
      }
    >
      <figure className="mb-8">
        <ArtworkImage
          image={artwork.image}
          watermark={artwork.watermarkImage !== false}
          width={900}
          sizes="(max-width: 1024px) 100vw, 760px"
          priority
          className="w-full bg-warm-linen"
        />
        {artwork.image?.caption && (
          <figcaption className="mt-2 font-mono text-[10px] tracking-[0.08em] text-foreground/50">{artwork.image.caption}</figcaption>
        )}
      </figure>

      {available && <Badge className="mb-6 bg-emerald-green text-night-soil">Available</Badge>}

      <Prose value={artwork.description} />

      {artwork.siblings?.length ? (
        <section className="mt-16">
          <SectionHeading
            title={`More ${artwork.category?.title ?? "work"}`}
            href={artwork.category ? `/gallery/${artwork.category.slug.current}` : "/gallery"}
          />
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-3">
            {artwork.siblings.map((a) => (
              <ArtworkCard key={a._id} artwork={a} />
            ))}
          </div>
        </section>
      ) : null}
    </PageShell>
  )
}
