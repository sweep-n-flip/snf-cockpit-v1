import { HTMLProps, ReactNode } from 'react'
import classnames from 'classnames'
import Link from 'next/link'

export type HeaderProps = HTMLProps<HTMLElement> & {
  toolbar?: ReactNode
  logo?: ReactNode
}

export const Header = ({ toolbar, logo, className, ...props }: HeaderProps) => {
  return (
    <header {...props} className={classnames([className, 'bg-white shadow'])}>
      <div
        className={classnames(['mx-auto flex w-full items-center justify-between gap-8 px-4 py-2'])}
      >
        <Link href={'/'}>{logo}</Link>
        <div className="flex flex-1 items-center justify-between">{toolbar}</div>
      </div>
    </header>
  )
}

export default Header
