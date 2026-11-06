import {defineType, defineField} from 'sanity'
import {LayoutGrid} from 'lucide-react'

export const galleryCategory = defineType({
  name: 'galleryCategory',
  title: 'Gallery Category',
  type: 'document',
  icon: LayoutGrid,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Category name (e.g. "Acrylic Paintings", "Watercolours")',
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Brief description of this medium or category',
    }),
    defineField({
      name: 'symbol',
      title: 'Symbol',
      type: 'string',
      description: 'A display symbol or icon character for this category',
    }),
    defineField({
      name: 'order',
      title: 'Sort Order',
      type: 'number',
      description: 'Controls display order (lower numbers appear first)',
      validation: (Rule) => Rule.integer().min(0),
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'creditedImage',
      description: 'Representative image for the category thumbnail',
    }),
  ],
  orderings: [
    {
      title: 'Sort Order',
      name: 'orderAsc',
      by: [{field: 'order', direction: 'asc'}],
    },
  ],
  preview: {
    select: {
      title: 'title',
      media: 'coverImage',
    },
  },
})
