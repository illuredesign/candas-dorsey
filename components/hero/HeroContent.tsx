import Link from "next/link"
import { Button } from "@/components/ui/button"

const stackedWord = "WRITING"
const accentWord = "ACROSS"

const letterShadow =
  "3px 3px 0px rgba(26,16,8,0.4), 6px 6px 0px rgba(26,16,8,0.15), 1px 1px 12px rgba(26,16,8,0.3)"
const accentShadow =
  "3px 3px 0px rgba(26,16,8,0.5), 6px 6px 0px rgba(26,16,8,0.2), 1px 1px 16px rgba(212,168,67,0.2)"
const textStroke = "0.5px rgba(197,151,59,0.2)"

export default function HeroContent() {
  return (
    <>
      {/* Main content — CSS grid, bottom-aligned */}
      <div className="hero-grid absolute inset-0 z-[3]">
        {/* Stacked letters — vertical on tall desktop, horizontal on mobile or short viewports */}
        <div className="hero-stacked flex items-center gap-0 self-end leading-none max-md:flex-row md:flex-col md:items-center">
          {stackedWord.split("").map((letter, i) => (
            <span
              key={i}
              className="hero-letter font-display leading-[0.85] text-canvas-cream"
              style={{
                textShadow: letterShadow,
                WebkitTextStroke: textStroke,
              }}
            >
              {letter}
            </span>
          ))}
          {/* Spacer between words — visible on horizontal layout */}
          <span className="hero-spacer hidden w-2 max-md:inline-block" />
          {accentWord.split("").map((letter, i) => (
            <span
              key={`a-${i}`}
              className="hero-letter font-display leading-[0.85] text-warm-gold"
              style={{
                textShadow: accentShadow,
                WebkitTextStroke: textStroke,
              }}
            >
              {letter}
            </span>
          ))}
        </div>

        {/* Right side content */}
        <div className="flex max-w-[520px] flex-col gap-3 self-end pb-2 sm:gap-4 md:gap-5">
          {/* Red label tag */}
          <span className="inline-block self-start bg-label-red px-3.5 pt-1.5 pb-1 font-display text-xs leading-none tracking-[0.15em] text-canvas-cream md:text-sm">
            Edmonton, Alberta
          </span>

          {/* Subtitle */}
          <h1
            className="hero-subtitle font-display leading-[1.05] tracking-[0.04em] text-canvas-cream"
            style={{ textShadow: "2px 2px 8px rgba(26,16,8,0.5)" }}
          >
            Four decades of speculative fiction, mystery, poetry &amp; art that
            refuses to stay{" "}
            <em className="not-italic text-warm-gold">inside the lines.</em>
          </h1>

          {/* Body */}
          <p
            className="font-sans text-sm leading-[1.7] text-canvas-cream/70 sm:text-[15px] md:text-[17px]"
            style={{ textShadow: "1px 1px 8px rgba(26,16,8,0.6)" }}
          >
            Novelist. Poet. Visual artist. Editor. Publisher. Teacher. Advocate.
            Founding president of SF Canada.
          </p>

          {/* Awards */}
          <p
            className="font-sans text-xs italic leading-relaxed text-warm-gold/80 sm:text-sm"
            style={{ textShadow: "1px 1px 10px rgba(26,16,8,0.8)" }}
          >
            Winner of the Tiptree, Crawford &amp; Aurora Awards.
            <br className="max-sm:hidden" />
            <span className="sm:hidden"> </span>
            City of Edmonton Arts and Cultural Hall of Fame.
            <br className="max-sm:hidden" />
            <span className="sm:hidden"> </span>
            WGA Golden Pen for Lifetime Achievement.
          </p>

          {/* CTA buttons — stack full-width on mobile */}
          <div className="mt-1 flex flex-col gap-3 sm:flex-row">
            <Button asChild>
              <Link href="/books/novels">Enter the Library</Link>
            </Button>
            <Button variant="outline" className="border-canvas-cream/30 text-canvas-cream hover:border-canvas-cream/60 hover:bg-canvas-cream/10" asChild>
              <Link href="/gallery">Visit the Gallery</Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
