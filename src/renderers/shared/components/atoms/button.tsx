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
        disabled && 'opacity-40',
        !disabled && 'focus:outline-none active:opacity-75',
        'px-2 py-1',
        'rounded-lg',
        'leading-none',
        'inline-flex items-center',
        'shadow-sm',
        'bg-white dark:bg-[#56555C]',
        'border',
        'border-b-[#C1BFBF] dark:border-b-[#56555C]',
        'border-l-[#D4D2D2] dark:border-l-[#56555C]',
        'border-r-[#D4D2D2] dark:border-r-[#56555C]',
        'border-t-[#DAD8D8] dark:border-t-[#6E6D73]',
      )}
      disabled={disabled}
      type="button"
      {...restProperties}
    />
  )
}

export default Button
