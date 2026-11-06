import Link from "next/link"
import SanityImage from "@/components/sanity/SanityImage"
import { Badge } from "@/components/ui/badge"
import type { PostCard as PostCardType } from "@/lib/sanity/types"
import { formatDate } from "@/lib/format"
import { cn } from "@/lib/utils"

export default function PostCard({
  post,
  featured,
  className,
}: {
  post: PostCardType
  featured?: boolean
  className?: string
}) {
  const href = `/blog/${post.slug.current}`
  return (
    <article
      className={cn(
        "group grid gap-5 border-t-2 border-label-red pt-5",
        featured && post.featuredImage?.asset && "md:grid-cols-[1.2fr_1fr]",
        className,
      )}
    >
      {post.featuredImage?.asset && (
        <Link href={href} className="relative block aspect-[16/10] overflow-hidden bg-warm-linen">
          <SanityImage
            image={post.featuredImage}
            width={720}
            height={450}
            fill
            sizes="(max-width: 768px) 100vw, 560px"
            className="transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </Link>
      )}
      <div className="flex flex-col gap-3">
        <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-foreground/50">
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          {post.isFeatured && <span className="ml-3 text-label-red">Featured</span>}
        </p>
        <h3 className={cn("font-display tracking-[0.04em] leading-tight text-foreground", featured ? "text-3xl md:text-4xl" : "text-2xl")}>
          <Link href={href} className="transition-colors group-hover:text-label-red">
            {post.title}
          </Link>
        </h3>
        {post.excerpt && <p className="font-sans text-base leading-relaxed text-foreground/70">{post.excerpt}</p>}
        {post.categories?.length ? (
          <div className="flex flex-wrap gap-1.5">
            {post.categories.map((c) => (
              <Badge key={c._id} variant="metadata" asChild>
                <Link href={`/blog?category=${c.slug.current}`}>{c.title}</Link>
              </Badge>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  )
}
