import type { Config } from 'payload'
import { fields } from '../../fields'
import map from 'lodash/map'
import { Media } from '@/payload-types'
// import { Media } from '@/payload-types'

export type Chains = {
  collections: Config['collections']
}

export const upload = ({ collections }: Chains): Chains['collections'] => {
  return map(collections, (collection) => {
    if (collection.slug === `media`) {
      collection.upload = {
        ...(typeof collection.upload === `object` ? collection.upload : {}),
        mimeTypes: [`image/*`],
        adminThumbnail: ({ doc }) => {
          const media = doc as unknown as Media
          if (
            typeof media.sizes == `object` &&
            typeof media.sizes.thumbnail == `object` &&
            media.sizes.thumbnail.url
          ) {
            return media.sizes.thumbnail.url!
          }

          if (String(media.mimeType).includes(`image`)) {
            return media.url!
          }

          return false
        },
        imageSizes: [
          {
            name: `icon`,
            width: 50,
            withoutEnlargement: true,
          },
          {
            name: `thumbnail`,
            width: 100,
            withoutEnlargement: true,
          },
          {
            name: `small`,
            width: 175,
            withoutEnlargement: true,
          },
          {
            name: `medium`,
            width: 800,
            withoutEnlargement: true,
          },
          {
            name: `large`,
            width: 1920,
            withoutEnlargement: true,
          },
        ],
      }

      collection.fields = fields.upload({
        fields: collection.fields,
      })
    }

    return collection
  })
}
