'use client'

import { useNetwork } from '@/lib/web3/hooks'
import { Chain as ChainEntity } from '@/lib/web3/types'
import { find } from 'lodash'
import Image from 'next/image'

export type ChainProps = {
  chainId?: ChainEntity['id']
  size?: number
}

export const Chain = ({ chainId, size = 16 }: ChainProps) => {
  const { chains } = useNetwork()
  const chain: ChainEntity | undefined = find(chains, { id: chainId })

  return (
    <div className="rounded-full bg-black/80">
      {chain && chain?.custom?.logo ? (
        <Image src={`${chain.custom.logo}`} width={size} height={size} alt={chain.name} />
      ) : (
        <>
          <style jsx>
            {`
              div {
                width: ${size}px;
                height: ${size}px;
              }
            `}
          </style>
          <div className="-m-px rounded-full bg-zinc-200" />
        </>
      )}
    </div>
  )
}

export default Chain
