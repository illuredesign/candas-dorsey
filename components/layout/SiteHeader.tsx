"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Menu } from "lucide-react"
import { mainNav, isNavGroup } from "@/lib/navigation"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

/** "/" only matches exactly; everything else matches itself and its children. */
function isActive(pathname: string, href: string) {
  const path = href.split("#")[0]
  return path === "/" ? pathname === "/" : pathname === path || pathname.startsWith(`${path}/`)
}

export default function SiteHeader({
  variant = "solid",
}: {
  variant?: "solid" | "transparent"
}) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const isTransparent = variant === "transparent"
  const topLink = (active: boolean) =>
    cn(
      "inline-block px-3 py-2 font-display text-xs tracking-[0.1em] uppercase transition-colors",
      isTransparent
        ? active ? "text-canvas-cream" : "text-canvas-cream/60 hover:text-canvas-cream"
        : active ? "text-foreground" : "text-foreground/70 hover:text-foreground",
    )

  return (
    <header
      className={
        isTransparent
          ? "absolute top-0 left-0 z-40 w-full"
          : "sticky top-0 z-40 w-full border-b border-foreground/10 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80"
      }
    >
      <div className="flex h-14 w-full items-center justify-between px-6">
        {/* Wordmark */}
        <Link
          href="/"
          className={`font-display text-sm tracking-[0.15em] uppercase ${
            isTransparent ? "text-warm-gold/60" : "text-foreground"
          }`}
        >
          Candas Jane Dorsey
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {mainNav.map((link) =>
            isNavGroup(link) ? (
              <div key={link.label} className="group relative">
                {link.href ? (
                  <Link href={link.href} className={topLink(isActive(pathname, link.href))} aria-haspopup="true">
                    {link.label}
                  </Link>
                ) : (
                  <button type="button" className={topLink(false)} aria-haspopup="true">
                    {link.label}
                  </button>
                )}
                <div className="invisible absolute top-full left-0 z-50 min-w-[200px] border border-foreground/10 bg-popover p-1 opacity-0 shadow-md transition-all group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  {link.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "block px-3 py-2 font-sans text-sm transition-colors hover:bg-muted",
                        pathname === item.href.split("#")[0] ? "text-primary" : "text-foreground/70",
                      )}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link key={link.href} href={link.href} className={topLink(isActive(pathname, link.href))}>
                {link.label}
              </Link>
            ),
          )}
        </nav>

        {/* Mobile nav */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className={`md:hidden ${isTransparent ? "text-canvas-cream/70 hover:text-canvas-cream hover:bg-canvas-cream/10" : ""}`}
            >
              <Menu className="size-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px] overflow-y-auto bg-night-soil text-canvas-cream">
            <SheetHeader>
              <SheetTitle className="font-display text-sm tracking-[0.15em] uppercase text-warm-gold">
                Menu
              </SheetTitle>
            </SheetHeader>
            <nav className="mt-6 flex flex-col gap-1 px-4" aria-label="Main">
              {mainNav.map((link) =>
                isNavGroup(link) ? (
                  <div key={link.label} className="mb-2">
                    <span className="mb-1 block font-mono text-[9px] uppercase tracking-[0.15em] text-canvas-cream/40">
                      {link.label}
                    </span>
                    {link.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "block py-2 pl-3 font-sans text-sm transition-colors hover:text-warm-gold",
                          pathname === item.href.split("#")[0] ? "text-warm-gold" : "text-canvas-cream/70",
                        )}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "py-2 font-display text-sm tracking-[0.1em] uppercase transition-colors hover:text-warm-gold",
                      isActive(pathname, link.href) ? "text-warm-gold" : "text-canvas-cream/70",
                    )}
                  >
                    {link.label}
                  </Link>
                ),
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
