import { slugfy } from './slugfy'
import { populatePublishedDate } from './populatePublishedDate'

export const beforeChange = {
  populatePublishedDate,
  slugfy,
}
