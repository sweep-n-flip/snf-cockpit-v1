import { Chain as ChainType } from '@/lib/web3/types/chain'
import { Explorer as ExplorerIcon } from '@/lib/web3/components/icons/explorer/Explorer'
import { useChainConfig } from '@/lib/web3/hooks'
import { Children } from 'react'
import Link from 'next/link'
import { Address } from 'viem'
import { stringUtils } from '@/lib/utils/string'

export type ExplorerProps = {
  chainIn?: ChainType
  collectionAddress?: Address
}

export const Explorer = ({ chainIn, collectionAddress }: ExplorerProps) => {
  const { config } = useChainConfig({
    chainId: chainIn?.id,
  })

  return (
    <ul className="flex space-x-1">
      {Children.toArray(
        Object.values(config.blockExplorers || {}).map((blockExplorer) => (
          <li>
            <Link
              target="_blank"
              href={stringUtils.shortCodeParser(`${blockExplorer.url}/address/{{address}}/`, {
                address: collectionAddress,
              })}
            >
              <ExplorerIcon chainId={config.id} size={16} />
            </Link>
          </li>
        )),
      )}
    </ul>
  )
}

export default Explorer
