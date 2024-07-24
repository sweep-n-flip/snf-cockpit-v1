import map from 'lodash/map'
import type { Config } from 'payload'

export type Collections = {
  collections: Config['collections']
}

import { fields } from '../fields'

export const users = ({ collections }: Collections): Collections['collections'] => {
  return map(collections, (collection) => {
    if (collection.slug === `users`) {
      collection.timestamps = true
      collection.fields = fields.users({
        fields: collection.fields,
      })
    }

    return collection
  })
}
