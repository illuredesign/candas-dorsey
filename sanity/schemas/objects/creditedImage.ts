import {defineType, defineField} from 'sanity'

/**
 * Image with alt text, optional caption and photographer/artist credit.
 * Same stored shape as a plain `image` (asset ref + hotspot), so it can
 * replace existing image fields without migrating data.
 */
export const creditedImage = defineType({
  name: 'creditedImage',
  title: 'Image',
  type: 'image',
  options: {hotspot: true},
  fields: [
    defineField({
      name: 'alt',
      title: 'Alt text',
      type: 'string',
      description: 'Describe the image for screen readers and search engines',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
    }),
    defineField({
      name: 'credit',
      title: 'Photo credit',
      type: 'string',
      description: 'Photographer or source, e.g. "Photo: Steven Stefaniuk"',
    }),
  ],
})
