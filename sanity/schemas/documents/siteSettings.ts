import {defineType, defineField, defineArrayMember} from 'sanity'
import {Settings} from 'lucide-react'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  icon: Settings,
  groups: [
    {name: 'general', title: 'General', default: true},
    {name: 'hero', title: 'Hero'},
    {name: 'social', title: 'Social & Links'},
  ],
  fields: [
    defineField({
      name: 'siteTitle',
      title: 'Site title',
      type: 'string',
      group: 'general',
      initialValue: 'Candas Jane Dorsey',
    }),
    defineField({
      name: 'siteDescription',
      title: 'Site description',
      type: 'text',
      rows: 3,
      description: 'Default meta description and tagline',
      group: 'general',
    }),
    defineField({
      name: 'ogImage',
      title: 'Default share image',
      type: 'image',
      description: 'Used when a page has no image of its own (1200×630 recommended)',
      group: 'general',
    }),
    defineField({
      name: 'contactEmail',
      title: 'Contact email',
      type: 'string',
      description: 'Where contact-form messages are delivered (never shown publicly)',
      group: 'general',
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: 'footerText',
      title: 'Footer text',
      type: 'text',
      rows: 2,
      group: 'general',
    }),
    defineField({
      name: 'heroTagline',
      title: 'Hero tagline',
      type: 'string',
      description: 'Main heading in the hero section',
      group: 'hero',
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero subtitle',
      type: 'text',
      rows: 2,
      group: 'hero',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social links',
      type: 'array',
      group: 'social',
      of: [defineArrayMember({type: 'socialLink'})],
    }),
    defineField({
      name: 'woodenDoorUrl',
      title: 'Wooden Door & Associates URL',
      type: 'url',
      group: 'social',
      validation: (Rule) => Rule.uri({scheme: ['http', 'https']}),
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Site Settings'}
    },
  },
})
