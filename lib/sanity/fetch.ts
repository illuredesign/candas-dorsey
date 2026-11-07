import "server-only"

import { sanityFetch } from "@/sanity/lib/live"
import { client } from "@/sanity/lib/client"
import * as q from "./queries"
import type * as T from "./types"

/**
 * Thin typed wrappers around sanityFetch. Each call is tagged with its
 * document type(s) so the /api/revalidate webhook can purge it.
 */
async function fetchTyped<R>(
  query: string,
  params: Record<string, unknown> = {},
  tags: string[] = [],
): Promise<R> {
  const { data } = await sanityFetch({ query, params, tags })
  return data as R
}

// ── Books ──
export const getAllBooks = () => fetchTyped<T.BookCard[]>(q.allBooksQuery, {}, ["book"])
export const getBooksByCategory = (category: string) =>
  fetchTyped<T.BookCard[]>(q.booksByCategoryQuery, { category }, ["book"])
export const getUpcomingBooks = () => fetchTyped<T.BookCard[]>(q.upcomingBooksQuery, {}, ["book"])
export const getBookBySlug = (slug: string) =>
  fetchTyped<T.Book | null>(q.bookBySlugQuery, { slug }, ["book"])

// ── Other writing ──
export const getAllWriting = () => fetchTyped<T.WritingCard[]>(q.allWritingQuery, {}, ["writing"])
export const getWritingBySlug = (slug: string) =>
  fetchTyped<T.Writing | null>(q.writingBySlugQuery, { slug }, ["writing"])

// ── Gallery ──
export const getAllGalleryCategories = () =>
  fetchTyped<T.GalleryCategory[]>(q.allGalleryCategoriesQuery, {}, ["galleryCategory", "artwork"])
export const getGalleryCategoryBySlug = (slug: string) =>
  fetchTyped<T.GalleryCategoryWithArtworks | null>(q.galleryCategoryBySlugQuery, { slug }, [
    "galleryCategory",
    "artwork",
  ])
export const getArtworkBySlug = (slug: string) =>
  fetchTyped<T.Artwork | null>(q.artworkBySlugQuery, { slug }, ["artwork"])

// ── Blog ──
export const getBlogPosts = (opts: { category?: string; q?: string } = {}) =>
  fetchTyped<T.PostCard[]>(
    q.blogPostsQuery,
    { category: opts.category ?? "", q: opts.q ?? "" },
    ["blogPost"],
  )
export const getBlogPostBySlug = (slug: string) =>
  fetchTyped<T.Post | null>(q.blogPostBySlugQuery, { slug }, ["blogPost"])
export const getAllBlogCategories = () =>
  fetchTyped<T.BlogCategory[]>(q.allBlogCategoriesQuery, {}, ["blogCategory", "blogPost"])

// ── Events & exhibitions ──
export const getUpcomingEvents = () =>
  fetchTyped<T.EventsResult>(q.upcomingEventsQuery, {}, ["event", "exhibition"])
export const getPastEvents = () =>
  fetchTyped<T.EventsResult>(q.pastEventsQuery, {}, ["event", "exhibition"])
export const getEventBySlug = (slug: string) =>
  fetchTyped<T.Event | null>(q.eventBySlugQuery, { slug }, ["event"])
export const getExhibitionBySlug = (slug: string) =>
  fetchTyped<T.Exhibition | null>(q.exhibitionBySlugQuery, { slug }, ["exhibition"])

// ── Pages, links, press kit ──
export const getPageBySlug = (slug: string) =>
  fetchTyped<T.Page | null>(q.pageBySlugQuery, { slug }, ["page"])
export const getAllLinks = () => fetchTyped<T.LinkItem[]>(q.allLinksQuery, {}, ["link"])
export const getPressKit = () => fetchTyped<T.PressKit | null>(q.pressKitQuery, {}, ["pressKit"])

// ── Singletons ──
export const getFlatProject = () =>
  fetchTyped<T.FlatProject | null>(q.flatProjectQuery, {}, ["flatProject"])
export const getSiteSettings = () =>
  fetchTyped<T.SiteSettings | null>(q.siteSettingsQuery, {}, ["siteSettings"])

// ── Home ──
export const getHomeData = () =>
  fetchTyped<T.HomeData>(q.homeQuery, {}, ["book", "event", "exhibition", "blogPost", "artwork", "galleryCategory", "page"])

/**
 * Plain client reads for build-time work (sitemap, static params) and
 * server actions. No live subscription, published content only.
 */
export const getSitemapData = () =>
  client.fetch<T.SitemapData>(q.sitemapQuery, {}, { perspective: "published" })
export const getPressKitPassword = () =>
  client.fetch<string | null>(q.pressKitPasswordQuery, {}, {
    perspective: "published",
    useCdn: false,
  })
