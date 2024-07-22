import nextPayloadCMS from '../config'

export const getProject = async () => {
  const result = await nextPayloadCMS.findGlobal({
    slug: 'project',
  })

  return result
}
