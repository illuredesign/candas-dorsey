import type { Metadata } from "next"
import Link from "next/link"
import PageShell from "@/components/layout/PageShell"
import EmptyState from "@/components/content/EmptyState"
import Reveal from "@/components/motion/Reveal"
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
      subtitle={`Other writing · ${pieces.length} pieces`}
      lead="Stories, poems and essays that live outside the books. Some to read here, some linked to where they were published."
      tone="blue"
    >
      {pieces.length === 0 ? (
        <EmptyState>Shorter pieces will appear here as they are added.</EmptyState>
      ) : (
        <ol className="border-t-2 border-night-soil">
          {pieces.map((p, i) => {
            const href = p.hasBody ? `/writing/${p.slug.current}` : p.url ?? `/writing/${p.slug.current}`
            const external = !p.hasBody && !!p.url
            return (
              <Reveal as="li" key={p._id} className="group grid gap-3 border-b border-night-soil/20 py-6 md:grid-cols-[72px_160px_1fr] md:gap-6">
                <span className="meta text-ink-mute">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <p className="eyebrow text-label-red">{formatWritingKind(p.kind)}</p>
                  {p.year && <p className="meta mt-1 text-ink-soft">{p.year}</p>}
                </div>
                <div>
                  <h2 className="display-3 text-foreground">
                    {external ? (
                      <a href={href} target="_blank" rel="noopener noreferrer" className="transition-colors group-hover:text-label-red">
                        {p.title} <span className="meta align-middle">↗</span>
                      </a>
                    ) : (
                      <Link href={href} className="transition-colors group-hover:text-label-red">
                        {p.title}
                      </Link>
                    )}
                  </h2>
                  {p.publishedIn && <p className="mt-1 font-sans text-base italic text-ink-soft">in {p.publishedIn}</p>}
                  {p.excerpt && <p className="mt-3 max-w-[60ch] font-sans text-[1.05rem] leading-relaxed text-ink-soft">{p.excerpt}</p>}
                </div>
              </Reveal>
            )
          })}
        </ol>
      )}
    </PageShell>
  )
}
