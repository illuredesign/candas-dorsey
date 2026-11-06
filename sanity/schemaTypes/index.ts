import {type SchemaTypeDefinition} from 'sanity'

import {
  blockContent,
  creditedImage,
  review,
  award,
  purchaseLink,
  edition,
  seo,
  socialLink,
  book,
  writing,
  galleryCategory,
  artwork,
  exhibition,
  blogPost,
  blogCategory,
  event,
  page,
  link,
  pressKit,
  flatProject,
  siteSettings,
} from '../schemas'

export const schema: {types: SchemaTypeDefinition[]} = {
  types: [
    // Objects
    blockContent,
    creditedImage,
    review,
    award,
    purchaseLink,
    edition,
    seo,
    socialLink,
    // Documents
    book,
    writing,
    galleryCategory,
    artwork,
    exhibition,
    blogPost,
    blogCategory,
    event,
    page,
    link,
    pressKit,
    flatProject,
    siteSettings,
  ],
}
