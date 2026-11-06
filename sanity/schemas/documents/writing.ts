import {defineType, defineField} from 'sanity'
import {PenLine} from 'lucide-react'

export const writingKinds = [
  {title: 'Short story', value: 'story'},
  {title: 'Essay', value: 'essay'},
  {title: 'Poem', value: 'poem'},
  {title: 'Article', value: 'article'},
  {title: 'Review / criticism', value: 'review'},
  {title: 'Other', value: 'other'},
]

/** Shorter pieces: stories, poems and essays, read on-site or linked out. */
export const writing = defineType({
  name: 'writing',
  title: 'Other Writing',
  type: 'document',
  icon: PenLine,
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
      name: 'kind',
      title: 'Kind',
      type: 'string',
      options: {list: writingKinds, layout: 'radio'},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'publishedIn',
      title: 'Published in',
      type: 'string',
      description: 'Periodical or anthology, e.g. "Tesseracts 9"',
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'string',
    }),
    defineField({
      name: 'excerpt',
      title: 'Teaser',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(300),
    }),
    defineField({
      name: 'body',
      title: 'Full text',
      type: 'blockContent',
      description: 'Leave empty if the piece is only available elsewhere',
    }),
    defineField({
      name: 'url',
      title: 'Read elsewhere (URL)',
      type: 'url',
      validation: (Rule) => Rule.uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'order',
      title: 'Sort order',
      type: 'number',
      validation: (Rule) => Rule.integer().min(0),
    }),
  ],
  orderings: [
    {title: 'Sort order', name: 'orderAsc', by: [{field: 'order', direction: 'asc'}]},
    {title: 'Year (newest)', name: 'yearDesc', by: [{field: 'year', direction: 'desc'}]},
  ],
  preview: {
    select: {title: 'title', kind: 'kind', publishedIn: 'publishedIn', year: 'year'},
    prepare({title, kind, publishedIn, year}) {
      const label = writingKinds.find((k) => k.value === kind)?.title ?? kind
      return {title, subtitle: [label, publishedIn, year].filter(Boolean).join(' · ')}
    },
  },
})
