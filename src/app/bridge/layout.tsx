import { Inter } from 'next/font/google'
import '@/lib/ui/styles/default.css'

import { ReactNode } from 'react'
import { appConfig } from '@/lib/config'
import { Wallet } from '@/lib/web3/components'
import { Nav, Typography, Logos, Layouts } from '@/lib/ui/components'
import { Registry } from '@/app/Registry'
import { Web3Provider } from '@/lib/web3/components'
import { ServiceProvider } from '@/lib/services/api/components'
import { networks, settings } from '@/lib/payloadcms/services'

const inter = Inter({ subsets: ['latin'] })

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  const chains = await networks.getChains()
  const project = await settings.getProject()
  console.log(chains)
  console.log(project)
  return (
    <html>
      <body>
        <ServiceProvider>
          <Web3Provider>
            <Registry>
              <Layouts.Default
                className={inter.className}
                headerProps={{
                  toolbar: (
                    <>
                      <Nav.Main />
                      <Wallet.Toolbar />
                    </>
                  ),
                  logo: <Logos.Default />,
                }}
                footerProps={{
                  copyRightProps: {
                    text: (
                      <Typography.Paragraph as="span">
                        Created by {appConfig.builder.createdBy}
                      </Typography.Paragraph>
                    ),
                  },
                  socialProps: {
                    include: appConfig.social,
                  },
                }}
              >
                {children}
              </Layouts.Default>
            </Registry>
          </Web3Provider>
        </ServiceProvider>
      </body>
    </html>
  )
}
