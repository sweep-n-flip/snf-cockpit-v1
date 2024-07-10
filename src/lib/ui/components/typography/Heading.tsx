import { type HTMLProps, createElement } from 'react'
import classNames from 'classnames'

export const Variant = {
  default: {
    classes: '',
  },
  h1: {
    classes: 'font-extrabold',
  },
  h2: {
    classes: 'font-bold',
  },
  h3: {
    classes: 'font-bold',
  },
  h4: {
    classes: 'font-bold',
  },
  h5: {
    classes: 'font-medium',
  },
  h6: {
    classes: 'font-normal',
  },
} as const

export const Sizes = {
  default: {
    classes: '',
  },
  h1: {
    classes: 'text-4xl lg:text-6xl',
  },
  h2: {
    classes: 'text-3xl lg:text-4xl',
  },
  h3: {
    classes: 'text-xl lg:text-2xl',
  },
  h4: {
    classes: 'text-base',
  },
  h5: {
    classes: 'text-base',
  },
  h6: {
    classes: 'text-sm',
  },
} as const

export type HeadingProps = Omit<HTMLProps<HTMLHeadingElement>, 'size'> & {
  size?: keyof typeof Sizes
  variant?: keyof typeof Variant
  as?: Exclude<keyof typeof Variant, 'default'>
}

export const Heading = ({
  as = 'h1',
  variant,
  children,
  className,
  size,
  ...props
}: HeadingProps) =>
  !as
    ? children
    : createElement(
        as,
        {
          ...props,
          className: classNames(
            className,
            Sizes[size || as || variant].classes,
            Variant[size || as || variant].classes,
          ),
        },
        children,
      )

export default Heading
