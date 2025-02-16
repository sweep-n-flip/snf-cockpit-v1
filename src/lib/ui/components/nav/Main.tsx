'use client'
import { HTMLProps } from 'react'
import { Paragraph } from '@/lib/ui/components/typography'
import classNames from 'classnames'
import { Bars3BottomLeftIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export type MainProps = HTMLProps<HTMLDivElement> & {}

export const Main = ({ className, ...props }: MainProps) => {
  const pathname = usePathname()
  const isBridgePath = pathname?.includes('bridge')

  return (
    <div {...props} className={classNames([className, ''])}>
      <Link className="max-lg:hidden" href={'/bridge'}>
        <Paragraph
          className={classNames('transition-all', {
            'font-semibold': isBridgePath,
            'font-normal': !isBridgePath,
          })}
        >
          Bridge
        </Paragraph>
      </Link>
      <div className="hidden max-lg:block">
        <Bars3BottomLeftIcon width={20} height={20} className="text-zinc-700" />
      </div>
    </div>
  )
}

export default Main
