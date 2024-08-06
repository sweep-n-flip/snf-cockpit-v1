'use client'

import { useWallet } from '@/lib/web3'
import { Field } from '@/lib/ui/components/blocks/bridges/form/token'
import { Switcher } from '@/lib/ui/components/blocks/bridges/form/Switcher'
import { Buttons } from '@/lib/web3/components/wallet'
import { useForm, FormProvider } from 'react-hook-form'
import { Modal } from '@/lib/ui/components/blocks/bridges/form/checkout'
import {
  useGetERC721CollectionsByAddress,
  useGetERC721TokensByAddress,
} from '@/lib/services/api/entities'
import { DEFAULT_FORM_STATE } from '@/lib/ui/components/blocks/bridges/utils/constants/form'
import {
  CHAIN_ID_IN,
  CHAIN_ID_OUT,
  COLLECTION_ADDRESS_IN,
} from '@/lib/ui/components/blocks/bridges/utils/constants/fields'
import { FormDataType, TokenType } from '@/lib/ui/components/blocks/bridges/types/bridge'
import { Chains } from '@/lib/payloadcms/types/payload-types'

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

  const { watch, formState, reset } = methods
  const { errors } = formState

  const chainIdInValue = watch(CHAIN_ID_IN)
  const collectionAddressInValue = watch(COLLECTION_ADDRESS_IN)

  const { collections, loading: loadingCollections } = useGetERC721CollectionsByAddress({
    address,
    chainId: chainIdInValue,
  })

  const { tokens, loading: tokensLoading } = useGetERC721TokensByAddress({
    address,
    chainId: chainIdInValue,
    collectionAddress: collectionAddressInValue,
    skip: !collectionAddressInValue,
  })

  const handleSubmit = (event) => {
    event.preventDefault()
    console.log(methods.getValues())
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
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
        >
          Bridge
        </Buttons.Custom>
      </form>
    </FormProvider>
  )
}

export default Form
