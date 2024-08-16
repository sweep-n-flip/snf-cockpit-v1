'use client'

import { useWallet } from '@/lib/web3'
import { Field } from '@/lib/ui/components/blocks/bridges/form/token'
import { Switcher } from '@/lib/ui/components/blocks/bridges/form/Switcher'
import { Buttons } from '@/lib/web3/components/wallet'
import { useForm, FormProvider } from 'react-hook-form'
import { DEFAULT_FORM_STATE } from '@/lib/ui/components/blocks/bridges/utils/constants/form'
import {
  CHAIN_ID_IN,
  COLLECTION_ADDRESS_IN,
} from '@/lib/ui/components/blocks/bridges/utils/constants/fields'
import { FormDataType, TokenType } from '@/lib/ui/components/blocks/bridges/types/bridge'
import { Chains } from '@/lib/payloadcms/types/payload-types'
import useGetERC721CollectionsByAddress from '@/lib/services/graphql/entities/ERC721/hooks/useGetERC721CollectionsByAddress'
import useGetERC721TokensByAddress from '@/lib/services/graphql/entities/ERC721/hooks/useGetERC721TokensByAddress'
import Modal from '@/lib/ui/components/blocks/bridges/form/checkout/Modal'
import React, { useMemo } from 'react'

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

  const chainIdInValue = watch(CHAIN_ID_IN)
  const collectionAddressInValue = watch(COLLECTION_ADDRESS_IN)

  const { collections, loading: loadingCollections } = useGetERC721CollectionsByAddress({
    address,
    chainId: chainIdInValue.chainId,
  })

  const selectedCollection = useMemo(() => {
    return collections.find((collection) => collection.address === collectionAddressInValue)
  }, [collectionAddressInValue, collections])

  const { tokens, loading: tokensLoading } = useGetERC721TokensByAddress({
    address,
    chainId: chainIdInValue.chainId,
    collectionAddress: collectionAddressInValue,
    skip: !collectionAddressInValue,
  })

  return (
    <FormProvider {...methods}>
      <Modal
        bridgeData={methods.getValues()}
        tokens={tokens}
        selectedCollection={selectedCollection}
      >
        {({ openBridge }) => (
          <form
            onSubmit={methods.handleSubmit(openBridge)}
            noValidate
            className="flex flex-col gap-4"
          >
            <Field
              collections={collections}
              tokens={tokens}
              loading={loadingCollections || tokensLoading}
              chains={sourceChains}
              tokenType={TokenType.TokenIn}
            />
            <Switcher />
            <Field
              collections={collections}
              tokens={tokens}
              loading={loadingCollections || tokensLoading}
              chains={targetChains}
              tokenType={TokenType.TokenOut}
            />
            <Buttons.Custom
              type="submit"
              forceChainId={chainIdInValue}
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
