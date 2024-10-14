import nextPayloadCMS from '../config'
import { Payload } from 'payload'

export const getBlockExplorers = async (options?: Partial<Parameters<Payload['find']>[0]>) => {
  const result = await (
    await nextPayloadCMS()
  ).find({
    ...(options || {}),
    collection: 'block_explorers',
  })

  const data = result.docs

  return data
}
