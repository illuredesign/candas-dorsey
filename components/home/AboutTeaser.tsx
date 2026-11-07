import Image from "next/image"
import Link from "next/link"
import SanityImage from "@/components/sanity/SanityImage"
import Reveal from "@/components/motion/Reveal"
import type { HomeData } from "@/lib/sanity/types"

const facts: [string, string][] = [
  ["Books", "22 and counting, from this is for you (1973) to At the Freak Show (2026)"],
  ["Honours", "Tiptree, Crawford and Aurora awards; WGA Golden Pen for lifetime achievement"],
  ["Halls of fame", "Canadian SF & Fantasy (2018) · Edmonton Arts & Culture (2019)"],
  ["Community", "Founding president of SF Canada; past president, Writers' Guild of Alberta"],
]

export default function AboutTeaser({ about }: { about?: HomeData["about"] }) {
  return (
    <section className="band bg-canvas-cream py-14 md:py-20" aria-label="About Candas">
      <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-8">
        <Reveal className="lg:col-span-5">
          <div className="relative isolate">
            {about?.featuredImage?.asset ? (
              <SanityImage image={about.featuredImage} width={720} height={860} sizes="(max-width: 1024px) 100vw, 40vw" className="w-full" />
            ) : (
              <div className="relative aspect-[5/6] w-full overflow-hidden bg-cadmium-yellow">
                <Image src="/img/candas-half-tone.jpg" alt="Candas Jane Dorsey" fill sizes="(max-width: 1024px) 100vw, 40vw" className="halftone object-cover object-top" />
              </div>
            )}
            <span className="absolute -right-3 -bottom-3 -z-10 h-full w-full bg-label-red" aria-hidden />
          </div>
          {about?.featuredImage?.credit && <p className="meta mt-5 text-ink-soft">Photo: {about.featuredImage.credit}</p>}
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-6 lg:col-start-7">
          <p className="eyebrow text-label-red">03 — About</p>
          <h2 className="display-2 mt-3 text-foreground">{about?.title ?? "My Life and Not-So-Hard Times"}</h2>
          <p className="lede mt-6 text-ink-soft">
            {about?.intro ??
              "Internationally known, award-winning author, editor, teacher, freelancer, community-builder, advocate and arts community lifer."}
          </p>
          <dl className="mt-8 border-t-2 border-night-soil">
            {facts.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[120px_1fr] gap-4 border-b border-night-soil/20 py-3">
                <dt className="eyebrow pt-1 text-ink-soft">{k}</dt>
                <dd className="font-sans text-[1.05rem] leading-snug">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/about" className="label-block hover:bg-night-soil">
              Read the whole story
            </Link>
            <Link href="/about/press" className="inline-flex items-center border-2 border-night-soil px-4 font-display text-sm tracking-[0.14em] uppercase hover:bg-night-soil hover:text-canvas-cream">
              Press kit
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
