'use client'
import { Children, useEffect } from 'react'
import { Default as Modal } from '@/lib/ui/components/modal/Default'
import { Button, Typography } from '@/lib/ui/components'
import { TokenType } from '@/components/bridge/types/bridge'
import { useFormContext } from 'react-hook-form'
import { useIsomorphicLayoutEffect, useToggle } from 'usehooks-ts'
import Image from 'next/image'
import gt from 'lodash/gt'
import { Chain } from '@/lib/web3/components/icons/chains'

import classNames from 'classnames'

import {
  CHAIN_ID_IN,
  TOKEN_IDS_IN,
  TOKEN_IDS_OUT,
  COLLECTION_ADDRESS_IN,
} from '@/components/bridge/utils/constants/fields'

import { Rangebar } from '@/components/bridge/form/token'
import { useNetwork } from '@/lib/web3'
import { find } from 'lodash'
import { Chains } from '@/lib/payloadcms/types/payload-types'
import { Collection } from '@/lib/payloadcms/plugins/snf/graphql/entities/ERC721/ownership/types'

export type ChooseTokenIdsProps = {
  tokenType: TokenType
  collection: Collection
  tokens: string[]
  loading?: boolean
}

export const ChooseTokenIds = ({ tokenType, tokens, loading, collection }: ChooseTokenIdsProps) => {
  const idLocal = tokenType === TokenType.TokenIn ? TOKEN_IDS_IN : TOKEN_IDS_OUT
  const idRemote = tokenType === TokenType.TokenOut ? TOKEN_IDS_IN : TOKEN_IDS_OUT

  const [isModalOpen, , setIsModalOpen] = useToggle()

  const { watch, register, setValue } = useFormContext()

  const idLocalValue: string[] = watch(idLocal, [])

  const collectionAddressInValue = watch(COLLECTION_ADDRESS_IN, '')

  const chainIdInValue = watch(CHAIN_ID_IN)

  const { chains } = useNetwork()
  const { chain: chainIn } = (find(chains, {
    chainId: chainIdInValue.chainId,
  }) || {
    chain: {},
  }) as { chain: Chains }

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleSelectToken = (tokenId: string) => {
    const alreadyExist = idLocalValue.some((selectedId) => selectedId === tokenId)

    if (alreadyExist) {
      setValue(
        idLocal,
        idLocalValue.filter((id) => id !== tokenId),
        {
          shouldValidate: true,
        },
      )

      setValue(
        idRemote,
        idLocalValue.filter((id) => id !== tokenId),
        {
          shouldValidate: true,
        },
      )

      return
    }

    setValue(idLocal, [...idLocalValue, tokenId], {
      shouldValidate: true,
    })

    setValue(idRemote, [...idLocalValue, tokenId], {
      shouldValidate: true,
    })
  }

  const handleConfirm = () => {
    handleCloseModal()
  }

  useEffect(() => {
    /// reset values if network or collection updates
    if (chainIdInValue || collectionAddressInValue) {
      setValue(idLocal, [])
      setValue(idRemote, [])
    }
  }, [chainIdInValue, collectionAddressInValue, idLocal, idRemote, setValue])

  useIsomorphicLayoutEffect(() => {
    register(idLocal, {
      required: true,
      /// must select at least one token
      validate: (value) => gt(value.length, 0),
    })
  }, [idLocal, register])

  return (
    <div className="flex flex-none items-center justify-end">
      <Typography.Paragraph
        as="button"
        type="button"
        className={classNames([
          'cursor-pointer text-color-primary',
          {
            'opacity-50': tokens?.length === 0 || loading,
          },
        ])}
        size="xs"
        variant="default"
        onClick={handleOpenModal}
        disabled={tokens?.length === 0 || loading}
      >
        <span className="max-lg:hidden">Choose </span>
        <span>NFTs</span>
      </Typography.Paragraph>
      <Modal
        title={collection?.name || 'Choose NFTs'}
        description={
          chainIn ? (
            <div className="flex items-center space-x-1">
              <Chain chainId={chainIn?.chainId} />
              <Typography.Paragraph size="sm">{chainIn.name}</Typography.Paragraph>
            </div>
          ) : undefined
        }
        thumbnail={
          collection?.image && (
            <div className="size-11 rounded-md bg-zinc-200">
              <Image
                src={collection.image!}
                alt={collection?.name ?? collection.address}
                className="size-11 rounded-md"
                width={44}
                height={44}
              />
            </div>
          )
        }
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      >
        <div className="flex flex-col space-y-8 p-4">
          <div className="flex justify-between space-x-8">
            <div className="flex-1">
              <Rangebar tokenType={tokenType} tokens={tokens} />
            </div>
            <div>
              <Typography.Paragraph size="sm">{idLocalValue.length} items</Typography.Paragraph>
            </div>
          </div>
          {gt(tokens?.length, 0) ? (
            <ul className="grid grid-cols-6 gap-4">
              {Children.toArray(
                tokens!.map((token) => (
                  <li className={classNames(['col-span-2 sm:col-span-1'])}>
                    <div
                      onClick={() => handleSelectToken(token)}
                      className={classNames([
                        'relative size-24 cursor-pointer overflow-hidden rounded-md bg-zinc-200',
                        {
                          'outline-width-2 outline-style-solid outline outline-color-primary':
                            idLocalValue.some((selectedId) => selectedId === token),
                        },
                      ])}
                    >
                      {collection.image && (
                        <Image
                          src={collection.image}
                          alt={collection?.name ?? collection.address}
                          className="size-full rounded-md object-cover"
                          sizes={`
                            (min-width: 640px) 96px,
                            (min-width: 768px) 96px,
                            (min-width: 1024px) 96px,
                            (min-width: 1280px) 96px,
                            96px
                          `}
                          fill
                        />
                      )}
                      <div className="absolute bottom-2 left-2 rounded-md bg-zinc-800 px-2 py-px opacity-80">
                        <Typography.Paragraph className="text-white" size="xs">
                          #{token}
                        </Typography.Paragraph>
                      </div>
                    </div>
                  </li>
                )),
              )}
            </ul>
          ) : (
            <div className="text-center">
              <Typography.Paragraph size="sm" variant="default">
                No NFTs found
              </Typography.Paragraph>
            </div>
          )}
        </div>
        <div className="flex justify-end space-x-4 border-t border-zinc-200 p-4">
          <div>
            <Button.Default
              size="sm"
              type="button"
              onClick={handleConfirm}
              disabled={loading || idLocalValue.length === 0}
            >
              Confirm
            </Button.Default>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default ChooseTokenIds
