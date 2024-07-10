'use client'

import classNames from 'classnames'
import { HTMLProps, ReactNode } from 'react'

type DefaultProps = HTMLProps<HTMLDivElement> & {
  maxHeight?: string
  children: ReactNode
}

export const Default = ({ children, className, ...props }: DefaultProps) => {
  return (
    <>
      <style jsx>
        {`
          .scrollbar::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }

          .scrollbar::-webkit-scrollbar-track {
            background-color: rgba(0, 0, 0, 0.1);
            border-radius: 8px;
          }

          .scrollbar::-webkit-scrollbar-thumb {
            border-radius: 20px;
          }

          .scrollbar-light.scrollbar::-webkit-scrollbar-thumb {
            background-color: rgb(255 46 0 / var(--tw-bg-opacity));
          }
        `}
      </style>
      <div
        className={classNames(
          className,
          {
            'max-h-screen': !className?.includes('max-h-'),
          },
          'scrollbar scrollbar-light overflow-y-auto',
        )}
        {...props}
      >
        {children}
      </div>
    </>
  )
}

export default Default
