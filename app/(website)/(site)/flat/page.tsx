import type { Metadata } from "next"
import PageShell from "@/components/layout/PageShell"
import Prose from "@/components/sanity/Prose"
import SanityImage from "@/components/sanity/SanityImage"
import EmptyState from "@/components/content/EmptyState"
import { getFlatProject } from "@/lib/sanity/fetch"
import { buildMetadata } from "@/lib/metadata"

export const metadata: Metadata = buildMetadata({
  title: "The FLAT Project",
  description: "The FLAT project — a collaborative art and fiction project by Candas Jane Dorsey, at truthandfiction.com.",
  path: "/flat",
})

export default async function FlatPage() {
  const flat = await getFlatProject()
  return (
    <PageShell
      title={flat?.title ?? "The FLAT Project"}
      subtitle="Art · Collaboration"
      tone="ink"
      aside={
        flat?.externalUrl ? (
          <div className="bg-cadmium-yellow p-5 text-night-soil">
            <p className="eyebrow">The project lives at</p>
            <a
              href={flat.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex h-11 items-center bg-night-soil px-5 pt-[3px] font-display text-base tracking-[0.12em] uppercase text-canvas-cream hover:bg-label-red"
            >
              truthandfiction.com ↗
            </a>
          </div>
        ) : undefined
      }
    >
      {!flat ? (
        <EmptyState title="Details coming soon" />
      ) : (
        <>
          {flat.featuredImage?.asset && (
            <figure className="mb-10">
              <SanityImage image={flat.featuredImage} width={1000} priority className="w-full" />
              {(flat.featuredImage.caption || flat.featuredImage.credit) && (
                <figcaption className="meta mt-3 text-ink-soft">
                  {[flat.featuredImage.caption, flat.featuredImage.credit && `Photo: ${flat.featuredImage.credit}`].filter(Boolean).join(" · ")}
                </figcaption>
              )}
            </figure>
          )}
          <Prose value={flat.description} className="body-lg" />
        </>
      )}
    </PageShell>
  )
}
