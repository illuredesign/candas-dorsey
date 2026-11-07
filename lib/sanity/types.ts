/**
 * Hand-written result types for the GROQ queries in ./queries.ts.
 * Keep in step with the projections there and the schemas in /sanity/schemas.
 */
import type { PortableTextBlock } from "@portabletext/types"

export type Slug = { current: string }

export type SanityImage = {
  asset?: { _ref: string; _type: "reference" } | null
  hotspot?: { x: number; y: number; height: number; width: number } | null
  crop?: { top: number; bottom: number; left: number; right: number } | null
  alt?: string | null
  caption?: string | null
  credit?: string | null
} | null

export type Seo = {
  metaTitle?: string | null
  metaDescription?: string | null
  ogImage?: SanityImage
} | null

export type Award = { _key?: string; name: string; year?: string | null; isWinner?: boolean | null }
export type Review = {
  _key?: string
  source: string
  quote: string
  reviewer?: string | null
  year?: string | null
  url?: string | null
}
export type Edition = {
  _key?: string
  publisher: string
  year?: string | null
  format?: string | null
  language?: string | null
  isbn?: string | null
  note?: string | null
}
export type PurchaseLink = { _key?: string; retailer: string; url: string; label?: string | null }

export type BookCategory = "novel" | "shortFiction" | "anthology" | "poetry" | "other"

export type BookCard = {
  _id: string
  title: string
  subtitle?: string | null
  slug: Slug
  category: BookCategory
  genre?: string | null
  year?: string | null
  publisher?: string | null
  coAuthors?: string[] | null
  isUpcoming?: boolean | null
  order?: number | null
  coverImage?: SanityImage
  awards?: Award[] | null
}

export type Book = BookCard & {
  description?: PortableTextBlock[] | null
  excerpt?: PortableTextBlock[] | null
  reviews?: Review[] | null
  editions?: Edition[] | null
  purchaseLinks?: PurchaseLink[] | null
  seo?: Seo
  relatedBooks?: BookCard[] | null
}

export type WritingKind = "story" | "essay" | "poem" | "article" | "review" | "other"
export type WritingCard = {
  _id: string
  title: string
  slug: Slug
  kind: WritingKind
  publishedIn?: string | null
  year?: string | null
  excerpt?: string | null
  url?: string | null
  hasBody?: boolean
}
export type Writing = Omit<WritingCard, "hasBody"> & { body?: PortableTextBlock[] | null }

export type ArtworkStatus = "available" | "sold" | "privateCollection" | "notForSale"
export type ArtworkCard = {
  _id: string
  title: string
  slug: Slug
  year?: string | null
  medium?: string | null
  dimensions?: string | null
  status?: ArtworkStatus | null
  price?: number | null
  watermarkImage?: boolean | null
  order?: number | null
  image: SanityImage
}
export type ArtworkNeighbour = { title: string; slug: Slug; image: SanityImage } | null
export type Artwork = ArtworkCard & {
  series?: string | null
  description?: PortableTextBlock[] | null
  category?: { _id: string; title: string; slug: Slug } | null
  position?: number | null
  total?: number | null
  prev?: ArtworkNeighbour
  next?: ArtworkNeighbour
  siblings?: ArtworkCard[] | null
}

export type GalleryCategory = {
  _id: string
  title: string
  slug: Slug
  description?: string | null
  symbol?: string | null
  order?: number | null
  coverImage?: SanityImage
  count: number
  firstArtwork?: { image: SanityImage } | null
  preview?: { _id: string; title: string; image: SanityImage }[] | null
  years?: (string | null)[] | null
}
export type GalleryCategoryWithArtworks = Pick<GalleryCategory, "_id" | "title" | "slug" | "description"> & {
  artworks: ArtworkCard[]
}

export type BlogCategory = { _id: string; title: string; slug: Slug; description?: string | null; count?: number }
export type PostCard = {
  _id: string
  title: string
  slug: Slug
  publishedAt: string
  excerpt?: string | null
  isFeatured?: boolean | null
  featuredImage?: SanityImage
  categories?: BlogCategory[] | null
}
export type Post = PostCard & { body: PortableTextBlock[]; seo?: Seo }

export type EventLocation = {
  venue?: string | null
  city?: string | null
  address?: string | null
  url?: string | null
} | null
export type EventCard = {
  _id: string
  _type: "event"
  title: string
  slug: Slug
  eventType?: string | null
  date: string
  endDate?: string | null
  location?: EventLocation
  externalUrl?: string | null
  featuredImage?: SanityImage
  relatedBooks?: Pick<BookCard, "_id" | "title" | "slug" | "coverImage">[] | null
}
export type Event = Omit<EventCard, "relatedBooks"> & {
  description?: PortableTextBlock[] | null
  relatedBooks?: BookCard[] | null
}
export type ExhibitionCard = {
  _id: string
  _type: "exhibition"
  title: string
  slug: Slug
  venue?: string | null
  city?: string | null
  startDate?: string | null
  endDate?: string | null
  externalUrl?: string | null
  featuredImage?: SanityImage
}
export type Exhibition = ExhibitionCard & {
  description?: PortableTextBlock[] | null
  artworks?: ArtworkCard[] | null
}
export type EventsResult = { events: EventCard[]; exhibitions: ExhibitionCard[] }

export type Page = {
  _id: string
  title: string
  slug: Slug
  pageType?: string | null
  body: PortableTextBlock[]
  featuredImage?: SanityImage
  seo?: Seo
  parent?: { title: string; slug: Slug } | null
  children?: { _id: string; title: string; slug: Slug }[] | null
}

export type LinkGroup = "community" | "morris" | "other" | "linksILike"
export type LinkItem = { _id: string; title: string; url: string; description?: string | null; group: LinkGroup }

export type PressKit = {
  title: string
  intro?: string | null
  shortBio?: string | null
  mediumBio?: string | null
  longBio?: PortableTextBlock[] | null
  headshots?: (NonNullable<SanityImage> & {
    _key?: string
    url?: string | null
    width?: number | null
    height?: number | null
    size?: number | null
  })[] | null
  files?: { _key?: string; title: string; url?: string | null; size?: number | null; extension?: string | null }[] | null
}

export type FlatProject = {
  _id: string
  title: string
  description?: PortableTextBlock[] | null
  externalUrl: string
  featuredImage?: SanityImage
}

export type SocialLink = { _key?: string; platform: string; url: string; label?: string | null }
export type SiteSettings = {
  siteTitle?: string | null
  siteDescription?: string | null
  heroTagline?: string | null
  heroSubtitle?: string | null
  socialLinks?: SocialLink[] | null
  woodenDoorUrl?: string | null
  contactEmail?: string | null
  footerText?: string | null
  ogImage?: SanityImage
}

export type HomeSeries = { _id: string; title: string; slug: Slug; count: number; cover: SanityImage }
export type HomeData = {
  latestBook?: BookCard | null
  upcomingBook?: BookCard | null
  recentBooks?: BookCard[] | null
  nextEvent?: EventCard | null
  nextExhibition?: ExhibitionCard | null
  latestPost?: PostCard | null
  series?: HomeSeries[] | null
  artworks?: ArtworkCard[] | null
  about?: { title: string; featuredImage?: SanityImage; intro?: string | null } | null
  counts?: { books: number; artworks: number; series: number } | null
}

type SitemapEntry = { slug: string; _updatedAt: string }
export type SitemapData = Record<
  "books" | "writing" | "artworks" | "categories" | "posts" | "events" | "exhibitions" | "pages",
  SitemapEntry[]
>
