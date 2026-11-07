import { cn } from "@/lib/utils"

/**
 * Standard inner-page frame: eyebrow + display title + lede in a header band,
 * then content. `aside` becomes a sticky right column on desktop.
 * `tone` colours the header band as a flat field.
 */
export default function PageShell({
  title,
  subtitle,
  lead,
  aside,
  wide,
  tone = "cream",
  headerExtra,
  children,
}: {
  title: string
  subtitle?: string
  /** Short intro paragraph under the heading. */
  lead?: React.ReactNode
  /** Right-hand column content on desktop. */
  aside?: React.ReactNode
  /** Let content span the full container width (galleries, grids). */
  wide?: boolean
  tone?: "cream" | "yellow" | "ink" | "red" | "blue"
  /** Rendered under the lede inside the header band (filters, tabs). */
  headerExtra?: React.ReactNode
  children?: React.ReactNode
}) {
  const tones = {
    cream: "bg-canvas-cream text-night-soil",
    yellow: "bg-cadmium-yellow text-night-soil",
    ink: "bg-night-soil text-canvas-cream",
    red: "bg-label-red text-canvas-cream",
    blue: "bg-cobalt-blue text-canvas-cream",
  }
  const eyebrowTone = {
    cream: "text-label-red",
    yellow: "text-label-red",
    ink: "text-cadmium-yellow",
    red: "text-cadmium-yellow",
    blue: "text-cadmium-yellow",
  }
  const ledeTone = {
    cream: "text-ink-soft",
    yellow: "text-night-soil/85",
    ink: "text-cream-soft",
    red: "text-canvas-cream/90",
    blue: "text-canvas-cream/90",
  }

  return (
    <>
      <header className={cn("band border-b border-night-soil/15", tones[tone])}>
        <div className={cn("container-x pt-12 pb-10 md:pt-20 md:pb-14")}>
          <div className={cn(!wide && "max-w-[1100px]")}>
            {subtitle && <p className={cn("eyebrow mb-4", eyebrowTone[tone])}>{subtitle}</p>}
            <h1 className="display-1 text-balance">{title}</h1>
            {lead && <div className={cn("lede mt-6 max-w-[60ch]", ledeTone[tone])}>{lead}</div>}
          </div>
          {headerExtra && <div className="mt-8">{headerExtra}</div>}
        </div>
      </header>

      <div className="container-x py-12 md:py-16">
        <div className={cn(!wide && "max-w-[1100px]")}>
          {aside ? (
            <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-16">
              <div className="min-w-0">{children}</div>
              <aside className="min-w-0 lg:sticky lg:top-24 lg:self-start">{aside}</aside>
            </div>
          ) : (
            children
          )}
        </div>
      </div>
    </>
  )
}
