import nextPayloadCMS from '../config'

export const getChains = async (options?: Partial<Parameters<typeof nextPayloadCMS.find>[0]>) => {
  const result = await nextPayloadCMS.find({
    ...(options || {}),
    collection: 'chains',
  })

  const data = result.docs

  return data
}
