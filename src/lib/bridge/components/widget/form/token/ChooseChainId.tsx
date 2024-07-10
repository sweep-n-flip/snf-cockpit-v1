'use client'

import { Modal, Option } from '@/lib/ui/components/select/Modal'
import { TokenType } from '@/lib/bridge/types/bridge'
import { Chain } from '@/lib/web3/types/chain'
import { Chain as ChainComponent } from '@/lib/web3/components/icons/chains/Chain'
import { useFormContext } from 'react-hook-form'
import { useIsomorphicLayoutEffect } from 'usehooks-ts'
import classNames from 'classnames'
import gt from 'lodash/gt'

import { CHAIN_ID_IN, CHAIN_ID_OUT } from '@/lib/bridge/utils/constants/fields'

export type ChooseChainIdProps = {
  tokenType: TokenType
  chains: Chain[]
}

export const ChooseChainId = ({ tokenType, chains }: ChooseChainIdProps) => {
  const idLocal = tokenType === TokenType.TokenIn ? CHAIN_ID_IN : CHAIN_ID_OUT
  const idRemote = tokenType === TokenType.TokenOut ? CHAIN_ID_IN : CHAIN_ID_OUT

  const { register, setValue, watch, getFieldState } = useFormContext()

  const idLocalValue = watch(idLocal)
  const idRemoteValue = watch(idRemote)

  const { error: idLocalErrors } = getFieldState(idLocal)

  const handleSelect = (value: Option['value']) => {
    setValue(idLocal, value, {
      shouldValidate: true,
    })
  }

  useIsomorphicLayoutEffect(() => {
    register(idLocal, {
      required: true,
      validate: (value) => gt(value, 0),
    })
  }, [idLocal, register])

  return (
    <div className="flex items-center gap-2">
      <div>{tokenType === TokenType.TokenIn ? 'From' : 'To'}</div>
      <div>
        <Modal
          title="Select a network"
          onSelect={handleSelect}
          selectedOption={idLocalValue}
          buttonClassName={classNames(['p-px', idLocalErrors && 'rounded-xl bg-red-400/10 '])}
          options={chains
            .filter((chain) => chain.id !== idRemoteValue)
            .map((chain) => ({
              label: chain.name,
              value: chain.id,
              thumbnail: <ChainComponent chainId={chain.id} size={24} />,
            }))}
        />
      </div>
    </div>
  )
}

export default ChooseChainId
