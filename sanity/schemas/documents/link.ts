import {defineType, defineField} from 'sanity'
import {Link2} from 'lucide-react'

export const linkGroups = [
  {title: 'Community & advocacy', value: 'community'},
  {title: 'Edmonton Magpie Morris', value: 'morris'},
  {title: 'Other things I do', value: 'other'},
  {title: 'Links I like', value: 'linksILike'},
]

/** An outbound link for the "Candas-adjacent" page. */
export const link = defineType({
  name: 'link',
  title: 'Link',
  type: 'document',
  icon: Link2,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      validation: (Rule) => Rule.required().uri({scheme: ['http', 'https', 'mailto']}),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'group',
      title: 'Group',
      type: 'string',
      options: {list: linkGroups, layout: 'radio'},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Sort order',
      type: 'number',
      validation: (Rule) => Rule.integer().min(0),
    }),
  ],
  orderings: [{title: 'Sort order', name: 'orderAsc', by: [{field: 'order', direction: 'asc'}]}],
  preview: {
    select: {title: 'title', group: 'group', url: 'url'},
    prepare({title, group, url}) {
      const label = linkGroups.find((g) => g.value === group)?.title ?? group
      return {title, subtitle: [label, url].filter(Boolean).join(' · ')}
    },
  },
})
