import type { Metadata } from "next"
import PageShell from "@/components/layout/PageShell"
import Prose from "@/components/sanity/Prose"
import SanityImage from "@/components/sanity/SanityImage"
import SectionHeading from "@/components/content/SectionHeading"
import EmptyState from "@/components/content/EmptyState"
import PressKitGate from "@/components/forms/PressKitGate"
import CopyButton from "@/components/forms/CopyButton"
import { Button } from "@/components/ui/button"
import { getPressKit } from "@/lib/sanity/fetch"
import { hasPressKitAccess } from "@/lib/pressKit"
import { buildMetadata } from "@/lib/metadata"
import { formatFileSize } from "@/lib/format"

export const metadata: Metadata = buildMetadata({
  title: "Press Kit",
  description: "Bios and photos of Candas Jane Dorsey for media, event organisers and publishers.",
  path: "/about/press",
  noIndex: true,
})

export default async function PressKitPage() {
  const [kit, unlocked] = await Promise.all([getPressKit(), hasPressKitAccess()])

  return (
    <PageShell title={kit?.title ?? "Press Kit"} subtitle="Bios & photos" lead={kit?.intro}>
      {!kit ? (
        <EmptyState title="Press kit coming soon" />
      ) : !unlocked ? (
        <PressKitGate />
      ) : (
        <div className="flex flex-col gap-16">
          {[
            { label: "Short bio", text: kit.shortBio },
            { label: "Medium bio", text: kit.mediumBio },
          ].map(
            (bio) =>
              bio.text && (
                <section key={bio.label}>
                  <SectionHeading title={bio.label} />
                  <p className="body-lg max-w-[62ch]">{bio.text}</p>
                  <CopyButton text={bio.text} className="mt-4" />
                </section>
              ),
          )}

          {kit.longBio?.length ? (
            <section>
              <SectionHeading title="Long bio" />
              <Prose value={kit.longBio} />
            </section>
          ) : null}

          {kit.headshots?.length ? (
            <section>
              <SectionHeading title="Photos" />
              <p className="mb-6 max-w-prose font-sans text-base text-ink-soft">
                Full-resolution files. Please use the credit shown with each photo.
              </p>
              <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
                {kit.headshots.map((h, i) => (
                  <figure key={h._key ?? i} className="flex flex-col gap-2">
                    <div className="relative aspect-[3/4] overflow-hidden bg-warm-linen">
                      <SanityImage image={h} width={400} height={533} fill sizes="(max-width: 768px) 50vw, 300px" />
                    </div>
                    <figcaption className="meta text-ink-soft">
                      {h.credit ? `Photo: ${h.credit}` : h.caption ?? h.alt}
                      {h.width && h.height && <span className="block text-ink-mute">{h.width} × {h.height}px · {formatFileSize(h.size)}</span>}
                    </figcaption>
                    {h.url && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={`${h.url}?dl=`} download>Download</a>
                      </Button>
                    )}
                  </figure>
                ))}
              </div>
            </section>
          ) : null}

          {kit.files?.length ? (
            <section>
              <SectionHeading title="Other downloads" />
              <ul className="divide-y divide-foreground/10 border-y border-foreground/10">
                {kit.files.map((f, i) => (
                  <li key={f._key ?? i} className="flex items-center justify-between gap-4 py-3">
                    <span className="font-sans">{f.title}<span className="ml-2 meta uppercase text-ink-soft">{[f.extension, formatFileSize(f.size)].filter(Boolean).join(" · ")}</span></span>
                    {f.url && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={`${f.url}?dl=`} download>Download</a>
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      )}
    </PageShell>
  )
}
