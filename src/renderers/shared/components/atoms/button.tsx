import clsx from 'clsx'
import React from 'react'

import { useSelector } from '../../../../shared/state/hooks'

const Button: React.FC<React.ComponentPropsWithoutRef<'button'>> = ({
  className,
  disabled,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- type is hardcoded
  type,
  ...restProperties
}) => {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode)

  return (
    <button
      className={clsx(
        className,
        'focus:outline-none active:opacity-75',
        'px-3 py-2',
        'rounded-md',
        'leading-none',
        'inline-flex items-center',
        isDarkMode ? 'bg-white' : 'bg-black',
        'bg-opacity-5',
      )}
      disabled={disabled}
      type="button"
      {...restProperties}
    />
  )
}

export default Button
