import { type ButtonHTMLAttributes } from 'react'
import classNames from 'classnames'
import { Loading } from '..'

export const Sizes = {
  default: {
    classes: 'py-3 px-6',
  },
  xs: {
    classes: 'py-1 px-2',
  },
  sm: {
    classes: 'py-2 px-4',
  },
  lg: {
    classes: 'py-4 px-8',
  },
} as const

export const Variant = {
  primary: {
    classes: classNames(
      'bg-color-primary text-white',
      'disabled:bg-color-primary/40 disabled:cursor-not-allowed',
      'hover:bg-color-primary/90',
      'border border-color-primary disabled:border-color-primary/40',
    ),
  },
  white: {
    classes: classNames(
      'bg-white text-color-primary',
      'disabled:bg-zinc/100 disabled:cursor-not-allowed',
      'hover:bg-zinc-100/90 hover:opacity-70',
      'border border-color-primary disabled:border-color-primary/20',
    ),
  },
} as const

export type DefaultProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  fullWidth?: boolean
  variant?: keyof typeof Variant
  size?: keyof typeof Sizes
  rounded?: boolean
  loading?: boolean
}

export const Default = ({
  children,
  rounded = true,
  fullWidth = true,
  variant = 'primary',
  size = 'default',
  disabled = false,
  loading = false,
  className,
  ...props
}: DefaultProps) => {
  return (
    <button
      {...props}
      disabled={disabled}
      className={classNames([
        'flex items-center justify-center space-x-2',
        { 'rounded-xl': rounded },
        { 'w-full': fullWidth },
        className,
        Variant[variant].classes,
        Sizes[size].classes,
      ])}
    >
      {loading && <Loading.Spinner size={size} variant={variant} />}
      <span>{children}</span>
    </button>
  )
}
export default Default
