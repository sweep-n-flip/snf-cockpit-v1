import nextPayloadCMS from '../config'

export const getChains = async () => {
  const result = await nextPayloadCMS.find({
    collection: 'chains',
  })

  const data = result.docs

  return data
}
