import type { Metadata } from "next"
import PageShell from "@/components/layout/PageShell"
import EventCard from "@/components/content/EventCard"
import EmptyState from "@/components/content/EmptyState"
import SectionHeading from "@/components/content/SectionHeading"
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
      title="Launches, Appearances & Openings"
      subtitle="Events"
      lead="Where to find Candas in person — readings, launches, panels and gallery openings."
    >
      <section className="mb-16">
        <SectionHeading label="Coming up" title="Upcoming" id="upcoming" />
        {upcomingAll.length === 0 ? (
          <EmptyState title="Nothing scheduled right now">Check back soon, or follow the blog for announcements.</EmptyState>
        ) : (
          <div>
            {upcomingAll.map((item) => (
              <EventCard key={item._id} item={item} />
            ))}
          </div>
        )}
      </section>

      {upcoming.exhibitions.length + past.exhibitions.length > 0 && (
        <section className="mb-16">
          <SectionHeading label="Art" title="Exhibitions" id="exhibitions" />
          <div>
            {[...upcoming.exhibitions, ...past.exhibitions].map((item) => (
              <EventCard key={item._id} item={item} past={past.exhibitions.includes(item)} />
            ))}
          </div>
        </section>
      )}

      {pastAll.length > 0 && (
        <section>
          <SectionHeading label="Archive" title="Past Events" id="past" />
          <div>
            {pastAll.map((item) => (
              <EventCard key={item._id} item={item} past />
            ))}
          </div>
        </section>
      )}
    </PageShell>
  )
}
