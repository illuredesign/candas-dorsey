import type { Metadata } from "next"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { cache } from "react"
import PageShell from "@/components/layout/PageShell"
import Prose from "@/components/sanity/Prose"
import { getWritingBySlug } from "@/lib/sanity/fetch"
import { buildMetadata } from "@/lib/metadata"
import { formatWritingKind } from "@/lib/format"

type Props = { params: Promise<{ slug: string }> }
const getPiece = cache((slug: string) => getWritingBySlug(slug))

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const piece = await getPiece(slug)
  if (!piece) return {}
  return buildMetadata({
    title: piece.title,
    description: piece.excerpt ?? `${formatWritingKind(piece.kind)} by Candas Jane Dorsey.`,
    path: `/writing/${slug}`,
    type: "article",
  })
}

export default async function WritingPiecePage({ params }: Props) {
  const { slug } = await params
  const piece = await getPiece(slug)
  if (!piece) notFound()
  if (!piece.body?.length && piece.url) redirect(piece.url)

  return (
    <PageShell
      title={piece.title}
      subtitle={[formatWritingKind(piece.kind), piece.publishedIn && `in ${piece.publishedIn}`, piece.year].filter(Boolean).join(" · ")}
    >
      <Prose value={piece.body} className="mx-auto" />
      <p className="mt-12 eyebrow text-ink-soft">
        <Link href="/writing" className="hover:text-label-red">← Other writing</Link>
      </p>
    </PageShell>
  )
}
