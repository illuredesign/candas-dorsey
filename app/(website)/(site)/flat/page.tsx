import type { Metadata } from "next"
import PageShell from "@/components/layout/PageShell"
import Prose from "@/components/sanity/Prose"
import SanityImage from "@/components/sanity/SanityImage"
import EmptyState from "@/components/content/EmptyState"
import { Button } from "@/components/ui/button"
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
      subtitle="Candas @ Art"
      aside={
        flat?.externalUrl ? (
          <div className="border-t-2 border-label-red pt-4">
            <Button variant="dark" asChild>
              <a href={flat.externalUrl} target="_blank" rel="noopener noreferrer">Visit truthandfiction.com ↗</a>
            </Button>
          </div>
        ) : undefined
      }
    >
      {!flat ? (
        <EmptyState title="Details coming soon" />
      ) : (
        <>
          {flat.featuredImage?.asset && (
            <figure className="mb-8">
              <SanityImage image={flat.featuredImage} width={800} priority className="w-full" />
            </figure>
          )}
          <Prose value={flat.description} />
        </>
      )}
    </PageShell>
  )
}
