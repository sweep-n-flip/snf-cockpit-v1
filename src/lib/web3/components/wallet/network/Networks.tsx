'use client'
import { Children, HTMLProps, useMemo } from 'react'
import { useNetwork } from '@/lib/web3/hooks'
import { Network } from './Network'
import { filter } from 'lodash'

export type NetworksProps = HTMLProps<HTMLUListElement> & {}

export const Networks = (props: NetworksProps) => {
  const { chain, chains } = useNetwork()

  const remainingChains = useMemo(
    () => filter(chains, (chainToCheck) => chainToCheck.id !== chain?.id),
    [chain, chains],
  )

  return (
    <ul {...props}>
      <li>
        <Network
          chain={chain}
          currentChain={chain}
          className={'w-full rounded-md p-2 hover:bg-gray-100'}
        />
      </li>
      {Children.toArray(
        remainingChains.map((remainingChain) => (
          <li>
            <Network
              currentChain={chain}
              chain={remainingChain}
              className={'w-full rounded-md p-2 hover:bg-gray-100'}
            />
          </li>
        )),
      )}
    </ul>
  )
}

export default Networks
