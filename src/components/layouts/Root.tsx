import '@/lib/ui/styles/default.css'

import { ReactNode } from 'react'
import { Web3Provider } from '@/lib/web3/components'
import { ServiceProvider } from '@/lib/services/api/components'
import { networks } from '@/lib/payloadcms/services'
import { Registry } from '@/app/Registry'

export default async function Root({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  const chains = await networks.getChains()
  console.log(chains)
  return (
    <ServiceProvider>
      <Web3Provider>
        <Registry>{children}</Registry>
      </Web3Provider>
    </ServiceProvider>
  )
}
