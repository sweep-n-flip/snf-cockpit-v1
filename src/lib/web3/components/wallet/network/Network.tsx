'use client'
import { ButtonHTMLAttributes } from 'react'
import { useNetwork } from '@/lib/web3/hooks'
import { Typography } from '@/lib/ui/components'
import { CheckIcon } from '@heroicons/react/24/outline'
import classNames from 'classnames'
import { Chain } from '@/lib/web3/types'

export type NetworkProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  currentChain?: Chain
  chain?: Chain
}

export const Network = ({ chain, currentChain, className, ...props }: NetworkProps) => {
  const { switchChain } = useNetwork()

  return (
    <button
      {...props}
      className={classNames([
        className,
        'flex items-center justify-between space-x-2',
        {
          'cursor-default': !chain?.id,
          'cursor-pointer': chain?.id,
        },
      ])}
      onClick={() =>
        chain?.id
          ? switchChain({
              chainId: chain.id,
            })
          : {}
      }
    >
      <div className="flex space-x-2">
        {/* <Chain chainId={chain?.id} size={24} /> */}
        {chain?.id}
        <Typography.Paragraph
          size="sm"
          className={chain?.unsupported ? 'text-red-500' : 'text-gray-900'}
        >
          {!chain || chain?.unsupported ? 'Unsupported' : chain?.name}
        </Typography.Paragraph>
      </div>
      <div>
        {currentChain?.id === chain?.id ? (
          <CheckIcon className="size-5 text-color-primary" />
        ) : null}
      </div>
    </button>
  )
}

export default Network
