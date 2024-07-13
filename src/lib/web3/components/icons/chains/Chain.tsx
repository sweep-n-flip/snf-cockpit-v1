'use client'

import { ChainId } from '@/lib/web3/types/chain'
import { Polygon } from './Polygon'
import { Linea } from './Linea'
import { Avalanche } from './Avalanche'
import { Arbitrum } from './Arbitrum'
import { Binance } from './Binance'

export type ChainProps = {
  chainId?: ChainId
  size?: number
}

export const Chain = ({ chainId, size = 16 }: ChainProps) => {
  return (
    <div className="rounded-full bg-black/80">
      {chainId ? (
        {
          [ChainId.Polygon]: <Polygon size={size} />,
          [ChainId.Linea]: <Linea size={size} />,
          [ChainId.ArbitrumSepolia]: <Arbitrum size={size} />,
          [ChainId.AvalancheFuji]: <Avalanche size={size} />,
          [ChainId.BscTestnet]: <Binance size={size} />,
        }[chainId]
      ) : (
        <>
          <style jsx>
            {`
              div {
                width: ${size}px;
                height: ${size}px;
              }
            `}
          </style>
          <div className="-m-px rounded-full bg-zinc-200" />
        </>
      )}
    </div>
  )
}

export default Chain
