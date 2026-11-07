import Link from "next/link"
import SanityImage from "@/components/sanity/SanityImage"
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
        "group grid gap-6 border-t-2 border-night-soil pt-6",
        featured && post.featuredImage?.asset && "md:grid-cols-[1.2fr_1fr] md:gap-10",
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
            className="transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        </Link>
      )}
      <div className="flex flex-col gap-3">
        <p className="eyebrow text-ink-soft">
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          {post.isFeatured && <span className="ml-3 text-label-red">Featured</span>}
        </p>
        <h3 className={cn("text-foreground", featured ? "display-2" : "display-3")}>
          <Link href={href} className="transition-colors group-hover:text-label-red">
            {post.title}
          </Link>
        </h3>
        {post.excerpt && <p className={cn("font-sans leading-relaxed text-ink-soft", featured ? "body-lg" : "text-[1.05rem]")}>{post.excerpt}</p>}
        {post.categories?.length ? (
          <ul className="flex flex-wrap gap-2">
            {post.categories.map((c) => (
              <li key={c._id}>
                <Link href={`/blog?category=${c.slug.current}`} className="meta border border-night-soil/30 px-2 py-0.5 uppercase text-ink-soft hover:bg-night-soil hover:text-canvas-cream">
                  {c.title}
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </article>
  )
}
