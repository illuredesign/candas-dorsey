import {defineType, defineField, defineArrayMember} from 'sanity'
import {Frame} from 'lucide-react'

export const exhibition = defineType({
  name: 'exhibition',
  title: 'Exhibition',
  type: 'document',
  icon: Frame,
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
      name: 'venue',
      title: 'Venue',
      type: 'string',
    }),
    defineField({
      name: 'city',
      title: 'City',
      type: 'string',
    }),
    defineField({
      name: 'startDate',
      title: 'Start Date',
      type: 'datetime',
    }),
    defineField({
      name: 'endDate',
      title: 'End Date',
      type: 'datetime',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'blockContent',
    }),
    defineField({
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'image',
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
      name: 'artworks',
      title: 'Artworks',
      type: 'array',
      description: 'Pieces shown in this exhibition',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: 'artwork'}],
        }),
      ],
    }),
    defineField({
      name: 'isUpcoming',
      title: 'Upcoming',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'externalUrl',
      title: 'External URL',
      type: 'url',
      validation: (Rule) => Rule.uri({scheme: ['http', 'https']}),
    }),
  ],
  orderings: [
    {
      title: 'Start Date (Newest)',
      name: 'startDateDesc',
      by: [{field: 'startDate', direction: 'desc'}],
    },
  ],
  preview: {
    select: {
      title: 'title',
      venue: 'venue',
      startDate: 'startDate',
      media: 'featuredImage',
    },
    prepare({title, venue, startDate, media}) {
      const formatted = startDate
        ? new Date(startDate).toLocaleDateString('en-CA', {
            year: 'numeric',
            month: 'short',
          })
        : ''
      return {
        title,
        subtitle: [formatted, venue].filter(Boolean).join(' — '),
        media,
      }
    },
  },
})
