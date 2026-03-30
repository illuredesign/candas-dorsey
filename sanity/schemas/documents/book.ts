import {defineType, defineField, defineArrayMember} from 'sanity'
import {BookOpen} from 'lucide-react'

export const book = defineType({
  name: 'book',
  title: 'Book',
  type: 'document',
  icon: BookOpen,
  groups: [
    {name: 'details', title: 'Details', default: true},
    {name: 'content', title: 'Content'},
    {name: 'reviews', title: 'Reviews & Awards'},
    {name: 'purchase', title: 'Purchase Links'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'The book title',
      group: 'details',
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'URL-friendly identifier (auto-generated from title)',
      group: 'details',
      options: {source: 'title', maxLength: 96},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      description: 'What type of publication is this?',
      group: 'details',
      options: {
        list: [
          {title: 'Novel', value: 'novel'},
          {title: 'Short Fiction Collection', value: 'shortFiction'},
          {title: 'Anthology', value: 'anthology'},
          {title: 'Poetry', value: 'poetry'},
          {title: 'Other', value: 'other'},
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'genre',
      title: 'Genre',
      type: 'string',
      description: 'e.g. "Speculative Fiction", "Mystery", "Young Adult", "Mainstream"',
      group: 'details',
    }),
    defineField({
      name: 'year',
      title: 'Publication Year',
      type: 'string',
      description: 'Year of publication (use "Forthcoming" for upcoming titles)',
      group: 'details',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      group: 'details',
      options: {hotspot: true},
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alt text',
          description: 'Describe the cover for accessibility',
          validation: (Rule) => Rule.required(),
        },
      ],
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'blockContent',
      description: 'Synopsis or write-up about the book',
      group: 'content',
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'blockContent',
      description: 'A sample passage from the book',
      group: 'content',
    }),
    defineField({
      name: 'reviews',
      title: 'Reviews',
      type: 'array',
      group: 'reviews',
      of: [defineArrayMember({type: 'review'})],
    }),
    defineField({
      name: 'awards',
      title: 'Awards',
      type: 'array',
      group: 'reviews',
      of: [defineArrayMember({type: 'award'})],
    }),
    defineField({
      name: 'purchaseLinks',
      title: 'Purchase Links',
      type: 'array',
      description: 'Where readers can buy this book',
      group: 'purchase',
      of: [defineArrayMember({type: 'purchaseLink'})],
    }),
    defineField({
      name: 'isUpcoming',
      title: 'Upcoming / Forthcoming',
      type: 'boolean',
      description: 'Flag this book as not yet published',
      group: 'details',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      title: 'Sort Order',
      type: 'number',
      description: 'Manual sort order within its category (lower numbers appear first)',
      group: 'details',
      validation: (Rule) => Rule.integer().min(0),
    }),
    defineField({
      name: 'relatedBooks',
      title: 'Related Books',
      type: 'array',
      description: 'Other books by Candas to link to',
      group: 'content',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: 'book'}],
        }),
      ],
    }),
  ],
  orderings: [
    {
      title: 'Sort Order',
      name: 'orderAsc',
      by: [{field: 'order', direction: 'asc'}],
    },
    {
      title: 'Publication Year (Newest)',
      name: 'yearDesc',
      by: [{field: 'year', direction: 'desc'}],
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
      category: 'category',
      year: 'year',
      media: 'coverImage',
    },
    prepare({title, category, year, media}) {
      const categoryLabels: Record<string, string> = {
        novel: 'Novel',
        shortFiction: 'Short Fiction',
        anthology: 'Anthology',
        poetry: 'Poetry',
        other: 'Other',
      }
      return {
        title,
        subtitle: [categoryLabels[category] ?? category, year]
          .filter(Boolean)
          .join(' · '),
        media,
      }
    },
  },
})
