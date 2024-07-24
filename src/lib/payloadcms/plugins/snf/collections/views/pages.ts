import type { Config } from 'payload'

export type Pages = {
  collections: Config['collections']
}

import { fields } from '../../fields'

export const pages = ({ collections }: Pages): Pages['collections'] => {
  const collectionsWithPages = [
    ...(collections ? collections : []),
    {
      slug: `pages`,
      labels: {
        singular: `Page`,
        plural: `Pages`,
      },
      typescript: {
        interface: `Pages`,
      },
      admin: {
        useAsTitle: `name`,
        defaultColumns: ['name', 'slug'],
        group: `Views`,
      },
      versions: {
        drafts: true,
      },
      // hooks: {
      //   beforeChange: [populatePublishedDate],
      //   afterChange: [revalidatePage],
      //   afterRead: [homepageResolver],
      // },
      fields: fields.pages(),
      /// todo: change access
      access: {
        read: () => true,
        create: () => true,
        update: () => true,
        delete: () => true,
      },
    },
  ]

  return collectionsWithPages
}
