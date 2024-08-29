'use client'

import { Typography } from '@/lib/ui/components'
import { Token } from '@/lib/payloadcms/plugins/snf/graphql/entities/ERC721/wallet/types'

export type AssetValuesProps = {
  tokens: Token[]
}

export const AssetValues = ({ tokens }: AssetValuesProps) => {
  return (
    <div className="flex justify-between">
      <div>
        {/* 
          todo: check if its required
        <Typography.Paragraph size='sm' className='text-zinc-400'>
          $0.00
        </Typography.Paragraph> */}
      </div>
      <div>
        <Typography.Paragraph size="sm" className="text-zinc-400">
          Balance: {tokens.length}
        </Typography.Paragraph>
      </div>
    </div>
  )
}

export default AssetValues
