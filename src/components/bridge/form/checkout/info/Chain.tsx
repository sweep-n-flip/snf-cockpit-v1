import { Chain as ChainIcon } from '@/lib/web3/components/icons/chains/Chain'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { Chains } from '@/lib/payloadcms/types/payload-types'
import { Typography } from '@/lib/ui/components'

export type ChainProps = {
  chainIn?: Chains
  chainOut?: Chains
}

export const Chain = ({ chainIn, chainOut }: ChainProps) => {
  return (
    <div className="flex items-center  justify-around gap-4 rounded-md bg-zinc-100 p-2">
      {chainIn && (
        <div className="flex items-center justify-center space-x-2">
          <div className="max-lg:hidden">
            <Typography.Paragraph variant="default">from</Typography.Paragraph>
          </div>
          <div className="flex items-center space-x-2">
            <ChainIcon chainId={chainIn.chainId} />
            <Typography.Paragraph
              className="overflow-hidden truncate font-bold max-lg:w-20"
              variant="default"
            >
              {chainIn.name}
            </Typography.Paragraph>
          </div>
        </div>
      )}
      <div>
        <ArrowRightIcon className="size-6" />
      </div>
      {chainOut && (
        <div className="flex items-center justify-center space-x-2">
          <div>
            <Typography.Paragraph variant="default">to</Typography.Paragraph>
          </div>
          <div className="flex items-center space-x-2">
            <ChainIcon chainId={chainOut.chainId} />
            <Typography.Paragraph
              className="overflow-hidden truncate font-bold max-lg:w-20"
              variant="default"
            >
              {chainOut.name}
            </Typography.Paragraph>
          </div>
        </div>
      )}
    </div>
  )
}

export default Chain
