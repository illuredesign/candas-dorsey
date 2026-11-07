import type { SocialLink } from "@/lib/sanity/types"
import { cn } from "@/lib/utils"

const platformLabels: Record<string, string> = {
  bluesky: "Bluesky",
  facebook: "Facebook",
  instagram: "Instagram",
  mastodon: "Mastodon",
  threads: "Threads",
  x: "X",
  youtube: "YouTube",
  linkedin: "LinkedIn",
  other: "Website",
}

export default function SocialLinks({ links, className, dark }: { links: SocialLink[]; className?: string; dark?: boolean }) {
  if (!links.length) return null
  return (
    <ul className={cn("flex flex-wrap gap-x-5 gap-y-2", className)}>
      {links.map((l) => (
        <li key={l._key ?? l.url}>
          <a
            href={l.url}
            target="_blank"
            rel="noopener noreferrer me"
            className={cn(
              "eyebrow transition-colors",
              dark ? "text-cream-soft hover:text-cadmium-yellow" : "text-ink-soft hover:text-label-red",
            )}
          >
            {l.label || platformLabels[l.platform] || l.platform} ↗
          </a>
        </li>
      ))}
    </ul>
  )
}
