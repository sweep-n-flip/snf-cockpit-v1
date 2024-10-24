import { getPayloadHMR } from '@payloadcms/next/utilities'

import config from '@payload-config'

export const nextPayloadCMS = async () => await getPayloadHMR({ config })

export default nextPayloadCMS
