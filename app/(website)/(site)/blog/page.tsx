import type { Metadata } from "next"
import Link from "next/link"
import PageShell from "@/components/layout/PageShell"
import PostCard from "@/components/content/PostCard"
import EmptyState from "@/components/content/EmptyState"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
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
      aside={
        <div className="flex flex-col gap-8">
          <form action="/blog" method="get" className="flex gap-2">
            {category && <input type="hidden" name="category" value={category} />}
            <Input type="search" name="q" defaultValue={query} placeholder="Search posts…" aria-label="Search posts" />
            <Button type="submit" variant="dark" size="default">Go</Button>
          </form>

          {categories.length > 0 && (
            <nav aria-label="Categories">
              <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-label-red">Categories</p>
              <ul className="flex flex-wrap gap-2 lg:flex-col lg:gap-1">
                <li>
                  <Link href={query ? `/blog?q=${encodeURIComponent(query)}` : "/blog"} className={cn("font-sans text-sm hover:text-label-red", !category ? "text-label-red" : "text-foreground/70")}>
                    All posts
                  </Link>
                </li>
                {categories.map((c) => (
                  <li key={c._id}>
                    <Link
                      href={`/blog?category=${c.slug.current}${query ? `&q=${encodeURIComponent(query)}` : ""}`}
                      className={cn("font-sans text-sm hover:text-label-red", category === c.slug.current ? "text-label-red" : "text-foreground/70")}
                    >
                      {c.title} <span className="font-mono text-[10px] text-foreground/40">({c.count ?? 0})</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      }
    >
      {filtering && (
        <p className="mb-6 font-mono text-[10px] uppercase tracking-[0.15em] text-foreground/50">
          {posts.length} {posts.length === 1 ? "post" : "posts"}
          {query && <> matching “{query}”</>}
          {category && <> in {categories.find((c) => c.slug.current === category)?.title ?? category}</>}
          {" · "}
          <Link href="/blog" className="text-label-red">Clear</Link>
        </p>
      )}

      {posts.length === 0 ? (
        <EmptyState title={filtering ? "No posts match" : "Nothing posted yet"}>
          {filtering ? "Try a different search or category." : "Posts will appear here once published."}
        </EmptyState>
      ) : (
        <div className="flex flex-col gap-12">
          <PostCard post={first} featured={!filtering} />
          {rest.length > 0 && (
            <div className="grid gap-10 md:grid-cols-2">
              {rest.map((p) => (
                <PostCard key={p._id} post={p} />
              ))}
            </div>
          )}
        </div>
      )}
    </PageShell>
  )
}
