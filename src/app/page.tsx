import { useConnectModal } from '@rainbow-me/rainbowkit'
import { SwapWidget } from '@reservoir0x/relay-kit-ui'
import Image from 'next/image'

export default function Home() {
  const { openConnectModal } = useConnectModal()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="flex items-center gap-2 mb-8">
        <Image src="/logo.svg" alt="Sweep n' Flip Logo" width={40} height={40} />
        <span className="text-2xl font-bold text-[#ff4d00]">Sweep n' Flip <span className="text-xs text-black">NFT DEX</span></span>
      </div>

      <div className="w-full max-w-2xl">
        <SwapWidget
          supportedWalletVMs={['evm']}
          onConnectWallet={openConnectModal}
          multiWalletSupportEnabled={true}
          onAnalyticEvent={(eventName: string, data: unknown) => {
            console.log('Analytic Event', eventName, data)
          }}
        />
      </div>
    </div>
  )
} 