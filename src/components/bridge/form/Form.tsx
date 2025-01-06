'use client'

import { useWallet } from '@/lib/web3'
import { Field } from '@/components/bridge/form/token'
import { Switcher } from '@/components/bridge/form/Switcher'
import { Buttons } from '@/lib/web3/components/wallet'
import { useForm, FormProvider } from 'react-hook-form'
import { DEFAULT_FORM_STATE } from '@/components/bridge/utils/constants/form'
import { CHAIN_ID_IN, COLLECTION_ADDRESS_IN } from '@/components/bridge/utils/constants/fields'
import { FormDataType, TokenType } from '@/components/bridge/types/bridge'
import { Chains } from '@/lib/payloadcms/types/payload-types'
import Modal from '@/components/bridge/form/checkout/Modal'
import React, { useMemo } from 'react'
import useGetERC721OwnerCollections from '@/lib/services/graphql/entities/ERC721/hooks/useGetERC721OwnerCollections'
import useGetERC721Balance from '@/lib/services/graphql/entities/ERC721/hooks/useGetERC721Balance'

export type FormProps = {
  sourceChains: Chains[]
  targetChains: Chains[]
}

export const Form = ({ sourceChains, targetChains }: FormProps) => {
  const { address } = useWallet()

  const methods = useForm<FormDataType>({
    mode: 'all',
    reValidateMode: 'onBlur',
    defaultValues: DEFAULT_FORM_STATE,
  })

  const { watch, formState } = methods
  const { errors } = formState

  const chainIdInValue = watch(CHAIN_ID_IN) as Chains
  const collectionAddressInValue = watch(COLLECTION_ADDRESS_IN)

  const { collections, loading: loadingCollections } = useGetERC721OwnerCollections({
    address,
    chainId: chainIdInValue.chainId,
  })

  const selectedCollection = useMemo(() => {
    return collections.find((collection) => collection.address === collectionAddressInValue)
  }, [collectionAddressInValue, collections])

  const { balance, loading: tokensLoading } = useGetERC721Balance({
    ownerAddress: address,
    chainId: chainIdInValue.chainId,
    collectionAddress: collectionAddressInValue,
    skip: !collectionAddressInValue,
  })

  return (
    <FormProvider {...methods}>
      <Modal tokens={balance?.tokenIds ?? []} selectedCollection={selectedCollection}>
        {({ openBridge }) => (
          <form
            onSubmit={methods.handleSubmit(openBridge)}
            noValidate
            className="flex flex-col gap-4"
          >
            <Field
              collections={collections}
              tokens={balance?.tokenIds ?? []}
              loading={loadingCollections || tokensLoading}
              selectedCollection={selectedCollection}
              chains={sourceChains}
              tokensCount={balance?.count ?? 0}
              tokenType={TokenType.TokenIn}
            />
            <Switcher />
            <Field
              collections={collections}
              tokens={balance?.tokenIds ?? []}
              loading={loadingCollections || tokensLoading}
              selectedCollection={selectedCollection}
              chains={targetChains}
              tokensCount={balance?.count ?? 0}
              tokenType={TokenType.TokenOut}
            />
            <Buttons.Custom
              type="submit"
              disabled={Object.keys(errors).length > 0}
              chainId={chainIdInValue.chainId}
            >
              Bridge
            </Buttons.Custom>
          </form>
        )}
      </Modal>
    </FormProvider>
  )
}

export default Form
