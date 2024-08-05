'use client'

import { Card } from '@/lib/ui/components'
import { ArrowsUpDownIcon } from '@heroicons/react/24/outline'
import { useFormContext } from 'react-hook-form'

import {
  TOKEN_IDS_IN,
  TOKEN_IDS_OUT,
  COLLECTION_ADDRESS_IN,
  COLLECTION_ADDRESS_OUT,
  CHAIN_ID_IN,
  CHAIN_ID_OUT,
} from '@/lib/ui/components/blocks/bridges/utils/constants/fields'
import { clone } from 'lodash'

export const Switcher = () => {
  const { setValue, getValues } = useFormContext()

  const resetFields = () => {
    setValue(COLLECTION_ADDRESS_IN, '')
    setValue(COLLECTION_ADDRESS_OUT, '')

    setValue(TOKEN_IDS_IN, [])
    setValue(TOKEN_IDS_OUT, [])
  }

  const switchChain = () => {
    const chainIdIn = clone(getValues(CHAIN_ID_IN))
    const chainIdOut = clone(getValues(CHAIN_ID_OUT))

    setValue(CHAIN_ID_OUT, chainIdIn)
    setValue(CHAIN_ID_IN, chainIdOut)
  }

  const handleClickSwitch = () => {
    switchChain()
    resetFields()
  }

  return (
    <div className="relative z-[2] -my-6 flex items-center justify-center">
      <Card.Default className="flex cursor-pointer items-center justify-center" size="xs">
        <ArrowsUpDownIcon
          width={20}
          height={20}
          className="text-slate-700"
          onClick={handleClickSwitch}
        />
      </Card.Default>
    </div>
  )
}

export default Switcher
