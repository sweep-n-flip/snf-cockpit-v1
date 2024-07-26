import map from 'lodash/map'
import type { Config } from 'payload'

export type OverrideParams = {
  collections: Config['collections']
}

import { fields } from '../../fields'

export const override = ({ collections }: OverrideParams): OverrideParams['collections'] => {
  /// dev: apply roles to users collection
  return map(collections, (collection) => {
    if (collection.slug === `users`) {
      collection.timestamps = true
      collection.fields = fields.users.roles({
        fields: collection.fields,
      })
    }

    return collection
  })
}
