import { useAccount, useConnect, useDisconnect, useEnsName } from 'wagmi'

export function useWallet() {
  const {
    isConnected,
    address,
    isConnecting,
    isReconnecting,
    isDisconnected,
    status: accountStatus,
  } = useAccount()

  const { error } = useConnect()
  const { disconnect } = useDisconnect()

  const { data } = useEnsName({
    address,
  })

  return {
    isReady: accountStatus === 'connected' || accountStatus === 'disconnected',
    isDisconnected,
    isReconnecting,
    isConnecting,
    address,
    isConnected,
    error,
    disconnect,
    ens: data,
  }
}

export default useWallet
