import { cn } from "@/lib/utils"

export default function PageShell({
  title,
  subtitle,
  lead,
  aside,
  wide,
  children,
}: {
  title: string
  subtitle?: string
  /** Short intro paragraph under the heading. */
  lead?: React.ReactNode
  /** Right-hand column content on desktop. */
  aside?: React.ReactNode
  /** Let content span the full content width (galleries, grids). */
  wide?: boolean
  children?: React.ReactNode
}) {
  return (
    <div className="page-container min-h-[60vh] py-12 md:py-16">
      <div className={cn(!wide && "mx-auto w-full max-w-[1100px]")}>
        <header className="mb-10">
          {subtitle && (
            <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-label-red">{subtitle}</p>
          )}
          <h1 className="font-display text-4xl tracking-[0.04em] text-foreground md:text-5xl lg:text-6xl">{title}</h1>
          {lead && (
            <div className="mt-4 max-w-prose font-sans text-lg italic leading-relaxed text-foreground/70">{lead}</div>
          )}
        </header>
        {aside ? (
          <div className="grid gap-12 lg:grid-cols-[1fr_320px]">
            <div className="min-w-0">{children}</div>
            <aside className="min-w-0">{aside}</aside>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  )
}
