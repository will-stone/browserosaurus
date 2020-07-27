import clsx from 'clsx'
import React from 'react'

interface Props {
  className?: string
}

const Kbd: React.FC<Props> = ({ children, className }) => {
  return (
    <kbd
      className={clsx(
        className,
        'text-grey-300 text-xxs tracking-widest font-bold uppercase',
        'bg-grey-600',
        'py-1 px-2',
        'border border-grey-900 rounded',
      )}
    >
      {children}
    </kbd>
  )
}

export default Kbd
