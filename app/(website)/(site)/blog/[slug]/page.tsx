import PageShell from "@/components/layout/PageShell"

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  return (
    <PageShell title={slug} subtitle="Blog">
      <p className="text-muted-foreground">
        Blog post &ldquo;{slug}&rdquo; will render here.
      </p>
    </PageShell>
  )
}
