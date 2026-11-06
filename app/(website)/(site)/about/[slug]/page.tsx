import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { cache } from "react"
import PageShell from "@/components/layout/PageShell"
import Prose from "@/components/sanity/Prose"
import SanityImage from "@/components/sanity/SanityImage"
import { getPageBySlug } from "@/lib/sanity/fetch"
import { buildMetadata } from "@/lib/metadata"

type Props = { params: Promise<{ slug: string }> }
const getPage = cache((slug: string) => getPageBySlug(slug))

/** Sub-pages of the biography, e.g. /about/my-past-as-a-newspaper. */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const page = await getPage(slug)
  if (!page) return {}
  return buildMetadata({ title: page.title, path: `/about/${slug}`, image: page.featuredImage, seo: page.seo })
}

export default async function AboutSubPage({ params }: Props) {
  const { slug } = await params
  const page = await getPage(slug)
  if (!page) notFound()
  const parentHref = page.parent ? `/about${page.parent.slug.current === "about" ? "" : `/${page.parent.slug.current}`}` : "/about"

  return (
    <PageShell title={page.title} subtitle={page.parent?.title ?? "About"}>
      {page.featuredImage?.asset && (
        <figure className="mb-8">
          <SanityImage image={page.featuredImage} width={800} priority className="w-full" />
          {page.featuredImage.credit && (
            <figcaption className="mt-2 font-mono text-[10px] tracking-[0.08em] text-foreground/50">Photo: {page.featuredImage.credit}</figcaption>
          )}
        </figure>
      )}
      <Prose value={page.body} />
      <p className="mt-12 font-mono text-[10px] uppercase tracking-[0.15em] text-foreground/50">
        <Link href={parentHref} className="hover:text-label-red">← {page.parent?.title ?? "About"}</Link>
      </p>
    </PageShell>
  )
}
