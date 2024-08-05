import nextPayloadCMS from '../config'
import { Chains } from "@/lib/payloadcms/types/payload-types";

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

export const getChainBlockExplorers = async (
  chain: Chains,
  options?: Partial<Parameters<typeof nextPayloadCMS.find>[0]>,
) => {
  return getBlockExplorers({
    ...(options || {}),
    where: {
      chain,
    },
  })
}
