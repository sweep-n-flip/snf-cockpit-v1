'use client'

import { HTMLProps } from 'react'
import { Network, Buttons } from '@/lib/web3/components/wallet'
import { BarProps } from '@/lib/web3/components/wallet/network/Bar'
import { ConnectProps } from '@/lib/web3/components/wallet/buttons/Connect'
import classNames from 'classnames'
import { useWallet } from '@/lib/web3/hooks'
import { Account } from '@/lib/web3/components/wallet'

export type DefaultProps = HTMLProps<HTMLDivElement> & {
  barProps?: BarProps
  connectProps?: ConnectProps
}

export function Default({ barProps, connectProps, className, ...props }: DefaultProps) {
  const { isConnected, isReconnecting, isReady } = useWallet()

  return (
    <div {...props} className={classNames([className, 'flex items-center gap-6'])}>
      {isConnected && !isReconnecting && <Network.Bar {...barProps} className="max-lg:hidden" />}

      {!isConnected || !isReady ? <Buttons.Connect {...connectProps} /> : <Account.Bar />}
    </div>
  )
}

export default Default
