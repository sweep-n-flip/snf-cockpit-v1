// 'use client'

import { Inter } from 'next/font/google'
import '@/lib/ui/styles/default.css'

import { ReactNode } from 'react'
import { appConfig } from '@/lib/config'
import { Wallet } from '@/lib/web3/components'
import { Nav, Typography, Logos, Layouts } from '@/lib/ui/components'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html>
      <body>
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
      </body>
    </html>
  )
}
