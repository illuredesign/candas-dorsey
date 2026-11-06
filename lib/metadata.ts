import type { Metadata } from "next"
import { urlFor } from "@/sanity/lib/image"
import type { SanityImage, Seo } from "@/lib/sanity/types"
import { siteUrl } from "./site"

type BuildMetadataInput = {
  title: string
  description?: string | null
  path: string
  image?: SanityImage
  seo?: Seo
  type?: "website" | "article" | "book"
  noIndex?: boolean
}

/** Builds page metadata, letting a document's SEO group override the defaults. */
export function buildMetadata({
  title,
  description,
  path,
  image,
  seo,
  type = "website",
  noIndex,
}: BuildMetadataInput): Metadata {
  const finalTitle = seo?.metaTitle || title
  const finalDescription = seo?.metaDescription || description || undefined
  const ogSource = seo?.ogImage?.asset ? seo.ogImage : image?.asset ? image : null
  const ogImage = ogSource
    ? [{ url: urlFor(ogSource).width(1200).height(630).fit("crop").auto("format").url(), width: 1200, height: 630 }]
    : undefined

  return {
    title: finalTitle,
    description: finalDescription,
    alternates: { canonical: `${siteUrl}${path}` },
    openGraph: {
      title: finalTitle,
      description: finalDescription,
      url: `${siteUrl}${path}`,
      type: type === "book" ? "book" : type,
      images: ogImage,
    },
    twitter: { card: ogImage ? "summary_large_image" : "summary" },
    robots: noIndex ? { index: false, follow: false } : undefined,
  }
}
