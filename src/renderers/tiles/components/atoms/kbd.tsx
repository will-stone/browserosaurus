import clsx from 'clsx'
import React from 'react'

interface Props {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

const Kbd = ({ children, className, style }: Props): JSX.Element => {
  return (
    <kbd
      className={clsx(
        className,
        'tracking-widest uppercase rounded text-center',
      )}
      style={style}
    >
      {children}
    </kbd>
  )
}

export default Kbd
