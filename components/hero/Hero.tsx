import Image from "next/image"
import Link from "next/link"
import SiteHeader from "@/components/layout/SiteHeader"
import SanityImage from "@/components/sanity/SanityImage"
import HeroCanvas from "./HeroCanvas"
import type { SiteSettings } from "@/lib/sanity/types"

/** Fallback copy, used field by field when Site Settings leaves one empty. */
const defaults = {
  headline: "Writing",
  headlineAccent: "Across",
  label: "Edmonton, Alberta",
  tagline: "Four decades of speculative fiction, mystery, poetry & art that refuses to stay inside the lines.",
  taglineAccent: "inside the lines.",
  roles: "Novelist. Poet. Visual artist. Editor. Publisher. Teacher. Advocate. Founding president of SF Canada.",
  awards: [
    "Winner of the Tiptree, Crawford & Aurora Awards.",
    "City of Edmonton Arts & Cultural Hall of Fame.",
    "WGA Golden Pen for Lifetime Achievement.",
  ],
  primary: { label: "Enter the library", href: "/books" },
  secondary: { label: "Visit the gallery", href: "/gallery" },
}

const text = (v: string | null | undefined, fallback: string) => (v && v.trim() ? v.trim() : fallback)

/**
 * Home hero. The slowly moving painting (WebGL) fills the viewport; the
 * halftone portrait prints into its lower right with a multiply blend; the
 * type stack sits on the same container as the header so the headline,
 * label, statement and buttons share the wordmark's left edge. Every
 * string and the portrait come from Site Settings → Home hero.
 */
export default function Hero({ settings, counts }: { settings?: SiteSettings | null; counts?: { books: number; artworks: number } | null }) {
  const headline = text(settings?.heroHeadline, defaults.headline)
  const headlineAccent = text(settings?.heroHeadlineAccent, settings?.heroHeadline ? "" : defaults.headlineAccent)
  const label = text(settings?.heroLabel, defaults.label)
  const tagline = text(settings?.heroTagline, defaults.tagline)
  // The accent only renders when the statement actually ends with it, so the
  // default is safe to apply even to a statement written in the Studio.
  const taglineAccent = text(settings?.heroTaglineAccent, defaults.taglineAccent)
  const roles = text(settings?.heroSubtitle, defaults.roles)
  const awards = (settings?.heroAwards ?? []).filter((a): a is string => !!a && !!a.trim())
  const honours = awards.length ? awards : defaults.awards
  const primary = {
    label: text(settings?.heroPrimaryCta?.label, defaults.primary.label),
    href: text(settings?.heroPrimaryCta?.href, defaults.primary.href),
  }
  const secondary = {
    label: text(settings?.heroSecondaryCta?.label, defaults.secondary.label),
    href: text(settings?.heroSecondaryCta?.href, defaults.secondary.href),
  }

  // Set the closing phrase in yellow when the statement actually ends on it.
  const lower = tagline.toLowerCase()
  const accentLower = taglineAccent.toLowerCase()
  const head = taglineAccent && lower.endsWith(accentLower) ? tagline.slice(0, tagline.length - taglineAccent.length).trimEnd() : null

  const countFor = (href: string) => (href === "/books" && counts?.books ? ` · ${counts.books}` : href === "/gallery" && counts?.artworks ? ` · ${counts.artworks}` : "")

  return (
    <section className="relative isolate h-svh min-h-[600px] overflow-hidden bg-night-soil text-canvas-cream">
      <HeroCanvas />

      {/* Portrait, printed into the painting */}
      <div
        className="portrait-mask pointer-events-none absolute right-[-2%] bottom-0 z-[1] aspect-[832/1253] w-[min(560px,42vw)] opacity-70 mix-blend-multiply max-md:w-[min(300px,60vw)] max-md:opacity-50"
        aria-hidden
      >
        {settings?.heroImage?.asset ? (
          <SanityImage image={settings.heroImage} width={832} height={1253} fill sizes="(max-width: 768px) 60vw, 42vw" priority alt="" className="object-contain object-bottom" />
        ) : (
          <Image src="/img/half-tone-30.png" alt="" fill priority sizes="(max-width: 768px) 60vw, 42vw" className="object-contain object-bottom" />
        )}
      </div>

      {/* Top scrim so the cream wordmark and nav read over the bright upper paint */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-40 bg-gradient-to-b from-night-soil/70 to-transparent" aria-hidden />

      <SiteHeader tone="hero" />

      <div className="hero-grid">
        <div className="hero-stack">
          <span className="label-block">{label}</span>

          <p className="hero-word" aria-label={`${headline} ${headlineAccent}`.trim()}>
            <span aria-hidden>{headline}</span>
            {headlineAccent && (
              <>
                {" "}
                <span className="text-cadmium-yellow" aria-hidden>
                  {headlineAccent}
                </span>
              </>
            )}
          </p>

          <h1 className="hero-shadow font-display text-[clamp(1.4rem,2.5vw,2.125rem)] leading-[1.08] tracking-[0.04em] text-canvas-cream">
            {head ? (
              <>
                {head} <span className="text-cadmium-yellow">{taglineAccent}</span>
              </>
            ) : (
              tagline
            )}
          </h1>

          <p className="hero-shadow max-w-[46ch] font-sans text-[1.0625rem] leading-[1.6] text-cream-soft md:text-[1.125rem]">{roles}</p>

          <p className="hero-shadow font-sans text-[0.95rem] italic leading-[1.55] text-cadmium-yellow">
            {honours.map((line, i) => (
              <span key={i} className="block max-sm:inline">
                {line}
                {i < honours.length - 1 && <span className="sm:hidden"> </span>}
              </span>
            ))}
          </p>

          <div className="mt-1 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link
              href={primary.href}
              className="inline-flex h-11 items-center justify-center bg-canvas-cream px-5 pt-[3px] font-display text-[1.05rem] tracking-[0.12em] uppercase text-night-soil transition-colors hover:bg-cadmium-yellow"
            >
              {primary.label}
              {countFor(primary.href)}
            </Link>
            <Link
              href={secondary.href}
              className="inline-flex h-11 items-center justify-center border-2 border-canvas-cream/70 px-5 pt-[3px] font-display text-[1.05rem] tracking-[0.12em] uppercase text-canvas-cream transition-colors hover:border-canvas-cream hover:bg-canvas-cream/10"
            >
              {secondary.label}
              {countFor(secondary.href)}
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
