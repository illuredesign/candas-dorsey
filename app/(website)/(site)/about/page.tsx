import type { Metadata } from "next"
import Link from "next/link"
import PageShell from "@/components/layout/PageShell"
import Prose from "@/components/sanity/Prose"
import SanityImage from "@/components/sanity/SanityImage"
import EmptyState from "@/components/content/EmptyState"
import { getPageBySlug } from "@/lib/sanity/fetch"
import { buildMetadata } from "@/lib/metadata"

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("about")
  return buildMetadata({
    title: page?.title ?? "About",
    description: "Who is Candas Jane Dorsey? Novelist, poet, visual artist, editor, publisher, teacher and advocate from Edmonton, Alberta.",
    path: "/about",
    image: page?.featuredImage,
    seo: page?.seo,
  })
}

export default async function AboutPage() {
  const page = await getPageBySlug("about")

  return (
    <PageShell
      title={page?.title ?? "My Life and Not-So-Hard Times"}
      subtitle="Who is?"
      aside={
        <div className="flex flex-col gap-8">
          {page?.featuredImage?.asset && (
            <figure>
              <SanityImage image={page.featuredImage} width={320} sizes="(max-width: 1024px) 60vw, 320px" priority className="w-full max-w-[320px]" />
              {page.featuredImage.credit && (
                <figcaption className="mt-2 font-mono text-[9px] tracking-[0.1em] text-foreground/40">Photo: {page.featuredImage.credit}</figcaption>
              )}
            </figure>
          )}
          {page?.children?.length ? (
            <nav aria-label="More about Candas">
              <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-label-red">Chapters</p>
              <ul className="flex flex-col divide-y divide-foreground/10 border-y border-foreground/10">
                {page.children.map((c) => (
                  <li key={c._id}>
                    <Link href={`/about/${c.slug.current}`} className="block py-2.5 font-display text-lg tracking-[0.04em] text-foreground transition-colors hover:text-label-red">
                      {c.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
          <nav aria-label="Related">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-label-red">Also</p>
            <ul className="flex flex-col gap-2 font-sans text-sm">
              <li><Link href="/about/freelance" className="text-foreground/70 hover:text-label-red">Wooden Door &amp; Associates</Link></li>
              <li><Link href="/about/interests" className="text-foreground/70 hover:text-label-red">Candas-adjacent</Link></li>
              <li><Link href="/about/press" className="text-foreground/70 hover:text-label-red">Press kit (bios &amp; photos)</Link></li>
              <li><Link href="/contact" className="text-foreground/70 hover:text-label-red">Send a message</Link></li>
            </ul>
          </nav>
        </div>
      }
    >
      {page ? <Prose value={page.body} /> : <EmptyState title="Biography coming soon" />}
    </PageShell>
  )
}
