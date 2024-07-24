import classNames from 'classnames'
import { HTMLProps } from 'react'
import { CopyRight, CopyRightProps } from './CopyRight'

export type FooterProps = HTMLProps<HTMLElement> & {
  copyRightProps: CopyRightProps
}

export const Footer = ({ className, copyRightProps, ...props }: FooterProps) => {
  return (
    <footer {...props} className={classNames([className, 'bg-white px-4 py-4'])}>
      <div className="flex justify-between max-lg:flex-col max-lg:items-center max-lg:space-y-4">
        <div>
          <CopyRight {...copyRightProps} />
        </div>
      </div>
    </footer>
  )
}

export default Footer
