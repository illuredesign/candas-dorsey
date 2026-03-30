export type NavItem = {
  label: string
  href: string
}

export type NavGroup = {
  label: string
  items: NavItem[]
}

export type NavLink = NavItem | NavGroup

function isNavGroup(link: NavLink): link is NavGroup {
  return "items" in link
}

export { isNavGroup }

export const mainNav: NavLink[] = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Books",
    items: [
      { label: "Novels", href: "/books/novels" },
      { label: "Short Fiction", href: "/books/short-fiction" },
      { label: "Anthologies", href: "/books/anthologies" },
      { label: "Poetry", href: "/books/poetry" },
    ],
  },
  {
    label: "Gallery",
    href: "/gallery",
  },
  {
    label: "Blog",
    href: "/blog",
  },
  {
    label: "Events",
    href: "/events",
  },
  {
    label: "About",
    items: [
      { label: "Who am I?", href: "/about" },
      { label: "Interests", href: "/about/interests" },
      { label: "Freelance Writing & Editing", href: "/about/freelance" },
      { label: "The FLAT Project", href: "/flat" },
    ],
  },
  {
    label: "Contact",
    href: "/contact",
  },
]

export const footerNav: NavGroup[] = [
  {
    label: "Books",
    items: [
      { label: "Novels", href: "/books/novels" },
      { label: "Short Fiction", href: "/books/short-fiction" },
      { label: "Anthologies", href: "/books/anthologies" },
      { label: "Poetry", href: "/books/poetry" },
    ],
  },
  {
    label: "Gallery & Art",
    items: [
      { label: "Gallery", href: "/gallery" },
      { label: "Exhibitions", href: "/events" },
      { label: "The FLAT Project", href: "/flat" },
    ],
  },
  {
    label: "Connect",
    items: [
      { label: "Blog", href: "/blog" },
      { label: "Events", href: "/events" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
]
