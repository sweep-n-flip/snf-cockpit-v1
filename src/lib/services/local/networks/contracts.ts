import nextPayloadCMS from '../config'
import { Payload } from 'payload'

export const getContracts = async (options?: Partial<Parameters<Payload['find']>[0]>) => {
  const result = await (
    await nextPayloadCMS()
  ).find({
    ...(options || {}),
    collection: 'contracts',
  })

  const data = result.docs

  return data
}
