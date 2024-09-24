'use client'

import { Typography } from '@/lib/ui/components'

export type AssetValuesProps = {
  tokensCount: number
}

export const AssetValues = ({ tokensCount }: AssetValuesProps) => {
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
          Balance: {tokensCount}
        </Typography.Paragraph>
      </div>
    </div>
  )
}

export default AssetValues
