'use client'

import { type HTMLProps } from 'react'
import { ZeroAddress } from 'ethers'
import classNames from 'classnames'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import { useWallet } from '@/lib/web3/hooks'

export type AvatarProps = HTMLProps<HTMLDivElement> & {
  size?: number
}

const SIZE = 20

export const Avatar = ({ className, size = SIZE, ...props }: AvatarProps) => {
  const { address } = useWallet()
  return (
    <>
      <style jsx>
        {`
          .avatar {
            --avatarSize: ${size / 16}rem;
          }
        `}
      </style>
      <div {...props} className={classNames(className, 'avatar')}>
        <div
          className={classNames(
            `flex h-[var(--avatarSize)] w-[var(--avatarSize)] items-center justify-center overflow-hidden rounded-full`,
          )}
        >
          <Jazzicon
            diameter={size * 1.3}
            paperStyles={{ borderRadius: '9999px' }}
            seed={jsNumberForAddress(address || ZeroAddress)}
          />
        </div>
      </div>
    </>
  )
}
export default Avatar
