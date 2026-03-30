export default function PageShell({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children?: React.ReactNode
}) {
  return (
    <div className="page-container min-h-[60vh] py-12 md:py-16">
      <div>
        <header className="mb-10">
          {subtitle && (
            <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-label-red">
              {subtitle}
            </p>
          )}
          <h1 className="font-display text-4xl tracking-[0.04em] text-foreground md:text-5xl">
            {title}
          </h1>
        </header>
        {children}
      </div>
    </div>
  )
}
