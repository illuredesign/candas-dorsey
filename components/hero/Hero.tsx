import Image from "next/image"
import Link from "next/link"
import SiteHeader from "@/components/layout/SiteHeader"
import HeroCanvas from "./HeroCanvas"
import type { SiteSettings } from "@/lib/sanity/types"

const stackedWord = "WRITING"
const accentWord = "ACROSS"

/**
 * Home hero. The slowly moving painting (WebGL) fills the viewport; the
 * halftone portrait prints into its lower right with a multiply blend; the
 * stacked word column and a short cream type block sit on the dark lower
 * third where cream text reads cleanly. Letter size is derived from the
 * viewport height so the column never clips.
 */
export default function Hero({ settings, counts }: { settings?: SiteSettings | null; counts?: { books: number; artworks: number } | null }) {
  const tagline = settings?.heroTagline ?? "Four decades of speculative fiction, mystery, poetry & art that refuses to stay inside the lines."
  const roles = settings?.heroSubtitle ?? "Novelist. Poet. Visual artist. Editor. Publisher. Teacher. Advocate. Founding president of SF Canada."
  // Set the closing phrase in yellow when the statement ends on it, otherwise the whole line in cream.
  const accent = "inside the lines."
  const head = tagline.trim().toLowerCase().endsWith(accent) ? tagline.trim().slice(0, -accent.length).trimEnd() : null

  return (
    <section className="relative isolate h-svh min-h-[600px] overflow-hidden bg-night-soil text-canvas-cream">
      <HeroCanvas />

      {/* Portrait, printed into the painting */}
      <Image
        src="/img/half-tone-30.png"
        alt=""
        width={832}
        height={1253}
        priority
        sizes="(max-width: 768px) 60vw, 42vw"
        className="portrait-mask pointer-events-none absolute right-[-2%] bottom-0 z-[1] h-auto w-[min(560px,42vw)] opacity-70 mix-blend-multiply max-md:w-[min(300px,60vw)] max-md:opacity-50"
      />

      {/* Top scrim so the cream wordmark and nav read over the bright upper paint */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-40 bg-gradient-to-b from-night-soil/70 to-transparent" aria-hidden />

      <SiteHeader tone="hero" />

      <div className="hero-grid">
        {/* Stacked word column */}
        <p className="hero-stacked self-end" aria-label="Writing across">
          {stackedWord.split("").map((letter, i) => (
            <span key={i} className="hero-letter text-canvas-cream" aria-hidden>
              {letter}
            </span>
          ))}
          <span className="hero-spacer h-3 w-3" aria-hidden />
          {accentWord.split("").map((letter, i) => (
            <span key={`a-${i}`} className="hero-letter text-cadmium-yellow" aria-hidden>
              {letter}
            </span>
          ))}
        </p>

        {/* Type block */}
        <div className="flex max-w-[34rem] flex-col items-start gap-4 self-end md:gap-5">
          <span className="label-block">Edmonton, Alberta</span>

          <h1 className="hero-shadow font-display text-[clamp(1.4rem,2.6vw,2.25rem)] leading-[1.08] tracking-[0.04em] text-canvas-cream">
            {head ? (
              <>
                {head} <span className="text-cadmium-yellow">{accent}</span>
              </>
            ) : (
              tagline
            )}
          </h1>

          <p className="hero-shadow max-w-[46ch] font-sans text-[1.0625rem] leading-[1.6] text-cream-soft md:text-[1.125rem]">{roles}</p>

          <p className="hero-shadow font-sans text-[0.95rem] italic leading-[1.55] text-cadmium-yellow">
            Winner of the Tiptree, Crawford &amp; Aurora Awards.
            <br className="max-sm:hidden" />
            <span className="sm:hidden"> </span>
            City of Edmonton Arts &amp; Cultural Hall of Fame.
            <br className="max-sm:hidden" />
            <span className="sm:hidden"> </span>
            WGA Golden Pen for Lifetime Achievement.
          </p>

          <div className="mt-1 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link
              href="/books"
              className="inline-flex h-11 items-center justify-center bg-canvas-cream px-5 pt-[3px] font-display text-[1.05rem] tracking-[0.12em] uppercase text-night-soil transition-colors hover:bg-cadmium-yellow"
            >
              Enter the library{counts?.books ? ` · ${counts.books}` : ""}
            </Link>
            <Link
              href="/gallery"
              className="inline-flex h-11 items-center justify-center border-2 border-canvas-cream/70 px-5 pt-[3px] font-display text-[1.05rem] tracking-[0.12em] uppercase text-canvas-cream transition-colors hover:border-canvas-cream hover:bg-canvas-cream/10"
            >
              Visit the gallery{counts?.artworks ? ` · ${counts.artworks}` : ""}
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll cue, desktop only so it never sits on the buttons */}
      <div className="pointer-events-none absolute bottom-4 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-1.5 md:flex" aria-hidden>
        <span className="h-8 w-px animate-pulse bg-canvas-cream/50" />
        <span className="font-mono text-[11px] tracking-[0.2em] text-canvas-cream/60 uppercase">Scroll</span>
      </div>
    </section>
  )
}
