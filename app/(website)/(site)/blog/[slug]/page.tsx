import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { cache } from "react"
import PageShell from "@/components/layout/PageShell"
import Prose from "@/components/sanity/Prose"
import SanityImage from "@/components/sanity/SanityImage"
import { Badge } from "@/components/ui/badge"
import { getBlogPostBySlug } from "@/lib/sanity/fetch"
import { buildMetadata } from "@/lib/metadata"
import { formatDate } from "@/lib/format"
import { siteName, siteUrl } from "@/lib/site"

type Props = { params: Promise<{ slug: string }> }
const getPost = cache((slug: string) => getBlogPostBySlug(slug))

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return {}
  return buildMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${slug}`,
    image: post.featuredImage,
    seo: post.seo,
    type: "article",
  })
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    datePublished: post.publishedAt,
    author: { "@type": "Person", name: siteName, url: siteUrl },
    url: `${siteUrl}/blog/${slug}`,
    description: post.excerpt ?? undefined,
  }

  return (
    <PageShell title={post.title} subtitle={formatDate(post.publishedAt)}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article className="mx-auto max-w-prose">
        {post.categories?.length ? (
          <div className="mb-6 flex flex-wrap gap-1.5">
            {post.categories.map((c) => (
              <Badge key={c._id} variant="metadata" asChild>
                <Link href={`/blog?category=${c.slug.current}`}>{c.title}</Link>
              </Badge>
            ))}
          </div>
        ) : null}
        {post.featuredImage?.asset && (
          <figure className="mb-8">
            <SanityImage image={post.featuredImage} width={800} priority className="w-full" />
            {(post.featuredImage.caption || post.featuredImage.credit) && (
              <figcaption className="mt-2 font-mono text-[10px] tracking-[0.08em] text-foreground/50">
                {[post.featuredImage.caption, post.featuredImage.credit].filter(Boolean).join(" · ")}
              </figcaption>
            )}
          </figure>
        )}
        <Prose value={post.body} />
      </article>
      <p className="mx-auto mt-12 max-w-prose font-mono text-[10px] uppercase tracking-[0.15em] text-foreground/50">
        <Link href="/blog" className="hover:text-label-red">← All posts</Link>
      </p>
    </PageShell>
  )
}
