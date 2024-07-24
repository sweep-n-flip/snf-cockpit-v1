import { slugfy } from './slugfy'
import { populatePublishedDate } from './populatePublishedDate'
import { ensureFirstUserIsAdmin } from './ensureFirstUserIsAdmin'

export const beforeChange = {
  populatePublishedDate,
  slugfy,
  ensureFirstUserIsAdmin,
}
