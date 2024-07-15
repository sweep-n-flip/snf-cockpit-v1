// 'use client'

import { ReactNode } from 'react'
import { Registry } from '@/app/Registry'
import { Web3Provider } from '@/lib/web3/components'
import { ServiceProvider } from '@/lib/services/api/components'

// async function getData() {
//   const res = await fetch('http://localhost:3000/api/globals/project')
//   // The return value is *not* serialized
//   // You can return Date, Map, Set, etc.

//   if (!res.ok) {
//     // This will activate the closest `error.js` Error Boundary
//     throw new Error('Failed to fetch data')
//   }

//   return res.json()
// }

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  // const data = await getData()
  // console.log(data)

  return (
    <ServiceProvider>
      <Web3Provider>
        <Registry>{children}</Registry>
      </Web3Provider>
    </ServiceProvider>
  )
}
