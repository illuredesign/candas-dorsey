/**
 * Date and display formatting helpers.
 */

const dateLocale = "en-CA"

export function formatDate(
  date: string | Date,
  options?: Intl.DateTimeFormatOptions,
): string {
  return new Date(date).toLocaleDateString(dateLocale, {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...options,
  })
}

export function formatShortDate(date: string | Date): string {
  return new Date(date).toLocaleDateString(dateLocale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function formatMonthYear(date: string | Date): string {
  return new Date(date).toLocaleDateString(dateLocale, {
    year: "numeric",
    month: "long",
  })
}

export function formatDateRange(
  start: string | Date,
  end?: string | Date | null,
): string {
  const startStr = formatShortDate(start)
  if (!end) return startStr
  const endStr = formatShortDate(end)
  return `${startStr} – ${endStr}`
}

/** Book category value → display label */
const bookCategoryLabels: Record<string, string> = {
  novel: "Novels",
  shortFiction: "Short Fiction",
  anthology: "Anthologies",
  poetry: "Poetry",
  other: "Other",
}

export function formatBookCategory(category: string): string {
  return bookCategoryLabels[category] ?? category
}

/** Event type value → display label */
const eventTypeLabels: Record<string, string> = {
  bookLaunch: "Book Launch",
  reading: "Reading",
  signing: "Signing",
  exhibition: "Exhibition",
  workshop: "Workshop",
  panel: "Panel",
  other: "Other",
}

export function formatEventType(eventType: string): string {
  return eventTypeLabels[eventType] ?? eventType
}

/** Page type value → display label */
const pageTypeLabels: Record<string, string> = {
  bio: "Biography",
  interests: "Interests",
  freelance: "Freelance",
  custom: "Custom",
}

export function formatPageType(pageType: string): string {
  return pageTypeLabels[pageType] ?? pageType
}

/** Artwork status value → display label */
const artworkStatusLabels: Record<string, string> = {
  available: "Available",
  sold: "Sold",
  privateCollection: "Private collection",
  notForSale: "Not for sale",
}

export function formatArtworkStatus(status?: string | null): string {
  return status ? (artworkStatusLabels[status] ?? status) : ""
}

/** Writing kind value → display label */
const writingKindLabels: Record<string, string> = {
  story: "Short story",
  essay: "Essay",
  poem: "Poem",
  article: "Article",
  review: "Review",
  other: "Other",
}

export function formatWritingKind(kind?: string | null): string {
  return kind ? (writingKindLabels[kind] ?? kind) : ""
}

/** Edition format value → display label */
const editionFormatLabels: Record<string, string> = {
  hardcover: "Hardcover",
  paperback: "Paperback",
  ebook: "E-book",
  audiobook: "Audiobook",
  limited: "Limited edition",
  translation: "Translation",
}

export function formatEditionFormat(format?: string | null): string {
  return format ? (editionFormatLabels[format] ?? format) : ""
}

/** Link group value → display label */
const linkGroupLabels: Record<string, string> = {
  community: "Community & Advocacy",
  morris: "Edmonton Magpie Morris",
  other: "Other Things I Do",
  linksILike: "Links I Like",
}

export function formatLinkGroup(group: string): string {
  return linkGroupLabels[group] ?? group
}

export function formatPrice(amount: number, currency = "CAD"): string {
  return new Intl.NumberFormat("en-CA", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount)
}

export function formatFileSize(bytes?: number | null): string {
  if (!bytes) return ""
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
