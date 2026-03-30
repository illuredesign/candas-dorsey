import { notFound } from "next/navigation"
import PageShell from "@/components/layout/PageShell"
import { formatBookCategory } from "@/lib/format"

const categoryMap: Record<string, string> = {
  novels: "novel",
  "short-fiction": "shortFiction",
  anthologies: "anthology",
  poetry: "poetry",
}

export default async function BookCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category } = await params
  const sanityCategory = categoryMap[category]
  if (!sanityCategory) notFound()

  return (
    <PageShell title={formatBookCategory(sanityCategory)} subtitle="Books">
      <p className="text-muted-foreground">
        Book listing for {formatBookCategory(sanityCategory)} will render here.
      </p>
    </PageShell>
  )
}
