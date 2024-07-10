import { HTMLProps, ReactNode } from 'react'
import { Paragraph } from '@/lib/ui/components/typography'
import classNames from 'classnames'

export type CopyRightProps = HTMLProps<HTMLDivElement> & {
  text: ReactNode
}

export const CopyRight = ({ text, className, ...props }: CopyRightProps) => {
  return (
    <div {...props} className={classNames([className, 'flex gap-2 text-gray-400'])}>
      <Paragraph>&copy;</Paragraph>
      {text}
      <Paragraph>{new Date().getFullYear()}</Paragraph>
    </div>
  )
}

export default CopyRight
