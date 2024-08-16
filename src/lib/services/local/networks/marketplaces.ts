import nextPayloadCMS from '../config'

export const getMarketplaces = async (
  options?: Partial<Parameters<typeof nextPayloadCMS.find>[0]>,
) => {
  const result = await nextPayloadCMS.find({
    ...(options || {}),
    collection: 'marketplaces',
  })

  const data = result.docs

  return data
}

export const getChainMarketplaces = async (chainId: number) => {
  return getMarketplaces({
    where: {
      chain: {
        chainId,
      },
    },
  })
}
