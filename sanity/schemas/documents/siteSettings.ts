import {defineType, defineField, defineArrayMember} from 'sanity'
import {Settings} from 'lucide-react'

const heroCta = (name: string, title: string, label: string, href: string) =>
  defineField({
    name,
    title,
    type: 'object',
    group: 'hero',
    options: {columns: 2},
    fields: [
      defineField({name: 'label', title: 'Label', type: 'string', initialValue: label}),
      defineField({
        name: 'href',
        title: 'Link',
        type: 'string',
        description: 'Site path (e.g. /books) or full URL',
        initialValue: href,
      }),
    ],
  })

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  icon: Settings,
  groups: [
    {name: 'general', title: 'General', default: true},
    {name: 'hero', title: 'Home hero'},
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

    // ── Home hero ── every string on the first screen of the home page.
    defineField({
      name: 'heroHeadline',
      title: 'Headline',
      type: 'string',
      description: 'The big word(s) in cream, e.g. "Writing"',
      group: 'hero',
      initialValue: 'Writing',
    }),
    defineField({
      name: 'heroHeadlineAccent',
      title: 'Headline accent',
      type: 'string',
      description: 'Continues the headline in yellow, e.g. "Across"',
      group: 'hero',
      initialValue: 'Across',
    }),
    defineField({
      name: 'heroLabel',
      title: 'Red label',
      type: 'string',
      description: 'Small red tag above the statement',
      group: 'hero',
      initialValue: 'Edmonton, Alberta',
    }),
    defineField({
      name: 'heroTagline',
      title: 'Statement',
      type: 'text',
      rows: 2,
      description: 'The one-sentence statement in capitals',
      group: 'hero',
    }),
    defineField({
      name: 'heroTaglineAccent',
      title: 'Statement accent',
      type: 'string',
      description: 'Phrase at the end of the statement to set in yellow, e.g. "inside the lines." Leave empty for none.',
      group: 'hero',
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Roles line',
      type: 'text',
      rows: 2,
      description: 'The line under the statement, e.g. "Novelist. Poet. Visual artist…"',
      group: 'hero',
    }),
    defineField({
      name: 'heroAwards',
      title: 'Honours lines',
      type: 'array',
      description: 'Shown in yellow italics, one per line',
      group: 'hero',
      of: [defineArrayMember({type: 'string'})],
    }),
    heroCta('heroPrimaryCta', 'Primary button', 'Enter the library', '/books'),
    heroCta('heroSecondaryCta', 'Secondary button', 'Visit the gallery', '/gallery'),
    defineField({
      name: 'heroImage',
      title: 'Portrait',
      type: 'image',
      description:
        'Printed into the painting at the lower right. A high-contrast black-on-white halftone works best; the white becomes transparent. Leave empty to use the built-in portrait.',
      group: 'hero',
      options: {hotspot: true},
      fields: [defineField({name: 'alt', title: 'Alt text', type: 'string'})],
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
