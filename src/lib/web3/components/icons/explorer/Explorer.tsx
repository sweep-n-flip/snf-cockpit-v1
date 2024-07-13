'use client'

import { ChainId } from '@/lib/web3/types/chain'
import { Etherscan } from './Etherscan'
import { Snowtrace } from './Snowtrace'
import { Binancescan } from './Binance'

export type ExplorerProps = {
  chainId?: ChainId
  size?: number
}

export const Explorer = ({ chainId, size = 16 }: ExplorerProps) => {
  return (
    <div className="rounded-full bg-black/80">
      {typeof chainId !== 'undefined' ? (
        {
          [ChainId.AvalancheFuji]: <Snowtrace size={size} />,
          [ChainId.ArbitrumSepolia]: <Etherscan size={size} />,
          [ChainId.BscTestnet]: <Binancescan size={size} />,
          [ChainId.Linea]: <Etherscan size={size} />,
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

export default Explorer
