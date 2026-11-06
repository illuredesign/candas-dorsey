import type {StructureResolver} from 'sanity/structure'

/** Document types that exist exactly once. */
export const singletonTypes = new Set(['siteSettings', 'pressKit', 'flatProject'])

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Writing')
        .child(
          S.list()
            .title('Writing')
            .items([
              S.documentTypeListItem('book').title('Books'),
              S.documentTypeListItem('writing').title('Other Writing'),
              S.documentTypeListItem('event').title('Events & Launches'),
            ]),
        ),
      S.listItem()
        .title('Art')
        .child(
          S.list()
            .title('Art')
            .items([
              S.documentTypeListItem('artwork').title('Artworks'),
              S.documentTypeListItem('galleryCategory').title('Gallery Categories'),
              S.documentTypeListItem('exhibition').title('Exhibitions'),
              S.listItem()
                .title('The FLAT Project')
                .id('flatProject')
                .child(S.document().schemaType('flatProject').documentId('flatProject')),
            ]),
        ),
      S.listItem()
        .title('Blog')
        .child(
          S.list()
            .title('Blog')
            .items([
              S.documentTypeListItem('blogPost').title('Posts'),
              S.documentTypeListItem('blogCategory').title('Categories'),
            ]),
        ),
      S.listItem()
        .title('About')
        .child(
          S.list()
            .title('About')
            .items([
              S.documentTypeListItem('page').title('Pages'),
              S.documentTypeListItem('link').title('Links (Candas-adjacent)'),
              S.listItem()
                .title('Press Kit')
                .id('pressKit')
                .child(S.document().schemaType('pressKit').documentId('pressKit')),
            ]),
        ),
      S.divider(),
      S.listItem()
        .title('Site Settings')
        .id('siteSettings')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
    ])
