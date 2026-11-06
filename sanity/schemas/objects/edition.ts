import {defineType, defineField} from 'sanity'

export const editionFormats = [
  {title: 'Hardcover', value: 'hardcover'},
  {title: 'Paperback', value: 'paperback'},
  {title: 'E-book', value: 'ebook'},
  {title: 'Audiobook', value: 'audiobook'},
  {title: 'Limited edition', value: 'limited'},
  {title: 'Translation', value: 'translation'},
]

export const edition = defineType({
  name: 'edition',
  title: 'Edition',
  type: 'object',
  fields: [
    defineField({
      name: 'publisher',
      title: 'Publisher',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'string',
      description: 'Use "Forthcoming" if not yet out',
    }),
    defineField({
      name: 'format',
      title: 'Format',
      type: 'string',
      options: {list: editionFormats},
    }),
    defineField({
      name: 'language',
      title: 'Language',
      type: 'string',
      description: 'For translations, e.g. "German"',
    }),
    defineField({
      name: 'isbn',
      title: 'ISBN',
      type: 'string',
    }),
    defineField({
      name: 'note',
      title: 'Note',
      type: 'string',
      description: 'e.g. "Limited signed edition of 100"',
    }),
  ],
  preview: {
    select: {publisher: 'publisher', year: 'year', format: 'format', language: 'language'},
    prepare({publisher, year, format, language}) {
      return {
        title: [publisher, year].filter(Boolean).join(' · '),
        subtitle: [format, language].filter(Boolean).join(' · '),
      }
    },
  },
})
