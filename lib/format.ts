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
  novel: "Novel",
  shortFiction: "Short Fiction",
  anthology: "Anthology",
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
  portfolio: "Portfolio",
  custom: "Custom",
}

export function formatPageType(pageType: string): string {
  return pageTypeLabels[pageType] ?? pageType
}
