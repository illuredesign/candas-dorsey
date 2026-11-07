import type { Metadata } from "next"
import Link from "next/link"
import PageShell from "@/components/layout/PageShell"
import Prose from "@/components/sanity/Prose"
import EmptyState from "@/components/content/EmptyState"
import { Button } from "@/components/ui/button"
import { getPageBySlug, getSiteSettings } from "@/lib/sanity/fetch"
import { buildMetadata } from "@/lib/metadata"

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("freelance")
  return buildMetadata({
    title: page?.title ?? "Wooden Door & Associates",
    description: "Freelance writing, editing and communications by Candas Jane Dorsey — Wooden Door & Associates, since 1991.",
    path: "/about/freelance",
    seo: page?.seo,
  })
}

export default async function FreelancePage() {
  const [page, settings] = await Promise.all([getPageBySlug("freelance"), getSiteSettings()])

  return (
    <PageShell
      title={page?.title ?? "Wooden Door & Associates"}
      subtitle="Freelance writing & editing"
      aside={
        <div className="flex flex-col gap-4 border-t-2 border-label-red pt-4">
          <p className="font-sans text-base text-ink-soft">
            Available for editing, writing, communications planning and workshops.
          </p>
          <Button variant="dark" asChild>
            <Link href="/contact?subject=Freelance%20enquiry">Enquire</Link>
          </Button>
          {settings?.woodenDoorUrl && (
            <a href={settings.woodenDoorUrl} target="_blank" rel="noopener noreferrer" className="eyebrow text-label-red">
              Wooden Door website ↗
            </a>
          )}
        </div>
      }
    >
      {page ? <Prose value={page.body} /> : <EmptyState title="Details coming soon" />}
    </PageShell>
  )
}
