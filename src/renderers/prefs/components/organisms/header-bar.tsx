import clsx from 'clsx'
import React from 'react'

import { useSelector } from '../../../../shared/state/hooks'

interface Props {
  className?: string
}

export const HeaderBar = ({ className }: Props): JSX.Element => {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode)

  return (
    <div
      className={clsx(isDarkMode ? 'bg-gray-700' : 'bg-gray-300', className)}
    >
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
