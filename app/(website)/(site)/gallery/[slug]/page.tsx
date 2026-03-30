import PageShell from "@/components/layout/PageShell"

export default async function ArtworkDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  return (
    <PageShell title={slug} subtitle="Artwork">
      <p className="text-muted-foreground">
        Artwork detail for &ldquo;{slug}&rdquo; will render here.
      </p>
    </PageShell>
  )
}
