import clsx from 'clsx'
import { css } from 'emotion'
import React from 'react'

import { useTheme } from '../../store/selector-hooks'
import { themes } from '../../themes'

interface ButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  tone?: 'primary' | 'sponsor'
  size?: 'xs' | 'md'
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
  const theme = useTheme()

  let textSize = 'text-xs'
  let padding = 'px-3 py-2'

  if (size === 'md') {
    textSize = 'text-base'
    padding = 'px-4 py-3'
  }

  let color = themes[theme].button.text.base
  if (tone === 'primary') {
    color = themes[theme].button.text.update
  } else if (disabled) {
    color = themes[theme].button.text.disabled
  } else if (tone === 'sponsor') {
    color = themes[theme].button.text.sponsor
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
        css({ color }),
      )}
      disabled={disabled}
      type="button"
      {...restProperties}
    />
  )
}

export default Button
