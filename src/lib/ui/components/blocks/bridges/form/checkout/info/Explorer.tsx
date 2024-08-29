'use client'

import Link from 'next/link'
import { Address } from 'viem'
import { stringUtils } from '@/lib/utils/string'
import { Chains, Media } from '@/lib/payloadcms/types/payload-types'
import { useBlockExplorers } from '@/lib/services/rest/hooks/useBlockExplorers'
import Image from 'next/image'

export type ExplorerProps = {
  chainIn?: Chains
  collectionAddress?: Address
}

export const Explorer = ({ chainIn, collectionAddress }: ExplorerProps) => {
  const { blockExplorers, isLoading } = useBlockExplorers({ chainId: chainIn?.chainId })

  return (
    <ul className="flex space-x-1">
      {!isLoading &&
        blockExplorers.map((blockExplorer) => (
          <li key={blockExplorer.id}>
            <Link
              target="_blank"
              href={stringUtils.shortCodeParser(`${blockExplorer.url}/address/{{address}}/`, {
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
                    src={(blockExplorer.logo as Media).url!}
                    alt={blockExplorer.name}
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

export default Explorer
