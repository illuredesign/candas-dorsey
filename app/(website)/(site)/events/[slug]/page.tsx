import PageShell from "@/components/layout/PageShell"

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  return (
    <PageShell title={slug} subtitle="Event">
      <p className="text-muted-foreground">
        Event detail for &ldquo;{slug}&rdquo; will render here.
      </p>
    </PageShell>
  )
}
