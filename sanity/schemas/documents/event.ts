import {defineType, defineField, defineArrayMember} from 'sanity'
import {Calendar} from 'lucide-react'

export const event = defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  icon: Calendar,
  groups: [
    {name: 'details', title: 'Details', default: true},
    {name: 'content', title: 'Content'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'details',
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'details',
      options: {source: 'title', maxLength: 96},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'eventType',
      title: 'Event Type',
      type: 'string',
      group: 'details',
      options: {
        list: [
          {title: 'Book Launch', value: 'bookLaunch'},
          {title: 'Reading', value: 'reading'},
          {title: 'Signing', value: 'signing'},
          {title: 'Exhibition', value: 'exhibition'},
          {title: 'Workshop', value: 'workshop'},
          {title: 'Panel', value: 'panel'},
          {title: 'Other', value: 'other'},
        ],
      },
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'datetime',
      description: 'Event date and time',
      group: 'details',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'endDate',
      title: 'End Date',
      type: 'datetime',
      description: 'For multi-day events',
      group: 'details',
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'object',
      group: 'details',
      fields: [
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
          name: 'address',
          title: 'Address',
          type: 'text',
          rows: 2,
        }),
        defineField({
          name: 'url',
          title: 'Venue / Event URL',
          type: 'url',
          validation: (Rule) => Rule.uri({scheme: ['http', 'https']}),
        }),
      ],
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'blockContent',
      group: 'content',
    }),
    defineField({
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'image',
      group: 'content',
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
      name: 'relatedBooks',
      title: 'Related Books',
      type: 'array',
      description: 'Books being launched or discussed at this event',
      group: 'content',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: 'book'}],
        }),
      ],
    }),
    defineField({
      name: 'isUpcoming',
      title: 'Upcoming',
      type: 'boolean',
      description: 'Is this event in the future?',
      group: 'details',
      initialValue: true,
    }),
    defineField({
      name: 'externalUrl',
      title: 'External URL',
      type: 'url',
      description: 'Link to external event page or tickets',
      group: 'details',
      validation: (Rule) => Rule.uri({scheme: ['http', 'https']}),
    }),
  ],
  orderings: [
    {
      title: 'Date (Newest)',
      name: 'dateDesc',
      by: [{field: 'date', direction: 'desc'}],
    },
    {
      title: 'Date (Oldest)',
      name: 'dateAsc',
      by: [{field: 'date', direction: 'asc'}],
    },
  ],
  preview: {
    select: {
      title: 'title',
      date: 'date',
      venue: 'location.venue',
      media: 'featuredImage',
    },
    prepare({title, date, venue, media}) {
      const formatted = date
        ? new Date(date).toLocaleDateString('en-CA', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
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
