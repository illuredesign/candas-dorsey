import Link from "next/link"
import PageShell from "@/components/layout/PageShell"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <PageShell title="Page Not Found" subtitle="404" lead="Not every door in this house leads somewhere. This one doesn't.">
      <div className="flex flex-wrap gap-3">
        <Button variant="dark" asChild>
          <Link href="/">Back home</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/books">Browse the books</Link>
        </Button>
      </div>
    </PageShell>
  )
}
