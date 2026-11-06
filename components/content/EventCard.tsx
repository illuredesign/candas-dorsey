import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import type { EventCard as EventCardType, ExhibitionCard } from "@/lib/sanity/types"
import { formatDateRange, formatEventType } from "@/lib/format"

/** Normalises an event or exhibition to one shape for listing. */
export function toListing(item: EventCardType | ExhibitionCard) {
  if (item._type === "exhibition") {
    return {
      key: item._id,
      href: `/events/${item.slug.current}`,
      title: item.title,
      kind: "Exhibition",
      start: item.startDate,
      end: item.endDate,
      place: [item.venue, item.city].filter(Boolean).join(", "),
    }
  }
  return {
    key: item._id,
    href: `/events/${item.slug.current}`,
    title: item.title,
    kind: item.eventType ? formatEventType(item.eventType) : "Event",
    start: item.date,
    end: item.endDate,
    place: [item.location?.venue, item.location?.city].filter(Boolean).join(", "),
  }
}

export default function EventCard({ item, past }: { item: EventCardType | ExhibitionCard; past?: boolean }) {
  const e = toListing(item)
  const start = e.start ? new Date(e.start) : null
  return (
    <article className="group grid grid-cols-[72px_1fr] gap-5 border-t border-foreground/15 py-5 md:grid-cols-[96px_1fr]">
      <div className={past ? "text-foreground/40" : "text-foreground"}>
        {start ? (
          <time dateTime={e.start ?? undefined} className="block">
            <span className="block font-display text-4xl leading-none tracking-[0.02em] md:text-5xl">
              {start.toLocaleDateString("en-CA", { day: "numeric" })}
            </span>
            <span className="block font-mono text-[10px] uppercase tracking-[0.15em]">
              {start.toLocaleDateString("en-CA", { month: "short", year: "numeric" })}
            </span>
          </time>
        ) : (
          <span className="font-mono text-[10px] uppercase tracking-[0.15em]">TBA</span>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Badge variant="metadata">{e.kind}</Badge>
        <h3 className="font-display text-2xl leading-tight tracking-[0.04em] text-foreground">
          <Link href={e.href} className="transition-colors group-hover:text-label-red">
            {e.title}
          </Link>
        </h3>
        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-foreground/50">
          {[e.start && formatDateRange(e.start, e.end), e.place].filter(Boolean).join(" · ")}
        </p>
      </div>
    </article>
  )
}
