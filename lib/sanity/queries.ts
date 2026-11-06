import { defineQuery } from "next-sanity"

/* Shared projections */
const imageFields = `{ asset, hotspot, crop, alt, caption, credit }`
const bookCard = `{
  _id, title, subtitle, slug, category, genre, year, publisher, coAuthors, isUpcoming, order,
  coverImage ${imageFields},
  "awards": awards[] { name, year, isWinner }
}`
const artworkCard = `{
  _id, title, slug, year, medium, dimensions, status, price, watermarkImage, order,
  image ${imageFields}
}`
const postCard = `{
  _id, title, slug, publishedAt, excerpt, isFeatured,
  featuredImage ${imageFields},
  "categories": categories[]-> { _id, title, slug }
}`
const eventCard = `{
  _id, _type, title, slug, eventType, date, endDate, location, externalUrl,
  featuredImage ${imageFields},
  "relatedBooks": relatedBooks[]-> { _id, title, slug, coverImage ${imageFields} }
}`
const exhibitionCard = `{
  _id, _type, title, slug, venue, city, startDate, endDate, externalUrl,
  featuredImage ${imageFields}
}`
const seoFields = `seo { metaTitle, metaDescription, ogImage }`

// ── Books ──
export const allBooksQuery = defineQuery(`
  *[_type == "book"] | order(category asc, order asc, year desc) ${bookCard}
`)

export const booksByCategoryQuery = defineQuery(`
  *[_type == "book" && category == $category] | order(order asc, year desc) ${bookCard}
`)

export const upcomingBooksQuery = defineQuery(`
  *[_type == "book" && isUpcoming == true] | order(order asc) ${bookCard}
`)

export const bookBySlugQuery = defineQuery(`
  *[_type == "book" && slug.current == $slug][0] {
    _id, title, subtitle, slug, category, genre, year, publisher, coAuthors, isUpcoming,
    coverImage ${imageFields},
    description, excerpt, reviews, awards, editions, purchaseLinks,
    ${seoFields},
    "relatedBooks": relatedBooks[]-> ${bookCard}
  }
`)

export const bookSlugsQuery = defineQuery(`*[_type == "book" && defined(slug.current)].slug.current`)

// ── Other writing ──
export const allWritingQuery = defineQuery(`
  *[_type == "writing"] | order(order asc, year desc) {
    _id, title, slug, kind, publishedIn, year, excerpt, url, "hasBody": defined(body)
  }
`)

export const writingBySlugQuery = defineQuery(`
  *[_type == "writing" && slug.current == $slug][0] {
    _id, title, slug, kind, publishedIn, year, excerpt, url, body
  }
`)

// ── Gallery ──
export const allGalleryCategoriesQuery = defineQuery(`
  *[_type == "galleryCategory"] | order(order asc) {
    _id, title, slug, description, symbol, order,
    coverImage ${imageFields},
    "count": count(*[_type == "artwork" && references(^._id)]),
    "firstArtwork": *[_type == "artwork" && references(^._id)] | order(order asc)[0] { image ${imageFields} }
  }
`)

export const galleryCategoryBySlugQuery = defineQuery(`
  *[_type == "galleryCategory" && slug.current == $slug][0] {
    _id, title, slug, description,
    "artworks": *[_type == "artwork" && references(^._id)] | order(order asc, title asc) ${artworkCard}
  }
`)

export const artworkBySlugQuery = defineQuery(`
  *[_type == "artwork" && slug.current == $slug][0] {
    _id, title, slug, year, medium, dimensions, series, status, price, watermarkImage, description,
    image ${imageFields},
    "category": category-> { _id, title, slug },
    "siblings": *[_type == "artwork" && category._ref == ^.category._ref && _id != ^._id] | order(order asc, title asc)[0...6] ${artworkCard}
  }
`)

export const gallerySlugsQuery = defineQuery(`{
  "categories": *[_type == "galleryCategory" && defined(slug.current)].slug.current,
  "artworks": *[_type == "artwork" && defined(slug.current)].slug.current
}`)

// ── Blog ──
export const blogPostsQuery = defineQuery(`
  *[_type == "blogPost"
    && ($category == "" || $category in categories[]->slug.current)
    && ($q == "" || title match $q + "*" || excerpt match $q + "*" || pt::text(body) match $q + "*")
  ] | order(isFeatured desc, publishedAt desc) ${postCard}
`)

export const blogPostBySlugQuery = defineQuery(`
  *[_type == "blogPost" && slug.current == $slug][0] {
    _id, title, slug, publishedAt, excerpt, body, isFeatured,
    featuredImage ${imageFields},
    ${seoFields},
    "categories": categories[]-> { _id, title, slug }
  }
`)

export const allBlogCategoriesQuery = defineQuery(`
  *[_type == "blogCategory"] | order(title asc) {
    _id, title, slug, description,
    "count": count(*[_type == "blogPost" && references(^._id)])
  }
`)

