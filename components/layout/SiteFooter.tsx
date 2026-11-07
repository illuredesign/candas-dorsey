import Link from "next/link"
import { footerNav } from "@/lib/navigation"
import { getSiteSettings } from "@/lib/sanity/fetch"
import SocialLinks from "./SocialLinks"

export default async function SiteFooter() {
  const settings = await getSiteSettings()

  return (
    <footer className="bg-night-soil text-canvas-cream">
      {/* Giant wordmark band */}
      <div className="border-b border-canvas-cream/15">
        <div className="container-x py-10 md:py-14">
          <p className="display-hero text-canvas-cream" aria-hidden>
            Candas <span className="text-cadmium-yellow">Jane</span> Dorsey
          </p>
        </div>
      </div>

      <div className="container-x grid gap-12 py-12 md:grid-cols-[1.2fr_2fr] md:py-16">
        <div className="flex flex-col gap-6">
          <p className="lede max-w-md text-cream-soft">
            {settings?.footerText ?? "Novelist. Poet. Visual artist. Editor. Publisher. Teacher. Advocate."}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/contact" className="label-block hover:bg-cadmium-yellow hover:text-night-soil">
              Send a message
            </Link>
            <Link href="/about/press" className="label-block bg-transparent outline outline-2 -outline-offset-2 outline-canvas-cream/40 hover:bg-canvas-cream hover:text-night-soil">
              Press kit
            </Link>
          </div>
          {settings?.socialLinks?.length ? <SocialLinks links={settings.socialLinks} dark /> : null}
        </div>

        <div className="grid grid-cols-2 gap-x-10 gap-y-10 sm:grid-cols-3">
          {footerNav.map((group) => (
            <nav key={group.label} aria-label={group.label} className="flex flex-col gap-2">
              <span className="eyebrow mb-2 text-cadmium-yellow">{group.label}</span>
              {group.items.map((link) => (
                <Link key={link.href} href={link.href} className="font-sans text-[1.05rem] text-cream-soft transition-colors hover:text-cadmium-yellow">
                  {link.label}
                </Link>
              ))}
            </nav>
          ))}
        </div>
      </div>

      <div className="border-t border-canvas-cream/15">
        <div className="container-x flex flex-wrap items-center justify-between gap-x-8 gap-y-2 py-5">
          <p className="meta text-cream-mute">&copy; {new Date().getFullYear()} Candas Jane Dorsey</p>
          <p className="meta text-cream-mute">Edmonton, Alberta · Treaty 6 territory · Métis Nation Region 4</p>
        </div>
      </div>
    </footer>
  )
}
