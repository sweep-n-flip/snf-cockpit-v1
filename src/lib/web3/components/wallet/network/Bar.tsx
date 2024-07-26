'use client'

import { HTMLProps, useRef } from 'react'
import { Thumbnail } from './Thumbnail'
import { useToggle } from 'usehooks-ts'
import { useOnClickOutside } from 'usehooks-ts'
import classNames from 'classnames'
import { Card } from '@/lib/ui/components'
import { Networks } from './Networks'

export type BarProps = HTMLProps<HTMLDivElement> & {}

export const Bar = ({ className, ...props }: BarProps) => {
  const containerRef = useRef(null)

  const [isOpen, toggleIsOpen, setIsOpen] = useToggle()

  const handleCloseList = () => {
    setIsOpen(false)
  }

  useOnClickOutside<any>(containerRef, handleCloseList)

  return (
    <>
      <div {...props} ref={containerRef} className={classNames([className, 'relative'])}>
        <Thumbnail onClick={toggleIsOpen} isOpen={isOpen} />
        <Card.Default
          className={classNames(
            'absolute right-0 z-10 w-56 rounded-md border border-gray-200 bg-white shadow-lg',
            {
              hidden: !isOpen,
              block: isOpen,
            },
          )}
        >
          <Networks />
        </Card.Default>
      </div>
    </>
  )
}

export default Bar
