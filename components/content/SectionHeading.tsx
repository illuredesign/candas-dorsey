import Link from "next/link"
import { cn } from "@/lib/utils"

/** Eyebrow + display heading with a hard rule, optional "view all" link and count. */
export default function SectionHeading({
  label,
  title,
  id,
  href,
  linkLabel,
  count,
  dark,
  className,
}: {
  label?: string
  title: string
  id?: string
  href?: string
  linkLabel?: string
  count?: number
  dark?: boolean
  className?: string
}) {
  return (
    <div
      id={id}
      className={cn(
        "mb-8 flex scroll-mt-24 flex-wrap items-end justify-between gap-4 border-b-2 pb-4",
        dark ? "border-canvas-cream/30" : "border-night-soil",
        className,
      )}
    >
      <div>
        {label && <p className={cn("eyebrow mb-2", dark ? "text-cadmium-yellow" : "text-label-red")}>{label}</p>}
        <h2 className={cn("display-2 flex items-baseline gap-3", dark ? "text-canvas-cream" : "text-foreground")}>
          {title}
          {typeof count === "number" && <span className={cn("meta", dark ? "text-cream-mute" : "text-ink-mute")}>({count})</span>}
        </h2>
      </div>
      {href && (
        <Link
          href={href}
          className={cn("eyebrow link-ink transition-colors", dark ? "text-cream-soft hover:text-cadmium-yellow" : "text-ink-soft hover:text-label-red")}
        >
          {linkLabel ?? "View all"} →
        </Link>
      )}
    </div>
  )
}
