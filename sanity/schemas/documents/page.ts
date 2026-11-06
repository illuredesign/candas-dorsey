import {defineType, defineField} from 'sanity'
import {FileIcon} from 'lucide-react'

export const pageTypes = [
  {title: 'Biography', value: 'bio'},
  {title: 'Interests', value: 'interests'},
  {title: 'Freelance', value: 'freelance'},
  {title: 'Custom', value: 'custom'},
]

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
      title: 'Page type',
      type: 'string',
      options: {list: pageTypes},
    }),
    defineField({
      name: 'parent',
      title: 'Parent page',
      type: 'reference',
      to: [{type: 'page'}],
      description: 'For sub-pages, e.g. "My past as a newspaper" under the biography',
    }),
    defineField({
      name: 'featuredImage',
      title: 'Featured image',
      type: 'creditedImage',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'blockContent',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Sort order',
      type: 'number',
      validation: (Rule) => Rule.integer().min(0),
    }),
    defineField({
      name: 'seo',
      title: 'SEO & Sharing',
      type: 'seo',
    }),
  ],
  orderings: [{title: 'Sort order', name: 'orderAsc', by: [{field: 'order', direction: 'asc'}]}],
  preview: {
    select: {title: 'title', pageType: 'pageType', parent: 'parent.title'},
    prepare({title, pageType, parent}) {
      const label = pageTypes.find((t) => t.value === pageType)?.title ?? pageType
      return {title, subtitle: [parent && `under ${parent}`, label].filter(Boolean).join(' · ')}
    },
  },
})
