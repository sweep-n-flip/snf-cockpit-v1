'use client'

import { Inter } from 'next/font/google'
import '@/lib/ui/styles/default.css'

import { ReactNode } from 'react'
import { appConfig } from '@/lib/config'
import { Registry } from '@/app/Registry'
import { Web3Provider, Wallet } from '@/lib/web3/components'
import { ServiceProvider } from '@/lib/services/api/components'
import { Nav, Typography, Logos, Layouts } from '@/lib/ui/components'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang="en">
      <ServiceProvider>
        <Web3Provider>
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
            <Registry>{children}</Registry>
          </Layouts.Default>
        </Web3Provider>
      </ServiceProvider>
    </html>
  )
}
