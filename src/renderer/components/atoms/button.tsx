import clsx from 'clsx'
import React from 'react'

const Button: React.FC<React.ComponentPropsWithoutRef<'button'>> = ({
  className,
  disabled,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- type is hardcoded
  type,
  ...restProperties
}) => {
  return (
    <button
      className={clsx(
        className,
        'active:shadow-none focus:outline-none active:opacity-75',
        'px-3 py-2',
        'rounded-md',
        'text-xs',
        'leading-none',
        'inline-flex items-center',
        'bg-black bg-opacity-10',
      )}
      disabled={disabled}
      type="button"
      {...restProperties}
    />
  )
}

export default Button
