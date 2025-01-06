import { Typography } from '@/lib/ui/components'
import { Address } from 'viem'
import Image from 'next/image'
import { Info } from '@/components/bridge/form/checkout'
import { Chains } from '@/lib/payloadcms/types/payload-types'
import { Collection } from '@/lib/payloadcms/plugins/snf/graphql/entities/ERC721/ownership/types'

export type ReviewProps = {
  collectionAddress: Address
  tokensIds: (Address | string | number)[]
  selectedTokens: string[]
  selectedCollection?: Collection
  chainIn?: Chains
  chainOut?: Chains
}

export const Review = ({
  collectionAddress,
  chainIn,
  chainOut,
  selectedTokens,
  selectedCollection,
}: ReviewProps) => {
  return (
    <div className="flex gap-8 max-md:flex-col md:min-w-[50rem]">
      <div className="flex flex-col space-y-6">
        <div className="relative size-52 overflow-hidden rounded-lg max-md:w-full">
          {selectedCollection?.image ? (
            <Image
              src={selectedCollection.image}
              alt={selectedCollection.name!}
              className="object-cover"
              sizes={`
                (min-width: 1024px) 1024px,
                (min-width: 768px) 768px,
                100vw
                `}
              fill
            />
          ) : (
            <div className="size-full bg-zinc-100" />
          )}
        </div>
        <div className="flex flex-col space-y-2 md:max-w-52">
          <div className="">
            <Typography.Heading as="h3" className="line-clamp-2 text-wrap">
              {selectedCollection?.name || 'Collection'}
            </Typography.Heading>
          </div>
          <div className="flex gap-2">
            <div>
              <Info.Explorer chainIn={chainIn} collectionAddress={collectionAddress} />
            </div>
            <div className="h-full w-px rounded-full bg-gray-200"></div>
            <div>
              <Info.Marketplaces
                chainIn={chainIn}
                collectionAddress={selectedCollection?.address as Address | undefined}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col space-y-6 ">
        <div className="flex flex-col space-y-2">
          <div className="flex flex-col space-y-px">
            <Typography.Heading as="h4">Checkout</Typography.Heading>
            <Typography.Paragraph className="flex space-x-1">
              <span>You are sending</span>
              <span className="font-bold">{selectedTokens.length}</span>
              <span>items</span>
            </Typography.Paragraph>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-stretch gap-4">
          {selectedTokens.map((token) => (
            <div
              key={`${selectedCollection?.name}:${token}`}
              className="flex items-center space-x-2"
            >
              <div className="relative size-24 overflow-hidden rounded-md bg-zinc-200">
                {selectedCollection?.image && (
                  <Image
                    src={selectedCollection.image}
                    alt={selectedCollection.name!}
                    className="size-full rounded-md object-cover"
                    fill
                  />
                )}
                <div className="absolute bottom-2 left-2 rounded-md bg-zinc-800 px-2 py-px opacity-80">
                  <Typography.Paragraph className="text-white" size="xs">
                    #{token}
                  </Typography.Paragraph>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div>
          <Info.Chain chainIn={chainIn} chainOut={chainOut} />
        </div>
      </div>
    </div>
  )
}

export default Review
