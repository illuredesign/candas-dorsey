import Image from "next/image"
import Link from "next/link"
import SiteHeader from "@/components/layout/SiteHeader"
import type { SiteSettings } from "@/lib/sanity/types"

const awards = ["Tiptree Award", "Crawford Award", "Aurora Award", "WGA Golden Pen", "Edmonton Arts Hall of Fame", "Alberta Centennial Medal", "CSFF Hall of Fame"]

/**
 * Home hero as a flat colour composition: a cadmium-yellow field carrying the
 * name and statement, a night-soil column carrying the halftone portrait,
 * and a red label strip underneath. No gradients, no blends, hard edges.
 */
export default function Hero({ settings, counts }: { settings?: SiteSettings | null; counts?: { books: number; artworks: number } | null }) {
  const tagline = settings?.heroTagline ?? "Writing across the lines."
  const subtitle =
    settings?.heroSubtitle ??
    "Four decades of speculative fiction, mystery, poetry and paint that refuse to stay inside the lines."

  return (
    <section className="relative bg-cadmium-yellow text-night-soil">
      <SiteHeader tone="hero" />

      <div className="grid min-h-[92svh] grid-cols-1 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        {/* Left: type field */}
        <div className="container-x flex flex-col justify-end pt-28 pb-10 lg:pr-10 lg:pb-14">
          <p className="eyebrow mb-6 text-night-soil/80">
            Edmonton, Alberta &nbsp;·&nbsp; Novelist, poet &amp; visual artist &nbsp;·&nbsp; Since 1973
          </p>
          <h1 className="display-hero text-night-soil">
            Candas
            <br />
            Jane
            <br />
            Dorsey
          </h1>
          <p className="display-2 mt-6 max-w-[24ch] text-label-red">{tagline}</p>
          <p className="lede mt-6 max-w-[42ch] text-night-soil/85">{subtitle}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/books"
              className="inline-flex h-12 items-center bg-night-soil px-6 pt-[3px] font-display text-lg tracking-[0.12em] uppercase text-canvas-cream transition-colors hover:bg-label-red"
            >
              The books{counts?.books ? ` · ${counts.books}` : ""}
            </Link>
            <Link
              href="/gallery"
              className="inline-flex h-12 items-center border-2 border-night-soil px-6 pt-[3px] font-display text-lg tracking-[0.12em] uppercase text-night-soil transition-colors hover:bg-night-soil hover:text-canvas-cream"
            >
              The gallery{counts?.artworks ? ` · ${counts.artworks}` : ""}
            </Link>
          </div>
        </div>

        {/* Right: portrait field */}
        <div className="relative aspect-[4/5] overflow-hidden bg-cadmium-yellow sm:aspect-[3/2] lg:aspect-auto">
          <Image
            src="/img/candas-half-tone.jpg"
            alt="Candas Jane Dorsey, laughing, chin on hand"
            width={832}
            height={1253}
            priority
            sizes="(max-width: 1024px) 100vw, 42vw"
            className="halftone absolute inset-x-0 top-0 bottom-0 h-full w-full object-cover object-top lg:top-24 lg:h-auto lg:object-contain lg:object-bottom"
          />
          {/* Hard-edged colour blocks, like the labels in her collages */}
          <span className="absolute top-24 right-0 h-10 w-28 bg-label-red lg:top-28" aria-hidden />
          <span className="absolute right-0 bottom-0 h-28 w-10 bg-cobalt-blue" aria-hidden />
          <span className="absolute bottom-0 left-0 h-6 w-40 bg-night-soil" aria-hidden />
        </div>
      </div>

      {/* Red strip: honours marquee */}
      <div className="marquee overflow-hidden border-y-2 border-night-soil bg-label-red py-3 text-canvas-cream" aria-label="Honours">
        <div className="marquee-track">
          {[0, 1].map((n) => (
            <span key={n} className="flex shrink-0 items-center" aria-hidden={n === 1}>
              {awards.map((a) => (
                <span key={a} className="flex items-center font-display text-lg tracking-[0.14em] uppercase">
                  <span className="px-6">{a}</span>
                  <span className="size-2 bg-cadmium-yellow" />
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
