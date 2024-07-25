'use client'

import { useNetwork } from '../../hooks'

export function Default() {
  const { chains } = useNetwork()
  console.log(chains)

  return <div>toolbar</div>
}

export default Default
