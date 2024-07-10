import { type HTMLProps, createElement } from 'react'
import classNames from 'classnames'

export const Sizes = {
  xs: { classes: 'text-xs' },
  sm: { classes: 'text-sm' },
  // inherit from parent
  default: { classes: '' },
  base: { classes: 'text-base' },
  lg: { classes: 'text-lg' },
  xl: { classes: 'text-xl' },
  '2xl': { classes: 'text-2xl' },
  '3xl': { classes: 'text-3xl' },
} as const

export const Variant = {
  // inherit from parent
  default: {
    classes: '',
  },
  p: {
    classes: 'font-normal',
  },
  span: {
    classes: 'font-light',
  },
  button: {
    classes: 'font-semibold',
  },
} as const

export type ParagraphProps = Omit<HTMLProps<HTMLElement>, 'size'> & {
  size?: keyof typeof Sizes
  variant?: keyof typeof Variant
  as?: Exclude<keyof typeof Variant, 'default'>
}

export const Paragraph = ({
  as = 'p',
  variant = 'p',
  size = 'base',
  children,
  className,
  ...props
}: ParagraphProps) =>
  !as
    ? children
    : createElement(
        as,
        {
          ...props,
          className: classNames(className, Sizes[size].classes, Variant[variant || as].classes),
        },
        children,
      )

export default Paragraph
