import type { Metadata } from "next"
import PageShell from "@/components/layout/PageShell"
import Prose from "@/components/sanity/Prose"
import SectionHeading from "@/components/content/SectionHeading"
import EmptyState from "@/components/content/EmptyState"
import { getAllLinks, getPageBySlug } from "@/lib/sanity/fetch"
import { buildMetadata } from "@/lib/metadata"
import { formatLinkGroup } from "@/lib/format"
import type { LinkGroup, LinkItem } from "@/lib/sanity/types"

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("interests")
  return buildMetadata({
    title: page?.title ?? "Candas-Adjacent",
    description: "Other things Candas Jane Dorsey does, and links she likes — community, advocacy, Morris dancing and more.",
    path: "/about/interests",
    seo: page?.seo,
  })
}

const groupOrder: LinkGroup[] = ["community", "morris", "other", "linksILike"]

export default async function InterestsPage() {
  const [page, links] = await Promise.all([getPageBySlug("interests"), getAllLinks()])
  const grouped = new Map<LinkGroup, LinkItem[]>()
  for (const l of links) grouped.set(l.group, [...(grouped.get(l.group) ?? []), l])

  return (
    <PageShell
      title={page?.title ?? "Candas-Adjacent"}
      subtitle="Other things I do"
      lead="A rich exterior life: community work, advocacy, dancing, and the corners of the internet worth your time."
    >
      {page && <Prose value={page.body} className="mb-12" />}

      {links.length === 0 ? (
        <EmptyState title="Links coming soon" />
      ) : (
        groupOrder.map((group) => {
          const items = grouped.get(group)
          if (!items?.length) return null
          return (
            <section key={group} className="mb-12">
              <SectionHeading title={formatLinkGroup(group)} />
              <ul className="grid gap-x-10 gap-y-5 sm:grid-cols-2">
                {items.map((l) => (
                  <li key={l._id} className="border-l-2 border-warm-gold pl-4">
                    <a href={l.url} target="_blank" rel="noopener noreferrer" className="font-display text-xl tracking-[0.04em] text-foreground transition-colors hover:text-label-red">
                      {l.title} ↗
                    </a>
                    {l.description && <p className="mt-1 font-sans text-sm text-foreground/60">{l.description}</p>}
                  </li>
                ))}
              </ul>
            </section>
          )
        })
      )}
    </PageShell>
  )
}
