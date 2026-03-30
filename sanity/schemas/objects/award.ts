import {defineType, defineField} from 'sanity'

export const award = defineType({
  name: 'award',
  title: 'Award',
  type: 'object',
  fields: [
    defineField({
      name: 'name',
      title: 'Award Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'string',
      description: 'Year awarded',
    }),
    defineField({
      name: 'isWinner',
      title: 'Winner',
      type: 'boolean',
      description: 'Winner (true) or nominee (false)',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      name: 'name',
      year: 'year',
      isWinner: 'isWinner',
    },
    prepare({name, year, isWinner}) {
      return {
        title: name,
        subtitle: `${year ?? ''}${isWinner === false ? ' (nominee)' : ''}`.trim(),
      }
    },
  },
})
