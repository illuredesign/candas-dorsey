/** Shown when a listing has no CMS content yet. */
export default function EmptyState({
  title = "Nothing here yet",
  children,
}: {
  title?: string
  children?: React.ReactNode
}) {
  return (
    <div className="border border-dashed border-foreground/20 bg-warm-linen/60 px-6 py-12 text-center">
      <p className="font-display text-xl tracking-[0.06em] text-foreground/70">{title}</p>
      {children && <p className="mt-2 font-sans text-sm text-foreground/50">{children}</p>}
    </div>
  )
}
