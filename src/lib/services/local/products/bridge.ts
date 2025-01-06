import nextPayloadCMS from '../config'

export const getBridge = async () => {
  const result = await (
    await nextPayloadCMS()
  ).findGlobal({
    slug: 'bridge',
  })

  console.log('bridge', result)

  return result
}
