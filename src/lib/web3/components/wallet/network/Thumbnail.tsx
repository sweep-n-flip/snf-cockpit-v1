'use client'

import { type HTMLProps } from 'react'
import { ChevronDownIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import classNames from 'classnames'
import { Chain } from '@/lib/web3/components/icons/chains'
import { useNetwork } from '@/lib/web3/hooks'

export type ThumbnailProps = HTMLProps<HTMLDivElement> & {
  isOpen?: boolean
}

export const Thumbnail = ({ isOpen, ...props }: ThumbnailProps) => {
  const { chain } = useNetwork()

  return (
    <div {...props} className={classNames(props.className, 'flex cursor-pointer justify-between')}>
      <div className="flex items-center space-x-2">
        <div>
          {!chain || chain?.unsupported ? (
            <ExclamationTriangleIcon
              width={24}
              className={isOpen ? 'text-gray-400' : 'text-red-400'}
            />
          ) : (
            <Chain chainId={chain.id} size={24} />
          )}
        </div>
        <div>
          <ChevronDownIcon
            width={16}
            height={16}
            className={isOpen ? 'rotate-180' : 'text-gray-400'}
          />
        </div>
      </div>
    </div>
  )
}

export default Thumbnail
