'use client'

import { Marketplace as MarketplaceEnum } from '@/lib/web3/types/chain'
import { Opensea } from './Opensea'

export type MarketplaceProps = {
  marketplace?: MarketplaceEnum
  size?: number
}

export const Marketplace = ({ marketplace, size = 16 }: MarketplaceProps) => {
  return (
    <div className="rounded-full bg-black/80">
      {typeof marketplace !== 'undefined' ? (
        {
          [MarketplaceEnum.Opensea]: <Opensea size={size} />,
        }[marketplace]
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

export default Marketplace
