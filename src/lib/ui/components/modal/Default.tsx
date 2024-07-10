'use client'

import { forwardRef, ReactNode, useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'
import { HTMLProps } from 'react'
import { Card, ScrollBar, Typography } from '..'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useOnClickOutside } from 'usehooks-ts'

export type DefaultProps = HTMLProps<HTMLDivElement> & {
  title?: string
  onClose?: () => void
  isOpen?: boolean
  containerId?: string // Optional ID for modal container
  thumbnail?: ReactNode
  description?: ReactNode
  closable?: boolean
}

export const Default = forwardRef<HTMLDivElement, DefaultProps>(
  (
    {
      title,
      onClose,
      isOpen,
      children,
      containerId,
      thumbnail,
      description,
      closable = true,
      className,
      ...props
    },
    ref,
  ) => {
    const [isMounted, setIsMounted] = useState(false)
    const containerRef = useRef(null)

    useOnClickOutside<any>(containerRef, (closable && onClose) || (() => {}))

    useEffect(() => {
      setIsMounted(true)
      return () => setIsMounted(false)
    }, [])

    if (!isMounted) return null

    let modalContainer = document.body

    if (containerId) {
      modalContainer = document.getElementById(containerId) || document.body
      if (!modalContainer) {
        console.error(`Modal container not found.`)
      }
    }

    return ReactDOM.createPortal(
      <>
        <style jsx global>
          {`
            body {
              overflow: ${isOpen ? 'hidden' : 'auto'};
            }
            @media screen and (max-width: 768px) {
              body {
                overflow-y: auto;
              }
            }
          `}
        </style>
        <style jsx>
          {`
            .modal {
              --modal-max-height-sm: 60vh;
              --modal-max-height-md: 80vh;
            }
          `}
        </style>
        <div {...props} ref={ref}>
          <div
            className={classNames(
              'modal fixed inset-0 z-[99] h-screen w-screen overflow-y-auto',
              'bg-black/50 backdrop-blur lg:p-4',
              'flex justify-center max-lg:items-end lg:items-center',
              { hidden: !isOpen },
            )}
          >
            <Card.Default
              className={classNames([
                className,
                'relative flex flex-col space-y-2 max-lg:pb-16',
                'rounded-lg max-lg:w-full max-lg:rounded-b-none lg:min-w-[20rem]',
              ])}
              size="default"
              ref={containerRef}
            >
              <div
                className={classNames([
                  'flex w-full items-center justify-between gap-4 px-4 py-6',
                  'border-b border-zinc-200',
                ])}
              >
                <div className="flex flex-1 space-x-4">
                  {thumbnail && thumbnail}
                  <div className="flex flex-col">
                    {title && (
                      <Typography.Heading as="h3" variant="default">
                        {title}
                      </Typography.Heading>
                    )}

                    {description && description}
                  </div>
                </div>
                {closable && (
                  <button type="button" onClick={onClose}>
                    <XMarkIcon width={18} title="exit" />
                    <span className="sr-only">Close modal</span>
                  </button>
                )}
              </div>
              <ScrollBar.Default className="md:max-h-[var(--modal-max-height-md) max-h-[var(--modal-max-height-sm)] rounded-xl">
                {children}
              </ScrollBar.Default>
            </Card.Default>
          </div>
        </div>
      </>,
      modalContainer,
    )
  },
)

Default.displayName = 'modal'

export default Default
