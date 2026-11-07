# How the site is updated

Everything a visitor reads or sees comes from Sanity. Candas edits in the Studio at
`/studio` (same deployment, her own login); nothing on the site is hard-coded except
layout, colours and the navigation structure. No deploy is needed after a content change.

## The flow from Studio to screen

```
Studio (/studio)  ──publish──►  Sanity dataset "production"
                                        │
                                        │  GROQ queries   lib/sanity/queries.ts
                                        ▼
                              lib/sanity/fetch.ts  (one typed getter per query)
                                        │
                                        ▼
                      app/(website)/(site)/**/page.tsx  (server components)
                                        │
                                        ▼
                     components/content/*  components/sanity/*  (presentation only)
```

- **Queries** live in one file, `lib/sanity/queries.ts`, and are typed by hand in
  `lib/sanity/types.ts`. A page never writes GROQ inline.
- **Fetching** goes through `sanityFetch` from `next-sanity/live`. Pages render
  dynamically and the `<SanityLive />` component in the site layout refreshes the page
  in the browser when a published document changes, so edits appear within seconds.
- **Revalidation webhook**: `app/api/revalidate/route.ts` accepts a Sanity webhook
  (secret in `SANITY_REVALIDATE_SECRET`) and busts the cache tag named after the
  document type. Configure it in Sanity → API → Webhooks pointing at
  `https://<site>/api/revalidate` with the same secret.
- **Images** are served from Sanity's CDN through `components/sanity/SanityImage.tsx`,
  which asks for the right width and respects the crop/hotspot set in the Studio.
  Every image field is the `creditedImage` object: alt text (required), caption, credit.
- **Rich text** (`blockContent`) is rendered by `components/sanity/Prose.tsx`.

## What lives where

| Page | Sanity document(s) | Renders with |
| --- | --- | --- |
| `/` | `siteSettings` (hero tagline, subtitle); via `homeQuery`: forthcoming/latest `book` + 4 recent covers, `galleryCategory` tiles with counts, first 10 `artwork`s, next `event` and `exhibition`, latest `blogPost`, the `about` page image + first paragraph | `components/hero/Hero.tsx`, `components/home/{TwoDoors,SelectedWorks,NowStrip,AboutTeaser}.tsx` |
| `/books`, `/books/novels` etc. | every `book`; `category` field picks the shelf, `isUpcoming` floats it to Forthcoming, `order` sorts within a shelf. A book without a cover scan gets a typographic cover in the shelf's colour | `components/content/BookCard.tsx`, `BookCover.tsx` |
| `/books/<slug>` | one `book`: description, excerpt, editions, reviews, awards, purchase links, related books, SEO | `books/[slug]/page.tsx` |
| `/writing`, `/writing/<slug>` | `writing` (stories, essays, poems, articles); an entry with a `url` and no body links out | `writing/*` |
| `/gallery` | every `galleryCategory`; thumbnail is the category's cover image or its first artwork | `gallery/page.tsx` |
| `/gallery/<category>` | the category plus its `artwork`s ordered by `order` then title | `components/content/ArtworkCard.tsx` |
| `/gallery/<artwork>` | one `artwork`: image, year, medium, dimensions, series, status, price, description, position in series, prev/next by `order`; "Enquire" pre-fills the contact subject | `components/content/ArtworkViewer.tsx` (focus mode + watermark) |
| `/blog`, `/blog/<slug>` | `blogPost` (+ `category` for the filter); search uses the `q` query string | `components/content/PostCard.tsx` |
| `/events` | `event` and `exhibition`, merged; "upcoming" is computed from the date, never ticked by hand | `components/content/EventCard.tsx` |
| `/about` | `page` with slug `about` plus any `page` whose `parent` is that page | `about/page.tsx`, `components/sanity/Prose.tsx` |
| `/about/freelance`, `/about/interests` | `page` with slug `freelance` / `interests` | `about/freelance`, `about/interests` |
| `/about/press` | `pressKit` singleton: password, three bios, headshots (full-res downloads), other files | `components/forms/PressKitGate.tsx`, `CopyButton.tsx` |
| `/flat` | `flatProject` singleton: description, external link, featured image | `flat/page.tsx` |
| `/contact` | form only; sends with Resend (`RESEND_API_KEY`, `CONTACT_RECIPIENT_EMAIL`) | `components/forms/ContactForm.tsx`, `app/actions/contact.ts` |
| Header / footer | navigation is code (`lib/navigation.ts`); footer text and social links come from `siteSettings` | `components/layout/*` |
| `sitemap.xml`, `robots.txt`, share images, JSON-LD | generated from the same documents; each document's optional `seo` object overrides title/description/image | `app/sitemap.ts`, `lib/metadata.ts` |

Singletons (`siteSettings`, `pressKit`, `flatProject`) cannot be duplicated or deleted
from the Studio; everything else is a normal list under Writing / Art / Blog / About.

## Design system in one paragraph

Three faces: EB Garamond carries display *and* body text (`.display-hero` … `.display-4`,
`.lede`, `.body-lg`), Bebas Neue is the label face for nav, buttons and the red
`.label-block`, JetBrains Mono is metadata only (`.eyebrow`, `.meta`, never under 12px).
Colour is flat and hard-edged: canvas-cream, night-soil, label-red, cadmium-yellow,
cobalt-blue, emerald-green (availability). No gradients, no tinted overlays; text never
uses opacity for "grey" (use `text-ink-soft` / `text-ink-mute`, which pass 4.5:1).
One container (`.container-x`) and one reveal recipe (`components/motion/Reveal.tsx`,
fade + 24px rise, once, honours reduced motion). Pages take a `tone` so each section of
the site has its own colour field: books = ink, gallery = blue, events = red,
about/contact = yellow.

## Rules we build components by

1. **One query, one getter, one type.** Add a GROQ query in `queries.ts`, a result type in
   `types.ts`, a getter in `fetch.ts`. Pages call getters only.
2. **Pages fetch, components render.** Nothing in `components/` talks to Sanity; it
   receives plain props. That keeps components testable and reusable across pages.
3. **Empty states are designed, not accidental.** Every list renders
   `components/content/EmptyState.tsx` when there is nothing yet, so a half-filled
   Studio never shows a broken page.
4. **Schema fields map to visible UI.** If a field has no component that shows it, it
   does not go in the schema. Field descriptions in the Studio say where the value appears.
5. **Derive, don't duplicate.** "Upcoming", counts, cover fallbacks and slugs for
   category pages are computed in GROQ, so editors never maintain two copies of a fact.
6. **Images always carry alt text and a credit**, enforced by the `creditedImage` type.
7. **Server-only secrets stay in `lib/`**, never in a `"use server"` file (those are
   callable from the browser). Form handling goes through `app/actions/*`.

## Seeding and re-seeding

- `sanity/seed.ndjson` holds the text content built from the 2026 résumé and the 2020
  site plan (books, pages, bios, settings).
- `scripts/build-seed-content.mjs` reads Candas's client folder, picks the artworks and
  headshots, resizes them into `sanity/seed-assets/` (git-ignored) and writes
  `sanity/seed-content.ndjson`. It is the record of which file became which artwork,
  with the title, year, medium and status assigned to each.
- Import (run where you are logged in to Sanity):

  ```
  npx sanity dataset import sanity/seed.ndjson production
  npx sanity dataset import sanity/seed-content.ndjson production --replace
  ```

  `--replace` is needed for the second file because it re-emits existing documents
  (books with covers, press kit with headshots, settings with a share image).
