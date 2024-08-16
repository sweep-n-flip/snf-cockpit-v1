import { Typography } from '@/lib/ui/components'
import classNames from 'classnames'
import { Children } from 'react'
import {
  ArrowRightCircleIcon,
  ArrowTopRightOnSquareIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline'
import { CheckCircleIcon } from '@heroicons/react/24/solid'
import {
  TOTAL_STEPS,
  STEPS_DATA,
} from '@/lib/ui/components/blocks/bridges/utils/constants/checkout'
import { Info } from '@/lib/ui/components/blocks/bridges/form/checkout'
import Image from 'next/image'
import React from 'react'
import Link from 'next/link'
import stringUtils from '@/lib/utils/string'
import { Chains } from '@/lib/payloadcms/types/payload-types'
import { Collection } from '@/lib/payloadcms/plugins/snf/graphql/entities/ERC721/wallet/types'

export type ConfirmationsProps = {
  currentStep: number
  isFinished?: boolean
  chainIn?: Chains
  chainOut?: Chains
  selectedCollection?: Collection
  transactionHash?: string
}

export const Confirmations = ({
  currentStep,
  isFinished,
  chainIn,
  chainOut,
  transactionHash,
  selectedCollection,
}: ConfirmationsProps) => {
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex space-x-6">
        <div className="relative size-8 overflow-hidden rounded-full">
          {selectedCollection?.image ? (
            <Image
              src={selectedCollection.image}
              alt={selectedCollection.name}
              className="object-cover"
              sizes={`
                (min-width: 1024px) 1024px,
                (min-width: 768px) 768px,
                100vw
                `}
              fill
            />
          ) : (
            <div className="size-full bg-zinc-100" />
          )}
        </div>
        <div className="flex w-full flex-1 flex-col space-y-2">
          <div className="">
            <Typography.Heading as="h3" className="line-clamp-2 text-wrap">
              {selectedCollection?.name || 'Collection'}
            </Typography.Heading>
          </div>
        </div>
      </div>

      <Info.Chain chainIn={chainIn} chainOut={chainOut} />
      <ul className="flex flex-col space-y-4">
        {Children.toArray(
          STEPS_DATA.map((step, index) => (
            <li
              key={index}
              className={classNames([
                'overflow-hidden rounded-md border p-4',
                'flex items-center space-x-2 last:rounded-b-xl',
                {
                  '': index + 1 < currentStep,
                  'border-zinc-200': index + 1 === currentStep,
                  'border-zinc-50 text-zinc-300 opacity-90': index + 1 > currentStep,
                },
              ])}
            >
              {index + 1 < currentStep || isFinished ? (
                <>
                  <CheckCircleIcon className="size-6 text-green-300" />
                </>
              ) : (
                <>
                  {index + 1 === currentStep && <ArrowRightCircleIcon className="size-6" />}

                  {index + 1 > currentStep && <ExclamationCircleIcon className="size-6 " />}
                </>
              )}

              <div className="flex flex-1 items-center justify-between space-x-2">
                <Typography.Paragraph
                  variant="default"
                  className={classNames({
                    'font-bold': index + 1 === currentStep && index + 1 !== TOTAL_STEPS,
                  })}
                >
                  {step.label}
                </Typography.Paragraph>

                {index + 1 === TOTAL_STEPS && isFinished && transactionHash && (
                  <Link
                    target="_blank"
                    href={stringUtils.shortCodeParser(
                      // `${config.blockExplorers?.default.url}/tx/{{transactionHash}}`,
                      '{{transactionHash}}',
                      {
                        transactionHash,
                      },
                    )}
                  >
                    <Typography.Paragraph
                      variant="default"
                      className="flex items-center space-x-1 text-color-primary"
                    >
                      <ArrowTopRightOnSquareIcon className="size-4" />
                      <span>View transaction</span>
                    </Typography.Paragraph>
                  </Link>
                )}
              </div>
            </li>
          )),
        )}
      </ul>
    </div>
  )
}

export default Confirmations
