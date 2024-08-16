import nextPayloadCMS from '../config'

export const getContracts = async (
  options?: Partial<Parameters<typeof nextPayloadCMS.find>[0]>,
) => {
  const result = await nextPayloadCMS.find({
    ...(options || {}),
    collection: 'contracts',
  })

  const data = result.docs

  return data
}

export const getChainContracts = async (chainId: number) => {
  return getContracts({
    where: {
      chain: {
        chainId,
      },
    },
  })
}
