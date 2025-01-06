'use client'

import classNames from 'classnames'
import { useFormContext } from 'react-hook-form'
import { TokenType } from '@/lib/ui/components/blocks/bridges/types/bridge'

import {
  TOKEN_IDS_IN,
  TOKEN_IDS_OUT,
} from '@/lib/ui/components/blocks/bridges/utils/constants/fields'

export type InputProps = {
  disabled?: boolean
  tokenType: TokenType
}

export const Input = ({ tokenType }: InputProps) => {
  const idLocal = tokenType === TokenType.TokenIn ? TOKEN_IDS_IN : TOKEN_IDS_OUT

  const { watch, getFieldState } = useFormContext()
  const { error: idLocalErrors } = getFieldState(idLocal)

  const idLocalValue: string[] = watch(idLocal, [])

  return (
    <div className="flex">
      <input
        aria-label="Amount"
        className={classNames([
          'w-full bg-transparent text-3xl font-bold outline-none',
          'disabled:cursor-not-allowed disabled:opacity-70',
          idLocalErrors ? `text-red-400 disabled:text-red-400` : 'disabled:text-zinc-500 ',
        ])}
        value={idLocalValue.length}
        disabled
      />
    </div>
  )
}

export default Input
