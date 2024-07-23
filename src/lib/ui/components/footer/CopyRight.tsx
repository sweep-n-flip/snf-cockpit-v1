import { HTMLProps, ReactNode } from 'react'
import { Typography } from '@/lib/ui/components'
import classNames from 'classnames'

export type CopyRightProps = HTMLProps<HTMLDivElement> & {
  text: ReactNode
}

export const CopyRight = ({ text, className, ...props }: CopyRightProps) => {
  return (
    <div {...props} className={classNames([className, 'flex gap-2 text-gray-400'])}>
      <Typography.Paragraph>&copy;</Typography.Paragraph>
      <Typography.Paragraph as="span">{text}</Typography.Paragraph>
      <Typography.Paragraph>{new Date().getFullYear()}</Typography.Paragraph>
    </div>
  )
}

export default CopyRight
