import clsx from 'clsx'
import React from 'react'

const Input: React.FC<React.ComponentPropsWithoutRef<'input'>> = ({
  className,
  ...restProperties
}) => {
  return (
    <input
      className={clsx(
        'text-center uppercase min-w-0',
        'focus:outline-none focus:bg-white dark:focus:bg-black focus:bg-opacity-70 focus:shadow-xl focus:ring-1 focus:ring-gray-500',
        'shadow-sm bg-white dark:bg-[#56555C]',
        'text-black dark:text-white',
        'border',
        'border-b-[#C1BFBF] dark:border-b-[#56555C]',
        'border-l-[#D4D2D2] dark:border-l-[#56555C]',
        'border-r-[#D4D2D2] dark:border-r-[#56555C]',
        'border-t-[#DAD8D8] dark:border-t-[#6E6D73]',
        className,
      )}
      {...restProperties}
    />
  )
}

export default Input
