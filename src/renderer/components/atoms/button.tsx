import clsx from 'clsx'
import { css } from 'emotion'
import React from 'react'

import { useSelector } from '../../store'

interface ButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  size?: 'xs' | 'md'
}

const Button: React.FC<ButtonProps> = ({
  className,
  disabled,
  size,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- type is hardcoded
  type,
  ...restProperties
}) => {
  const theme = useSelector((state) => state.theme)

  let textSize = 'text-xs'
  let padding = 'px-3 py-2'

  if (size === 'md') {
    textSize = 'text-base'
    padding = 'px-4 py-3'
  }

  return (
    <button
      className={clsx(
        className,
        'active:shadow-none focus:outline-none active:opacity-75',
        padding,
        'rounded-md',
        textSize,
        'leading-none',
        'inline-flex items-center',
        css({ backgroundColor: theme.control }),
      )}
      disabled={disabled}
      type="button"
      {...restProperties}
    />
  )
}

export default Button
