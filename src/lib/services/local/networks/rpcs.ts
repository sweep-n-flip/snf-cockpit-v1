import nextPayloadCMS from '../config'

export const getRpcs = async (options?: Partial<Parameters<typeof nextPayloadCMS.find>[0]>) => {
  const result = await nextPayloadCMS.find({
    ...(options || {}),
    collection: 'rpcs',
  })

  const data = result.docs

  return data
}
