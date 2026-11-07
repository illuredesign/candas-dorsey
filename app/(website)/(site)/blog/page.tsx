import type { Metadata } from "next"
import Link from "next/link"
import PageShell from "@/components/layout/PageShell"
import PostCard from "@/components/content/PostCard"
import EmptyState from "@/components/content/EmptyState"
import Reveal from "@/components/motion/Reveal"
import { getAllBlogCategories, getBlogPosts } from "@/lib/sanity/fetch"
import { buildMetadata } from "@/lib/metadata"
import { cn } from "@/lib/utils"

export const metadata: Metadata = buildMetadata({
  title: "Surreptitiously Incognito",
  description: "The blog of Candas Jane Dorsey — news, notes, soap, and the occasional Pomeranian.",
  path: "/blog",
})

type Props = { searchParams: Promise<{ category?: string; q?: string }> }

export default async function BlogPage({ searchParams }: Props) {
  const { category = "", q = "" } = await searchParams
  const query = q.trim().slice(0, 100)
  const [posts, categories] = await Promise.all([
    getBlogPosts({ category, q: query }),
    getAllBlogCategories(),
  ])
  const filtering = !!(category || query)
  const [first, ...rest] = posts

  return (
    <PageShell
      title="Surreptitiously Incognito"
      subtitle="Blog"
      lead="News, notes and digressions. Not always on topic; rarely on schedule."
      tone="ink"
      headerExtra={
        <form action="/blog" method="get" className="flex max-w-md gap-0" role="search">
          {category && <input type="hidden" name="category" value={category} />}
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Search posts…"
            aria-label="Search posts"
            className="h-11 min-w-0 flex-1 border-2 border-canvas-cream bg-transparent px-4 font-sans text-[1.05rem] text-canvas-cream placeholder:text-cream-mute focus:outline-none focus-visible:bg-canvas-cream focus-visible:text-night-soil"
          />
          <button type="submit" className="h-11 bg-cadmium-yellow px-5 pt-[3px] font-display text-base tracking-[0.12em] uppercase text-night-soil hover:bg-canvas-cream">
            Search
          </button>
        </form>
      }
      aside={
        categories.length > 0 ? (
          <nav aria-label="Categories">
            <p className="eyebrow mb-3 text-label-red">Categories</p>
            <ul className="border-t-2 border-night-soil">
              <li className="border-b border-night-soil/20">
                <Link href={query ? `/blog?q=${encodeURIComponent(query)}` : "/blog"} className={cn("flex justify-between py-2.5 font-sans text-[1.05rem] hover:text-label-red", !category ? "text-label-red" : "text-foreground")}>
                  All posts
                </Link>
              </li>
              {categories.map((c) => (
                <li key={c._id} className="border-b border-night-soil/20">
                  <Link
                    href={`/blog?category=${c.slug.current}${query ? `&q=${encodeURIComponent(query)}` : ""}`}
                    className={cn("flex justify-between py-2.5 font-sans text-[1.05rem] hover:text-label-red", category === c.slug.current ? "text-label-red" : "text-foreground")}
                  >
                    {c.title} <span className="meta text-ink-soft">{c.count ?? 0}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ) : undefined
      }
    >
      {filtering && (
        <p className="eyebrow mb-8 text-ink-soft">
          {posts.length} {posts.length === 1 ? "post" : "posts"}
          {query && <> matching “{query}”</>}
          {category && <> in {categories.find((c) => c.slug.current === category)?.title ?? category}</>}
          {" · "}
          <Link href="/blog" className="link-ink text-label-red">Clear</Link>
        </p>
      )}

      {posts.length === 0 ? (
        <EmptyState title={filtering ? "No posts match" : "Nothing posted yet"}>
          {filtering ? "Try a different search or category." : "Posts will appear here once published."}
        </EmptyState>
      ) : (
        <div className="flex flex-col gap-14">
          <Reveal>
            <PostCard post={first} featured={!filtering} />
          </Reveal>
          {rest.length > 0 && (
            <div className="grid gap-12 md:grid-cols-2">
              {rest.map((p, i) => (
                <Reveal key={p._id} delay={(i % 2) * 0.06}>
                  <PostCard post={p} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      )}
    </PageShell>
  )
}
