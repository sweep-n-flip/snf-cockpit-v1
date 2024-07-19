import type { HTMLProps, ReactNode } from 'react'
import { Header, HeaderProps } from '@/lib/ui/components/header/Header'
import { Footer, FooterProps } from '@/lib/ui/components/footer/Footer'
import classNames from 'classnames'

export type DefaultProps = HTMLProps<HTMLDivElement> & {
  children: ReactNode
  headerProps?: HeaderProps
  footerProps: FooterProps
}

export const Default = ({
  children,
  headerProps,
  footerProps,
  className,
  ...props
}: DefaultProps) => {
  return (
    <div
      {...props}
      className={classNames([className, 'flex h-screen flex-col bg-zinc-100 text-zinc-700'])}
    >
      <Header {...headerProps} />
      <main className="flex-1">{children}</main>
      <Footer {...footerProps} />
    </div>
  )
}

export default Default
