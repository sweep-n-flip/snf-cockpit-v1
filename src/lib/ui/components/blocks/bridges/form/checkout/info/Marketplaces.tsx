'use client'

import Link from 'next/link'
import { Address } from 'viem'
import { stringUtils } from '@/lib/utils/string'
import Image from 'next/image'
import { useMarketplaces } from '@/lib/ui/components/blocks/bridges/hooks/useMarketplaces'
import { Chains } from '@/lib/payloadcms/types/payload-types'

export type MarketplacesProps = {
  chainIn?: Chains
  collectionAddress?: Address
}

export const Marketplaces = ({ chainIn, collectionAddress }: MarketplacesProps) => {
  const { marketplaces } = useMarketplaces(chainIn)

  return (
    <ul className="flex space-x-1">
      {marketplaces.map((marketplace) => (
        <li key={marketplace.id}>
          <Link
            target="_blank"
            href={stringUtils.shortCodeParser(`${marketplace.url}/{{address}}/`, {
              address: collectionAddress,
            })}
          >
            <>
              <style jsx>
                {`
                  div {
                    width: 16px;
                    height: 16px;
                  }
                `}
              </style>
              <div className="-m-px rounded-full bg-zinc-200">
                <Image src={marketplace.url} alt={marketplace.name} layout="responsive" />
              </div>
            </>
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default Marketplaces
