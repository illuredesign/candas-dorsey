import type { Metadata } from "next"
import Link from "next/link"
import PageShell from "@/components/layout/PageShell"
import EmptyState from "@/components/content/EmptyState"
import ArtworkImage from "@/components/content/ArtworkImage"
import { getAllGalleryCategories } from "@/lib/sanity/fetch"
import { buildMetadata } from "@/lib/metadata"

export const metadata: Metadata = buildMetadata({
  title: "Gallery",
  description: "Paintings, drawings, collages and photographs by Candas Jane Dorsey.",
  path: "/gallery",
})

export default async function GalleryPage() {
  const categories = (await getAllGalleryCategories()).filter((c) => c.count > 0 || c.coverImage?.asset)

  return (
    <PageShell
      title="Candas @ Art"
      subtitle="Gallery"
      lead={
        <>
          Acrylics, watercolours, drawings, word-salad collages and more. Some pieces are available —{" "}
          <Link href="/contact" className="text-label-red underline underline-offset-4">get in touch</Link> if one speaks to you.
        </>
      }
      wide
    >
      {categories.length === 0 ? (
        <EmptyState title="The gallery is being hung">Artwork will appear here once it is added in the CMS.</EmptyState>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c, i) => {
            const image = c.coverImage?.asset ? c.coverImage : c.firstArtwork?.image
            return (
              <Link
                key={c._id}
                href={`/gallery/${c.slug.current}`}
                className="group relative block aspect-[4/3] overflow-hidden bg-night-soil"
              >
                {image?.asset ? (
                  <ArtworkImage
                    image={image}
                    width={640}
                    height={480}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    priority={i < 3}
                    className="transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                ) : null}
                <div className="absolute inset-x-0 bottom-0 z-[2] flex items-end justify-between bg-night-soil/85 px-5 py-4">
                  <div>
                    <h2 className="font-display text-2xl tracking-[0.06em] text-canvas-cream">{c.title}</h2>
                    {c.description && <p className="font-mono text-[10px] tracking-[0.1em] text-canvas-cream/60">{c.description}</p>}
                  </div>
                  <span className="font-mono text-[10px] tracking-[0.1em] text-warm-gold">{c.count} {c.count === 1 ? "work" : "works"}</span>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </PageShell>
  )
}
