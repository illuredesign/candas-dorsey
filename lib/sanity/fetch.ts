import "server-only"

import { sanityFetch } from "@/sanity/lib/live"
import {
  allBooksQuery,
  booksByCategoryQuery,
  bookBySlugQuery,
  allGalleryCategoriesQuery,
  artworksByCategoryQuery,
  artworkBySlugQuery,
  blogPostsQuery,
  blogPostBySlugQuery,
  allBlogCategoriesQuery,
  upcomingEventsQuery,
  pastEventsQuery,
  eventBySlugQuery,
  pageBySlugQuery,
  allExhibitionsQuery,
  exhibitionBySlugQuery,
  flatProjectQuery,
  siteSettingsQuery,
} from "./queries"

// ── Books ──

export async function getAllBooks() {
  return (await sanityFetch({ query: allBooksQuery, tags: ["book"] })).data
}

export async function getBooksByCategory(category: string) {
  return (
    await sanityFetch({
      query: booksByCategoryQuery,
      params: { category },
      tags: ["book"],
    })
  ).data
}

export async function getBookBySlug(slug: string) {
  return (
    await sanityFetch({
      query: bookBySlugQuery,
      params: { slug },
      tags: ["book"],
    })
  ).data
}

// ── Gallery ──

export async function getAllGalleryCategories() {
  return (
    await sanityFetch({
      query: allGalleryCategoriesQuery,
      tags: ["galleryCategory"],
    })
  ).data
}

export async function getArtworksByCategory(categoryId: string) {
  return (
    await sanityFetch({
      query: artworksByCategoryQuery,
      params: { categoryId },
      tags: ["artwork"],
    })
  ).data
}

export async function getArtworkBySlug(slug: string) {
  return (
    await sanityFetch({
      query: artworkBySlugQuery,
      params: { slug },
      tags: ["artwork"],
    })
  ).data
}

// ── Blog ──

export async function getBlogPosts() {
  return (
    await sanityFetch({ query: blogPostsQuery, tags: ["blogPost"] })
  ).data
}

export async function getBlogPostBySlug(slug: string) {
  return (
    await sanityFetch({
      query: blogPostBySlugQuery,
      params: { slug },
      tags: ["blogPost"],
    })
  ).data
}

export async function getAllBlogCategories() {
  return (
    await sanityFetch({
      query: allBlogCategoriesQuery,
      tags: ["blogCategory"],
    })
  ).data
}

// ── Events ──

export async function getUpcomingEvents() {
  return (
    await sanityFetch({ query: upcomingEventsQuery, tags: ["event"] })
  ).data
}

export async function getPastEvents() {
  return (
    await sanityFetch({ query: pastEventsQuery, tags: ["event"] })
  ).data
}

export async function getEventBySlug(slug: string) {
  return (
    await sanityFetch({
      query: eventBySlugQuery,
      params: { slug },
      tags: ["event"],
    })
  ).data
}

// ── Pages ──

export async function getPageBySlug(slug: string) {
  return (
    await sanityFetch({
      query: pageBySlugQuery,
      params: { slug },
      tags: ["page"],
    })
  ).data
}

// ── Exhibitions ──

export async function getAllExhibitions() {
  return (
    await sanityFetch({
      query: allExhibitionsQuery,
      tags: ["exhibition"],
    })
  ).data
}

export async function getExhibitionBySlug(slug: string) {
  return (
    await sanityFetch({
      query: exhibitionBySlugQuery,
      params: { slug },
      tags: ["exhibition"],
    })
  ).data
}

// ── FLAT Project (singleton) ──

export async function getFlatProject() {
  return (
    await sanityFetch({ query: flatProjectQuery, tags: ["flatProject"] })
  ).data
}

// ── Site Settings (singleton) ──

export async function getSiteSettings() {
  return (
    await sanityFetch({
      query: siteSettingsQuery,
      tags: ["siteSettings"],
    })
  ).data
}
