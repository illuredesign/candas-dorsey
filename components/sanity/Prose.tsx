import { PortableText, type PortableTextComponents } from "@portabletext/react"
import type { PortableTextBlock } from "@portabletext/types"
import SanityImage from "./SanityImage"
import { cn } from "@/lib/utils"

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p>{children}</p>,
    h2: ({ children }) => (
      <h2 className="mt-10 mb-4 font-display text-3xl tracking-[0.04em] text-foreground first:mt-0">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-8 mb-3 font-display text-2xl tracking-[0.04em] text-foreground">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="mt-6 mb-2 font-mono text-xs uppercase tracking-[0.15em] text-label-red">{children}</h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-6 border-l-4 border-label-red pl-5 text-lg italic text-foreground/80">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="my-4 list-disc space-y-1 pl-6">{children}</ul>,
    number: ({ children }) => <ol className="my-4 list-decimal space-y-1 pl-6">{children}</ol>,
  },
  marks: {
    link: ({ value, children }) => {
      const href: string = value?.href ?? "#"
      const external = value?.blank ?? /^https?:/.test(href)
      return (
        <a
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          className="text-label-red underline decoration-label-red/40 underline-offset-4 transition-colors hover:decoration-label-red"
        >
          {children}
        </a>
      )
    },
  },
  types: {
    image: ({ value }) => (
      <figure className="my-8">
        <SanityImage image={value} width={800} className="w-full" />
        {(value?.caption || value?.credit) && (
          <figcaption className="mt-2 font-mono text-[10px] tracking-[0.08em] text-foreground/50">
            {value.caption}
            {value.caption && value.credit && " · "}
            {value.credit}
          </figcaption>
        )}
      </figure>
    ),
  },
}

/** Renders Sanity Portable Text with the site's typography. */
export default function Prose({
  value,
  className,
}: {
  value?: PortableTextBlock[] | null
  className?: string
}) {
  if (!value?.length) return null
  return (
    <div
      className={cn(
        "max-w-prose font-sans text-[17px] leading-[1.75] text-foreground [&>p]:mb-5 [&>p:last-child]:mb-0 [&_strong]:font-semibold [&_em]:italic",
        className,
      )}
    >
      <PortableText value={value} components={components} />
    </div>
  )
}
