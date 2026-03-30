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

export default function SiteHeader({
  variant = "solid",
}: {
  variant?: "solid" | "transparent"
}) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const isTransparent = variant === "transparent"

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
        <nav className="hidden items-center gap-1 md:flex">
          {mainNav.map((link) =>
            isNavGroup(link) ? (
              <div key={link.label} className="group relative">
                <button
                  className={`px-3 py-2 font-display text-xs tracking-[0.1em] uppercase transition-colors ${
                    isTransparent
                      ? "text-canvas-cream/60 hover:text-canvas-cream"
                      : "text-foreground/70 hover:text-foreground"
                  }`}
                >
                  {link.label}
                </button>
                <div className="invisible absolute top-full left-0 z-50 min-w-[180px] border border-foreground/10 bg-popover p-1 opacity-0 shadow-md transition-all group-hover:visible group-hover:opacity-100">
                  {link.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`block px-3 py-2 font-sans text-sm transition-colors hover:bg-muted ${
                        pathname === item.href
                          ? "text-primary"
                          : "text-foreground/70"
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 font-display text-xs tracking-[0.1em] uppercase transition-colors ${
                  isTransparent
                    ? link.href === "/" ? pathname === "/" : pathname.startsWith(link.href)
                      ? "text-canvas-cream"
                      : "text-canvas-cream/60 hover:text-canvas-cream"
                    : link.href === "/" ? pathname === "/" : pathname.startsWith(link.href)
                      ? "text-foreground"
                      : "text-foreground/70 hover:text-foreground"
                }`}
              >
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
          <SheetContent side="right" className="w-[280px] bg-night-soil text-canvas-cream">
            <SheetHeader>
              <SheetTitle className="font-display text-sm tracking-[0.15em] uppercase text-warm-gold">
                Menu
              </SheetTitle>
            </SheetHeader>
            <nav className="mt-6 flex flex-col gap-1 px-4">
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
                        className={`block py-2 pl-3 font-sans text-sm transition-colors hover:text-warm-gold ${
                          pathname === item.href
                            ? "text-warm-gold"
                            : "text-canvas-cream/70"
                        }`}
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
                    className={`py-2 font-display text-sm tracking-[0.1em] uppercase transition-colors hover:text-warm-gold ${
                      link.href === "/" ? pathname === "/" : pathname.startsWith(link.href)
                        ? "text-warm-gold"
                        : "text-canvas-cream/70"
                    }`}
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
