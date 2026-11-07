export type NavItem = {
  label: string
  href: string
  /** Short line shown under the label in menus. */
  hint?: string
}

export type NavGroup = {
  label: string
  href?: string
  items: NavItem[]
}

export type NavLink = NavItem | NavGroup

function isNavGroup(link: NavLink): link is NavGroup {
  return "items" in link
}

export { isNavGroup }

/** Book category URL segment → Sanity `category` value. */
export const bookCategorySlugs: Record<string, string> = {
  novels: "novel",
  "short-fiction": "shortFiction",
  anthologies: "anthology",
  poetry: "poetry",
  other: "other",
}

/** Sanity `category` value → URL segment. */
export const bookCategoryPaths: Record<string, string> = Object.fromEntries(
  Object.entries(bookCategorySlugs).map(([path, value]) => [value, path]),
)

export const mainNav: NavLink[] = [
  {
    label: "Writing",
    href: "/books",
    items: [
      { label: "All Books", href: "/books", hint: "Every title, shelf by shelf" },
      { label: "Novels", href: "/books/novels" },
      { label: "Short Fiction", href: "/books/short-fiction" },
      { label: "Anthologies", href: "/books/anthologies" },
      { label: "Poetry", href: "/books/poetry" },
      { label: "Other Writing", href: "/writing", hint: "Stories, poems and essays to read here" },
    ],
  },
  {
    label: "Art",
    href: "/gallery",
    items: [
      { label: "Gallery", href: "/gallery", hint: "Paintings, drawings, collage, photographs" },
      { label: "Exhibitions", href: "/events#exhibitions" },
      { label: "The FLAT Project", href: "/flat" },
    ],
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
    href: "/about",
    items: [
      { label: "My Life and Not-So-Hard Times", href: "/about", hint: "The biography" },
      { label: "Wooden Door & Associates", href: "/about/freelance", hint: "Editing, writing and consulting" },
      { label: "Candas-Adjacent", href: "/about/interests", hint: "Community, morris, links" },
      { label: "Press Kit", href: "/about/press", hint: "Bios and photos for media" },
    ],
  },
  {
    label: "Contact",
    href: "/contact",
  },
]

export const footerNav: NavGroup[] = [
  {
    label: "Writing",
    items: [
      { label: "All Books", href: "/books" },
      { label: "Novels", href: "/books/novels" },
      { label: "Short Fiction", href: "/books/short-fiction" },
      { label: "Anthologies", href: "/books/anthologies" },
      { label: "Poetry", href: "/books/poetry" },
      { label: "Other Writing", href: "/writing" },
    ],
  },
  {
    label: "Art",
    items: [
      { label: "Gallery", href: "/gallery" },
      { label: "Exhibitions", href: "/events#exhibitions" },
      { label: "The FLAT Project", href: "/flat" },
    ],
  },
  {
    label: "Connect",
    items: [
      { label: "Blog", href: "/blog" },
      { label: "Events", href: "/events" },
      { label: "About", href: "/about" },
      { label: "Press Kit", href: "/about/press" },
      { label: "Contact", href: "/contact" },
    ],
  },
]
