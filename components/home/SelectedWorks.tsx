import Link from "next/link"
import ArtworkImage from "@/components/content/ArtworkImage"
import Reveal from "@/components/motion/Reveal"
import type { ArtworkCard } from "@/lib/sanity/types"

/**
 * A single horizontal strip of artworks (confined to this section, with a
 * visible direction cue). Works keep their own aspect ratios at a fixed height.
 */
export default function SelectedWorks({ artworks }: { artworks?: ArtworkCard[] | null }) {
  const works = (artworks ?? []).filter((a) => a.image?.asset)
  if (works.length === 0) return null

  return (
    <section className="band border-b-2 border-night-soil bg-canvas-cream py-14 md:py-20" aria-label="Selected works">
      <Reveal>
        <div className="container-x mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow text-label-red">Selected works</p>
            <h2 className="display-2 mt-2 text-foreground">From the studio</h2>
          </div>
          <p className="eyebrow text-ink-soft">
            Scroll sideways <span aria-hidden>⟶</span>
          </p>
        </div>
        <ul className="strip pb-4">
          {works.map((a, i) => (
            <li key={a._id} className="group w-[78vw] sm:w-[420px]">
              <Link href={`/gallery/${a.slug.current}`} className="block">
                <div className="relative h-[52vw] overflow-hidden bg-warm-linen sm:h-[340px]">
                  <ArtworkImage
                    image={a.image}
                    watermark={a.watermarkImage !== false}
                    width={840}
                    height={680}
                    fill
                    sizes="(max-width: 640px) 78vw, 420px"
                    priority={i < 2}
                    className="transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                </div>
                <div className="mt-3 flex items-baseline justify-between gap-3">
                  <span className="display-4 text-foreground group-hover:text-label-red">{a.title}</span>
                  <span className="meta shrink-0 text-ink-soft">
                    {String(i + 1).padStart(2, "0")} / {String(works.length).padStart(2, "0")}
                  </span>
                </div>
                <p className="meta mt-1 text-ink-soft">{[a.medium, a.year].filter(Boolean).join(" · ")}</p>
              </Link>
            </li>
          ))}
          <li className="flex w-[60vw] items-center sm:w-[280px]">
            <Link href="/gallery" className="display-3 link-ink text-label-red">
              All work →
            </Link>
          </li>
        </ul>
      </Reveal>
    </section>
  )
}
