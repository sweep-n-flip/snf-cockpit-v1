import '@/lib/ui/styles/default.css'

import { ReactNode } from 'react'
import { Web3Provider } from '@/lib/web3/components'
import { ServiceProvider } from '@/lib/services/api/components'
import { networks, settings } from '@/lib/payloadcms/services'
import { Registry } from '@/app/Registry'
import { toWagmiChain } from '@/lib/payloadcms/utils/chains/toWagmiChain'

export default async function Root({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  const project = await settings.getProject()

  const chains = await networks.getChains({
    where: {
      testnet: {
        equals: project.testnet,
      },
    },
  })

  const normalizedChains = toWagmiChain({ chains, project })

  console.log(normalizedChains)

  return (
    <ServiceProvider>
      <Web3Provider
        chains={normalizedChains}
        appName={project.name}
        appDescription={project.description}
        appUrl={project.url}
      >
        <Registry>{children}</Registry>
      </Web3Provider>
    </ServiceProvider>
  )
}
