'use client'

import Link from 'next/link'
import { Address } from 'viem'
import { stringUtils } from '@/lib/utils/string'
import Image from 'next/image'
import { useMarketplaces } from '@/lib/services/rest/hooks/useMarketplaces'
import { Chains, Media } from '@/lib/payloadcms/types/payload-types'

export type MarketplacesProps = {
  chainIn?: Chains
  collectionAddress?: Address
}

export const Marketplaces = ({ chainIn, collectionAddress }: MarketplacesProps) => {
  const { marketplaces, isLoading } = useMarketplaces({ chainId: chainIn?.chainId })

  return (
    <ul className="flex space-x-1">
      {!isLoading &&
        marketplaces.map((marketplace) => (
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
                  <Image
                    src={(marketplace.logo as Media).url!}
                    alt={marketplace.name}
                    width={16}
                    height={16}
                  />
                </div>
              </>
            </Link>
          </li>
        ))}
    </ul>
  )
}

export default Marketplaces
