import {defineType, defineField} from 'sanity'

export const purchaseLink = defineType({
  name: 'purchaseLink',
  title: 'Purchase Link',
  type: 'object',
  fields: [
    defineField({
      name: 'retailer',
      title: 'Retailer',
      type: 'string',
      description: 'e.g. "Amazon", "Bookshop.org", "PS Publishing"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      validation: (Rule) => Rule.required().uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'label',
      title: 'Display Label',
      type: 'string',
      description: 'Optional override for display text (defaults to retailer name)',
    }),
  ],
  preview: {
    select: {
      title: 'retailer',
      subtitle: 'url',
    },
  },
})
