import { CollectionBeforeChangeHook } from 'payload'

export const populatePublishedDate =
  (): CollectionBeforeChangeHook =>
  async ({ data, operation }) => {
    if (operation === `create` || operation === `update`) {
      const now = new Date()
      return {
        ...data,
        publishedDate: now,
      }
    }

    return data
  }
