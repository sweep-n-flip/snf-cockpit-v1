import nextPayloadCMS from '../config'

export const getBlockExplorers = async (
  options?: Partial<Parameters<typeof nextPayloadCMS.find>[0]>,
) => {
  const result = await nextPayloadCMS.find({
    ...(options || {}),
    collection: 'block_explorers',
  })

  const data = result.docs

  return data
}
