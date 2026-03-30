import PageShell from "@/components/layout/PageShell"

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>
}) {
  const { slug } = await params

  return (
    <PageShell title={slug} subtitle="Book">
      <p className="text-muted-foreground">
        Book detail page for &ldquo;{slug}&rdquo; will render here.
      </p>
    </PageShell>
  )
}
