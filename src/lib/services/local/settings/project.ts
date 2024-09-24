import { getConfig } from '../config'

export const getProject = async () => {
  const config = await getConfig()
  const result = await config.findGlobal({
    slug: 'project',
    depth: 1,
  })

  return result
}
