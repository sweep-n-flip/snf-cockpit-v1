import { getPayloadHMR } from '@payloadcms/next/utilities'

import config from '@payload-config'

export const getConfig = async () => await getPayloadHMR({ config })

export default getConfig
