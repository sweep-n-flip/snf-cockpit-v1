'use client'

import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'

import { TokenType } from '@/components/bridge/types/bridge'
import { useFormContext } from 'react-hook-form'

import { TOKEN_IDS_IN, TOKEN_IDS_OUT } from '@/components/bridge/utils/constants/fields'

import { MinusCircleIcon, PlusCircleIcon } from '@heroicons/react/24/outline'
import classNames from 'classnames'
import { isArray } from 'lodash'

export type RangebarProps = {
  tokenType: TokenType
  tokens: string[]
}

export const Rangebar = ({ tokenType, tokens }: RangebarProps) => {
  const { watch, setValue } = useFormContext()

  const idLocal = tokenType === TokenType.TokenIn ? TOKEN_IDS_IN : TOKEN_IDS_OUT

  const idRemote = tokenType === TokenType.TokenOut ? TOKEN_IDS_IN : TOKEN_IDS_OUT

  const idLocalValue: string[] = watch(idLocal, [])
  const disabled = !tokens.length

  const handleOnChange = (value: number | number[]) => {
    const fieldValue = isArray(value) ? value[0] : value

    const slicedTokens = tokens.slice(0, fieldValue)

    setValue(idLocal, slicedTokens, {
      shouldValidate: true,
    })

    setValue(idRemote, slicedTokens, {
      shouldValidate: true,
    })
  }

  const handleIncrementRangeValue = () => {
    const value = idLocalValue.length + 1

    if (value <= tokens.length) {
      handleOnChange(value)
    }
  }

  const handleDecrementRangeValue = () => {
    const value = idLocalValue.length - 1

    if (value >= 0) {
      handleOnChange(value)
    }
  }

  return (
    <div className="flex items-center justify-between space-x-4">
      <MinusCircleIcon
        className={classNames([
          'size-5 text-color-primary max-lg:size-8 ',
          {
            'opacity-20': disabled || idLocalValue.length === 0,
            'cursor-pointer': !disabled || idLocalValue.length === 0,
          },
        ])}
        onClick={handleDecrementRangeValue}
      />
      <Slider
        value={idLocalValue.length}
        // range
        min={0}
        max={tokens.length}
        disabled={disabled}
        onChange={handleOnChange}
        classNames={{
          track: '!bg-red-500 h-4',
          rail: '!bg-gray-200 h-4',
          handle: classNames([
            '!bg-white h-4 w-4 !opacity-100 !border-color-primary',
            'focus-visible:!ring-2 focus-visible:!ring-color-primary focus-visible:!ring-opacity-50',
            'focus:!ring-2 focus:!ring-color-primary focus:!ring-opacity-50',
            'active:!ring-2 active:!ring-color-primary active:!ring-opacity-50',
          ]),
        }}
      />
      <PlusCircleIcon
        className={classNames([
          'size-5 text-color-primary max-lg:size-8 ',
          {
            'opacity-20': disabled || idLocalValue.length === tokens.length,
            'cursor-pointer': !disabled || idLocalValue.length === tokens.length,
          },
        ])}
        onClick={handleIncrementRangeValue}
      />
    </div>
  )
}

export default Rangebar
