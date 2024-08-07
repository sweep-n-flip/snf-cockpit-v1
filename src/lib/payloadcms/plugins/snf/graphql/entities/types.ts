import type { Config, PayloadRequest } from '@/lib/payloadcms/plugins/snf/types'

export type ResolverContext = {
  req: PayloadRequest & {
    payload: PayloadRequest['payload'] & {
      config: PayloadRequest['payload']['config'] & {
        custom: Config['custom']
      }
    }
  }
}
