'use client'

import Link from 'next/link'
import { Address } from 'viem'
import { stringUtils } from '@/lib/utils/string'
import { Chains } from '@/lib/payloadcms/types/payload-types'
import { useBlockExplorers } from '@/lib/ui/components/blocks/bridges/hooks/useBlockExplorers'
import Image from 'next/image'

export type ExplorerProps = {
  chainIn?: Chains
  collectionAddress?: Address
}

export const Explorer = ({ chainIn, collectionAddress }: ExplorerProps) => {
  const { blockExplorers } = useBlockExplorers(chainIn)

  return (
    <ul className="flex space-x-1">
      {blockExplorers.map((blockExplorer) => (
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
                <Image src={blockExplorer.url} alt={blockExplorer.name} layout="responsive" />
              </div>
            </>
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default Explorer
