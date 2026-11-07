import type { Metadata } from "next"
import Link from "next/link"
import PageShell from "@/components/layout/PageShell"
import EventCard from "@/components/content/EventCard"
import EmptyState from "@/components/content/EmptyState"
import SectionHeading from "@/components/content/SectionHeading"
import Reveal from "@/components/motion/Reveal"
import { getPastEvents, getUpcomingEvents } from "@/lib/sanity/fetch"
import { buildMetadata } from "@/lib/metadata"
import type { EventCard as EventCardType, ExhibitionCard } from "@/lib/sanity/types"

export const metadata: Metadata = buildMetadata({
  title: "Events & Exhibitions",
  description: "Book launches, readings, appearances and art exhibitions by Candas Jane Dorsey.",
  path: "/events",
})

function startOf(item: EventCardType | ExhibitionCard) {
  return item._type === "exhibition" ? item.startDate ?? "" : item.date
}

export default async function EventsPage() {
  const [upcoming, past] = await Promise.all([getUpcomingEvents(), getPastEvents()])
  const upcomingAll = [...upcoming.events, ...upcoming.exhibitions].sort((a, b) => startOf(a).localeCompare(startOf(b)))
  const pastAll = [...past.events, ...past.exhibitions].sort((a, b) => startOf(b).localeCompare(startOf(a)))

  return (
    <PageShell
      title="Launches, Readings & Openings"
      subtitle={`Events · ${upcomingAll.length} coming up`}
      lead="Where to find Candas in person: readings, launches, panels and gallery openings."
      tone="red"
      headerExtra={
        <nav aria-label="Sections" className="flex flex-wrap gap-2">
          {[
            ["#upcoming", "Upcoming"],
            ["#exhibitions", "Exhibitions"],
            ["#past", "Archive"],
          ].map(([href, label]) => (
            <a key={href} href={href} className="border-2 border-canvas-cream/50 px-3 py-1.5 font-display text-sm tracking-[0.12em] uppercase text-canvas-cream hover:border-cadmium-yellow hover:text-cadmium-yellow">
              {label}
            </a>
          ))}
        </nav>
      }
    >
      <Reveal as="section" className="mb-20">
        <SectionHeading label="Coming up" title="Upcoming" id="upcoming" />
        {upcomingAll.length === 0 ? (
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <EmptyState title="Nothing scheduled right now">Check back soon, or follow the blog for announcements.</EmptyState>
            <Link href="/contact?subject=Invitation" className="label-block hover:bg-night-soil">
              Invite Candas to read
            </Link>
          </div>
        ) : (
          <div className="border-b-2 border-night-soil">
            {upcomingAll.map((item) => (
              <EventCard key={item._id} item={item} />
            ))}
          </div>
        )}
      </Reveal>

      {upcoming.exhibitions.length + past.exhibitions.length > 0 && (
        <Reveal as="section" className="mb-20">
          <SectionHeading label="Art" title="Exhibitions" id="exhibitions" count={upcoming.exhibitions.length + past.exhibitions.length} />
          <div className="border-b-2 border-night-soil/20">
            {[...upcoming.exhibitions, ...past.exhibitions].map((item) => (
              <EventCard key={item._id} item={item} past={past.exhibitions.includes(item)} />
            ))}
          </div>
        </Reveal>
      )}

      {pastAll.length > 0 && (
        <Reveal as="section">
          <SectionHeading label="Archive" title="Past events" id="past" count={pastAll.length} />
          <div className="border-b-2 border-night-soil/20">
            {pastAll.map((item) => (
              <EventCard key={item._id} item={item} past />
            ))}
          </div>
        </Reveal>
      )}
    </PageShell>
  )
}
