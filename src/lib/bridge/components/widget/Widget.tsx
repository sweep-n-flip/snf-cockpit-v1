'use client'

import { Card, Typography } from '@/lib/ui/components'
import { Form } from './form/Form'
import { ChainId, allowedChains } from '@/lib/web3/config/chains'

export type WidgetProps = {
  enabledChainIds: ChainId[]
}

export const Widget = ({ enabledChainIds }: WidgetProps) => {
  const chains = enabledChainIds.map((chainId) => allowedChains[chainId])

  return (
    <Card.Default className="flex w-full flex-col gap-4 lg:max-w-[30rem]">
      <div>
        <Typography.Heading as="h3" size="h4" className="flex items-center justify-between gap-8">
          <Typography.Paragraph size="default" variant="default">
            Bridge
          </Typography.Paragraph>
        </Typography.Heading>
        <Typography.Paragraph>Send NFTs across chains</Typography.Paragraph>
      </div>
      <Form chains={chains} />
    </Card.Default>
  )
}

export default Widget
