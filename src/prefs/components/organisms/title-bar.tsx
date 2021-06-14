import clsx from 'clsx'
import React from 'react'

import { useSelector } from '../../../shared-state/hooks'

interface Props {
  className?: string
}

export const TitleBar = ({ className }: Props): JSX.Element => {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode)

  return (
    <div
      className={clsx(
        'flex justify-center items-center',
        'h-12',
        'draggable',
        isDarkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-700',
        className,
      )}
    >
      Apps
    </div>
  )
}
