import { Inter } from 'next/font/google'
import { ReactNode } from 'react'
import { appConfig } from '@/lib/config'
// import { Wallet } from '@/lib/web3/components'
import { Nav, Logos, Layouts } from '@/lib/ui/components'
import { settings } from '@/lib/payloadcms/services'

const inter = Inter({ subsets: ['latin'] })

export default async function SlugLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  const project = await settings.getProject()

  return (
    <Layouts.Default
      className={inter.className}
      headerProps={{
        toolbar: (
          <>
            <Nav.Main />
            {/* <Wallet.Toolbar /> */}
          </>
        ),
        logo: <Logos.Default />,
      }}
      footerProps={{
        copyRightProps: {
          text: project.footer?.copyright,
        },
        socialProps: {
          include: appConfig.social,
        },
      }}
    >
      {children}
    </Layouts.Default>
  )
}
