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

/** One door per practice, so the three halves of her work each get a first screen. */
const practices = [
  { label: "The novelist", href: "/books/novels", blurb: "Black Wine to the Isabel mysteries" },
  { label: "The poet", href: "/books/poetry", blurb: "Five collections since 1973" },
  { label: "The painter", href: "/gallery", blurb: "Acrylics, watercolour, collage, photographs" },
  { label: "The editor", href: "/about/freelance", blurb: "Wooden Door & Associates" },
]

export default async function AboutPage() {
  const page = await getPageBySlug("about")

  return (
    <PageShell
      title={page?.title ?? "My Life and Not-So-Hard Times"}
      subtitle="Who is?"
      tone="yellow"
      lead="Novelist, poet, visual artist, editor, publisher, teacher, advocate and arts-community lifer, born in Edmonton and still there."
      aside={
        <div className="flex flex-col gap-10">
          {page?.featuredImage?.asset && (
            <figure>
              <div className="relative">
                <SanityImage image={page.featuredImage} width={640} sizes="(max-width: 1024px) 60vw, 320px" priority className="w-full" />
                <span className="absolute -right-2.5 -bottom-2.5 -z-10 h-full w-full bg-label-red" aria-hidden />
              </div>
              {page.featuredImage.credit && <figcaption className="meta mt-5 text-ink-soft">Photo: {page.featuredImage.credit}</figcaption>}
            </figure>
          )}

          <nav aria-label="Practices">
            <p className="eyebrow mb-3 text-label-red">Four hats</p>
            <ul className="border-t-2 border-night-soil">
              {practices.map((p) => (
                <li key={p.href} className="border-b border-night-soil/20">
                  <Link href={p.href} className="group flex items-baseline justify-between gap-3 py-3">
                    <span>
                      <span className="display-4 block group-hover:text-label-red">{p.label}</span>
                      <span className="font-sans text-base text-ink-soft">{p.blurb}</span>
                    </span>
                    <span className="eyebrow text-ink-soft" aria-hidden>→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {page?.children?.length ? (
            <nav aria-label="More about Candas">
              <p className="eyebrow mb-3 text-label-red">Chapters</p>
              <ul className="border-t-2 border-night-soil">
                {page.children.map((c) => (
                  <li key={c._id} className="border-b border-night-soil/20">
                    <Link href={`/about/${c.slug.current}`} className="display-4 block py-3 hover:text-label-red">
                      {c.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}

          <nav aria-label="Related">
            <p className="eyebrow mb-3 text-label-red">Also</p>
            <ul className="flex flex-col gap-2 font-sans text-[1.05rem]">
              <li><Link href="/about/interests" className="link-ink">Candas-adjacent</Link></li>
              <li><Link href="/about/press" className="link-ink">Press kit (bios &amp; photos)</Link></li>
              <li><Link href="/contact" className="link-ink">Send a message</Link></li>
            </ul>
          </nav>
        </div>
      }
    >
      {page ? (
        <Prose value={page.body} className="body-lg [&>p:first-child]:text-[1.4rem] [&>p:first-child]:leading-[1.45] [&>p:first-child]:text-foreground" />
      ) : (
        <EmptyState title="Biography coming soon" />
      )}
    </PageShell>
  )
}
