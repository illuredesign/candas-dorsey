"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { ChevronDown, Menu, X } from "lucide-react"
import { mainNav, isNavGroup, type NavGroup } from "@/lib/navigation"
import { cn } from "@/lib/utils"

/** "/" only matches exactly; everything else matches itself and its children. */
function isActive(pathname: string, href: string) {
  const path = href.split("#")[0]
  return path === "/" ? pathname === "/" : pathname === path || pathname.startsWith(`${path}/`)
}

/**
 * Site header. On the home page it sits on the hero's colour field
 * (`tone="hero"`); everywhere else it is a sticky cream bar.
 * Dropdowns open on hover *and* click, close on Escape / outside click,
 * and are fully keyboard-reachable. A skip link is the first thing in the DOM.
 */
export default function SiteHeader({ tone = "solid" }: { tone?: "solid" | "hero" }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [menu, setMenu] = useState<string | null>(null)
  const navRef = useRef<HTMLElement>(null)

  // Menus close when a link inside them is clicked (see `close` below) rather
  // than by watching the pathname, so no setState runs inside an effect.
  const close = () => {
    setOpen(false)
    setMenu(null)
  }

  // Escape + outside click close dropdowns
  useEffect(() => {
    if (!menu) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(null)
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setMenu(null)
    }
    document.addEventListener("keydown", onKey)
    document.addEventListener("mousedown", onClick)
    return () => {
      document.removeEventListener("keydown", onKey)
      document.removeEventListener("mousedown", onClick)
    }
  }, [menu])

  // Lock scroll while the mobile menu is open
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : ""
    return () => {
      document.documentElement.style.overflow = ""
    }
  }, [open])

  const hero = tone === "hero"

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:bg-night-soil focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:text-canvas-cream"
      >
        Skip to content
      </a>

      <header
        className={cn(
          "z-40 w-full",
          hero
            ? "absolute top-0 left-0 text-canvas-cream"
            : "sticky top-0 border-b border-night-soil/15 bg-canvas-cream/95 text-night-soil backdrop-blur supports-backdrop-filter:bg-canvas-cream/85",
        )}
      >
        <div className="container-x flex h-16 items-center justify-between md:h-[4.5rem]">
          {/* Wordmark */}
          <Link
            href="/"
            onClick={close}
            className="font-display text-[1.35rem] leading-none tracking-[0.06em] text-current md:text-2xl"
            aria-label="Candas Jane Dorsey, home"
          >
            Candas <span className={hero ? "text-cadmium-yellow" : "text-label-red"}>Jane</span> Dorsey
          </Link>

          {/* Desktop nav */}
          <nav ref={navRef} className="hidden items-center gap-1 lg:flex" aria-label="Main">
            {mainNav.map((link) => {
              const active = isActive(pathname, (link as NavGroup).href ?? "")
              const base = cn(
                "relative inline-flex h-10 items-center gap-1 px-3 font-display text-[1.05rem] leading-none tracking-[0.1em] uppercase transition-colors",
                "after:absolute after:inset-x-3 after:bottom-1 after:h-[3px] after:scale-x-0 after:transition-transform after:duration-300 after:origin-left",
                hero ? "after:bg-cadmium-yellow" : "after:bg-label-red",
                active ? "after:scale-x-100" : "hover:after:scale-x-100",
              )
              if (!isNavGroup(link)) {
                return (
                  <Link key={link.href} href={link.href} className={base} aria-current={active ? "page" : undefined}>
                    {link.label}
                  </Link>
                )
              }
              const isOpen = menu === link.label
              return (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => setMenu(link.label)}
                  onMouseLeave={() => setMenu((m) => (m === link.label ? null : m))}
                >
                  <button
                    type="button"
                    className={base}
                    aria-haspopup="true"
                    aria-expanded={isOpen}
                    aria-controls={`menu-${link.label}`}
                    onClick={() => setMenu(isOpen ? null : link.label)}
                  >
                    {link.label}
                    <ChevronDown className={cn("size-3.5 transition-transform", isOpen && "rotate-180")} aria-hidden />
                  </button>
                  <div
                    id={`menu-${link.label}`}
                    className={cn(
                      "absolute top-full left-1/2 z-50 min-w-[280px] -translate-x-1/2 border-2 border-night-soil bg-canvas-cream p-2 text-night-soil shadow-[6px_6px_0_0_var(--color-night-soil)] transition-[opacity,transform] duration-150",
                      isOpen ? "visible opacity-100" : "invisible opacity-0",
                    )}
                  >
                    {link.href && (
                      <Link
                        href={link.href}
                        onClick={close}
                        className="block border-b border-night-soil/15 px-3 pt-2 pb-3 font-display text-lg tracking-[0.06em] uppercase hover:text-label-red"
                      >
                        {link.label} →
                      </Link>
                    )}
                    <ul className="py-1">
                      {link.items.map((item) => {
                        const current = pathname === item.href.split("#")[0]
                        return (
                          <li key={item.href}>
                            <Link
                              href={item.href}
                              onClick={close}
                              className={cn(
                                "block px-3 py-2 font-sans text-[1.05rem] leading-snug transition-colors hover:bg-cadmium-yellow hover:text-night-soil",
                                current && "text-label-red",
                              )}
                              aria-current={current ? "page" : undefined}
                            >
                              {item.label}
                              {item.hint && <span className="block font-mono text-[0.7rem] tracking-[0.04em] text-ink-soft">{item.hint}</span>}
                            </Link>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                </div>
              )
            })}
          </nav>

          {/* Mobile toggle */}
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          </button>
        </div>
      </header>

      {/* Mobile menu: full-screen flat colour field */}
      <div
        id="mobile-menu"
        className={cn(
          "fixed inset-0 z-50 flex flex-col bg-night-soil text-canvas-cream transition-[opacity,visibility] duration-200 lg:hidden",
          open ? "visible opacity-100" : "invisible opacity-0",
        )}
        aria-hidden={!open}
      >
        <div className="container-x flex h-16 items-center justify-between">
          <span className="font-display text-xl tracking-[0.06em]">Menu</span>
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center"
            onClick={() => setOpen(false)}
          >
            <X className="size-6" />
            <span className="sr-only">Close menu</span>
          </button>
        </div>
        <nav className="container-x flex-1 overflow-y-auto pb-10" aria-label="Main">
          <ul className="divide-y divide-canvas-cream/15 border-y border-canvas-cream/15">
            {mainNav.map((link) => (
              <li key={link.label} className="py-4">
                {isNavGroup(link) ? (
                  <>
                    <Link href={link.href ?? "#"} onClick={close} className="display-2 block text-canvas-cream hover:text-cadmium-yellow">
                      {link.label}
                    </Link>
                    <ul className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2">
                      {link.items.map((item) => (
                        <li key={item.href}>
                          <Link href={item.href} onClick={close} className="block py-1 font-sans text-lg text-cream-soft hover:text-cadmium-yellow">
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <Link href={link.href} onClick={close} className="display-2 block text-canvas-cream hover:text-cadmium-yellow">
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
          <p className="eyebrow mt-8 text-cream-mute">Edmonton, Alberta · Treaty 6 territory</p>
        </nav>
      </div>
    </>
  )
}
