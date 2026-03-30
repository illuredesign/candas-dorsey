import Image from "next/image"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Style Guide — Candas Jane Dorsey",
  robots: "noindex",
}

/* ── Palette data ── */
const primaryPalette = [
  { name: "Cadmium Yellow", hex: "#EAB80D", light: true },
  { name: "Warm Gold", hex: "#D4A843", light: true },
  { name: "Deep Amber", hex: "#C49E1A", light: true },
  { name: "Burnt Sienna", hex: "#8B5520", light: false },
  { name: "Label Red", hex: "#8B2020", light: false },
  { name: "Burgundy", hex: "#5C1422", light: false },
  { name: "Night Soil", hex: "#1A1008", light: false },
]

const secondaryPalette = [
  { name: "Canvas Cream", hex: "#F5EDE0", light: true },
  { name: "Warm Linen", hex: "#EDDFD0", light: true },
  { name: "Text Light", hex: "#E8DFD0", light: true },
  { name: "Russet", hex: "#8C5535", light: false },
  { name: "Dark Maroon", hex: "#38140A", light: false },
  { name: "Charcoal Warm", hex: "#2A2018", light: false },
]

export default function StyleGuidePage() {
  return (
    <div className="mx-auto max-w-[1100px] px-10 py-12 font-sans">
      {/* ═══ HEADER ═══ */}
      <header className="mb-12 flex items-end justify-between border-b-[3px] border-night-soil pb-5">
        <h1 className="font-display text-5xl leading-none tracking-[0.04em] text-night-soil">
          Mood Board<span className="text-label-red"> — Candas Jane Dorsey</span>
        </h1>
        <div className="text-right font-mono text-[10px] uppercase leading-relaxed tracking-[0.1em] text-[#888]">
          Author Website · Phase 1 Deliverable
          <br />
          Prepared March 2026
          <br />
          Jennifer Johnston · Edmonton, AB
        </div>
      </header>

      {/* ═══ 01 / SOURCE IMAGERY ═══ */}
      <SectionLabel>01 / Source Material</SectionLabel>
      <SectionNote>
        Design direction drawn directly from Candas&apos;s own work — her paintings, collages, and
        photographic portrait. Every visual element on the site traces back to her body of work, not
        stock imagery or generic templates.
      </SectionNote>

      <div className="mb-14 grid grid-cols-[1.3fr_0.9fr_0.8fr] gap-4">
        <SourceItem src="/img/dark-quin-br.webp" alt="Unsettled Day — acrylic on canvas" aspect="4/3">
          <SourceCaption title="Unsettled Day" sub="Acrylic on canvas · Hero background source" />
        </SourceItem>
        <SourceItem src="/img/incidental-redemption-event.jpg" alt="Incidental Redemption Event — mixed media collage" aspect="3/4">
          <SourceCaption title="Incidental Redemption Event" sub="Mixed media collage · Typography source" />
        </SourceItem>
        <SourceItem src="/img/candas-half-tone.jpg" alt="Halftone portrait of Candas Jane Dorsey" aspect="3/4">
          <SourceCaption title="Halftone Portrait" sub="Processed photograph · Hero composite" />
        </SourceItem>
      </div>

      {/* ═══ 02 / COLOR PALETTE ═══ */}
      <SectionLabel>02 / Color Palette</SectionLabel>
      <SectionNote>
        Extracted from &ldquo;Unsettled Day&rdquo; and the broader body of visual work. Warm,
        saturated, and unapologetically chromatic — no safe neutrals.
      </SectionNote>

      {/* Primary row */}
      <div className="mb-3 flex h-20">
        {primaryPalette.map((c) => (
          <div
            key={c.hex}
            className="flex flex-1 flex-col justify-end p-2.5"
            style={{ background: c.hex }}
          >
            <span
              className="font-mono text-[9px] tracking-[0.06em]"
              style={{ color: c.light ? "#1A1008" : "#F5EDE0" }}
            >
              {c.name}
            </span>
            <span
              className="font-mono text-[9px] opacity-60"
              style={{ color: c.light ? "#1A1008" : "#F5EDE0" }}
            >
              {c.hex}
            </span>
          </div>
        ))}
      </div>

      {/* Secondary row */}
      <div className="mb-14 flex h-12">
        {secondaryPalette.map((c) => (
          <div
            key={c.hex}
            className="flex flex-1 items-center justify-start p-2.5"
            style={{ background: c.hex }}
          >
            <span className="flex flex-col">
              <span
                className="font-mono text-[9px] tracking-[0.06em]"
                style={{ color: c.light ? "#1A1008" : "#F5EDE0" }}
              >
                {c.name}
              </span>
              <span
                className="font-mono text-[9px] opacity-60"
                style={{ color: c.light ? "#1A1008" : "#F5EDE0" }}
              >
                {c.hex}
              </span>
            </span>
          </div>
        ))}
      </div>

      {/* ═══ 03 / TYPOGRAPHY ═══ */}
      <SectionLabel>03 / Typography</SectionLabel>
      <SectionNote>
        Three typefaces, three voices. Display headings reference the dimensional wooden letterforms
        in the collage work. Body text is literary and warm. System elements use monospace for
        contrast.
      </SectionNote>

      <div className="mb-14">
        {/* Bebas Neue */}
        <div className="mb-0.5 grid min-h-[100px] grid-cols-[200px_1fr]">
          <div className="flex flex-col justify-center bg-night-soil px-5 py-4">
            <h3 className="mb-1 font-mono text-[11px] font-medium tracking-[0.08em] text-warm-gold">
              Bebas Neue
            </h3>
            <p className="font-mono text-[9px] leading-relaxed text-canvas-cream/40">
              Display / Headlines
              <br />
              Stacked verticals
              <br />
              Navigation labels
              <br />
              Button text
            </p>
          </div>
          <div className="flex flex-col justify-center bg-warm-linen px-6 py-5">
            <p className="mb-2 font-display text-[56px] leading-none tracking-[0.04em] text-night-soil">
              WRITING ACROSS
            </p>
            <p className="font-display text-[28px] leading-tight tracking-[0.06em] text-label-red">
              EVERY BOUNDARY
            </p>
          </div>
        </div>

        {/* EB Garamond */}
        <div className="mb-0.5 grid min-h-[100px] grid-cols-[200px_1fr]">
          <div className="flex flex-col justify-center bg-night-soil px-5 py-4">
            <h3 className="mb-1 font-mono text-[11px] font-medium tracking-[0.08em] text-warm-gold">
              EB Garamond
            </h3>
            <p className="font-mono text-[9px] leading-relaxed text-canvas-cream/40">
              Body text
              <br />
              Descriptions
              <br />
              Blog content
              <br />
              Book write-ups
            </p>
          </div>
          <div className="flex flex-col justify-center bg-warm-linen px-6 py-5">
            <p className="mb-2 font-sans text-xl leading-[1.7] text-night-soil">
              Novelist. Poet. Visual artist. Editor. Publisher. Teacher. Advocate. Four decades of
              speculative fiction, mystery, and art that refuses to stay inside the lines.
            </p>
            <p className="font-sans text-base italic text-label-red">
              Winner of the Tiptree, Crawford, and Aurora Awards.
            </p>
          </div>
        </div>

        {/* JetBrains Mono */}
        <div className="grid min-h-[100px] grid-cols-[200px_1fr]">
          <div className="flex flex-col justify-center bg-night-soil px-5 py-4">
            <h3 className="mb-1 font-mono text-[11px] font-medium tracking-[0.08em] text-warm-gold">
              JetBrains Mono
            </h3>
            <p className="font-mono text-[9px] leading-relaxed text-canvas-cream/40">
              System UI
              <br />
              Labels &amp; tags
              <br />
              Navigation hints
              <br />
              Metadata
            </p>
          </div>
          <div className="flex flex-col justify-center bg-warm-linen px-6 py-5">
            <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.15em] text-night-soil/50">
              Speculative Fiction · 1997 · Tiptree Award Winner
            </p>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-label-red">
              Site Map — 46 Pages · Candas @ Writing
            </p>
          </div>
        </div>
      </div>

      {/* ═══ 04 / UI COMPONENTS ═══ */}
      <SectionLabel>04 / UI Components</SectionLabel>
      <SectionNote>
        Interactive elements draw from the collage aesthetic — red label blocks, gold accents on dark
        fields, and dimensional shadow effects.
      </SectionNote>

      <div className="mb-14 grid grid-cols-2 gap-4">
        {/* Buttons — Dark */}
        <div className="bg-night-soil p-6 text-canvas-cream">
          <p className="mb-4 font-mono text-[9px] uppercase tracking-[0.15em] text-canvas-cream/35">
            Buttons — Dark Context
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <button className="border-none bg-label-red px-6 pt-3 pb-2.5 font-display text-[15px] tracking-[0.12em] text-canvas-cream">
              Enter the Library
            </button>
            <button className="border border-canvas-cream/30 bg-transparent px-6 pt-3 pb-2.5 font-display text-[15px] tracking-[0.12em] text-canvas-cream">
              Visit the Gallery
            </button>
            <button className="border-none bg-warm-gold px-6 pt-3 pb-2.5 font-display text-[15px] tracking-[0.12em] text-night-soil">
              How to Buy
            </button>
          </div>
        </div>

        {/* Buttons — Light */}
        <div className="bg-warm-linen p-6">
          <p className="mb-4 font-mono text-[9px] uppercase tracking-[0.15em] text-[#999]">
            Buttons — Light Context
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <button className="border-none bg-night-soil px-6 pt-3 pb-2.5 font-display text-[15px] tracking-[0.12em] text-canvas-cream">
              Read More
            </button>
            <button className="border border-night-soil/30 bg-transparent px-6 pt-3 pb-2.5 font-display text-[15px] tracking-[0.12em] text-night-soil">
              View All Books
            </button>
            <button className="border-none bg-label-red px-6 pt-3 pb-2.5 font-display text-[15px] tracking-[0.12em] text-canvas-cream">
              Contact
            </button>
          </div>
        </div>

        {/* Label Tags */}
        <div className="bg-night-soil p-6 text-canvas-cream">
          <p className="mb-4 font-mono text-[9px] uppercase tracking-[0.15em] text-canvas-cream/35">
            Label Tags — Collage Style
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-label-red px-3 pt-[5px] pb-[3px] font-display text-[13px] tracking-[0.1em] text-canvas-cream">
              Edmonton, Alberta
            </span>
            <span className="bg-warm-gold/15 px-2.5 py-1 font-mono text-[9px] tracking-[0.08em] text-warm-gold">
              Tiptree Award
            </span>
            <span className="bg-canvas-cream/[0.08] px-2.5 py-1 font-mono text-[9px] tracking-[0.08em] text-canvas-cream/60">
              Speculative Fiction · 1997
            </span>
          </div>
        </div>

        {/* Book Card */}
        <div className="bg-night-soil p-6 text-canvas-cream">
          <p className="mb-4 font-mono text-[9px] uppercase tracking-[0.15em] text-canvas-cream/35">
            Book Card — Expanded State
          </p>
          <div className="border border-warm-gold/20 bg-warm-gold/[0.08] p-4">
            <p className="mb-1.5 font-mono text-[9px] tracking-[0.1em] text-canvas-cream/30">
              SPECULATIVE FICTION · 1997
            </p>
            <p className="mb-2 text-[22px] italic text-text-light" style={{ fontFamily: "'Instrument Serif', serif" }}>
              Black Wine
            </p>
            <div className="mb-3 flex gap-1.5">
              <span className="bg-warm-gold/10 px-2 py-0.5 font-mono text-[8px] text-warm-gold">
                Tiptree Award
              </span>
              <span className="bg-warm-gold/10 px-2 py-0.5 font-mono text-[8px] text-warm-gold">
                Crawford Award
              </span>
            </div>
            <p className="font-sans text-[13px] leading-relaxed text-canvas-cream/50">
              A multistranded feminist identity-puzzler on a strange colony world...
            </p>
          </div>
        </div>
      </div>

      {/* ═══ 05 / TEXTURES & EFFECTS ═══ */}
      <SectionLabel>05 / Textures &amp; Effects</SectionLabel>
      <SectionNote>
        Three signature textures that give the site its physicality — the feeling of paint, paper,
        and print.
      </SectionNote>

      <div className="mb-14 grid grid-cols-3 gap-4">
        <div
          className="relative flex h-[140px] items-end overflow-hidden p-3"
          style={{
            background:
              "linear-gradient(135deg, #EAB80D 0%, #C49E1A 30%, #8B5520 60%, #5C1422 85%, #38140A 100%)",
          }}
        >
          <span className="relative z-[1] font-mono text-[10px] tracking-[0.1em] text-canvas-cream [text-shadow:0_1px_4px_rgba(0,0,0,0.5)]">
            Fluid Canvas (WebGL)
          </span>
        </div>
        <div
          className="relative flex h-[140px] items-end overflow-hidden p-3"
          style={{
            background: "#1A1008",
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(245,237,224,0.03) 2px, rgba(245,237,224,0.03) 3px), repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(245,237,224,0.03) 2px, rgba(245,237,224,0.03) 3px)",
          }}
        >
          <span className="relative z-[1] font-mono text-[10px] tracking-[0.1em] text-canvas-cream [text-shadow:0_1px_4px_rgba(0,0,0,0.5)]">
            Canvas Weave Overlay
          </span>
        </div>
        <div
          className="relative flex h-[140px] items-end overflow-hidden p-3"
          style={{
            background: "#2A2018",
            backgroundImage:
              "radial-gradient(circle, rgba(245,237,224,0.4) 0.8px, transparent 0.8px)",
            backgroundSize: "4px 4px",
          }}
        >
          <span className="relative z-[1] font-mono text-[10px] tracking-[0.1em] text-canvas-cream [text-shadow:0_1px_4px_rgba(0,0,0,0.5)]">
            Halftone Dot Pattern
          </span>
        </div>
      </div>

      {/* ═══ 06 / DESIGN PRINCIPLES ═══ */}
      <SectionLabel>06 / Design Principles</SectionLabel>

      <div className="mb-14 grid grid-cols-3 gap-6">
        <Principle title="Her Work Is the Design">
          Every visual element traces back to Candas&apos;s own art and aesthetic. The fluid
          background is her painting. The typography is her collage style. The portrait is her
          photograph. Nothing is stock, nothing is generic.
        </Principle>
        <Principle title="Dense, Not Cluttered">
          She admires rifters.com for its graphic density. The site should feel rich and immersive —
          full-bleed colour, layered content, no empty white boxes. But density is curated, not
          chaotic. Every element earns its space.
        </Principle>
        <Principle title="Eccentric, Not Inaccessible">
          Slightly unusual, as she asked. But unusual within modern UX standards — proper contrast
          ratios, responsive layouts, readable body text, intuitive navigation. The eccentricity
          lives in the visual language, not the usability.
        </Principle>
      </div>

      {/* ═══ FOOTER ═══ */}
      <footer className="flex items-center justify-between border-t border-night-soil/15 pt-5">
        <p className="font-mono text-[10px] tracking-[0.05em] text-[#aaa]">
          Candas Jane Dorsey · Author Website · Phase 1 Mood Board
        </p>
        <p className="font-mono text-[10px] tracking-[0.05em] text-[#aaa]">
          Jennifer Johnston · Freelance Web Developer · Edmonton, AB · March 2026
        </p>
      </footer>
    </div>
  )
}

