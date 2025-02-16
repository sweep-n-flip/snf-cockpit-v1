import React, { useState } from 'react'
import { MdArrowForward } from 'react-icons/md'

const NftCardBridge = () => {
  const [selectedFromChain, setSelectedFromChain] = useState('Ethereum')
  const [selectedToChain, setSelectedToChain] = useState('Polygon')
  const [selectedItems, setSelectedItems] = useState(3)
  const [selectedTokens, setSelectedTokens] = useState(new Set())
  const [bridgedTokens, setBridgedTokens] = useState([])

  const chains = [
    { id: 'ethereum', name: 'Ethereum', version: '16' },
    { id: 'polygon', name: 'Polygon', version: '2' },
    { id: 'smartchain', name: 'SmartChain', version: '2' },
    { id: 'arbitrum', name: 'Arbitrum', version: '2' },
    { id: 'avalanche', name: 'Avalanche', version: '2' },
  ]

  const handleTokenClick = (index) => {
    setSelectedTokens((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(index)) {
        newSet.delete(index)
      } else if (newSet.size < 16) {
        newSet.add(index)
      }
      setSelectedItems(newSet.size)
      return newSet
    })
  }

  const handleBridge = () => {
    const selectedArray = Array.from(selectedTokens)
    setBridgedTokens([...selectedArray])
    setSelectedTokens(new Set())
    setSelectedItems(0)
  }

  const TokenGridLeft = ({ balance, onTokenClick, tokens }) => (
    <div className="mb-1 h-96 overflow-y-auto rounded-lg bg-gray-100 pr-2">
      <div className="grid grid-cols-5 gap-2 rounded-lg  p-1">
        {Array(balance)
          .fill(0)
          .map((_, index) => (
            <div
              key={index}
              onClick={() => onTokenClick?.(index)}
              className={`relative h-[100px] cursor-pointer rounded-lg bg-gray-100  transition-all hover:opacity-80
                ${tokens.has(index) ? 'ring-2 ring-color-primary' : ''}`}
            >
              <img
                src="https://www.moneytimes.com.br/uploads/2021/10/bored-ape-8585.jpg"
                alt="Token"
                className="size-full rounded-lg object-cover"
              />
              <div className="absolute bottom-1 left-1 text-xs text-white">9,999</div>
            </div>
          ))}
      </div>
    </div>
  )

  const TokenGridRight = ({ tokens }) => (
    <div className="h-full overflow-y-auto rounded-lg bg-gray-100 pr-2">
      <div className="grid grid-cols-5 gap-2 rounded-lg  p-1">
        {tokens.map((tokenId, index) => (
          <div
            key={index}
            className="relative h-[100px] cursor-pointer rounded-lg bg-gray-100  transition-all hover:opacity-80"
          >
            <img
              src="https://www.moneytimes.com.br/uploads/2021/10/bored-ape-8585.jpg"
              alt="Token"
              className="h-full w-full rounded-lg object-cover"
            />
            <div className="absolute bottom-1 left-1 text-xs text-white">9,999</div>
          </div>
        ))}
      </div>
    </div>
  )

  const ChainSelector = ({ chains, selected, onChange, label }) => (
    <div className="">
      <div className="mb-2 text-sm text-gray-600">{label}</div>
      <div className="flex flex-wrap gap-2">
        {chains.map((chain) => (
          <button
            key={chain.id}
            onClick={() => onChange(chain.name)}
            className={`flex items-center rounded-full px-3 py-1.5 text-sm ${
              selected === chain.name ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
            }`}
          >
            {chain.name} {chain.version}
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
      <div className="h-full rounded-lg border border-gray-300 bg-white p-6 shadow-lg flex flex-col gap-2 ">
        <ChainSelector
          chains={chains}
          selected={selectedFromChain}
          onChange={setSelectedFromChain}
          label="From"
        />
        <div className="text-sm text-gray-600">Balance (16)</div>
        <TokenGridLeft balance={16} onTokenClick={handleTokenClick} tokens={selectedTokens} />

        <div className=" flex items-center gap-2">
          <input
            type="range"
            min="0"
            max="16"
            value={selectedItems}
            onChange={(e) => {
              const newValue = parseInt(e.target.value)
              setSelectedItems(newValue)
              const newSelected = new Set()
              for (let i = 0; i < newValue; i++) {
                newSelected.add(i)
              }
              setSelectedTokens(newSelected)
            }}
            className="h-2 w-full rounded-lg bg-color-primary accent-color-primary"
          />
          <span className="text-sm text-gray-600">{selectedItems} Items</span>
        </div>

        <button
          onClick={handleBridge}
          className="w-full rounded-lg bg-red-500 py-3 font-medium text-white transition-colors hover:bg-red-600"
        >
          Bridge
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <button
          onClick={handleBridge}
          className="rounded-full p-2 transition-colors hover:bg-gray-100"
          title="Switch chains"
        >
          <MdArrowForward className="size-6 text-gray-400" />
        </button>
      </div>

      <div className="flex h-full flex-col gap-2 rounded-lg border border-gray-300 bg-white p-6 shadow-lg">
        <ChainSelector
          chains={chains}
          selected={selectedToChain}
          onChange={setSelectedToChain}
          label="To"
        />
        <div className="text-sm text-gray-600">Balance ({bridgedTokens.length})</div>
        <TokenGridRight tokens={bridgedTokens} />
      </div>
    </div>
  )
}

export default NftCardBridge
