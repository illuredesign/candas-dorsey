import Link from "next/link"
import { footerNav } from "@/lib/navigation"

export default function SiteFooter() {
  return (
    <footer className="border-t border-foreground/10 bg-night-soil text-canvas-cream">
      <div className="flex w-full flex-col gap-12 px-6 py-12 sm:flex-row sm:items-start sm:justify-between">
        {/* Wordmark + tagline */}
        <div>
          <Link
            href="/"
            className="font-display text-lg tracking-[0.1em] uppercase text-warm-gold"
          >
            Candas Jane Dorsey
          </Link>
          <p className="mt-2 max-w-xs font-sans text-sm leading-relaxed text-canvas-cream/50">
            Novelist. Poet. Visual artist. Editor. Publisher. Teacher. Advocate.
          </p>
        </div>

        {/* Nav columns */}
        <div className="grid grid-cols-2 gap-x-16 gap-y-8 sm:grid-cols-3">
          {footerNav.map((group) => (
            <nav key={group.label} className="flex flex-col gap-2.5">
              <span className="mb-1 font-mono text-[9px] uppercase tracking-[0.15em] text-canvas-cream/40">
                {group.label}
              </span>
              {group.items.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-sans text-sm text-canvas-cream/60 transition-colors hover:text-warm-gold"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-canvas-cream/10 px-6 py-4">
        <p className="font-mono text-[10px] tracking-[0.05em] text-canvas-cream/30">
          &copy; {new Date().getFullYear()} Candas Jane Dorsey. All rights
          reserved.
        </p>
      </div>
    </footer>
  )
}
