import Link from "next/link"

/** Numbered mono label + display heading, matching the mood board sections. */
export default function SectionHeading({
  label,
  title,
  id,
  href,
  linkLabel,
}: {
  label?: string
  title: string
  id?: string
  href?: string
  linkLabel?: string
}) {
  return (
    <div id={id} className="mb-6 flex scroll-mt-20 flex-wrap items-end justify-between gap-3 border-b border-label-red/20 pb-3">
      <div>
        {label && (
          <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-label-red">{label}</p>
        )}
        <h2 className="font-display text-3xl tracking-[0.04em] text-foreground md:text-4xl">{title}</h2>
      </div>
      {href && (
        <Link
          href={href}
          className="font-mono text-[10px] uppercase tracking-[0.15em] text-foreground/60 transition-colors hover:text-label-red"
        >
          {linkLabel ?? "View all"} →
        </Link>
      )}
    </div>
  )
}
