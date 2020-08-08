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
        'text-xxs tracking-widest font-bold uppercase',
      )}
    >
      {children}
    </kbd>
  )
}

export default Kbd
