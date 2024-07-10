'use client'
import { useWallet } from '@/lib/web3'
import { Field } from '@/lib/bridge/components/widget/form/token'
import { Switcher } from '@/lib/bridge/components/widget/form/Switcher'
import { FieldProps } from '@/lib/bridge/components/widget/form/token/Field'
import { TokenType, FormDataType } from '@/lib/bridge/types/bridge'
import { Buttons } from '@/lib/web3/components/wallet'
import { useForm, FormProvider } from 'react-hook-form'
import { Modal } from '@/lib/bridge/components/widget/form/checkout'
import { DEFAULT_FORM_STATE } from '@/lib/bridge/utils/constants/form'
import {
  useGetERC721CollectionsByAddress,
  useGetERC721TokensByAddress,
} from '@/lib/services/api/entities'

import { CHAIN_ID_IN, COLLECTION_ADDRESS_IN } from '@/lib/bridge/utils/constants/fields'

export type FormProps = {
  chains: FieldProps['chains']
}

export const Form = ({ chains }: FormProps) => {
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

  return (
    <Modal onCloseAfterBridge={reset} tokens={tokens} collections={collections}>
      {({ openBridge }) => (
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(openBridge)}
            noValidate
            className="flex flex-col gap-4"
          >
            <Field
              collections={collections}
              tokens={tokens}
              loading={loadingCollections || tokensLoading}
              chains={chains}
              tokenType={TokenType.TokenIn}
            />
            <Switcher />
            <Field
              collections={collections}
              tokens={tokens}
              loading={loadingCollections || tokensLoading}
              chains={chains}
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
      )}
    </Modal>
  )
}

export default Form
