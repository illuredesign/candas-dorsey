import type { Metadata } from "next"
import Link from "next/link"
import PageShell from "@/components/layout/PageShell"
import EmptyState from "@/components/content/EmptyState"
import ArtworkImage from "@/components/content/ArtworkImage"
import Reveal from "@/components/motion/Reveal"
import { getAllGalleryCategories } from "@/lib/sanity/fetch"
import { buildMetadata } from "@/lib/metadata"
import { cn } from "@/lib/utils"

export const metadata: Metadata = buildMetadata({
  title: "Gallery",
  description: "Paintings, drawings, collages and photographs by Candas Jane Dorsey.",
  path: "/gallery",
})

function yearRange(years?: (string | null)[] | null) {
  const ys = (years ?? []).map((y) => Number(y)).filter((y) => !Number.isNaN(y))
  if (!ys.length) return null
  const min = Math.min(...ys)
  const max = Math.max(...ys)
  return min === max ? String(min) : `${min}–${String(max).slice(-2)}`
}

export default async function GalleryPage() {
  const categories = (await getAllGalleryCategories()).filter((c) => c.count > 0 || c.coverImage?.asset)
  const total = categories.reduce((n, c) => n + c.count, 0)

  return (
    <PageShell
      title="The Gallery"
      subtitle={total ? `Art · ${total} works in ${categories.length} series` : "Art"}
      lead={
        <>
          Acrylics, watercolours, drawings, word-salad collage and photographs, hung by series. Some pieces are available;{" "}
          <Link href="/contact" className="link-ink text-label-red">get in touch</Link> if one speaks to you.
        </>
      }
      tone="blue"
      wide
    >
      {categories.length === 0 ? (
        <EmptyState title="The gallery is being hung">Artwork will appear here once it is added in the Studio.</EmptyState>
      ) : (
        <ul className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c, i) => {
            const image = c.coverImage?.asset ? c.coverImage : c.firstArtwork?.image
            const extras = (c.preview ?? []).filter((p) => p.image?.asset).slice(1, 3)
            const range = yearRange(c.years)
            const big = i === 0
            return (
              <Reveal as="li" key={c._id} delay={(i % 3) * 0.06} className={cn(big && "sm:col-span-2 lg:col-span-2")}>
                <Link href={`/gallery/${c.slug.current}`} className="group block">
                  <div className={cn("relative overflow-hidden bg-night-soil", big ? "aspect-[16/9]" : "aspect-[4/3]")}>
                    {image?.asset ? (
                      <ArtworkImage
                        image={image}
                        width={big ? 1200 : 720}
                        height={big ? 675 : 540}
                        fill
                        sizes={big ? "(max-width: 1024px) 100vw, 66vw" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"}
                        priority={i < 3}
                        className="transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                      />
                    ) : null}
                    {extras.length > 0 && (
                      <div className="absolute right-3 bottom-3 z-[2] hidden gap-2 sm:flex">
                        {extras.map((p) => (
                          <span key={p._id} className="relative block size-16 overflow-hidden border-2 border-canvas-cream bg-night-soil">
                            <ArtworkImage image={p.image} width={128} height={128} fill sizes="64px" watermark={false} />
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-start justify-between gap-4 border-t-2 border-night-soil pt-3">
                    <div>
                      <h2 className="display-3 text-foreground group-hover:text-label-red">{c.title}</h2>
                      {c.description && <p className="mt-1 max-w-[46ch] font-sans text-base leading-snug text-ink-soft">{c.description}</p>}
                    </div>
                    <p className="meta shrink-0 pt-1 text-right text-ink-soft">
                      {c.count} {c.count === 1 ? "work" : "works"}
                      {range && (
                        <>
                          <br />
                          {range}
                        </>
                      )}
                    </p>
                  </div>
                </Link>
              </Reveal>
            )
          })}
        </ul>
      )}
    </PageShell>
  )
}
