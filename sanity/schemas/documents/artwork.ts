import {defineType, defineField} from 'sanity'
import {Palette} from 'lucide-react'

export const artwork = defineType({
  name: 'artwork',
  title: 'Artwork',
  type: 'document',
  icon: Palette,
  groups: [
    {name: 'details', title: 'Details', default: true},
    {name: 'sale', title: 'Sale Info'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Title of the artwork',
      group: 'details',
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'details',
      options: {source: 'title', maxLength: 96},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Gallery Category',
      type: 'reference',
      to: [{type: 'galleryCategory'}],
      description: 'Which gallery category does this belong to?',
      group: 'details',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      description: 'High-quality photo of the artwork',
      group: 'details',
      options: {hotspot: true},
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alt text',
          description: 'Describe the artwork for accessibility',
          validation: (Rule) => Rule.required(),
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'year',
      title: 'Year Created',
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
      description: 'e.g. "24 x 36 inches"',
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
      name: 'isForSale',
      title: 'For Sale',
      type: 'boolean',
      description: 'Is this piece currently available for purchase?',
      group: 'sale',
      initialValue: false,
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'number',
      description: 'Price in CAD (for future Stripe integration)',
      group: 'sale',
      hidden: ({document}) => !document?.isForSale,
    }),
    defineField({
      name: 'watermarkImage',
      title: 'Apply Watermark',
      type: 'boolean',
      description: 'Whether to apply a watermark overlay when displaying this image',
      group: 'details',
      initialValue: true,
    }),
    defineField({
      name: 'order',
      title: 'Sort Order',
      type: 'number',
      description: 'Sort order within its category (lower numbers appear first)',
      group: 'details',
      validation: (Rule) => Rule.integer().min(0),
    }),
  ],
  orderings: [
    {
      title: 'Sort Order',
      name: 'orderAsc',
      by: [{field: 'order', direction: 'asc'}],
    },
    {
      title: 'Title A-Z',
      name: 'titleAsc',
      by: [{field: 'title', direction: 'asc'}],
    },
  ],
  preview: {
    select: {
      title: 'title',
      categoryTitle: 'category.title',
      year: 'year',
      media: 'image',
    },
    prepare({title, categoryTitle, year, media}) {
      return {
        title,
        subtitle: [categoryTitle, year].filter(Boolean).join(' · '),
        media,
      }
    },
  },
})
