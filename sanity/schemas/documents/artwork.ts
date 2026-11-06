import {defineType, defineField} from 'sanity'
import {Palette} from 'lucide-react'

export const artworkStatuses = [
  {title: 'Available', value: 'available'},
  {title: 'Sold', value: 'sold'},
  {title: 'Private collection', value: 'privateCollection'},
  {title: 'Not for sale', value: 'notForSale'},
]

export const artwork = defineType({
  name: 'artwork',
  title: 'Artwork',
  type: 'document',
  icon: Palette,
  groups: [
    {name: 'details', title: 'Details', default: true},
    {name: 'sale', title: 'Availability'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'details',
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'URL: /gallery/<slug>',
      group: 'details',
      options: {source: 'title', maxLength: 96},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Gallery category',
      type: 'reference',
      to: [{type: 'galleryCategory'}],
      group: 'details',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'creditedImage',
      description: 'High-quality photo of the artwork',
      group: 'details',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'year',
      title: 'Year created',
      type: 'string',
      group: 'details',
    }),
    defineField({
      name: 'medium',
      title: 'Medium',
      type: 'string',
      description: 'e.g. "Acrylic on canvas", "Watercolour on paper"',
      group: 'details',
    }),
    defineField({
      name: 'dimensions',
      title: 'Dimensions',
      type: 'string',
      description: 'e.g. "24 × 36 in" or "61 × 91 cm"',
      group: 'details',
    }),
    defineField({
      name: 'series',
      title: 'Series',
      type: 'string',
      description: 'Optional grouping, e.g. "Collage Words"',
      group: 'details',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'blockContent',
      description: 'Artist statement or notes about this piece',
      group: 'details',
    }),
    defineField({
      name: 'watermarkImage',
      title: 'Apply watermark',
      type: 'boolean',
      description: 'Overlay a watermark when displaying this image',
      group: 'details',
      initialValue: true,
    }),
    defineField({
      name: 'order',
      title: 'Sort order',
      type: 'number',
      description: 'Within its category; lower numbers appear first',
      group: 'details',
      validation: (Rule) => Rule.integer().min(0),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      group: 'sale',
      options: {list: artworkStatuses, layout: 'radio'},
      initialValue: 'notForSale',
    }),
    defineField({
      name: 'price',
      title: 'Price (CAD)',
      type: 'number',
      description: 'Shown only when status is Available. Used by Stage 2 checkout.',
      group: 'sale',
      hidden: ({document}) => document?.status !== 'available',
    }),
  ],
  orderings: [
    {title: 'Sort order', name: 'orderAsc', by: [{field: 'order', direction: 'asc'}]},
    {title: 'Title A–Z', name: 'titleAsc', by: [{field: 'title', direction: 'asc'}]},
  ],
  preview: {
    select: {title: 'title', categoryTitle: 'category.title', year: 'year', media: 'image'},
    prepare({title, categoryTitle, year, media}) {
      return {title, subtitle: [categoryTitle, year].filter(Boolean).join(' · '), media}
    },
  },
})
