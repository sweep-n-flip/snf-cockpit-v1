import '@/lib/ui/styles/default.css'

import { Inter } from 'next/font/google'
import { ReactNode } from 'react'
import { Web3Provider } from '@/lib/web3/components'
import { ServiceProvider } from '@/lib/services/api/components'
import { Nav, Layouts } from '@/lib/ui/components'
import Image from 'next/image'
import { Media } from '@/lib/payloadcms/types/payload-types'
import { networks, settings } from '@/lib/payloadcms/services'
import { toWagmiChain } from '@/lib/payloadcms/utils/chains/toWagmiChain'
import Registry from '@/app/Registry'
import { Viewport } from 'next'

const inter = Inter({ subsets: ['latin'] })

export const viewport: Viewport = {
  width: `device-width`,
  initialScale: 1,
}

export default async function SlugLayout({
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
  const logo = project.logo as Media

  return (
    <ServiceProvider>
      <Web3Provider
        chains={normalizedChains}
        appName={project.name}
        appDescription={project.description}
        appUrl={project.url}
      >
        <Registry>
          <Layouts.Default
            className={inter.className}
            headerProps={{
              logo: (
                <Image src={logo.url!} alt={logo.alt} width={logo.width!} height={logo.height!} />
              ),
              toolbar: (
                <>
                  <Nav.Main />
                </>
              ),
            }}
            footerProps={{
              copyRightProps: {
                text: project.footer?.copyright,
              },
            }}
          >
            {children}
          </Layouts.Default>
        </Registry>
      </Web3Provider>
    </ServiceProvider>
  )
}