/* ── Reusable sub-components ── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-4 border-b border-label-red/20 pb-2 font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-label-red">
      {children}
    </p>
  )
}

function SectionNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-6 font-sans text-[15px] italic leading-relaxed text-[#777]">{children}</p>
  )
}

function SourceItem({
  src,
  alt,
  aspect,
  children,
}: {
  src: string
  alt: string
  aspect: string
  children: React.ReactNode
}) {
  return (
    <div className="relative overflow-hidden bg-text-light" style={{ aspectRatio: aspect }}>
      <Image src={src} alt={alt} fill className="object-cover" sizes="(max-width: 1100px) 40vw, 440px" />
      {children}
    </div>
  )
}

function SourceCaption({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-night-soil/85 to-transparent px-3 pt-6 pb-2.5">
      <h3 className="mb-0.5 font-display text-sm tracking-[0.1em] text-canvas-cream">{title}</h3>
      <p className="font-mono text-[9px] tracking-[0.08em] text-canvas-cream/50">{sub}</p>
    </div>
  )
}

function Principle({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t-2 border-label-red pt-4">
      <h3 className="mb-2 font-display text-xl tracking-[0.06em] text-night-soil">{title}</h3>
      <p className="text-sm leading-relaxed text-[#666]">{children}</p>
    </div>
  )
}

