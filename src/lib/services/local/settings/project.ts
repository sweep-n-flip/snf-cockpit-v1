import nextPayloadCMS from '../config'

export const getProject = async () => {
  const result = await (
    await nextPayloadCMS()
  ).findGlobal({
    slug: 'project',
  })

  return result
}