export const blogSlugsQuery = defineQuery(`*[_type == "blogPost" && defined(slug.current)].slug.current`)

// ── Events & exhibitions (upcoming is computed from dates, never a checkbox) ──
export const upcomingEventsQuery = defineQuery(`{
  "events": *[_type == "event" && coalesce(endDate, date) >= now()] | order(date asc) ${eventCard},
  "exhibitions": *[_type == "exhibition" && coalesce(endDate, startDate) >= now()] | order(startDate asc) ${exhibitionCard}
}`)

export const pastEventsQuery = defineQuery(`{
  "events": *[_type == "event" && coalesce(endDate, date) < now()] | order(date desc) ${eventCard},
  "exhibitions": *[_type == "exhibition" && coalesce(endDate, startDate) < now()] | order(startDate desc) ${exhibitionCard}
}`)

export const eventBySlugQuery = defineQuery(`
  *[_type == "event" && slug.current == $slug][0] {
    _id, _type, title, slug, eventType, date, endDate, location, description, externalUrl,
    featuredImage ${imageFields},
    "relatedBooks": relatedBooks[]-> ${bookCard}
  }
`)

export const exhibitionBySlugQuery = defineQuery(`
  *[_type == "exhibition" && slug.current == $slug][0] {
    _id, _type, title, slug, venue, city, startDate, endDate, description, externalUrl,
    featuredImage ${imageFields},
    "artworks": artworks[]-> ${artworkCard}
  }
`)

export const eventSlugsQuery = defineQuery(`{
  "events": *[_type == "event" && defined(slug.current)].slug.current,
  "exhibitions": *[_type == "exhibition" && defined(slug.current)].slug.current
}`)

// ── Pages ──
export const pageBySlugQuery = defineQuery(`
  *[_type == "page" && slug.current == $slug][0] {
    _id, title, slug, pageType, body,
    featuredImage ${imageFields},
    ${seoFields},
    "parent": parent-> { title, slug },
    "children": *[_type == "page" && parent._ref == ^._id] | order(order asc) { _id, title, slug }
  }
`)

export const pageSlugsQuery = defineQuery(`*[_type == "page" && defined(slug.current)].slug.current`)

// ── Links (Candas-adjacent) ──
export const allLinksQuery = defineQuery(`
  *[_type == "link"] | order(group asc, order asc, title asc) { _id, title, url, description, group }
`)

// ── Press kit (singleton) ──
export const pressKitQuery = defineQuery(`
  *[_type == "pressKit"][0] {
    title, intro, shortBio, mediumBio, longBio,
    "headshots": headshots[] { ...@ ${imageFields}, "url": asset->url, "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height, "size": asset->size },
    "files": files[] { title, "url": asset->url, "size": asset->size, "extension": asset->extension }
  }
`)

export const pressKitPasswordQuery = defineQuery(`*[_type == "pressKit"][0].password`)

// ── FLAT Project (singleton) ──
export const flatProjectQuery = defineQuery(`
  *[_type == "flatProject"][0] { _id, title, description, externalUrl, featuredImage ${imageFields} }
`)

// ── Site settings (singleton) ──
export const siteSettingsQuery = defineQuery(`
  *[_type == "siteSettings"][0] {
    siteTitle, siteDescription, heroTagline, heroSubtitle, socialLinks, woodenDoorUrl, contactEmail, footerText, ogImage
  }
`)

// ── Home page strip ──
export const homeQuery = defineQuery(`{
  "latestBook": *[_type == "book" && isUpcoming != true] | order(year desc, order asc)[0] ${bookCard},
  "upcomingBook": *[_type == "book" && isUpcoming == true] | order(order asc)[0] ${bookCard},
  "nextEvent": *[_type == "event" && coalesce(endDate, date) >= now()] | order(date asc)[0] ${eventCard},
  "latestPost": *[_type == "blogPost"] | order(publishedAt desc)[0] ${postCard}
}`)

// ── Sitemap ──
export const sitemapQuery = defineQuery(`{
  "books": *[_type == "book" && defined(slug.current)] { "slug": slug.current, _updatedAt },
  "writing": *[_type == "writing" && defined(slug.current)] { "slug": slug.current, _updatedAt },
  "artworks": *[_type == "artwork" && defined(slug.current)] { "slug": slug.current, _updatedAt },
  "categories": *[_type == "galleryCategory" && defined(slug.current)] { "slug": slug.current, _updatedAt },
  "posts": *[_type == "blogPost" && defined(slug.current)] { "slug": slug.current, _updatedAt },
  "events": *[_type == "event" && defined(slug.current)] { "slug": slug.current, _updatedAt },
  "exhibitions": *[_type == "exhibition" && defined(slug.current)] { "slug": slug.current, _updatedAt },
  "pages": *[_type == "page" && defined(slug.current)] { "slug": slug.current, _updatedAt }
}`)
