import { Chain as ChainType } from '@/lib/web3/types/chain'
import { Marketplace as MarketplaceIcon } from '@/lib/web3/components/icons/marketplaces/Marketplace'
import { useChainConfig } from '@/lib/web3/hooks'
import { Children } from 'react'
import Link from 'next/link'
import { Address } from 'viem'
import { stringUtils } from '@/lib/utils/string'

export type MarketplacesProps = {
  chainIn?: ChainType
  collectionAddress?: Address
}

export const Marketplaces = ({ chainIn, collectionAddress }: MarketplacesProps) => {
  const { config } = useChainConfig({
    chainId: chainIn?.id,
  })

  return (
    <ul className="flex space-x-1">
      {Children.toArray(
        config.marketplaces.map((marketplace) => (
          <li>
            <Link
              target="_blank"
              href={stringUtils.shortCodeParser(`${marketplace.url}/{{address}}/`, {
                address: collectionAddress,
              })}
            >
              <MarketplaceIcon marketplace={marketplace.id} size={16} />
            </Link>
          </li>
        )),
      )}
    </ul>
  )
}

export default Marketplaces
