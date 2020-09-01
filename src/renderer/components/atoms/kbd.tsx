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
        'text-xs tracking-widest font-bold uppercase py-1 px-2 rounded text-center',
      )}
    >
      {children}
    </kbd>
  )
}

export default Kbd
