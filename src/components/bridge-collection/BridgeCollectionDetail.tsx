'use client'
import { Bridge as BridgeType, Chains } from '@/lib/payloadcms/types/payload-types'
import { Card, Typography } from '@/lib/ui/components'
import Link from 'next/link'
import { PiArrowLeft } from 'react-icons/pi'
import { FaCheckCircle, FaExternalLinkAlt } from 'react-icons/fa'
import Image from 'next/image'
import { Chain } from '@/lib/web3/components/icons/chains'
import { Heading, Paragraph } from '@/lib/ui/components/typography'
import Form from '@/components/bridge/form/Form'
import { useMemo } from 'react'

export type WidgetProps = {
  config?: (string | null) | BridgeType
}

interface Collection {
  chainId: number
  nativeChain: string
  logo: string
  name: string
  contract: string
  owners: number
  items: number
  omniBridgeContract: string
}

const collection: Collection = {
  chainId: 80084,
  nativeChain: 'berachain-bartio',
  logo: 'https://s3.cointelegraph.com/storage/uploads/view/e0a22aa33c4efbc2cb01b04eb634f563.jpg',
  name: 'MutantApeYachtClub',
  contract: '0x123...0x123',
  owners: 8756,
  items: 20000,
  omniBridgeContract: '0x123...0x123',
}

export const BridgeCollectionDetail = ({ config }: WidgetProps) => {
  const { title, description, routing } = (config || {}) as Partial<BridgeType>
  // Get the source and target chains
  const { sourceChains, targetChains } = useMemo(() => {
    const sourceChains = new Set<string | Chains>()
    const targetChains = new Set<string | Chains>()

    // Map the chains from the paths
    routing?.paths.map((path) => {
      sourceChains.add(path.sourceChain)
      targetChains.add(path.targetChain)
    })

    return {
      sourceChains: [...sourceChains],
      targetChains: [...targetChains],
    }
  }, [routing?.paths])

  return (
    <Card.Default className="flex w-full flex-col gap-4 ">
      <Heading as="h1" size="h3" className="flex items-center  gap-2">
        <Link href="/bridge">
          <PiArrowLeft />
        </Link>
        <Paragraph size="default" variant="default">
          Bridge
        </Paragraph>
      </Heading>
      <div className="rounded-lg border border-gray-300 p-4">
        <div className="flex items-center justify-between gap-8 border-b border-gray-300 pb-4">
          <div className="flex items-center gap-4">
            <div className="relative size-[60px]">
              <Image src={collection.logo} alt="logo" fill className=" rounded-lg object-cover" />
            </div>
            <Typography.Paragraph size="2xl" variant="default" className="font-bold">
              {collection.name}
            </Typography.Paragraph>
            <FaCheckCircle className="text-color-primary" />
          </div>
          <div className="flex items-center gap-6">
            <div className="flex flex-col gap-1">
              <Typography.Paragraph size="default" variant="default" className="text-sm">
                Contract
              </Typography.Paragraph>
              <div className="flex items-center gap-1">
                <Typography.Paragraph size="default" variant="default" className="font-bold">
                  {collection.contract}
                </Typography.Paragraph>
                <FaExternalLinkAlt className="text-sm font-normal" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex flex-col gap-1">
                <Typography.Paragraph size="default" variant="default" className="text-sm">
                  Native Chain
                </Typography.Paragraph>
                <div className="flex items-center gap-1">
                  <Chain chainId={collection.chainId} size={16} />
                  <Typography.Paragraph size="default" variant="default" className="font-bold">
                    {collection.nativeChain}
                  </Typography.Paragraph>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex flex-col gap-1">
                <Typography.Paragraph size="default" variant="default" className="text-sm">
                  Owners
                </Typography.Paragraph>
                <div className="flex items-center gap-1">
                  <Typography.Paragraph size="default" variant="default" className="font-bold">
                    {collection.owners}
                  </Typography.Paragraph>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex flex-col gap-1">
                <Typography.Paragraph size="default" variant="default" className="text-sm">
                  Items
                </Typography.Paragraph>
                <div className="flex items-center gap-1">
                  <Typography.Paragraph size="default" variant="default" className="font-bold">
                    {collection.items}
                  </Typography.Paragraph>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-8 pt-4">
          <div className="flex items-center gap-4">
            <div className="flex flex-col gap-1">
              <Typography.Paragraph size="default" variant="default" className="text-sm">
                Omnichain Bridge Contract
              </Typography.Paragraph>
              <div className="flex items-center gap-1">
                <Typography.Paragraph size="default" variant="default" className="font-bold">
                  {collection.omniBridgeContract}
                </Typography.Paragraph>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex flex-col gap-1">
              <Typography.Paragraph size="default" variant="default" className="text-sm">
                Items bridged
              </Typography.Paragraph>
              <div className="flex items-center gap-1">
                <Typography.Paragraph size="default" variant="default" className="font-bold">
                  5.000 (25%)
                </Typography.Paragraph>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Heading as="h1" size="h3" className="flex items-center  gap-2">
        <Paragraph size="default" variant="default">
          My Wallet
        </Paragraph>
      </Heading>
      <Card.Default className="flex w-full flex-col gap-4 lg:max-w-[30rem]">
        <div>
          {title && (
            <Typography.Heading
              as="h3"
              size="h4"
              className="flex items-center justify-between gap-8 "
            >
              <Typography.Paragraph size="default" variant="default">
                {title}
              </Typography.Paragraph>
            </Typography.Heading>
          )}

          {description && <Typography.Paragraph>{description}</Typography.Paragraph>}

          <Form sourceChains={sourceChains as Chains[]} targetChains={targetChains as Chains[]} />
        </div>
      </Card.Default>
    </Card.Default>
  )
}

export default BridgeCollectionDetail
