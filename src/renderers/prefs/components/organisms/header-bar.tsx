import clsx from 'clsx'
import React from 'react'

interface Props {
  className?: string
}

export const HeaderBar = ({ className }: Props): JSX.Element => {
  return (
    <div className={clsx(className)}>
      <div
        className={clsx('flex justify-center items-center', 'h-8', 'draggable')}
      >
        Tiles
      </div>
      <div
        className={clsx('flex justify-center items-center space-x-12', 'h-16')}
      >
        <div>General</div>
        <div className="text-white">Tiles</div>
        <div>About</div>
      </div>
    </div>
  )
}
