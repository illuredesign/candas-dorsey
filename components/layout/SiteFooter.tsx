import Link from "next/link"
import { footerNav } from "@/lib/navigation"
import { getSiteSettings } from "@/lib/sanity/fetch"
import SocialLinks from "./SocialLinks"

export default async function SiteFooter() {
  const settings = await getSiteSettings()

  return (
    <footer className="border-t border-foreground/10 bg-night-soil text-canvas-cream">
      <div className="flex w-full flex-col gap-12 px-6 py-12 sm:flex-row sm:items-start sm:justify-between">
        {/* Wordmark + tagline */}
        <div className="flex flex-col gap-4">
          <div>
            <Link href="/" className="font-display text-lg tracking-[0.1em] uppercase text-warm-gold">
              Candas Jane Dorsey
            </Link>
            <p className="mt-2 max-w-xs font-sans text-sm leading-relaxed text-canvas-cream/50">
              {settings?.footerText ?? "Novelist. Poet. Visual artist. Editor. Publisher. Teacher. Advocate."}
            </p>
          </div>
          {settings?.socialLinks?.length ? <SocialLinks links={settings.socialLinks} dark /> : null}
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
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-canvas-cream/10 px-6 py-4">
        <p className="font-mono text-[10px] tracking-[0.05em] text-canvas-cream/30">
          &copy; {new Date().getFullYear()} Candas Jane Dorsey. All rights reserved.
        </p>
        <p className="font-mono text-[10px] tracking-[0.05em] text-canvas-cream/30">
          Edmonton, Alberta · Treaty 6 territory
        </p>
      </div>
    </footer>
  )
}
