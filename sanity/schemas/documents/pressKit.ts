import {defineType, defineField, defineArrayMember} from 'sanity'
import {Newspaper} from 'lucide-react'

/** Singleton: bios and headshots for media, behind a shared password. */
export const pressKit = defineType({
  name: 'pressKit',
  title: 'Press Kit',
  type: 'document',
  icon: Newspaper,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      initialValue: 'Press Kit',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'intro',
      title: 'Intro',
      type: 'text',
      rows: 2,
      description: 'Shown above the password prompt and at the top of the kit',
    }),
    defineField({
      name: 'password',
      title: 'Password',
      type: 'string',
      description: 'Share this with people who need the kit. Change it any time.',
      validation: (Rule) => Rule.required().min(6),
    }),
    defineField({
      name: 'shortBio',
      title: 'Short bio',
      type: 'text',
      rows: 4,
      description: 'Roughly 50–90 words',
    }),
    defineField({
      name: 'mediumBio',
      title: 'Medium bio',
      type: 'text',
      rows: 6,
      description: 'Roughly 100–150 words',
    }),
    defineField({
      name: 'longBio',
      title: 'Long bio',
      type: 'blockContent',
    }),
    defineField({
      name: 'headshots',
      title: 'Headshots',
      type: 'array',
      description: 'Upload full-resolution files; the site offers them as downloads',
      of: [defineArrayMember({type: 'creditedImage'})],
    }),
    defineField({
      name: 'files',
      title: 'Other downloads',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'file',
          fields: [
            defineField({name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required()}),
          ],
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Press Kit'}
    },
  },
})
