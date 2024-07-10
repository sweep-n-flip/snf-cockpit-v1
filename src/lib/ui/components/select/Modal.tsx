'use client'

import classNames from 'classnames'
import { useState, ReactNode, Children } from 'react'
import { Typography } from '@/lib/ui/components'

import { Default as ModalComponent, DefaultProps } from '@/lib/ui/components/modal/Default'

import { ChevronDownIcon } from '@heroicons/react/24/outline'
import find from 'lodash/find'

export type Option = {
  label: string
  value: any
  thumbnail?: ReactNode
}

export type SelectButtonRenderProps = {
  isOpen: boolean
  close: () => void
  open: () => void
}

export type ModalProps = {
  title?: DefaultProps['title']
  thumbnail?: DefaultProps['thumbnail']
  description?: DefaultProps['description']
  options: Option[]
  onSelect?: (value: Option['value']) => void
  selectedOption?: Option['value']
  selectButton?: ReactNode | ((props: SelectButtonRenderProps) => ReactNode)
  buttonClassName?: string
  buttonLabelClassName?: string
  optionClassName?: string
  optionLabelClassName?: string
  disabled?: boolean
}

export const Modal = ({
  title,
  disabled,
  buttonClassName,
  buttonLabelClassName,
  optionClassName,
  optionLabelClassName,
  options,
  onSelect,
  selectButton,
  selectedOption,
}: ModalProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const selectedOptionItem = find(options, { value: selectedOption })

  const handleOpen = () => {
    setIsOpen(true)
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  const handleSelect = (option: Option) => {
    onSelect?.(option.value)
    handleClose()
  }

  return (
    <>
      {selectButton ? (
        typeof selectButton === 'function' ? (
          selectButton({
            isOpen,
            close: handleClose,
            open: handleOpen,
          })
        ) : (
          selectButton
        )
      ) : (
        <button
          className={classNames([
            buttonClassName,
            'flex w-full items-center justify-between gap-2',
            { 'hover:opacity-80': !disabled },
            { 'cursor-not-allowed opacity-70': disabled },
          ])}
          type="button"
          onClick={handleOpen}
          disabled={disabled}
        >
          <div className="flex items-center space-x-1">
            {selectedOptionItem?.thumbnail ? (
              selectedOptionItem.thumbnail
            ) : (
              <div className="size-6 rounded-full bg-zinc-300" />
            )}
            <Typography.Paragraph
              size="sm"
              variant="default"
              title={selectedOptionItem?.label || 'Select'}
              className={classNames([
                buttonLabelClassName,
                selectedOptionItem ? 'font-bold' : 'text-zinc-700',
              ])}
            >
              {selectedOptionItem ? selectedOptionItem.label : 'Select'}
            </Typography.Paragraph>
          </div>
          <ChevronDownIcon width={18} height={16} title="open" />
        </button>
      )}
      <ModalComponent title={title} onClose={handleClose} isOpen={isOpen}>
        {options.length > 0 ? (
          <ul>
            {Children.toArray(
              options.map((option) => (
                <li
                  className={classNames([
                    optionClassName,
                    'overflow-hidden rounded-md p-4 ',
                    'flex  items-center space-x-2 last:rounded-b-xl',
                    {
                      'cursor-not-allowed bg-zinc-100': selectedOption === option.value,
                    },
                    {
                      'cursor-pointer hover:bg-zinc-100': selectedOption !== option.value,
                    },
                  ])}
                  onClick={() => handleSelect(option)}
                >
                  {option.thumbnail}
                  <Typography.Paragraph className={optionLabelClassName} title={option.label}>
                    {option.label}
                  </Typography.Paragraph>
                </li>
              )),
            )}
          </ul>
        ) : (
          <Typography.Paragraph className="p-4">No options available</Typography.Paragraph>
        )}
      </ModalComponent>
    </>
  )
}

export default Modal
