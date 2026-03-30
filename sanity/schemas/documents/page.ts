import {defineType, defineField} from 'sanity'
import {FileIcon} from 'lucide-react'

export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  icon: FileIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
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
      name: 'pageType',
      title: 'Page Type',
      type: 'string',
      description: 'What kind of page is this?',
      options: {
        list: [
          {title: 'Biography', value: 'bio'},
          {title: 'Interests', value: 'interests'},
          {title: 'Freelance', value: 'freelance'},
          {title: 'Portfolio', value: 'portfolio'},
          {title: 'Custom', value: 'custom'},
        ],
      },
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'blockContent',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'image',
      description: 'Optional hero or header image',
      options: {hotspot: true},
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alt text',
          validation: (Rule) => Rule.required(),
        },
      ],
    }),
    defineField({
      name: 'isPasswordProtected',
      title: 'Password Protected',
      type: 'boolean',
      description: 'Require a password to view this page',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      title: 'Sort Order',
      type: 'number',
      validation: (Rule) => Rule.integer().min(0),
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
      pageType: 'pageType',
    },
    prepare({title, pageType}) {
      const typeLabels: Record<string, string> = {
        bio: 'Biography',
        interests: 'Interests',
        freelance: 'Freelance',
        portfolio: 'Portfolio',
        custom: 'Custom',
      }
      return {
        title,
        subtitle: typeLabels[pageType] ?? pageType,
      }
    },
  },
})
