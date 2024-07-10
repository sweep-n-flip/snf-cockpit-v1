import { HTMLProps } from 'react'
import { Paragraph } from '@/lib/ui/components/typography'
import classNames from 'classnames'
import { Bars3BottomLeftIcon } from '@heroicons/react/24/outline'

export type MainProps = HTMLProps<HTMLDivElement> & {}

export const Main = ({ className, ...props }: MainProps) => {
  return (
    <div {...props} className={classNames([className, ''])}>
      <div className="max-lg:hidden">
        <Paragraph>Bridge</Paragraph>
      </div>
      <div className="hidden max-lg:block">
        <Bars3BottomLeftIcon width={20} height={20} className="text-zinc-700" />
      </div>
    </div>
  )
}

export default Main
