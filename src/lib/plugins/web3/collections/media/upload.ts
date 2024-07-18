import type { Config } from 'payload'
import { fields } from '../../fields'
import map from 'lodash/map'

export type Chains = {
  collections: Config['collections']
}

export const upload = ({ collections }: Chains): Chains['collections'] => {
  return map(collections, (collection) => {
    if (collection.slug === `media`) {
      collection.fields = fields.upload({
        fields: collection.fields,
      })
    }

    return collection
  })
}
