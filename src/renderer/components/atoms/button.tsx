import clsx from 'clsx'
import React from 'react'

interface ButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  tone?: 'primary' | 'sponsor'
  size?: 'xxs' | 'xs' | 'md'
}

const Button: React.FC<ButtonProps> = ({
  className,
  disabled,
  size,
  tone,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- type is hardcoded
  type,
  ...restProperties
}) => {
  let textSize = 'text-xs'
  let padding = 'px-3 py-2'

  if (size === 'xxs') {
    textSize = 'text-xxs'
    padding = 'px-2 py-2'
  } else if (size === 'md') {
    textSize = 'text-base'
    padding = 'px-4 py-3'
  }

  return (
    <button
      className={clsx(
        className,
        'active:shadow-none focus:outline-none',
        padding,
        'rounded-md',
        textSize,
        'font-bold leading-none',
        !disabled && tone === 'primary' && 'text-blue-400 active:text-blue-300',
        !disabled && tone === 'sponsor' && 'text-pink-400 active:text-pink-300',
        !disabled && !tone && 'text-grey-300 active:text-grey-200',
        disabled
          ? 'bg-transparent text-grey-500'
          : 'bg-grey-700 hover:bg-grey-900',
      )}
      disabled={disabled}
      type="button"
      {...restProperties}
    />
  )
}

export default Button
