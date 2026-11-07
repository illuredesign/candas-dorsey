import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { cache } from "react"
import PageShell from "@/components/layout/PageShell"
import ArtworkCard from "@/components/content/ArtworkCard"
import ArtworkImage from "@/components/content/ArtworkImage"
import ArtworkViewer from "@/components/content/ArtworkViewer"
import EmptyState from "@/components/content/EmptyState"
import SectionHeading from "@/components/content/SectionHeading"
import Reveal from "@/components/motion/Reveal"
import Prose from "@/components/sanity/Prose"
import { getArtworkBySlug, getGalleryCategoryBySlug } from "@/lib/sanity/fetch"
import { buildMetadata } from "@/lib/metadata"
import { formatArtworkStatus, formatPrice } from "@/lib/format"
import { cn } from "@/lib/utils"

type Props = { params: Promise<{ slug: string }> }

/*
 * /gallery/acrylic-paintings → series grid
 * /gallery/unsettled-day     → artwork detail
 * Series are checked first, so series slugs are effectively reserved.
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
    const works = category.artworks
    const years = works.map((a) => Number(a.year)).filter((y) => !Number.isNaN(y))
    const range = years.length ? `${Math.min(...years)}–${Math.max(...years)}` : null
    const available = works.filter((a) => a.status === "available").length
    return (
      <PageShell
        title={category.title}
        subtitle={[`Series · ${works.length} ${works.length === 1 ? "work" : "works"}`, range, available ? `${available} available` : null].filter(Boolean).join(" · ")}
        lead={category.description}
        wide
        headerExtra={
          <Link href="/gallery" className="eyebrow link-ink text-ink-soft hover:text-label-red">
            ← All series
          </Link>
        }
      >
        {works.length === 0 ? (
          <EmptyState title="Nothing hung here yet" />
        ) : (
          <div className="masonry">
            {works.map((a, i) => (
              <Reveal key={a._id} delay={(i % 3) * 0.05}>
                <ArtworkCard artwork={a} priority={i < 3} intrinsic />
              </Reveal>
            ))}
          </div>
        )}
      </PageShell>
    )
  }

  if (!artwork) notFound()

  const available = artwork.status === "available"
  const seriesHref = artwork.category ? `/gallery/${artwork.category.slug.current}` : "/gallery"
  const position = artwork.position && artwork.total ? `${String(artwork.position).padStart(2, "0")} / ${String(artwork.total).padStart(2, "0")}` : null

  return (
    <>
      {/* Breadcrumb + position */}
      <div className="container-x flex flex-wrap items-center justify-between gap-3 border-b border-night-soil/15 py-3">
        <p className="eyebrow text-ink-soft">
          <Link href="/gallery" className="hover:text-label-red">Gallery</Link>
          <span className="mx-2" aria-hidden>/</span>
          {artwork.category ? (
            <Link href={seriesHref} className="hover:text-label-red">{artwork.category.title}</Link>
          ) : (
            "Artwork"
          )}
        </p>
        {position && <p className="meta text-ink-soft">{position}</p>}
      </div>

      <article className="container-x grid gap-10 py-10 lg:grid-cols-12 lg:gap-12 lg:py-14">
        <div className="lg:col-span-8">
          <ArtworkViewer image={artwork.image} title={artwork.title} watermark={artwork.watermarkImage !== false} caption={artwork.image?.caption} />
        </div>

        <aside className="flex flex-col gap-8 lg:col-span-4 lg:sticky lg:top-24 lg:self-start">
          <div>
            <h1 className="display-1 text-foreground">{artwork.title}</h1>
            <p className="body-lg mt-3 text-ink-soft">
              {artwork.dimensions && <span>{artwork.dimensions} · </span>}
              {artwork.medium && <em>{artwork.medium}</em>}
              {artwork.year && <span> · {artwork.year}</span>}
            </p>
          </div>

          <dl className="grid grid-cols-[110px_1fr] gap-x-4 gap-y-2 border-t-2 border-night-soil pt-4">
            {artwork.series && (<><dt className="eyebrow pt-0.5 text-ink-soft">Series</dt><dd className="font-sans text-[1.05rem]">{artwork.series}</dd></>)}
            {artwork.category && (<><dt className="eyebrow pt-0.5 text-ink-soft">Collection</dt><dd className="font-sans text-[1.05rem]"><Link href={seriesHref} className="link-ink">{artwork.category.title}</Link></dd></>)}
            {artwork.status && (<><dt className="eyebrow pt-0.5 text-ink-soft">Status</dt><dd className={cn("font-sans text-[1.05rem]", available && "text-emerald-green font-semibold")}>{formatArtworkStatus(artwork.status)}</dd></>)}
            {available && artwork.price ? (<><dt className="eyebrow pt-0.5 text-ink-soft">Price</dt><dd className="font-display text-2xl tracking-[0.04em]">{formatPrice(artwork.price)}</dd></>) : null}
          </dl>

          {available ? (
            <div className="bg-emerald-green p-5 text-night-soil">
              <p className="font-sans text-[1.05rem] leading-snug">This piece is available. Shipping is arranged per order.</p>
              <Link
                href={`/contact?subject=${encodeURIComponent(`Enquiry: ${artwork.title}`)}`}
                className="mt-4 inline-flex h-11 items-center bg-night-soil px-5 pt-[3px] font-display text-base tracking-[0.12em] uppercase text-canvas-cream hover:bg-label-red"
              >
                Enquire about this piece
              </Link>
            </div>
          ) : (
            <p className="font-sans text-[1.05rem] leading-snug text-ink-soft">
              Not currently for sale.{" "}
              <Link href={`/contact?subject=${encodeURIComponent(`About: ${artwork.title}`)}`} className="link-ink text-label-red">
                Ask about prints or similar work.
              </Link>
            </p>
          )}

          {artwork.description?.length ? <Prose value={artwork.description} className="prose-sm" /> : null}

          {artwork.image?.credit && <p className="meta text-ink-soft">Photo: {artwork.image.credit}</p>}

          {/* Prev / next within the series */}
          {(artwork.prev || artwork.next) && (
            <nav aria-label="Within this series" className="grid grid-cols-2 gap-3 border-t-2 border-night-soil pt-4">
              {artwork.prev ? (
                <Link href={`/gallery/${artwork.prev.slug.current}`} className="group flex items-center gap-3">
                  <span className="relative block size-14 shrink-0 overflow-hidden bg-warm-linen">
                    <ArtworkImage image={artwork.prev.image} width={112} height={112} fill sizes="56px" watermark={false} />
                  </span>
                  <span className="min-w-0">
                    <span className="eyebrow block text-ink-soft">← Previous</span>
                    <span className="block truncate font-display text-lg tracking-[0.04em] group-hover:text-label-red">{artwork.prev.title}</span>
                  </span>
                </Link>
              ) : <span />}
              {artwork.next ? (
                <Link href={`/gallery/${artwork.next.slug.current}`} className="group flex items-center justify-end gap-3 text-right">
                  <span className="min-w-0">
                    <span className="eyebrow block text-ink-soft">Next →</span>
                    <span className="block truncate font-display text-lg tracking-[0.04em] group-hover:text-label-red">{artwork.next.title}</span>
                  </span>
                  <span className="relative block size-14 shrink-0 overflow-hidden bg-warm-linen">
                    <ArtworkImage image={artwork.next.image} width={112} height={112} fill sizes="56px" watermark={false} />
                  </span>
                </Link>
              ) : <span />}
            </nav>
          )}
        </aside>
      </article>

      {artwork.siblings?.length ? (
        <section className="container-x border-t-2 border-night-soil py-14">
          <SectionHeading title={`More ${artwork.category?.title ?? "work"}`} href={seriesHref} linkLabel="Whole series" />
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-3">
            {artwork.siblings.map((a) => (
              <ArtworkCard key={a._id} artwork={a} />
            ))}
          </div>
        </section>
      ) : null}
    </>
  )
}
