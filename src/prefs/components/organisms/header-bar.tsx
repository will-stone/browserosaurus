import clsx from 'clsx'
import React from 'react'

import { useSelector } from '../../../shared-state/hooks'

interface Props {
  className?: string
}

export const HeaderBar = ({ className }: Props): JSX.Element => {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode)

  return (
    <div
      className={clsx(
        'flex justify-center items-center',
        'h-12',
        'draggable',
        isDarkMode ? 'bg-gray-700' : 'bg-gray-200',
        className,
      )}
    >
      Apps
    </div>
  )
}
