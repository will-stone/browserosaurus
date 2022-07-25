import clsx from 'clsx'

const Input: React.FC<React.ComponentPropsWithoutRef<'input'>> = ({
  className,
  ...restProperties
}) => {
  return (
    <input
      className={clsx(
        'min-w-0 text-center uppercase',
        'focus:bg-white/70 focus:shadow-xl focus:outline-none focus:ring-1 focus:ring-gray-500 dark:focus:bg-black',
        'bg-white shadow-sm dark:bg-[#56555C]',
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
