'use client'

import { Card } from '@/lib/ui/components'
import { Modal, Option } from '@/lib/ui/components/select/Modal'
import Image from 'next/image'
import { useFormContext } from 'react-hook-form'
import { TokenType } from '@/lib/ui/components/blocks/bridges/types/bridge'
import { useIsomorphicLayoutEffect } from 'usehooks-ts'
import { useEffect } from 'react'
import classNames from 'classnames'

import {
  CHAIN_ID_IN,
  COLLECTION_ADDRESS_IN,
  COLLECTION_ADDRESS_OUT,
} from '@/lib/ui/components/blocks/bridges/utils/constants/fields'
import { ERC721Collections } from '@/lib/services/api/entities/ERC721/types'

export type ChooseTokensProps = {
  disabled?: boolean
  tokenType: TokenType
  collections: ERC721Collections
  loading?: boolean
}

export const ChooseTokens = ({ disabled, tokenType, collections, loading }: ChooseTokensProps) => {
  const idLocal = tokenType === TokenType.TokenIn ? COLLECTION_ADDRESS_IN : COLLECTION_ADDRESS_OUT
  const idRemote = tokenType === TokenType.TokenOut ? COLLECTION_ADDRESS_IN : COLLECTION_ADDRESS_OUT

  // const { address } = useWallet()
  const { watch, register, setValue, getFieldState } = useFormContext()
  const { error: idLocalErrors } = getFieldState(idLocal)

  const chainIdInValue = watch(CHAIN_ID_IN)
  const idLocalValue = watch(idLocal, '')

  const handleSelect = (value: Option['value']) => {
    setValue(idLocal, value, { shouldValidate: true })
    setValue(idRemote, value, {
      shouldValidate: true,
    })
  }

  useEffect(() => {
    if (chainIdInValue) {
      setValue(idLocal, '')
      setValue(idRemote, '')
    }
  }, [setValue, chainIdInValue, idLocal, idRemote])

  useIsomorphicLayoutEffect(() => {
    register(idLocal, { required: true })
  }, [idLocal, register])

  return (
    <div className="flex min-w-32 flex-col items-end justify-end space-y-px">
      <Card.Default size="default" className="w-full rounded-md">
        <Modal
          title="Select a token"
          disabled={disabled || loading || !chainIdInValue}
          buttonClassName={classNames(['px-3 py-2', idLocalErrors && 'rounded-md bg-red-400/10 '])}
          buttonLabelClassName="overflow-hidden truncate max-w-24"
          onSelect={handleSelect}
          selectedOption={idLocalValue}
          optionLabelClassName="overflow-hidden truncate max-w-60"
          options={
            collections
              ? collections?.map((collection) => ({
                  label: collection.name,
                  value: collection.address,
                  thumbnail: collection.image ? (
                    <Image
                      src={collection.image}
                      alt={collection.name}
                      className="size-6 rounded-full"
                      width={24}
                      height={24}
                    />
                  ) : undefined,
                }))
              : []
          }
        />
      </Card.Default>
    </div>
  )
}

export default ChooseTokens
