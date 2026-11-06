import type { Metadata } from "next"
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

export default async function ContactPage({ searchParams }: Props) {
  const [{ subject = "" }, settings] = await Promise.all([searchParams, getSiteSettings()])

  return (
    <PageShell
      title="Send a Message"
      subtitle="Contact"
      lead="Questions about a book, a painting, an edit, a reading, or a Pomeranian? This is the place."
      aside={
        <div className="flex flex-col gap-6 border-t-2 border-label-red pt-4">
          <p className="font-sans text-sm text-foreground/70">
            Messages go straight to Candas. Replies may take a few days — she is usually writing something.
          </p>
          {settings?.socialLinks?.length ? (
            <div>
              <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-label-red">Elsewhere</p>
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
