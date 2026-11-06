import type { MetadataRoute } from "next"
import { getSitemapData } from "@/lib/sanity/fetch"
import { siteUrl } from "@/lib/site"

const staticPaths = [
  "",
  "/books",
  "/books/novels",
  "/books/short-fiction",
  "/books/anthologies",
  "/books/poetry",
  "/writing",
  "/gallery",
  "/blog",
  "/events",
  "/about",
  "/about/freelance",
  "/about/interests",
  "/flat",
  "/contact",
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const data = await getSitemapData()
  const entry = (path: string, lastModified?: string): MetadataRoute.Sitemap[number] => ({
    url: `${siteUrl}${path}`,
    lastModified: lastModified ? new Date(lastModified) : undefined,
  })

  return [
    ...staticPaths.map((p) => entry(p)),
    ...data.books.map((b) => entry(`/books/${b.slug}`, b._updatedAt)),
    ...data.writing.map((w) => entry(`/writing/${w.slug}`, w._updatedAt)),
    ...data.categories.map((c) => entry(`/gallery/${c.slug}`, c._updatedAt)),
    ...data.artworks.map((a) => entry(`/gallery/${a.slug}`, a._updatedAt)),
    ...data.posts.map((p) => entry(`/blog/${p.slug}`, p._updatedAt)),
    ...data.events.map((e) => entry(`/events/${e.slug}`, e._updatedAt)),
    ...data.exhibitions.map((e) => entry(`/events/${e.slug}`, e._updatedAt)),
    ...data.pages
      .filter((p) => !["about", "freelance", "interests"].includes(p.slug))
      .map((p) => entry(`/about/${p.slug}`, p._updatedAt)),
  ]
}
