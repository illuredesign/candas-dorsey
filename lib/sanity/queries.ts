import { defineQuery } from "next-sanity"

// ── Books ──
export const allBooksQuery = defineQuery(`
  *[_type == "book"] | order(order asc) {
    _id,
    title,
    slug,
    category,
    genre,
    year,
    coverImage,
    isUpcoming,
    order,
    "awards": awards[] { name, year, isWinner }
  }
`)

export const booksByCategoryQuery = defineQuery(`
  *[_type == "book" && category == $category] | order(order asc) {
    _id,
    title,
    slug,
    category,
    genre,
    year,
    coverImage,
    isUpcoming,
    order,
    "awards": awards[] { name, year, isWinner }
  }
`)

export const bookBySlugQuery = defineQuery(`
  *[_type == "book" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    category,
    genre,
    year,
    coverImage,
    description,
    excerpt,
    reviews,
    awards,
    purchaseLinks,
    isUpcoming,
    "relatedBooks": relatedBooks[]-> {
      _id, title, slug, category, year, coverImage
    }
  }
`)

// ── Gallery ──
export const allGalleryCategoriesQuery = defineQuery(`
  *[_type == "galleryCategory"] | order(order asc) {
    _id,
    title,
    slug,
    description,
    symbol,
    order,
    coverImage
  }
`)

export const artworksByCategoryQuery = defineQuery(`
  *[_type == "artwork" && category._ref == $categoryId] | order(order asc) {
    _id,
    title,
    slug,
    image,
    year,
    medium,
    dimensions,
    isForSale,
    watermarkImage,
    order
  }
`)

export const artworkBySlugQuery = defineQuery(`
  *[_type == "artwork" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    "category": category-> { _id, title, slug },
    image,
    year,
    medium,
    dimensions,
    description,
    isForSale,
    price,
    watermarkImage
  }
`)

// ── Blog ──
export const blogPostsQuery = defineQuery(`
  *[_type == "blogPost"] | order(isFeatured desc, publishedAt desc) {
    _id,
    title,
    slug,
    publishedAt,
    excerpt,
    featuredImage,
    isFeatured,
    "categories": categories[]-> { _id, title, slug }
  }
`)

export const blogPostBySlugQuery = defineQuery(`
  *[_type == "blogPost" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    publishedAt,
    body,
    featuredImage,
    isFeatured,
    "categories": categories[]-> { _id, title, slug }
  }
`)

export const allBlogCategoriesQuery = defineQuery(`
  *[_type == "blogCategory"] | order(title asc) {
    _id,
    title,
    slug,
    description
  }
`)

// ── Events ──
export const upcomingEventsQuery = defineQuery(`
  *[_type == "event" && isUpcoming == true] | order(date asc) {
    _id,
    title,
    slug,
    eventType,
    date,
    endDate,
    location,
    featuredImage,
    externalUrl,
    "relatedBooks": relatedBooks[]-> { _id, title, slug, coverImage }
  }
`)

export const pastEventsQuery = defineQuery(`
  *[_type == "event" && isUpcoming != true] | order(date desc) {
    _id,
    title,
    slug,
    eventType,
    date,
    location,
    featuredImage
  }
`)

export const eventBySlugQuery = defineQuery(`
  *[_type == "event" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    eventType,
    date,
    endDate,
    location,
    description,
    featuredImage,
    externalUrl,
    isUpcoming,
    "relatedBooks": relatedBooks[]-> { _id, title, slug, coverImage }
  }
`)

// ── Pages ──
export const pageBySlugQuery = defineQuery(`
  *[_type == "page" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    pageType,
    body,
    featuredImage,
    isPasswordProtected
  }
`)

// ── Exhibitions ──
export const allExhibitionsQuery = defineQuery(`
  *[_type == "exhibition"] | order(startDate desc) {
    _id,
    title,
    slug,
    venue,
    city,
    startDate,
    endDate,
    featuredImage,
    isUpcoming,
    externalUrl
  }
`)

export const exhibitionBySlugQuery = defineQuery(`
  *[_type == "exhibition" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    venue,
    city,
    startDate,
    endDate,
    description,
    featuredImage,
    isUpcoming,
    externalUrl,
    "artworks": artworks[]-> {
      _id, title, slug, image, medium, year
    }
  }
`)

// ── FLAT Project ──
export const flatProjectQuery = defineQuery(`
  *[_type == "flatProject"][0] {
    _id,
    title,
    description,
    externalUrl,
    featuredImage
  }
`)

// ── Site Settings (singleton) ──
export const siteSettingsQuery = defineQuery(`
  *[_type == "siteSettings"][0] {
    siteTitle,
    siteDescription,
    heroTagline,
    heroSubtitle,
    socialLinks,
    woodenDoorUrl,
    contactEmail,
    footerText,
    ogImage
  }
`)
