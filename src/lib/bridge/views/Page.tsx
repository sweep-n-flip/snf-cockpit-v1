import { Widget } from '@/lib/bridge/components'
import { ChainId } from '@/lib/web3/config/chains'

export default function Page() {
  return (
    <div className="flex size-full items-center justify-center py-16 container max-lg:items-start">
      <Widget.Widget
        enabledChainIds={[ChainId.ArbitrumSepolia, ChainId.BscTestnet, ChainId.AvalancheFuji]}
      />
    </div>
  )
}
