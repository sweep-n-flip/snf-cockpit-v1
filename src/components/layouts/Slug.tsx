import { Inter } from 'next/font/google'
import { ReactNode } from 'react'
import { Nav, Layouts } from '@/lib/ui/components'
import { settings } from '@/lib/payloadcms/services'
import Image from 'next/image'
import { Media } from '@/lib/payloadcms/types/payload-types'

const inter = Inter({ subsets: ['latin'] })

export default async function SlugLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  const project = await settings.getProject()
  const logo = project.logo as Media

  return (
    <Layouts.Default
      className={inter.className}
      headerProps={{
        logo: <Image src={logo.url!} alt={logo.alt} width={logo.width!} height={logo.height!} />,
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
  )
}
