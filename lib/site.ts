/** Canonical site URL for metadata, sitemap and absolute links. */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://candas-dorsey.vercel.app")
).replace(/\/$/, "")

export const siteName = "Candas Jane Dorsey"
