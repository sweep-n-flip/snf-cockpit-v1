'use client'
import { Typography } from '@/lib/ui/components'
import { Chain } from '@/lib/web3/components/icons/chains'
import { useRouter } from 'next/navigation'
import React from 'react'

interface BridgedNetworks {
  chainId: number
  amount: number
}

export interface NFTCollection {
  id: number
  name: string
  image: string
  nativeChain: string
  nativeChainId: number
  bridgedNetworks: BridgedNetworks[]
  balance: string
}

const collections: NFTCollection[] = [
  {
    id: 1,
    name: 'CryptoPunks',
    image: '👾',
    nativeChain: 'bsc-testnet',
    nativeChainId: 97,
    bridgedNetworks: [
      { chainId: 80084, amount: 300 },
      { chainId: 43113, amount: 300 },
    ],
    balance: '10',
  },
  {
    id: 2,
    name: 'Bored Ape Yacht Club',
    image: '🐵',
    nativeChain: 'berachain-bartio',
    nativeChainId: 80084,
    bridgedNetworks: [
      { chainId: 80084, amount: 300 },
      { chainId: 43113, amount: 300 },
    ],
    balance: '10',
  },
  {
    id: 3,
    name: 'Mutant Ape Yacht Club',
    image: '🦍',
    nativeChain: 'berachain-bartio',
    nativeChainId: 80084,
    bridgedNetworks: [
      { chainId: 80084, amount: 300 },
      { chainId: 43113, amount: 300 },
    ],
    balance: '10',
  },
  {
    id: 4,
    name: 'Mutant Hound Collars',
    image: '🐕',
    nativeChain: 'berachain-bartio',
    nativeChainId: 80084,
    bridgedNetworks: [
      { chainId: 80084, amount: 300 },
      { chainId: 43113, amount: 300 },
    ],
    balance: '10',
  },
  {
    id: 5,
    name: 'The Captainz',
    image: '🏴‍☠️',
    nativeChain: 'berachain-bartio',
    nativeChainId: 80084,
    bridgedNetworks: [
      { chainId: 80084, amount: 300 },
      { chainId: 43113, amount: 300 },
    ],
    balance: '10',
  },
]

export default function YourAssetsTable() {
  const router = useRouter()
  return (
    <div className="flex flex-col gap-6">
      <Typography.Paragraph size="default" variant="default">
        Select the collection
      </Typography.Paragraph>
      <div className="w-full overflow-hidden rounded-lg shadow">
        <table className="w-full">
          <thead className="bg-[#434343] text-left text-white">
            <tr className="border-b">
              <th className="p-4 font-medium">#</th>
              <th className="p-4 font-medium">Collection</th>
              <th className="p-4 font-medium">Native Chain</th>
              <th className="p-4 font-medium">Bridged Networks</th>
              <th className="p-4 text-right font-medium">Balance</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {collections.map((collection) => (
              <tr
                key={collection.id}
                className="cursor-pointer border-b hover:bg-gray-50"
                onClick={() => router.push(`/bridge/collection/${collection.id}`)}
              >
                <td className="p-4 text-gray-600">{collection.id}</td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{collection.image}</span>
                    <span className="font-medium">{collection.name}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <Chain chainId={collection.nativeChainId} size={16} />
                    <span>{collection.nativeChain}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    {collection.bridgedNetworks.map((network, index) => (
                      <span
                        key={index}
                        className="flex items-center gap-2 rounded-lg bg-gray-200 px-2 py-1 text-sm"
                      >
                        <Chain chainId={network.chainId} size={16} />
                        {network.amount}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="p-4 text-right">{collection.balance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
