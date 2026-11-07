import type { Metadata } from "next"
import Link from "next/link"
import { Suspense } from "react"
import PageShell from "@/components/layout/PageShell"
import ContactForm from "@/components/forms/ContactForm"
import SocialLinks from "@/components/layout/SocialLinks"
import { getSiteSettings } from "@/lib/sanity/fetch"
import { buildMetadata } from "@/lib/metadata"

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description: "Send a message to Candas Jane Dorsey — about books, art, editing, events or anything else.",
  path: "/contact",
})

type Props = { searchParams: Promise<{ subject?: string }> }

const reasons: [string, string][] = [
  ["Invitation", "Invite Candas to read, launch or sit on a panel"],
  ["Enquiry: artwork", "Ask about a painting, a print or a commission"],
  ["Editing", "Wooden Door & Associates: editing, writing, consulting"],
  ["Press kit access", "Bios and photos for media"],
]

export default async function ContactPage({ searchParams }: Props) {
  const [{ subject = "" }, settings] = await Promise.all([searchParams, getSiteSettings()])

  return (
    <PageShell
      title="Send a Message"
      subtitle="Contact"
      lead="Questions about a book, a painting, an edit, a reading, or a Pomeranian? This is the place."
      tone="yellow"
      aside={
        <div className="flex flex-col gap-10">
          <div>
            <p className="eyebrow mb-3 text-label-red">Common reasons</p>
            <ul className="border-t-2 border-night-soil">
              {reasons.map(([s, blurb]) => (
                <li key={s} className="border-b border-night-soil/20">
                  <Link href={`/contact?subject=${encodeURIComponent(s)}`} className="group block py-3">
                    <span className="display-4 block group-hover:text-label-red">{s}</span>
                    <span className="font-sans text-base text-ink-soft">{blurb}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-warm-linen p-5">
            <p className="font-sans text-[1.05rem] leading-snug">
              Messages go straight to Candas. Replies may take a few days; she is usually writing something.
            </p>
          </div>
          {settings?.socialLinks?.length ? (
            <div>
              <p className="eyebrow mb-3 text-label-red">Elsewhere</p>
              <SocialLinks links={settings.socialLinks} />
            </div>
          ) : null}
        </div>
      }
    >
      <Suspense>
        <ContactForm defaultSubject={subject.slice(0, 200)} />
      </Suspense>
    </PageShell>
  )
}
