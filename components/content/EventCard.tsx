import Link from "next/link"
import type { EventCard as EventCardType, ExhibitionCard } from "@/lib/sanity/types"
import { formatDateRange, formatEventType } from "@/lib/format"
import { cn } from "@/lib/utils"

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
    <article
      className={cn(
        "group grid grid-cols-[88px_1fr] gap-6 border-t-2 border-night-soil py-6 md:grid-cols-[120px_1fr_auto] md:items-start",
        past && "border-night-soil/20",
      )}
    >
      <div className={past ? "text-ink-mute" : "text-foreground"}>
        {start ? (
          <time dateTime={e.start ?? undefined} className="block">
            <span className="display-1 block">{start.toLocaleDateString("en-CA", { day: "numeric" })}</span>
            <span className="eyebrow block">{start.toLocaleDateString("en-CA", { month: "short", year: "numeric" })}</span>
          </time>
        ) : (
          <span className="eyebrow">TBA</span>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <p className="eyebrow text-label-red">{e.kind}</p>
        <h3 className="display-3 text-foreground">
          <Link href={e.href} className="transition-colors group-hover:text-label-red">
            {e.title}
          </Link>
        </h3>
        <p className="meta text-ink-soft">{[e.start && formatDateRange(e.start, e.end), e.place].filter(Boolean).join(" · ")}</p>
      </div>
      <Link href={e.href} className="eyebrow hidden self-center text-ink-soft transition-colors group-hover:text-label-red md:block">
        Details →
      </Link>
    </article>
  )
}
