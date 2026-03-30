import {type SchemaTypeDefinition} from 'sanity'

import {
  blockContent,
  review,
  award,
  purchaseLink,
  book,
  galleryCategory,
  artwork,
  blogPost,
  blogCategory,
  event,
  page,
  siteSettings,
  exhibition,
  flatProject,
} from '../schemas'

export const schema: {types: SchemaTypeDefinition[]} = {
  types: [
    // Objects
    blockContent,
    review,
    award,
    purchaseLink,
    // Documents
    book,
    galleryCategory,
    artwork,
    blogPost,
    blogCategory,
    event,
    page,
    siteSettings,
    exhibition,
    flatProject,
  ],
}
