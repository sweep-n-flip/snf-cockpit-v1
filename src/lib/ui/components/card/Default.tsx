import { type HTMLProps, createElement, forwardRef } from 'react'
import classNames from 'classnames'

export const Variant = {
  default: {
    classes: 'bg-white shadow',
  },
  primary: {
    classes: 'bg-zinc-100',
  },
} as const

export const Size = {
  default: {
    classes: '',
  },
  xs: {
    classes: 'p-2',
  },
  sm: {
    classes: 'p-4',
  },
  md: {
    classes: 'p-6',
  },
  lg: {
    classes: 'p-10',
  },
} as const

export type DefaultProps = Omit<HTMLProps<HTMLElement>, 'size'> & {
  variant?: keyof typeof Variant
  size?: keyof typeof Size
}

export const Default = forwardRef<HTMLElement, DefaultProps>(
  ({ as = 'div', variant = 'default', size = 'sm', children, className, ...rest }, ref) => {
    return !as
      ? children
      : createElement(
          as,
          {
            ...rest,
            ref,
            className: classNames(
              className?.includes('rounded-') ? '' : 'rounded-xl',
              className,
              Variant[variant].classes,
              Size[size].classes,
            ),
          },
          children,
        )
  },
)

Default.displayName = 'Card'

export default Default
