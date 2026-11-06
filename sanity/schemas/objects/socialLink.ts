import {defineType, defineField} from 'sanity'

export const socialPlatforms = [
  {title: 'Bluesky', value: 'bluesky'},
  {title: 'Facebook', value: 'facebook'},
  {title: 'Instagram', value: 'instagram'},
  {title: 'Mastodon', value: 'mastodon'},
  {title: 'Threads', value: 'threads'},
  {title: 'X / Twitter', value: 'x'},
  {title: 'YouTube', value: 'youtube'},
  {title: 'LinkedIn', value: 'linkedin'},
  {title: 'Other', value: 'other'},
]

export const socialLink = defineType({
  name: 'socialLink',
  title: 'Social link',
  type: 'object',
  fields: [
    defineField({
      name: 'platform',
      title: 'Platform',
      type: 'string',
      options: {list: socialPlatforms},
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
      title: 'Label',
      type: 'string',
      description: 'Optional display text, e.g. "@candasjane"',
    }),
  ],
  preview: {
    select: {title: 'platform', subtitle: 'url'},
  },
})
