import type { Metadata } from "next"
import Link from "next/link"
import PageShell from "@/components/layout/PageShell"
import EmptyState from "@/components/content/EmptyState"
import { Badge } from "@/components/ui/badge"
import { getAllWriting } from "@/lib/sanity/fetch"
import { buildMetadata } from "@/lib/metadata"
import { formatWritingKind } from "@/lib/format"

export const metadata: Metadata = buildMetadata({
  title: "Other Writing",
  description: "Short stories, poems, essays and articles by Candas Jane Dorsey — for your reading enjoyment.",
  path: "/writing",
})

export default async function WritingPage() {
  const pieces = await getAllWriting()
  return (
    <PageShell
      title="For Your Reading Enjoyment"
      subtitle="Other Writing"
      lead="Stories, poems and essays that live outside the books — some to read here, some linked to where they were published."
    >
      {pieces.length === 0 ? (
        <EmptyState>Shorter pieces will appear here as they are added.</EmptyState>
      ) : (
        <ul className="divide-y divide-foreground/10 border-y border-foreground/10">
          {pieces.map((p) => {
            const href = p.hasBody ? `/writing/${p.slug.current}` : p.url ?? `/writing/${p.slug.current}`
            const external = !p.hasBody && !!p.url
            return (
              <li key={p._id} className="group grid gap-2 py-5 md:grid-cols-[140px_1fr]">
                <div className="flex flex-col gap-1">
                  <Badge variant="metadata">{formatWritingKind(p.kind)}</Badge>
                  {p.year && <span className="font-mono text-[10px] tracking-[0.1em] text-foreground/40">{p.year}</span>}
                </div>
                <div>
                  <h2 className="font-display text-2xl tracking-[0.04em] text-foreground">
                    {external ? (
                      <a href={href} target="_blank" rel="noopener noreferrer" className="transition-colors group-hover:text-label-red">
                        {p.title} ↗
                      </a>
                    ) : (
                      <Link href={href} className="transition-colors group-hover:text-label-red">
                        {p.title}
                      </Link>
                    )}
                  </h2>
                  {p.publishedIn && (
                    <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-foreground/50">in {p.publishedIn}</p>
                  )}
                  {p.excerpt && <p className="mt-2 max-w-prose font-sans text-base text-foreground/70">{p.excerpt}</p>}
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </PageShell>
  )
}
