import {defineType, defineField} from 'sanity'

export const review = defineType({
  name: 'review',
  title: 'Review',
  type: 'object',
  fields: [
    defineField({
      name: 'source',
      title: 'Source',
      type: 'string',
      description: 'Publication name (e.g. "The Guardian", "Kirkus Reviews")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'quote',
      title: 'Quote',
      type: 'text',
      description: 'The review quote',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'reviewer',
      title: 'Reviewer',
      type: 'string',
      description: 'Reviewer name, if known',
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      description: 'Link to the full review',
      validation: (Rule) => Rule.uri({scheme: ['http', 'https']}),
    }),
  ],
  preview: {
    select: {
      title: 'source',
      subtitle: 'reviewer',
    },
  },
})
