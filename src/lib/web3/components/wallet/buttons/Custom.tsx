'use client'

import { Default, DefaultProps } from '@/lib/ui/components/button/Default'
import { useNetwork, useWallet } from '@/lib/web3/hooks'
import { MouseEvent, ReactNode, useEffect, useMemo, useState } from 'react'
import { useModal } from 'connectkit'
import { Chain } from '@/lib/web3/types'

export type CustomProps = DefaultProps & {
  chainId: Chain['id']
}

export const Custom = ({ children, onClick, chainId, type, ...props }: CustomProps) => {
  const [text, setText] = useState<ReactNode>(<>Connect</>)

  const { setOpen } = useModal()
  const { chain, switchChain, loading } = useNetwork()
  const { isConnected, isConnecting, isReady } = useWallet()

  const mustSwitchChain = useMemo(
    () => (isReady && isConnected && !chain) || (chainId && chain && chain.id !== chainId),
    [chain, isReady, isConnected, chainId],
  )

  const buttonType = useMemo(() => {
    /// if not connected or must switch chain, return button type
    if (!isReady || !isConnected || mustSwitchChain) return 'button'

    /// if connected, return type
    if (type) return type

    /// if connected and no type, return button
    return 'button'
  }, [isConnected, type, mustSwitchChain, isReady])

  const handleConnect = (e: MouseEvent<HTMLButtonElement>) => {
    /// if must switch chain and switchChain is available, switch chain to default chain
    if (mustSwitchChain && switchChain) {
      switchChain({
        chainId: chainId,
      })
      return
    }

    if (isConnected) return onClick?.(e)
    setOpen(true)
  }

  useEffect(() => {
    if (isConnecting) {
      setText('Connecting')
      return
    }

    if ((!isConnected && !isReady) || (isConnected && isReady)) {
      setText(children)
      return
    }

    setText('Connect')
  }, [isReady, isConnected, children, isConnecting])

  return (
    <Default
      {...props}
      disabled={loading || props.disabled}
      type={buttonType}
      onClick={handleConnect}
    >
      {mustSwitchChain ? <>{loading ? 'Connecting' : 'Switch chain'}</> : <>{text}</>}
    </Default>
  )
}

export default Custom
