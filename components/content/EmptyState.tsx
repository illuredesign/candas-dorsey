/** Shown when a listing has no CMS content yet. */
export default function EmptyState({
  title = "Nothing here yet",
  children,
}: {
  title?: string
  children?: React.ReactNode
}) {
  return (
    <div className="border-2 border-dashed border-night-soil/30 px-6 py-14 text-center">
      <p className="display-3 text-foreground">{title}</p>
      {children && <p className="mx-auto mt-3 max-w-md font-sans text-base text-ink-soft">{children}</p>}
    </div>
  )
}
